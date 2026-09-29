export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  tags: string[];
  author: string;
  featured: boolean;
  content: string;
  jsonContent?: Record<string, unknown>;
}

export interface PostDraft {
  id: string;
  title: string;
  slug: string;
  tags: string[];
  excerpt: string;
  content: string;
  updatedAt: string;
}
