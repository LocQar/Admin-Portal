/**
 * Normalized API error shape used throughout the app.
 * All HTTP failures bubble up as ApiError — components never see raw fetch errors.
 */

export type FieldErrors = Record<string, string[]>;

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fieldErrors?: FieldErrors;
  readonly cause?: unknown;

  constructor(params: {
    status: number;
    code: string;
    message: string;
    fieldErrors?: FieldErrors;
    cause?: unknown;
  }) {
    super(params.message);
    this.name = 'ApiError';
    this.status = params.status;
    this.code = params.code;
    this.fieldErrors = params.fieldErrors;
    this.cause = params.cause;
  }

  static isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
  }
}

/**
 * Turn any thrown value into an ApiError with sensible defaults.
 */
export async function normalizeError(response: Response): Promise<ApiError> {
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    // Non-JSON error body
  }

  const data = (body ?? {}) as {
    code?: string;
    message?: string;
    error?: string;
    errors?: FieldErrors;
  };

  return new ApiError({
    status: response.status,
    code: data.code ?? `HTTP_${response.status}`,
    message: data.message ?? data.error ?? response.statusText ?? 'Request failed',
    fieldErrors: data.errors,
  });
}

/**
 * Human-readable summary of an error for toasts/logs.
 */
export function errorMessage(error: unknown): string {
  if (ApiError.isApiError(error)) return error.message;
  if (error instanceof Error) return error.message;
  return 'Something went wrong';
}
