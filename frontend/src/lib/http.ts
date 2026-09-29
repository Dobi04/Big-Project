import axios from 'axios';

type ErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
  title?: string;
};

export function getErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError<ErrorResponse>(error)) {
    return fallback;
  }

  const data = error.response?.data;
  if (data?.message) {
    return data.message;
  }

  const validationMessage = data?.errors
    ? Object.values(data.errors).flat().find((message) => Boolean(message))
    : undefined;

  return validationMessage || data?.title || fallback;
}