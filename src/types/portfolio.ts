export type Contact = {
  label: "Email" | "GitHub" | "LinkedIn";
  href: string;
};

export type Project = {
  id: string;
  title: string;
  date: string;
  outcome: string;
  focus: string[];
  githubUrl: string;
  architectureSnippet: string;
};

export type Profile = {
  name: string;
  handle: string;
  headline: string;
  subtitle: string;
  bio: string;
  status: string;
  techStack: string[];
  contacts: Contact[];
};
