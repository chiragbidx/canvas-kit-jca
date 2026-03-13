import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const DATABASE_URL = process.env.DATABASE_URL;
const MIGRATIONS_DIR = path.join(process.cwd(), "drizzle");
const JOURNAL_PATH = path.join(MIGRATIONS_DIR, "meta", "_journal.json");

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set");
  process.exit(1);
}

function run(cmd) {
  console.log(`→ ${cmd}`);
  execSync(cmd, { stdio: "inherit", env: process.env });
}

// Drizzle applies only migrations listed in drizzle/meta/_journal.json.
// Guard rail: fail early if a .sql migration exists that isn't in the journal,
// which would otherwise be silently skipped by the CLI.
try {
  const sqlFiles = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .map((f) => path.parse(f).name);

  const journal = JSON.parse(fs.readFileSync(JOURNAL_PATH, "utf8"));
  const journalTags = (journal.entries || []).map((e) => e.tag);

  const missing = sqlFiles.filter((tag) => !journalTags.includes(tag));
  if (missing.length) {
    console.error(
      "❌ Drizzle journal is missing entries for migrations:",
      missing.join(", ")
    );
    console.error(
      "   Run `npm run db:generate` or add the migrations via drizzle-kit so _journal.json is updated, then commit both SQL and meta."
    );
    process.exit(1);
  }
} catch (err) {
  console.error("❌ Failed to validate Drizzle journal:", err);
  process.exit(1);
}

console.log("🚀 Running Drizzle migrations…");
run("npx drizzle-kit migrate --config drizzle.config.ts");
console.log("🎉 Database migrations completed.");
