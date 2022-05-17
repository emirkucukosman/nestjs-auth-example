export interface IAuthController {
  login(): Promise<{
    accessToken: string;
    refreshToken: string;
  }>;
}
