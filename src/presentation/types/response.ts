export interface ApiSuccessResponse<T = undefined> {
    message?: string;
    data?: T;
}

export interface ApiErrorResponse {
    message: string;
    fields?: Array<{ field: string; message: string }>;
    requestId?: string;
}

export type ApiResponse<T = undefined> = ApiSuccessResponse<T> | ApiErrorResponse;
