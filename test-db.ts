import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

(async () => {
  try {
    const result = await sql`SELECT NOW()`;
    console.log("Connected ✅", result);
  } catch (e) {
    console.error("Connection failed ❌", e);
  }
})();
