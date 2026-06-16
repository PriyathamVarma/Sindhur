export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiFailureResponse<E = string> {
  success: false;
  message: string;
  error?: E;
}

export function success<T>(data: T, message = "Success"): ApiSuccessResponse<T> {
  return { success: true, message, data };
}

export function failure<E = string>(
  message = "Something went wrong",
  error?: E,
): ApiFailureResponse<E> {
  return {
    success: false,
    message,
    error: process.env.NODE_ENV === "development" ? error : undefined,
  };
}
