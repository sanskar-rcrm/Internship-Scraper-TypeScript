import { InternshipRecord } from "./types";
import { fetchAicteHtml, parseAicteInternships } from "./aicteScraper";
import {
  fetchSkillIndiaPrograms,
  parseSkillIndiaPrograms
} from "./skillIndiaClient";
import { fetchIirsInternships } from "./iirsScraper";

export async function aggregateInternships(): Promise<InternshipRecord[]> {
  const allRecords: InternshipRecord[] = [];

  try {
    const aicteHtml = await fetchAicteHtml("");
    const aicteRecords = parseAicteInternships(aicteHtml);
    allRecords.push(...aicteRecords);
  } catch (e) {
    console.warn("[WARN] Failed to fetch/parse AICTE internships:", e);
  }
  try {
    const skillRaw = await fetchSkillIndiaPrograms(1, 10000);
    const skillRecords = parseSkillIndiaPrograms(skillRaw);
    allRecords.push(...skillRecords);
  } catch (e) {
    console.warn("[WARN] Failed to fetch/parse Skill India internships:", e);
  }
  try {
    const iirsRecords = await fetchIirsInternships();
    allRecords.push(...iirsRecords);
  } catch (e) {
    console.warn("[WARN] Failed to fetch/parse IIRS internships:", e);
  }
  allRecords.forEach((rec, idx) => {
    rec.job_id = idx + 1;
  });

  return allRecords;
}
