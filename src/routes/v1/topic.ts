import { celebrate } from "celebrate";
import { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import TopicController from "../../controllers/topic";
import { protect, isAdmin, isAdminOrTeacher } from "../../middlewares/authenticate";
import {
  createTopicSchema,
  updateTopicSchema,
  getTopicsSchema,
} from "../../utils/validation-schema";

const topicRoutes: Router = Router();
const topicController = new TopicController();

topicRoutes.post(
  "/",
  protect,
  isAdminOrTeacher,
  celebrate({ body: createTopicSchema }),
  asyncHandler(async (request: Request, response: Response) => {
    const topicData = request.body;
    const data = await topicController.createTopic(topicData);
    response.status(201).json(data).end();
  })
);

topicRoutes.get(
  "/:slug",
  protect,
  asyncHandler(async (request: Request, response: Response) => {
    const { slug } = request.params;
    const data = await topicController.getTopicBySlug(slug);
    response.status(200).json(data).end();
  })
);

topicRoutes.put(
  "/:slug",
  protect,
  isAdminOrTeacher,
  celebrate({ body: updateTopicSchema }),
  asyncHandler(async (request: Request, response: Response) => {
    const { slug } = request.params;
    const topicData = request.body;
    const data = await topicController.updateTopic(slug, topicData);
    response.status(200).json(data).end();
  })
);

topicRoutes.delete(
  "/:slug",
  protect,
  isAdmin,
  asyncHandler(async (request: Request, response: Response) => {
    const { slug } = request.params;
    const data = await topicController.deleteTopic(slug);
    response.status(200).json(data).end();
  })
);

topicRoutes.post(
  "/:slug/complete",
  protect,
  asyncHandler(async (request: Request, response: Response) => {
    const { slug } = request.params;
    const userId = response.locals.user.getId();
    const data = await topicController.markTopicAsCompleted(userId, slug);
    response.status(200).json(data).end();
  })
);

topicRoutes.get(
  "/:slug/completion-status",
  protect,
  asyncHandler(async (request: Request, response: Response) => {
    const { slug } = request.params;
    const userId = response.locals.user.getId();
    const data = await topicController.getTopicCompletionStatus(userId, slug);
    response.status(200).json(data).end();
  })
);

topicRoutes.get(
  "/:slug/leaderboard",
  protect,
  isAdminOrTeacher,
  celebrate({ query: getTopicsSchema }),
  asyncHandler(async (request: Request, response: Response) => {
    const { slug } = request.params;
    const { page, limit } = request.query;
    const data = await topicController.getTopicLeaderboard(slug, Number(page), Number(limit));
    response.status(200).json(data).end();
  })
);

export { topicRoutes };