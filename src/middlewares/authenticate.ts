import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";

import { authenticationError, authorizationError } from "../error";
import config from "../config";
import { JWTUser } from "../utils/jwt-user";

import db from "../database/models";
import logger from "../logger";

const { User, Role } = db;

export const protect = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    const token = getAuthToken(request);
    const decodedValue = await decodeAndValidateToken(token);
    response.locals.user = new JWTUser(decodedValue);
    logger.info(
      `User ${response.locals.user.getId()} with role ${response.locals.user.getRole()} accessed ${request.url} route`
    );
    next();
  }
);

function getAuthToken(request: Request) {
  let token = request.headers["authorization"];
  if (token?.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }
  if (!token) {
    throw authenticationError("Auth token is required");
  }
  return token;
}

async function decodeAndValidateToken(token: string) {
  try {
    const decodedToken = jwt.verify(token, config.auth.secretToken as string) as any;
    const user = await User.findByPk(decodedToken.id, {
      include: [{ model: Role, as: 'role' }]
    });


    if (!user) {
      throw authenticationError("User not found");
    }

    return {
      id: user.id,
      role: user.role.name
    };
  } catch (error) {
    throw authenticationError("Error occurred while validating token");
  }
}

export const apiKeyAuthMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const receivedApiKey = request.get("x-api-key");

  if (!receivedApiKey || receivedApiKey !== config.auth.apiKey) {
    throw authenticationError("Unauthorized. API key is missing or invalid");
  }
  next();
};

export const isAdmin = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    const user = response.locals.user as JWTUser;
    if (!user.isAdmin()) {
      throw authorizationError("Access denied. Admin role required.");
    }
    next();
  }
);

export const isTeacher = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    const user = response.locals.user as JWTUser;
    if (!user.isTeacher()) {
      throw authorizationError("Access denied. Teacher role required.");
    }
    next();
  }
);

export const isAdminOrTeacher = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    const user = response.locals.user as JWTUser;
    if (!user.isAdmin() && !user.isTeacher()) {
      throw authorizationError("Access denied. Admin or Teacher role required.");
    }
    next();
  }
);