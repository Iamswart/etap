import { Op } from "sequelize";
import db from "../database/models/";
import { GetUserProgressInterface } from "../interfaces/learningProgress";
import { TopicAttributes } from "../database/models/topic";

const { LearningProgress, Topic, Subject } = db;

export default class LearningProgressService {

  async getUserProgress(input: GetUserProgressInterface) {
    const { userId, subjectId } = input;
  
    const topics = await Topic.findAll({
      where: { subjectId },
      attributes: ['id'],
      order: [['order', 'ASC']]
    }) as Pick<TopicAttributes, 'id'>[];
  
    const totalTopics = topics.length;
  
    const completedTopics = await LearningProgress.count({
      where: {
        userId: userId,
        topicId: {
          [Op.in]: topics.map((topic: Pick<TopicAttributes, 'id'>) => topic.id)
        },
        completed: true
      }
    });
  
    console.log('Total Topics:', totalTopics);
    console.log('Completed Topics:', completedTopics);
  
    return {
      userId,
      subjectId,
      totalTopics,
      completedTopics,
      progressPercentage: totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0,
    };
  }
}