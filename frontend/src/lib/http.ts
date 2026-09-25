import axios from 'axios';

type ErrorResponse = {
  message?: string;
};

export function getErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError<ErrorResponse>(error)) {
    return fallback;
  }

  return error.response?.data?.message || fallback;
}