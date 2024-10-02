import {
  CreateSubjectInterface,
  UpdateSubjectInterface,
} from "../interfaces/subject";
import logger from "../logger";
import SubjectService from "../services/subject";

export default class SubjectController {
  private subjectService = new SubjectService();

  async createSubject(input: CreateSubjectInterface) {
    try {
      return await this.subjectService.createSubject(input);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async getAllSubjects(page: number = 1, limit: number = 10) {
    try {
      return await this.subjectService.getAllSubjects(page, limit);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async getSubjectBySlug(slug: string) {
    try {
      return await this.subjectService.getSubjectBySlug(slug);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async updateSubject(slug: string, input: UpdateSubjectInterface) {
    try {
      return await this.subjectService.updateSubject(slug, input);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async deleteSubject(slug: string) {
    try {
      return await this.subjectService.deleteSubject(slug);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async getSubjectTopics(slug: string, page: number = 1, limit: number = 10) {
    try {
      return await this.subjectService.getSubjectTopics(slug, page, limit);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async getRankedLearners(slug: string, page: number = 1, limit: number = 10) {
    try {
      return await this.subjectService.getRankedLearners(slug, page, limit);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}