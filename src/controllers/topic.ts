import {
  CreateTopicInterface,
  UpdateTopicInterface,
} from "../interfaces/topic";
import logger from "../logger";
import TopicService from "../services/topic";

export default class TopicController {
  private topicService = new TopicService();

  async createTopic(input: CreateTopicInterface) {
    try {
      return await this.topicService.createTopic(input);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async getTopicBySlug(slug: string) {
    try {
      return await this.topicService.getTopicBySlug(slug);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async updateTopic(slug: string, input: UpdateTopicInterface) {
    try {
      return await this.topicService.updateTopic(slug, input);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async deleteTopic(slug: string) {
    try {
      return await this.topicService.deleteTopic(slug);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async markTopicAsCompleted(userId: string, topicSlug: string) {
    try {
      return await this.topicService.markTopicAsCompleted(userId, topicSlug);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async getTopicCompletionStatus(userId: string, topicSlug: string) {
    try {
      return await this.topicService.getTopicCompletionStatus(userId, topicSlug);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async getTopicLeaderboard(topicSlug: string, page: number = 1, limit: number = 10) {
    try {
      return await this.topicService.getTopicLeaderboard(topicSlug, page, limit);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}