const config = {
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: 'postgres',
  database: 'devtraining',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/*.js'],
};

module.exports = config;
