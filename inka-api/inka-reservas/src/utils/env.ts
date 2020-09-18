import dotenv from 'dotenv';

dotenv.config();

export type environmentVariables = {
  DB_HOST: string
  DB_DIALECT: string
  DB_PORT: string
  DB_DATABASE: string
  DB_USERNAME: string
  DB_PASSWORD: string
  NODE_ENV: string
}

export const environmentVariables: environmentVariables = {
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_DIALECT: process.env.DB_DIALECT || 'mssql',
  DB_PORT: process.env.DB_PORT || '1433',
  DB_DATABASE: process.env.DB_DATABASE || 'demo',
  DB_USERNAME: process.env.DB_USERNAME || 'admin',
  DB_PASSWORD: process.env.DB_PASSWORD || '123',
  NODE_ENV: process.env.NODE_ENV || 'development'
}