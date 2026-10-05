import { readFileSync } from "fs";
import path from "path";
import { Pool, types } from "pg";

// Postgres `date` has no time or zone; keep it as the "YYYY-MM-DD" string instead of a JS Date at local midnight
types.setTypeParser(types.builtins.DATE, (value) => value);

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
}

// Hosted Supabase: TLS that verifies the server against Supabase's own root CA, which Node doesn't trust by default.
// The local Supabase stack (tests, CI) has no TLS. Keep `sslmode` out of DATABASE_URL: pg lets it override `ssl`.
const isLocal = ["localhost", "127.0.0.1", "[::1]"].includes(new URL(connectionString).hostname);
const ssl = isLocal
    ? false
    : { ca: readFileSync(path.join(__dirname, "../../certs/supabase-root-2021-ca.crt"), "utf8") };

const pool = new Pool({ connectionString, ssl });
export default pool;
