import type { Knex } from 'knex';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgrespassword',
      database: process.env.DB_NAME || 'demo_db',
    },
    migrations: {
      directory: path.join(__dirname, 'src', 'db', 'migrations'),
      extension: 'ts',
    },
    seeds: {
      directory: path.join(__dirname, 'src', 'db', 'seeds'),
      extension: 'ts',
    },
  },
};

export default config;
