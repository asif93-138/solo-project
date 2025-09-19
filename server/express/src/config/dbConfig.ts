const dbConfig = {
  DB: "movieReviewDB",
  USER: "postgres",
  PASSWORD: "12345678",
  HOST: "127.0.0.1",
  dialect: "postgres",
};

export default dbConfig;

// const dbConfig = {
//   DB: "postgres", // database name
//   USER: "postgres.kkacesmxzfdeaqahhljq", // user from session pooler
//   PASSWORD: "iW4shvxapaSD6Vz5", // process.env.DB_PASSWORD, // don’t hardcode; set in .env
//   HOST: "aws-1-ap-south-1.pooler.supabase.com", // Supabase session pooler host
//   dialect: "postgres",
//   port: 5432,
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false, // required for Supabase SSL
//     },
//   },
// };

// export default dbConfig;
