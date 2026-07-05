export interface RefreshRequest {
    refreshToken: string;
    deviceName: string;
}

export interface RefreshResponse {
    accessToken: string;
    refreshToken: string
}