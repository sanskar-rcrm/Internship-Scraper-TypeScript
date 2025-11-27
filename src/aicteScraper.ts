import axios from "axios";
import * as cheerio from "cheerio";
import { AICTE_LIST_URL, AICTE_DETAIL_BASE, HEADERS } from "./config";
import { baseRecord, InternshipRecord } from "./types";

export async function fetchAicteHtml(city: string = ""): Promise<string> {
  const url = `${AICTE_LIST_URL}${encodeURIComponent(city)}`;
  const resp = await axios.get<string>(url, { headers: HEADERS, timeout: 20000 });
  return resp.data;
}

export function parseAicteInternships(html: string): InternshipRecord[] {
  const $ = cheerio.load(html);
  const results: InternshipRecord[] = [];

  $(".card, .internship-card, .job-card").each((_, el) => {
    const rec = baseRecord();

    const title = $(el).find(".title, .job-title").text().trim();
    const company = $(el).find(".company, .org_name").text().trim();
    const location = $(el).find(".location").text().trim();
    const duration = $(el).find(".duration").text().trim();
    const startDate = $(el).find(".start-date").text().trim();
    const applyBy = $(el).find(".apply-by").text().trim();
    const mode = $(el).find(".mode").text().trim();
    const stipend = $(el).find(".stipend").text().trim();

    let relativeLink =
      $(el).find("a.details, a.view, a[href*='internship-det']").attr("href") || "";
    const jobLink = relativeLink
      ? new URL(relativeLink, AICTE_DETAIL_BASE).toString()
      : "";

    rec.job_title = title;
    rec.company_name = company;
    rec.location = location;
    rec.duration = duration;
    rec.start_date = startDate || "Immediately";
    rec.apply_by = applyBy;
    rec.mode = mode;
    rec.stipend = stipend;
    rec.job_link = jobLink;
    rec.wfh = mode.toLowerCase().includes("home") ? "WFH" : "Full Time";
    rec.source = "AICTE Internship";

    results.push(rec);
  });

  return results;
}
