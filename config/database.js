// const path = require('path');

// module.exports = ({ env }) => ({
//   connection: {
//     client: 'sqlite',
//     connection: {
//       filename: path.join(__dirname, '..', env('DATABASE_FILENAME', '.tmp/data.db')),
//     },
//     useNullAsDefault: true,
//   },
// });
// module.exports = ({ env }) => ({
//   connection: {
//     client: 'postgres',
//     connection: {
//       host: env('DATABASE_HOST', '127.0.0.1'),
//       port: env.int('DATABASE_PORT', 5432),
//       database: env('DATABASE_NAME', 'ClockStore'),
//       user: env('DATABASE_USERNAME', 'ClockStore'),
//       password: env('DATABASE_PASSWORD', 'ClockStore'),
//       ssl: { rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false), },
      
//     },
//   },
// });
module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: "ec2-35-170-21-76.compute-1.amazonaws.com",
      port: 5432,
      database: "debrh1bp3fim08",
      user: "yirwbzwalxmmoa",
      password: "8a7adfcfd02592d91e94c03cc4aa6bcc35b5057db7cac3d0fbcfe3299736e7db",
      ssl: { rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false), },
      
    },
  },
});