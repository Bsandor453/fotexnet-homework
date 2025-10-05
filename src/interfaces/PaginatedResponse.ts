import { Pagination } from '@/interfaces/Pagination';

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}
