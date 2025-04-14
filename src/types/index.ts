export type ApiResponse = {
  statusCode: number;
  message: string;
  data: any;
  pagination?: Pagination;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type RawQuery = {
  [key: string]: string | number | boolean;
};
