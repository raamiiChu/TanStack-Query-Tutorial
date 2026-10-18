export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TodoPage = {
  items: Todo[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type TodoCursorPage = {
  items: Todo[];
  nextCursor: number | null;
};
