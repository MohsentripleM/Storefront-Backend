import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();
const {
  ENV,
  POSTGRES_TEST_DB,
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
} = process.env;

let client: Pool;

if (ENV === "dev") {
  client = new Pool({
    host: POSTGRES_HOST,
    user: POSTGRES_USER,
    database: POSTGRES_DB,
    password: POSTGRES_PASSWORD,
  });
} else {
  client = new Pool({
    host: POSTGRES_HOST,
    user: POSTGRES_USER,
    database: POSTGRES_TEST_DB,
    password: POSTGRES_PASSWORD,
  });
}

export default client;
