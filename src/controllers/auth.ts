import { RegisterInterface, LoginInterface, ChangePasswordInterface } from "../interfaces/auth";
import logger from "../logger";
import AuthService from "../services/auth";

export default class AuthController {
  private authService = new AuthService();

  async registerUser(input: RegisterInterface) {
    try {
      return await this.authService.register(input);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
  async loginUser(input: LoginInterface) {
    try {
      return await this.authService.login(input);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
  async changePassword(userId: string, input: ChangePasswordInterface) {
    try {
      return await this.authService.changePassword(userId, input);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
  async validateToken(token: string) {
    try {
      return await this.authService.validateToken(token);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}
