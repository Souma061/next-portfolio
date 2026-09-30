export interface SocialLink {
  label: string;
  url: string;
  icon: string;
  badge?: string;
  isExternal: boolean;
}

export const PERSONAL_INFO = {
  name: "Soumabrata Ghosh",
  handle: "Souma061",
  title: "Systems & Distributed Infrastructure Engineer",
  tagline: "High-throughput kernels, lock-free concurrency, spatial indices, and distributed message fabrics.",
  status: "ONLINE",
  statusMessage: "OPEN FOR SYSTEMS ROLES",
  location: "Kolkata, IN // UTC+05:30",
  email: "soumabrataghosh57@gmail.com",
  npxCommand: "npx soumabrata",
  github: "https://github.com/Souma061",
  linkedin: "https://linkedin.com/in/soumabrata-ghosh",
  resumePath: "/resume.pdf",
  stats: {
    peakOps: "3.88M ops/s",
    p99Latency: "16.5 µs",
    raceConditions: "0.000%",
    projectsShipped: 5,
    chaosPassRate: "100%"
  }
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "GitHub",
    url: "https://github.com/Souma061",
    icon: "github",
    badge: "5 Repos",
    isExternal: true
  },
  {
    label: "LinkedIn",
    url: "https://linkedin.com/in/soumabrata-ghosh",
    icon: "linkedin",
    isExternal: true
  },
  {
    label: "Email",
    url: "mailto:soumabrataghosh57@gmail.com",
    icon: "mail",
    badge: "Direct PGP",
    isExternal: true
  },
  {
    label: "Resume",
    url: "/resume.pdf",
    icon: "file-text",
    badge: "PDF v2026",
    isExternal: true
  }
];
