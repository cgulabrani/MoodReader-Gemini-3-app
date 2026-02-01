
export interface Mood {
  id: string;
  label: string;
  emoji: string;
  color: string;
  description: string;
}

export interface Book {
  title: string;
  author: string;
  year: string;
  rating: string;
  summary: string;
  reason: string;
  isbn: string;
}

export interface GroundingLink {
  title: string;
  uri: string;
}

export interface CurationResponse {
  curatorNote: string;
  books: Book[];
  links: GroundingLink[];
}
