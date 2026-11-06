import { NextResponse } from "next/server";

export interface ApiResponseSuccess<T> {
  success: true;
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
  timestamp: string;
}

export interface ApiResponseError {
  success: false;
  error: string;
  code?: string;
  details?: unknown;
  timestamp: string;
}

export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError;

/**
 * Creates a standardized successful JSON response.
 */
export function apiSuccess<T>(
  data: T,
  options: { message?: string; status?: number; meta?: Record<string, unknown> } = {}
): NextResponse<ApiResponseSuccess<T>> {
  const { message, status = 200, meta } = options;
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message ? { message } : {}),
      ...(meta ? { meta } : {}),
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

/**
 * Creates a standardized error JSON response.
 */
export function apiError(
  message: string,
  options: { status?: number; code?: string; details?: unknown } = {}
): NextResponse<ApiResponseError> {
  const { status = 400, code, details } = options;
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(code ? { code } : {}),
      ...(details !== undefined ? { details } : {}),
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

