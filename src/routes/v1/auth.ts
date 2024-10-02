import { celebrate } from "celebrate";
import { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import AuthController from "../../controllers/auth";
import { apiKeyAuthMiddleware, protect } from "../../middlewares/authenticate";

import {
  changePasswordSchema,
  loginSchema,
  registerAccountSchema,
  validateTokenSchema,
} from "../../utils/validation-schema";

const authRoutes: Router = Router();
const authController = new AuthController();



authRoutes.post(
  "/login",
  apiKeyAuthMiddleware,
  celebrate({ body: loginSchema }),
  asyncHandler(async (request: Request, response: Response) => {
    const loginData = request.body;
    const data = await authController.loginUser(loginData);

    response.status(200).json(data).end();
  })
);

authRoutes.post(
  "/register",
  apiKeyAuthMiddleware,
  celebrate({ body: registerAccountSchema }),
  asyncHandler(async (request: Request, response: Response) => {
    const userData = request.body;
    const data = await authController.registerUser(userData);

    response.status(201).json(data).end();
  })
);


authRoutes.post(
  "/change-password",
  apiKeyAuthMiddleware,
  protect,
  celebrate({ body: changePasswordSchema }),
  asyncHandler(async (request: Request, response: Response) => {
    const userId = response.locals.user.getId();
    const changePasswordData = request.body;
    const data = await authController.changePassword(userId, changePasswordData);

    response.status(200).json(data).end();
  })
);

authRoutes.get(
  "/validate-token",
  apiKeyAuthMiddleware,
  asyncHandler(async (request: Request, response: Response) => {
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      response.status(401).json({ message: "No token provided" }).end();
      return;
    }
    const data = await authController.validateToken(token);

    response.status(200).json(data).end();
  })
);

authRoutes.post(
  "/validate-token",
  apiKeyAuthMiddleware,
  celebrate({ body: validateTokenSchema }),
  asyncHandler(async (request: Request, response: Response) => {
    const { token } = request.body;
    const data = await authController.validateToken(token);
    response.status(200).json(data).end();
  })
);

export { authRoutes };
