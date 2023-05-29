export type LoginRequest = {
  username: string;
  password: string;
};

export type Token = {
  access_token?: string;
  token_type?: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  listmenu?: string[] | null;
  jti?: string;
};

export enum Gender {
  No = -1,
  Male = 0,
  Female = 1,
}

export interface LoginInfo {
  username: string;
  password: string;
  name: string;
  gender: Gender;
  avatar: string;
}
