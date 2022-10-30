// const parse = require('pg-connection-string').parse;
// const config = parse(process.env.DATABASE_URL);
// module.exports = ({ env }) => ({
//   connection: {
//     client: 'postgres',
//     connection: {
//       host: config.host,
//       port: config.port,
//       database: config.database,
//       user: config.user,
//       password: config.password,
//       ssl: {
//         rejectUnauthorized: false
//       },
//     },
//     debug: false,
//   },
// });
module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', '127.0.0.1'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'ClockStore'),
      user: env('DATABASE_USERNAME', 'ClockStore'),
      password: env('DATABASE_PASSWORD', 'ClockStore'),
      ssl: { rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false), },
      
    },
  },
});