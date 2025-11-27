import { aggregateInternships } from "./aggregator";
import { promises as fs } from "fs";
import * as path from "path";

async function main() {
  try {
    const records = await aggregateInternships();
    const outPath = path.resolve(process.cwd(), "jobs.json");
    const json = JSON.stringify(records, null, 2);

    await fs.writeFile(outPath, json, { encoding: "utf-8" });

    console.log(
      `✔ jobs.json generated at ${outPath} with ${records.length} records (each with job_id).`
    );
  } catch (err) {
    console.error("❌ Failed to generate jobs.json:", err);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  void main();
}
