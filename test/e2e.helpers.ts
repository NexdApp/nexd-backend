import { NestApplication } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { readFileSync } from 'fs';
import * as path from 'path';
import { Connection } from 'typeorm';
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

  connection = await module.get<Connection>(Connection);

  app = module.createNestApplication();
  await app.init();
  return app;
};

export const prepareConnection = async () => {
  await testConnection.synchronize(true);
  await connection.synchronize(true);

  let sql: string = readFileSync(
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
