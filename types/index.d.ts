
declare interface Account {
  username: string;
  fullname: string;
  email: string;
  phoneNumber: string;
  role: "admin" | "member";
};

declare interface AccessTokenResponse {
  token: string;
  /** Unix timestamp (seconds) when the access token expires. */
  exp: number;
}

declare interface SignUpRequest {
  account: Account;
  password: string;
}

declare interface SignInRequest {
  username: string;
  password: string;
  isRememberMe: boolean;
}

declare interface SigninResponse {
  account: Account;
  accessToken: AccessTokenResponse;
}

declare interface SignupResponse {
  accessToken: AccessTokenResponse;
}

declare interface Asset {
  name: string;
  currentBalance: number;
}

declare interface Portfolio {
  assets: Asset[];
  totalAssets: number;
  totalCurrentBalance: number;
}

// -------------------------------- Financial Indicators

declare interface IndicatorAsset {
  symbol: string;
  name: string;
  currentValue: number;
  /** Percentage change compared to 1 week ago */
  changeWeek: number;
  /** Percentage change compared to 1 month ago */
  changeMonth: number;
  /** Percentage change compared to 1 year ago */
  changeYear: number;
}

declare interface IndicatorGroup {
  id: string;
  name: string;
  assets: IndicatorAsset[];
}

// -------------------------------- Profile / Webhooks

declare interface ProfileMeResponse {
  account: Account;
}

declare interface UpdateProfileMeRequest {
  fullname?: string;
  email?: string;
  phoneNumber?: string;
}

declare interface UpdatePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

declare interface Webhook {
  id?: number;
  name: string;
  url: string;
}