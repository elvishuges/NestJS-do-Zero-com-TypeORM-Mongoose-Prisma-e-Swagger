import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5433,
        username: 'postgres',
        password: 'postgres',
        database: 'devtraining',
        synchronize: true,
        entities: [__dirname + '/../**/*.entity.js'],
      });

      return dataSource.initialize();
    },
  },
];
