import { GetUserProgressInterface } from "../interfaces/learningProgress";
import logger from "../logger";
import LearningProgressService from "../services/learningProgress";

export default class LearningProgressController {
  private learningProgressService = new LearningProgressService();

  async getUserProgress(input: GetUserProgressInterface) {
    try {
      return await this.learningProgressService.getUserProgress(input);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}
