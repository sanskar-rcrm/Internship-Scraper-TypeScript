import axios from "axios";
import * as cheerio from "cheerio";
import { IIRS_URL } from "./config";
import { baseRecord, InternshipRecord } from "./types";

export async function fetchIirsInternships(): Promise<InternshipRecord[]> {
  const resp = await axios.get<string>(IIRS_URL, { timeout: 20000 });
  const html = resp.data;
  return parseIirsInternships(html);
}

export function parseIirsInternships(html: string): InternshipRecord[] {
  const $ = cheerio.load(html);
  const results: InternshipRecord[] = [];

  $("table tbody tr").each((_, row) => {
    const cols = $(row).find("td");
    if (cols.length === 0) return;

    const rec = baseRecord();

    const title = $(cols[0]).text().trim();
    const duration = $(cols[1]).text().trim();
    const location = $(cols[2]).text().trim();
    const applyBy = $(cols[3]).text().trim();
    const link = $(cols[0]).find("a").attr("href") || "";

    rec.job_title = title;
    rec.company_name = "IIRS / ISRO";
    rec.duration = duration;
    rec.location = location;
    rec.apply_by = applyBy;
    rec.job_link = link ? new URL(link, IIRS_URL).toString() : "";
    rec.mode = "On-site";
    rec.wfh = "Full Time";
    rec.source = "IIRS Internship";

    results.push(rec);
  });

  return results;
}
