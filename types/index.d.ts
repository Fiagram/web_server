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

declare interface SignUpRequest extends Account {
  password: string;
};

declare interface SignInRequest {
  username: string;
  password: string;
  isRememberMe: bool;
};

declare interface Asset {
  name: string;
  currentBalance: number;
}

declare interface Portfolio {
  assets: Asset[];
  totalAssets: number;
  totalCurrentBalance: number;
}