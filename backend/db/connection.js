import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Prueba rápida para ver si la conexión funciona al arrancar
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Error crítico: No se pudo conectar a Supabase', err.stack);
    } else {
        console.log('🟢 Conexión exitosa a Supabase PostgreSQL');
    }
});

export default pool;