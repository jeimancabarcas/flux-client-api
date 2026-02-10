import * as bcrypt from 'bcrypt';
import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Cargar variables de entorno desde el archivo .env en la raíz
dotenv.config({ path: path.join(__dirname, '../.env') });

const email = process.argv[2] || 'admin@fluxmedical.com';
const password = process.argv[3] || 'Admin123!';

async function setupAdmin() {
    console.log('--- Configuración de Usuario Administrador ---');
    console.log(`Email objetivo: ${email}`);
    console.log(`Contraseña objetivo: ${password}`);

    // 1. Generar el hash de la contraseña (usando el mismo método que CreateUserUseCase)
    const saltRounds = 10;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log(`Hash generado exitosamente.`);

        // 2. Conectar a la base de datos
        if (!process.env.DATABASE_URL) {
            console.error('ERROR: No se encontró DATABASE_URL en el archivo .env');
            console.log('\nSi solo necesitas el hash para insertarlo manualmente:');
            console.log(`Hash: ${hashedPassword}`);
            return;
        }

        const client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        });

        await client.connect();
        console.log('Conectado a la base de datos PostgreSQL.');

        // 3. Insertar o actualizar el usuario
        // El esquema es 'fluxmedical' según la configuración del proyecto
        const query = `
            INSERT INTO fluxmedical.users (email, password, role)
            VALUES ($1, $2, 'ADMIN')
            ON CONFLICT (email) 
            DO UPDATE SET password = $2, role = 'ADMIN'
            RETURNING id, email, role;
        `;

        const res = await client.query(query, [email, hashedPassword]);

        console.log('\n--- ÉXITO ---');
        console.log('El usuario administrador ha sido creado o actualizado:');
        console.log(`ID:     ${res.rows[0].id}`);
        console.log(`Email:  ${res.rows[0].email}`);
        console.log(`Rol:    ${res.rows[0].role}`);
        console.log('----------------------------');
        console.log('Ya puedes iniciar sesión con estas credenciales.');

        await client.end();
    } catch (error) {
        console.error('\n--- ERROR ---');
        console.error('Ocurrió un error durante el proceso:', error.message);

        // En caso de error, al menos mostrar el hash por si quieren hacerlo manual
        const fallbackHash = await bcrypt.hash(password, saltRounds);
        console.log('\nPuedes intentar la actualización manual con este SQL:');
        console.log(`UPDATE fluxmedical.users SET password = '${fallbackHash}' WHERE email = '${email}';`);
    }
}

setupAdmin();
