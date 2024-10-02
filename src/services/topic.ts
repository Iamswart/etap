import { Op } from "sequelize";
import { badRequestError, unknownResourceError } from "../error";
import db from "../database/models/";
import logger from "../logger";
import { CreateTopicInterface, UpdateTopicInterface } from "../interfaces/topic";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";

const { Topic, Subject, LearningProgress, User } = db;

export default class TopicService {
  async createTopic(input: CreateTopicInterface) {
    const { title, description, videoUrl, subjectId, order } = input;

    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      throw unknownResourceError("Subject not found");
    }

    const existingTopic = await Topic.findOne({
      where: { subjectId, order },
    });
    if (existingTopic) {
      throw badRequestError("A topic with this order already exists for the subject");
    }

    const slug = slugify(`${title}-${uuidv4()}`, { lower: true });

    const topic = await Topic.create({
      title,
      description,
      videoUrl,
      subjectId,
      order,
      slug, 
    });

    logger.info(`New topic created: ${topic.id}`);

    return topic;
  }

  async getTopicBySlug(slug: string) {
    const topic = await Topic.findOne({
      where: { slug },
      include: [{ model: Subject, as: 'subject' }],
    });

    if (!topic) {
      throw unknownResourceError("Topic not found");
    }

    return topic;
  }

  async updateTopic(slug: string, input: UpdateTopicInterface) {
    const topic = await Topic.findOne({ where: { slug } });

    if (!topic) {
      throw unknownResourceError("Topic not found");
    }

    const { title, description, videoUrl, order } = input;

    if (order && order !== topic.order) {
      const existingTopic = await Topic.findOne({
        where: { subjectId: topic.subjectId, order },
      });
      if (existingTopic) {
        throw badRequestError("A topic with this order already exists for the subject");
      }
    }

    await topic.update({
      title: title || topic.title,
      description: description || topic.description,
      videoUrl: videoUrl || topic.videoUrl,
      order: order || topic.order,
    });

    logger.info(`Topic updated: ${topic.id}`);

    return topic;
  }

  async deleteTopic(slug: string) {
    const topic = await Topic.findOne({ where: { slug } });

    if (!topic) {
      throw unknownResourceError("Topic not found");
    }

    await topic.destroy();

    logger.info(`Topic deleted: ${topic.id}`);

    return { message: "Topic successfully deleted" };
  }

  async markTopicAsCompleted(userId: string, topicSlug: string) {
    const topic = await Topic.findOne({ where: { slug: topicSlug } });
  
    if (!topic) {
      throw unknownResourceError("Topic not found");
    }
  
    const [progress, created] = await LearningProgress.findOrCreate({
      where: { userId, topicId: topic.id },
      defaults: { completed: true, completedAt: new Date() },
    });
  
    if (!created && !progress.completed) {
      await progress.update({ completed: true, completedAt: new Date() });
    }
  
    logger.info(`Topic ${topic.id} marked as completed for user ${userId}`);
  
    return progress;
  }

  async getTopicCompletionStatus(userId: string, topicSlug: string) {
    const topic = await Topic.findOne({ where: { slug: topicSlug } });

    if (!topic) {
      throw unknownResourceError("Topic not found");
    }

    const progress = await LearningProgress.findOne({
      where: { userId, topicId: topic.id },
    });

    return {
      topicId: topic.id,
      topicTitle: topic.title,
      completed: progress ? progress.completed : false,
      completedAt: progress ? progress.completedAt : null,
    };
  }

  async getTopicLeaderboard(topicSlug: string, page = 1, limit = 10) {
    const topic = await Topic.findOne({ where: { slug: topicSlug } });
  
    if (!topic) {
      throw unknownResourceError("Topic not found");
    }
  
    const offset = (page - 1) * limit;
  
    const leaderboard = await User.findAll({
      attributes: ['id', 'name', 'email'],
      include: [{
        model: LearningProgress,
        as: 'learningProgress',
        attributes: ['completedAt'],
        where: { 
          topicId: topic.id,
          completed: true,
          completedAt: { [Op.not]: null }
        },
        required: true,
      }],
      order: [[{ model: LearningProgress, as: 'learningProgress' }, 'completedAt', 'ASC']],
      limit,
      offset,
    });
  
    const totalCount = await User.count({
      include: [{
        model: LearningProgress,
        as: 'learningProgress',
        where: { 
          topicId: topic.id,
          completed: true,
          completedAt: { [Op.not]: null }
        },
        required: true,
      }],
    });
  
    return {
      leaderboard,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    };
  }
}