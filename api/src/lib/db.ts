import { Pool, types } from "pg";

// Postgres `date` has no time or zone; keep it as the "YYYY-MM-DD" string instead of a JS Date at local midnight
types.setTypeParser(types.builtins.DATE, (value) => value);

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export default pool;
