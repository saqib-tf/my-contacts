export interface TenantScopedOptions {
  tenantId: number;
}

export interface SearchOptions<T> extends TenantScopedOptions {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: keyof T;
  sortDir?: "asc" | "desc";
}
