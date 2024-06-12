// Utilizar <T> en ResponseBuilder permite que la clase sea
// genérica y adaptable a cualquier tipo de datos, manteniendo la
// robustez y la seguridad de tipos de TypeScript.

type Status = "success" | "error";
type Data<T> = T | null;
type Error = Array<{ field?: string; message: string }>;
type Pagination = {
  current_page: number;
  per_page: number;
  total_pages: number;
  total_items: number;
};

interface ApiResponse<T> {
  status: Status;
  data: Data<T>;
  message: string;
  errors?: Error;
  pagination?: Pagination;
}

class ResponseBuilder<T> {
  private response: ApiResponse<T>;

  constructor(initValues?: Partial<ApiResponse<T>>) {
    this.response = {
      status: "success",
      data: null,
      message: "",
      errors: [],
      ...initValues,
    };
  }

  setStatus(status: Status) {
    this.response.status = status;
    return this;
  }

  setData(data: Data<T>) {
    this.response.data = data;
    return this;
  }

  setMessage(message: string) {
    this.response.message = message;
    return this;
  }

  setErrors(errors: Error) {
    this.response.errors = errors;
    return this;
  }

  setPagination(pagination: Pagination) {
    this.response.pagination = pagination;
    return this;
  }

  build(): ApiResponse<T> {
    return this.response;
  }
}

export default ResponseBuilder;
