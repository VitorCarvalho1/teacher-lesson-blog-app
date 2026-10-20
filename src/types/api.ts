export type ApiMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiPaginated<T> = {
  data: T[];
  meta: ApiMeta;
};

export type ApiSuccess<T> = {
  data: T;
};
