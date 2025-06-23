export interface SearchOptions<T> {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: keyof T;
  sortDir?: "asc" | "desc";
}
