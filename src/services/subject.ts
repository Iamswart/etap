import { Op } from "sequelize";
import { badRequestError, unknownResourceError } from "../error";
import db, { sequelize } from "../database/models/";
import logger from "../logger";
import {
  CreateSubjectInterface,
  UpdateSubjectInterface,
} from "../interfaces/subject";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";

const { Subject, Topic, User, LearningProgress } = db;

export default class SubjectService {
  async createSubject(input: CreateSubjectInterface) {
    const { title, description } = input;

    const existingSubject = await Subject.findOne({ where: { title } });
    if (existingSubject) {
      throw badRequestError("A subject with this title already exists");
    }

    const slug = slugify(`${title}-${uuidv4()}`, { lower: true });

    const subject = await Subject.create({
      title,
      description,
      slug,
    });

    logger.info(`New subject created: ${subject.id}`);
    return subject;
  }

  async getAllSubjects(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { count, rows } = await Subject.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      subjects: rows,
      totalCount: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    };
  }

  async getSubjectBySlug(slug: string) {
    const subject = await Subject.findOne({
      where: { slug },
      include: [{ model: Topic, as: "topics" }],
    });

    if (!subject) {
      throw unknownResourceError("Subject not found");
    }

    return subject;
  }

  async updateSubject(slug: string, input: UpdateSubjectInterface) {
    const subject = await Subject.findOne({ where: { slug } });

    if (!subject) {
      throw unknownResourceError("Subject not found");
    }

    const { title, description } = input;

    if (title && title !== subject.title) {
      const existingSubject = await Subject.findOne({ where: { title } });
      if (existingSubject) {
        throw badRequestError("A subject with this title already exists");
      }
    }

    await subject.update({
      title: title || subject.title,
      description: description || subject.description,
    });

    logger.info(`Subject updated: ${subject.id}`);

    return subject;
  }

  async deleteSubject(slug: string) {
    const subject = await Subject.findOne({ where: { slug } });

    if (!subject) {
      throw unknownResourceError("Subject not found");
    }

    await subject.destroy();

    logger.info(`Subject deleted: ${subject.id}`);

    return { message: "Subject successfully deleted" };
  }

  async getSubjectTopics(slug: string, page = 1, limit = 10) {
    const subject = await Subject.findOne({ where: { slug } });

    if (!subject) {
      throw unknownResourceError("Subject not found");
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Topic.findAndCountAll({
      where: { subjectId: subject.id },
      limit,
      offset,
      order: [["order", "ASC"]],
    });

    return {
      topics: rows,
      totalCount: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    };
  }

  async getRankedLearners(slug: string, page = 1, limit = 10) {
    const subject = await Subject.findOne({
      where: { slug },
      include: [{ model: Topic, as: "topics", attributes: ["id"] }],
    });

    if (!subject) {
      throw unknownResourceError("Subject not found");
    }

    const offset = (page - 1) * limit;
    const topicIds = subject.topics.map((topic: { id: string }) => topic.id);
    const totalTopics = topicIds.length;

    const rankedLearners = await User.findAll({
      attributes: [
        "id",
        "name",
        "email",
        [
          sequelize.fn("COUNT", sequelize.col("learningProgress.id")),
          "completedTopics",
        ],
        [
          sequelize.literal(
            `(COUNT("learningProgress"."id")::float / ${totalTopics}) * 100`
          ),
          "completionRate",
        ],
        [
          sequelize.fn("MAX", sequelize.col("learningProgress.completed_at")),
          "lastCompletedAt",
        ],
      ],
      include: [
        {
          model: LearningProgress,
          as: "learningProgress",
          attributes: [],
          where: {
            topicId: { [Op.in]: topicIds },
            completed: true,
          },
          required: true,
        },
      ],
      group: ["User.id"],
      order: [
        [
          sequelize.literal(
            '(COUNT("learningProgress"."id")::float / ' +
              totalTopics +
              ") * 100 DESC"
          ),
          "NULLS LAST",
        ],
        [sequelize.col("lastCompletedAt"), "DESC NULLS LAST"],
      ],
      limit,
      offset,
      subQuery: false,
    });

    const totalCount = await User.count({
      distinct: true,
      include: [
        {
          model: LearningProgress,
          as: "learningProgress",
          where: {
            topicId: { [Op.in]: topicIds },
            completed: true,
          },
          required: true,
        },
      ],
    });

    return {
      rankedLearners: rankedLearners.map((learner: any) => ({
        id: learner.id,
        name: learner.name,
        email: learner.email,
        completedTopics: learner.get("completedTopics") as number,
        completionRate: parseFloat(
          (learner.get("completionRate") as number).toFixed(2)
        ),
        lastCompletedAt: learner.get("lastCompletedAt") as Date | null,
      })),
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    };
  }
}
