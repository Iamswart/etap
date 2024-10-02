export interface RegisterInterface {
  email: string;
  name: string;
  password: string;
}

export interface LoginInterface {
  email: string;
  password: string;
}

export interface EmailInterface {
  email: string;
  data: any;
  template: string;
  subject: string;
}

export interface ChangePasswordInterface {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordInterface {
  email: string;
}

export interface ResetPasswordInterface {
  email: string;
  otp: string;
  newPassword: string;
}