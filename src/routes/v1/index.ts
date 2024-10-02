import { Router } from "express";
import { authRoutes } from "./auth";
import { subjectRoutes } from "./subject";
import { topicRoutes } from "./topic";
import { learningProgressRoutes } from "./learningProgress";
import swaggerSpec from "../../swaggerConfig";
import swaggerUi from 'swagger-ui-express';

const v1Routes: Router = Router();

v1Routes.use("/auth", authRoutes);
v1Routes.use("/progress", learningProgressRoutes);
v1Routes.use("/subjects", subjectRoutes);
v1Routes.use("/topics", topicRoutes );


v1Routes.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
export { v1Routes };
