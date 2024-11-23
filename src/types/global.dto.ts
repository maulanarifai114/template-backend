export interface IdName<T = string> {
  id: T;
  name?: string;
}

export interface PaginatedResponse<T> {
  total: number;
  list: T[];
}
