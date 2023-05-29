import KeycloakApiService from "../KeycloakApiService";
import endpoints from "./endpoints";

type KeycloakResponse = {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  "not-before-policy": number;
  session_state: string;
  scope: string;
};

export type InventoryResponse = {
  access_token: string;
  expires_in: number;
  jti: string;
  refresh_token: string;
  token_type: string;
  scope: string;
};

export const LoginApi = {
  login: (username: string, password: string, version?: number) => {
    return KeycloakApiService.POST<string, KeycloakResponse>(
      endpoints.v1.keycloakAuth,
      JSON.stringify({
        username,
        password,
        version,
      })
    ).loadingMessage("Tiến hành đăng nhập");
  },
  refreshToken: (refreshToken: string) => {
    return KeycloakApiService.POST<string, KeycloakResponse>(
      endpoints.v1.refreshToken,
      JSON.stringify({
        refreshToken,
      })
    ).loading(false);
  },
};
