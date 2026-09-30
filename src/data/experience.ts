export interface ExperienceHighlight {
  title: string;
  detail: string;
}

export interface CompanyProperty {
  name: string;
  url?: string;
}

export interface ExperienceRole {
  company: string;
  companyUrl: string;
  role: string;
  employmentType: string;
  location: string;
  start: string;
  /** null means current. */
  end: string | null;
  summary: string;
  properties: CompanyProperty[];
  highlights: ExperienceHighlight[];
  stack: string[];
}

export const EXPERIENCE: ExperienceRole[] = [
  {
    company: "ShapeNXT.com",
    companyUrl: "https://shapenxt.com",
    role: "Full-Stack Software Engineer Intern",
    employmentType: "Internship",
    location: "Remote",
    start: "Jul 2026",
    end: null,
    summary:
      "Working across the company's web platform and its learning management system, shipping production features end to end.",
    properties: [
      { name: "shapenxt.com", url: "https://shapenxt.com" },
      { name: "LMS", url: "https://learn.shapenxt.com" },
      { name: "CRM", url: "https://galaxy.shapenxt.com" },
    ],
    highlights: [
      {
        title: "Rebuilt the company website",
        detail:
          "Reconstructed the site from the ground up, taking ownership of the frontend and the build and deployment pipeline behind it.",
      },
      {
        title: "Added a blog management system to the LMS",
        detail:
          "Built authoring and publishing for blog content directly into their learning platform, so course and marketing content can be managed without developer involvement.",
      },
    ],
    stack: ["Next.js", "React", "TypeScript", "PostgreSQL", "MongoDB"],
  },
];
