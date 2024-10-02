import { Joi } from "celebrate";

export const registerAccountSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().trim().email().lowercase().required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/)
    .message(
      '"password" must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
});

export const loginSchema = Joi.object().keys({
  email: Joi.string().trim().email().lowercase().required(),
  password: Joi.string().required(),
});

export const refreshTokenSchema = Joi.object().keys({
  refreshToken: Joi.string().required(),
});

export const createSubjectSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().trim().optional(),
});

export const updateSubjectSchema = Joi.object({
  title: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
}).min(1);

export const getSubjectsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

export const getSubjectBySlugSchema = Joi.object({
  slug: Joi.string().trim().required(),
});

export const getSubjectTopicsSchema = Joi.object({
  slug: Joi.string().trim().required(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

export const getRankedLearnersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

export const createTopicSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().trim().optional(),
  videoUrl: Joi.string().uri().optional(),
  subjectId: Joi.string().uuid().required(),
  order: Joi.number().integer().min(1).required(),
});

export const updateTopicSchema = Joi.object({
  title: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  videoUrl: Joi.string().uri().optional(),
  order: Joi.number().integer().min(1).optional(),
}).min(1);

export const getTopicsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

export const getTopicBySlugSchema = Joi.object({
  slug: Joi.string().trim().required(),
});

export const getTopicLeaderboardSchema = Joi.object({
  slug: Joi.string().trim().required(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});


export const markTopicCompletedSchema = Joi.object({
  topicId: Joi.string().uuid().required(),
});

export const getUserProgressSchema = Joi.object({
  subjectId: Joi.string().uuid().required(),
});

export const getSubjectLeaderboardSchema = Joi.object({
  subjectId: Joi.string().uuid().required(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

export const getRecentActivitySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(10),
});


export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string()
  .min(8)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/)
  .message(
    '"password" must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  ),
});

export const validateTokenSchema = Joi.object({
  token: Joi.string().required(),
});