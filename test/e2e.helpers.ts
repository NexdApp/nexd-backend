import { NestApplication } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { readFileSync } from 'fs';
import * as path from 'path';
import { Connection, createConnection } from 'typeorm';
import { AppModule } from '../src/app.module';

let app: NestApplication;
let connection: Connection;
let testConnection: Connection;

export const prepareApp = async () => {
  const msForTimeout = 10000;
  jest.setTimeout(msForTimeout);

  const module = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  // connection = await module.get<Connection>(Connection);

  let dbConfig: any = {
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  };
  if (process.env.DATABASE_URL) {
    dbConfig = {
      url: process.env.DATABASE_URL,
    };
  }
  testConnection = await createConnection({
    type: 'postgres',
    ...dbConfig,
    schema: 'public',
    logging: false,
    synchronize: true,
    name: 'testConnection',
    entities: ['src/**/**.entity{.ts,.js}'],
  });

  app = module.createNestApplication();
  await app.init();
  return app;
};

export const prepareConnection = async () => {
  await testConnection.synchronize(true);
  // await connection.synchronize(true);

  const sql: string = readFileSync(
    path.join(__dirname, './../sql/articles_commands.sql'),
    {
      flag: 'r',
      encoding: 'utf-8',
    },
  );
  await testConnection.query(sql);
};

export const closeConnections = async () => {
  await app.close();
  if (testConnection && testConnection.isConnected) {
    await testConnection.close();
  }
  if (connection && connection.isConnected) {
    await connection.close();
  }
};
