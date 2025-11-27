export interface InternshipRecord {
  job_id: number;
  job_title: string;
  company_name: string;
  wfh: string;
  posted_on: string;
  location: string;
  start_date: string;
  duration: string;
  apply_by: string;
  job_link: string;
  sector: string;
  description: string;
  price: string;
  fee_type: string;
  mode: string;
  stipend: string;
  stipend_amount: string;
  domain: string;
  occupation: string;
  number_of_openings: string;
  credits_available: string;
  source: string;
}

export const baseRecord = (): InternshipRecord => ({
  job_id: 0,
  job_title: "",
  company_name: "",
  wfh: "",
  posted_on: "",
  location: "",
  start_date: "",
  duration: "",
  apply_by: "",
  job_link: "",
  sector: "",
  description: "",
  price: "",
  fee_type: "",
  mode: "",
  stipend: "",
  stipend_amount: "",
  domain: "",
  occupation: "",
  number_of_openings: "",
  credits_available: "",
  source: ""
});
