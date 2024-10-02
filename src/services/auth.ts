import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import {
  RegisterInterface,
  LoginInterface,
  ChangePasswordInterface,
} from "../interfaces/auth";
import db from "../database/models/";
import { authenticationError, badRequestError, unknownResourceError } from "../error";

import sqs from "../utils/sqs-consumer";

import logger from "../logger";
import config from "../config";
import emailTemplates from "../emailTemplates/emailTemplates";
import { Role } from "../database/models/role";
import { Role as RoleEnum } from "../interfaces/constant";
import { v4 as uuidv4 } from "uuid";

const { User } = db;

export default class AuthService {
  private async getOrCreateStudentRole(): Promise<Role> {
    const [role] = await Role.findOrCreate({
      where: { name: RoleEnum.STUDENT },
      defaults: {
        id: uuidv4(),
        name: RoleEnum.STUDENT,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return role;
  }

  async register(input: RegisterInterface) {
    const { email, name, password } = input;

    const emailExist = await User.findOne({ where: { email } });
    if (emailExist) {
      throw badRequestError(
        "Email address already exist, please login to continue"
      );
    }
    const studentRole = await this.getOrCreateStudentRole();
    const user = await User.create({
      email,
      name,
      password,
      roleId: studentRole.id,
    });

    // Welcome Message
    const welcomeMsgData = {
      notifyBy: ["email"],
      email: user.email,
      subject: "Welcome",
      data: {
        name: `${user.name}`,
      },
      template: emailTemplates.welcome,
    };

    const welcomeSqsOrderData = {
      MessageAttributes: {
        type: {
          DataType: "String",
          StringValue: "email",
        },
      },
      MessageBody: JSON.stringify(welcomeMsgData),
      QueueUrl: process.env.SQS_QUEUE_URL as string,
    };

    const welcomeSqsMessagePromise = sqs
      .sendMessage(welcomeSqsOrderData)
      .promise();
    welcomeSqsMessagePromise
      .then((data) => {
        logger.info(`Welcome Email sent | SUCCESS: ${data.MessageId}`);
      })
      .catch((error) => {
        logger.error(`Error sending Welcome email: ${error}`);
      });

    const accessToken = jwt.sign(
      { id: user.id, role: RoleEnum.STUDENT },
      config.auth.secretToken,
      {
        expiresIn: config.auth.tokenExpiration,
      }
    );

    const refreshToken = jwt.sign(
      { id: user.id, role: RoleEnum.STUDENT },
      config.auth.secretRefreshToken,
      {
        expiresIn: config.auth.tokenRefreshExpiration,
      }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: RoleEnum.STUDENT,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(input: LoginInterface) {
    const { email, password } = input;

    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, as: 'role' }]
    });

    if (!user) {
      throw badRequestError("Email Or Password Incorrect");
    }

    if (user.status === "inactive") {
      throw badRequestError(
        "Your account has been disabled please contact support for further details"
      );
    }

    const verifyCredentials = await bcrypt.compare(password, user.password);

    if (!verifyCredentials) {
      throw badRequestError("Email Or Password Incorrect");
    }

    const userRole = user.role?.name as RoleEnum;

    if (!userRole) {
      throw badRequestError("User role not found");
    }

    const accessToken = jwt.sign(
      { id: user.id, role: userRole },
      config.auth.secretToken,
      {
        expiresIn: config.auth.tokenExpiration,
      }
    );

    const refreshToken = jwt.sign(
      { id: user.id, role: userRole },
      config.auth.secretRefreshToken,
      {
        expiresIn: config.auth.tokenRefreshExpiration,
      }
    );

    user.lastLoginAt = new Date();
    await user.save();

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: userRole
      },
      accessToken,
      refreshToken,
    };
  }

  async changePassword(userId: string, input: ChangePasswordInterface) {
    const { currentPassword, newPassword } = input;

    const user = await User.findByPk(userId);
    if (!user) {
      throw unknownResourceError("User not found");
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      throw badRequestError("Current password is incorrect");
    }

    await user.update({ password: newPassword });

    return { message: "Password changed successfully" };
  }


  async validateToken(token: string) {
    let decodedToken;
    
    try {
      decodedToken = jwt.verify(token, config.auth.secretToken as string) as any;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw authenticationError("Token has expired");
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw authenticationError("Invalid token");
      } else {
        throw authenticationError("Error verifying token");
      }
    }
    
    const user = await User.findByPk(decodedToken.id, {
      include: [{ model: Role, as: 'role' }]
    });

    if (!user) {
      throw authenticationError("User not found");
    }

    if (user.status === "inactive") {
      throw authenticationError(
        "Your account has been disabled. Please contact support for further details."
      );
    }

    const userRole = user.role?.name as RoleEnum;

    if (!userRole) {
      throw authenticationError("User role not found");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: userRole
    };
  }
}
