import { Request } from 'express';
import { DataSource } from 'typeorm';

export interface SesionSqlActiva {
  sessionId: string;
  usuario: string;
  dataSource: DataSource;
}

export interface SqlSessionRequest extends Request {
  sqlSession?: SesionSqlActiva;
}
