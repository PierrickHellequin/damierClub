// Types API génériques
export interface ApiListResponse<T> {
  data: T[];
  total: number;
  page: number; // page courante (1-based)
  pageSize: number; // taille de page
}

export interface OrderParam {
  field: string;
  direction?: "asc" | "desc";
}
