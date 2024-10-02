import { celebrate } from "celebrate";
import { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import SubjectController from "../../controllers/subject";
import { protect, isAdmin, isAdminOrTeacher } from "../../middlewares/authenticate";
import {
  createSubjectSchema,
  updateSubjectSchema,
  getSubjectsSchema,
  getRankedLearnersSchema,
} from "../../utils/validation-schema";

const subjectRoutes: Router = Router();
const subjectController = new SubjectController();

subjectRoutes.post(
  "/",
  protect,
  isAdmin,
  celebrate({ body: createSubjectSchema }),
  asyncHandler(async (request: Request, response: Response) => {
    const subjectData = request.body;
    const data = await subjectController.createSubject(subjectData);
    response.status(201).json(data).end();
  })
);

subjectRoutes.get(
  "/",
  protect,
  celebrate({ query: getSubjectsSchema }),
  asyncHandler(async (request: Request, response: Response) => {
    const { page, limit } = request.query;
    const data = await subjectController.getAllSubjects(Number(page), Number(limit));
    response.status(200).json(data).end();
  })
);

subjectRoutes.get(
  "/:slug",
  protect,
  asyncHandler(async (request: Request, response: Response) => {
    const { slug } = request.params;
    const data = await subjectController.getSubjectBySlug(slug);
    response.status(200).json(data).end();
  })
);

subjectRoutes.put(
  "/:slug",
  protect,
  isAdmin,
  celebrate({ body: updateSubjectSchema }),
  asyncHandler(async (request: Request, response: Response) => {
    const { slug } = request.params;
    const subjectData = request.body;
    const data = await subjectController.updateSubject(slug, subjectData);
    response.status(200).json(data).end();
  })
);

subjectRoutes.delete(
  "/:slug",
  protect,
  isAdmin,
  asyncHandler(async (request: Request, response: Response) => {
    const { slug } = request.params;
    const data = await subjectController.deleteSubject(slug);
    response.status(200).json(data).end();
  })
);

subjectRoutes.get(
  "/:slug/topics",
  protect,
  celebrate({ query: getSubjectsSchema }),
  asyncHandler(async (request: Request, response: Response) => {
    const { slug } = request.params;
    const { page, limit } = request.query;
    const data = await subjectController.getSubjectTopics(slug, Number(page), Number(limit));
    response.status(200).json(data).end();
  })
);

subjectRoutes.get(
  "/:slug/ranked-learners",
  protect,
  isAdminOrTeacher,
  celebrate({ query: getRankedLearnersSchema }),
  asyncHandler(async (request: Request, response: Response) => {
    const { slug } = request.params;
    const { page, limit } = request.query;
    const data = await subjectController.getRankedLearners(slug, Number(page), Number(limit));
    response.status(200).json(data).end();
  })
);

export { subjectRoutes };