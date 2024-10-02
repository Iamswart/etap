import { celebrate } from "celebrate";
import { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import LearningProgressController from "../../controllers/learningProgress";
import { protect } from "../../middlewares/authenticate";
import {
  getUserProgressSchema,
} from "../../utils/validation-schema";

const learningProgressRoutes: Router = Router();
const learningProgressController = new LearningProgressController();

learningProgressRoutes.get(
  "/user-progress",
  protect,
  celebrate({ query: getUserProgressSchema }),
  asyncHandler(async (request: Request, response: Response) => {
    const { subjectId } = request.query;
    const userId = response.locals.user.getId();
    const data = await learningProgressController.getUserProgress({ userId, subjectId: subjectId as string });
    response.status(200).json(data).end();
  })
);

export { learningProgressRoutes };