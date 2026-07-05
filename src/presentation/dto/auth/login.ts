export interface LoginRequest {
    email: string;
    password: string;
    deviceName: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string
}