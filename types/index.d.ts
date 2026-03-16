declare interface PhoneNumber {
  countryCode: string;
  number: string;
};

declare interface Account {
  username: string;
  fullname: string;
  email: string;
  phoneNumber: PhoneNumber;
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