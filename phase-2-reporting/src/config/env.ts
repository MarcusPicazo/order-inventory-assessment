export const config = {
  databaseUrl: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/orderdb?schema=public",
  port: parseInt(process.env.PORT || "3001", 10),
};
