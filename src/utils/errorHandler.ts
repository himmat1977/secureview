export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

export class NetworkError extends Error {
  status?: number;
  code?: string;
  details?: any;

  constructor(message: string, status?: number, code?: string, details?: any) {
    super(message);
    this.name = 'NetworkError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const handleApiError = (error: any): ApiError => {
  if (error instanceof NetworkError) {
    return {
      message: error.message,
      status: error.status,
      code: error.code,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: 'An unexpected error occurred',
  };
};

export const getErrorMessage = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return 'An unexpected error occurred';
};
