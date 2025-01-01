export class ReadBookDto {
  id: number;
  title: string;
  author: string;
  isbn: string;
  category: string;
  availability: boolean;
}

export class PaginatedReadBookDto {
  data: ReadBookDto[];
  page: number;
  limit: number;
  total: number;
}
