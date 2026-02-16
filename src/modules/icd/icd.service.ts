import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import axios from 'axios';

@Injectable()
export class IcdService {
    private readonly logger = new Logger(IcdService.name);
    private accessToken: string | null = null;
    private tokenExpiry: number | null = null;

    private readonly tokenUrl = 'https://icdaccessmanagement.who.int/connect/token';
    private readonly baseUrl = 'https://id.who.int';

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) { }

    private async getToken(): Promise<string> {
        if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
            return this.accessToken as string;
        }

        const clientId = this.configService.get<string>('ICD_CLIENT_ID');
        const clientSecret = this.configService.get<string>('ICD_CLIENT_SECRET');

        if (!clientId || !clientSecret) {
            throw new Error('ICD credentials not found in configuration');
        }

        try {
            const params = new URLSearchParams();
            params.append('grant_type', 'client_credentials');
            params.append('client_id', clientId);
            params.append('client_secret', clientSecret);
            params.append('scope', 'icdapi_access');

            const response = await axios.post(this.tokenUrl, params);

            this.accessToken = response.data.access_token;
            // Set expiry with a small buffer (5 minutes)
            this.tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 300000;

            return this.accessToken as string;
        } catch (error) {
            this.logger.error('Error fetching ICD access token', error);
            throw error;
        }
    }

    async search(dto: any) {
        const { releaseId = '2025-01', linearization = 'mms' } = dto;
        const token = await this.getToken();
        const url = `${this.baseUrl}/icd/release/11/${releaseId}/${linearization}/search`;

        // Construimos el cuerpo del POST como Form Data (multipart/form-data)
        // Usamos la configuración por defecto solicitada, ignorando lo que envíe el front
        const formData = new FormData();
        formData.append('q', dto.q);
        formData.append('chapterFilter', '10;11;12;13;14;15;16;17;18;19;20;21;22;23;24;25;26;01;02;03;04;05;06;07;08;09;V;X;');
        formData.append('subtreesFilter', '');
        formData.append('includePostcoordination', 'true');
        formData.append('useBroaderSynonyms', 'false');
        formData.append('useFlexiSearch', 'false');
        formData.append('includeKeywordResult', 'true');
        formData.append('flatResults', 'true');
        formData.append('highlightingEnabled', 'true');
        formData.append('medicalCodingMode', 'true');

        try {
            const response = await firstValueFrom(
                this.httpService.post(url, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Accept-Language': 'es',
                        'Api-Version': 'v2',
                        'Content-Type': 'multipart/form-data'
                    },
                }),
            );

            return response.data;
        } catch (error) {
            this.logger.error(`Error searching ICD-11 for query: ${dto.q}`, error.response?.data || error.message);
            throw error;
        }
    }
}
