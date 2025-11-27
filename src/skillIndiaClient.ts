import axios from "axios";
import { SKILL_INDIA_URL, HEADERS } from "./config";
import { baseRecord, InternshipRecord } from "./types";

interface SkillIndiaProgram {
  ProgramTitle?: string;
  OrganisationName?: string;
  Location?: string;
  ModeOfTraining?: string;
  Sector?: string;
  Description?: string;
  Fees?: number | string | null;
  FeesType?: string | null;
  Stipend?: boolean | string | null;
  StipendAmount?: number | string | null;
  Domain?: string | null;
  Occupation?: string | null;
  NumberOfOpenings?: number | string | null;
  CreditsAvailable?: boolean | null;
  StartDate?: string | null;
  EndDate?: string | null;
  ApplyBy?: string | null;
  Link?: string | null;
}

interface SkillIndiaResponse {
  data?: SkillIndiaProgram[];
  Data?: SkillIndiaProgram[];
}

export async function fetchSkillIndiaPrograms(
  pageNumber: number = 1,
  pageSize: number = 10000
): Promise<SkillIndiaResponse> {
  const payload = {
    PageNumber: pageNumber,
    PageSize: pageSize
  };

  const headers = {
    ...HEADERS,
    "Content-Type": "application/json"
  };

  const resp = await axios.post<SkillIndiaResponse>(
    SKILL_INDIA_URL,
    payload,
    { headers, timeout: 20000 }
  );

  return resp.data;
}

export function parseSkillIndiaPrograms(raw: SkillIndiaResponse): InternshipRecord[] {
  const list = raw.data || raw.Data || [];
  const results: InternshipRecord[] = [];

  for (const p of list) {
    const rec = baseRecord();

    rec.job_title = (p.ProgramTitle ?? "").toString();
    rec.company_name = (p.OrganisationName ?? "").toString();
    rec.location = (p.Location ?? "").toString();
    rec.mode = (p.ModeOfTraining ?? "").toString();
    rec.sector = (p.Sector ?? "").toString();
    rec.description = (p.Description ?? "").toString();

    const price = p.Fees;
    rec.price = price == null ? "" : String(price);

    rec.fee_type = (p.FeesType ?? "").toString();

    const stipendFlag = p.Stipend;
    if (stipendFlag === true || stipendFlag === "Yes") {
      rec.stipend = "Yes";
    } else if (stipendFlag === false || stipendFlag === "No") {
      rec.stipend = "No";
    } else {
      rec.stipend = "";
    }

    const stAmt = p.StipendAmount;
    rec.stipend_amount = stAmt == null ? "0" : String(stAmt);

    rec.domain = (p.Domain ?? "").toString();
    rec.occupation = (p.Occupation ?? "").toString();

    const openings = p.NumberOfOpenings;
    rec.number_of_openings = openings == null ? "" : String(openings);

    const credits = p.CreditsAvailable;
    if (credits === true) rec.credits_available = "Yes";
    else if (credits === false) rec.credits_available = "No";
    else rec.credits_available = "";

    rec.start_date = (p.StartDate ?? "").toString();
    rec.apply_by = (p.ApplyBy ?? "").toString();
    rec.job_link = (p.Link ?? "").toString();
    rec.wfh = rec.mode.toLowerCase().includes("online") ? "WFH" : "Full Time";
    rec.source = "Skill India Internship";

    results.push(rec);
  }

  return results;
}
