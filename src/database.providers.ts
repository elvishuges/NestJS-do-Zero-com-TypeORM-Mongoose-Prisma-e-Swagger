import { DataSource } from 'typeorm';
import { CourseRefactoringTest1667347674820 } from './migrations/1667347674820-CourseRefactoringTest';

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

export const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: 'postgres',
  database: 'devtraining',
  synchronize: true,
  entities: [__dirname + '/../**/*.entity.js'],
  migrations: [CourseRefactoringTest1667347674820],
});
