import { DataSourceOptions, DataSource } from 'typeorm';
import { env } from '../env';

const options: DataSourceOptions = {
  type: 'postgres',
  host: env.POSTGRES_HOST,
  port: +(env.POSTGRES_PORT as string),
  username: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  migrationsRun: true,
  synchronize: false,
};

const source = new DataSource(options);
export { options, source };
