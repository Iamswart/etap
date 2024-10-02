import { OpenAPIV3 } from "openapi-types";
import config from "./config";

const swaggerDocument: OpenAPIV3.Document = {
  openapi: "3.0.0",
  info: {
    title: "Learning Management System API",
    version: "1.0.0",
    description: "API documentation for the Learning Management System.",
  },
  servers: [
    {
      url: config.localServerUrl,
      description: "Local server",
    },
    {
      url: config.productionServerUrl,
      description: "Production server",
    },
  ],
  paths: {
    "/auth/login": {
      post: {
        summary: "Login a user",
        security: [{ apiKey: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Login",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/LoginResponse",
                },
              },
            },
          },
          401: {
            description: "Invalid credentials",
          },
        },
      },
    },
    "/auth/register": {
      post: {
        summary: "Register a new user",
        security: [{ apiKey: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Register",
              },
            },
          },
        },
        responses: {
          201: {
            description: "User registered successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RegisterResponse",
                },
              },
            },
          },
          400: {
            description: "Invalid data",
          },
        },
      },
    },
    "/auth/change-password": {
      post: {
        summary: "Change user password",
        security: [{ apiKey: [] }, { bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ChangePassword",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Password changed successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid data",
          },
          401: {
            description: "Unauthorized",
          },
        },
      },
    },
    "/auth/validate-token": {
      get: {
        summary: "Validate token",
        security: [{ apiKey: [] }],
        responses: {
          200: {
            description: "Token is valid",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    valid: {
                      type: "boolean",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Invalid token",
          },
        },
      },
      post: {
        summary: "Validate token",
        security: [{ apiKey: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ValidateToken",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Token is valid",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    valid: {
                      type: "boolean",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Invalid token",
          },
        },
      },
    },
    "/progress/user-progress": {
      get: {
        summary: "Get user progress",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "subjectId",
            in: "query",
            required: true,
            schema: {
              type: "string",
              format: "uuid",
            },
          },
        ],
        responses: {
          200: {
            description: "User progress retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UserProgress",
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
          },
        },
      },
    },
    "/subjects": {
      post: {
        summary: "Create a new subject",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateSubject",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Subject created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Subject",
                },
              },
            },
          },
          400: {
            description: "Invalid data",
          },
          401: {
            description: "Unauthorized",
          },
          403: {
            description: "Forbidden - Admin access required",
          },
        },
      },
      get: {
        summary: "Get all subjects",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            schema: {
              type: "integer",
              minimum: 1,
              default: 1,
            },
          },
          {
            name: "limit",
            in: "query",
            schema: {
              type: "integer",
              minimum: 1,
              maximum: 100,
              default: 10,
            },
          },
        ],
        responses: {
          200: {
            description: "Subjects retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Subject",
                      },
                    },
                    pagination: {
                      $ref: "#/components/schemas/Pagination",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
          },
        },
      },
    },
    "/subjects/{slug}": {
      get: {
        summary: "Get subject by slug",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Subject retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Subject",
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "Subject not found",
          },
        },
      },
      put: {
        summary: "Update subject",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateSubject",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Subject updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Subject",
                },
              },
            },
          },
          400: {
            description: "Invalid data",
          },
          401: {
            description: "Unauthorized",
          },
          403: {
            description: "Forbidden - Admin access required",
          },
          404: {
            description: "Subject not found",
          },
        },
      },
      delete: {
        summary: "Delete subject",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Subject deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
          },
          403: {
            description: "Forbidden - Admin access required",
          },
          404: {
            description: "Subject not found",
          },
        },
      },
    },
    "/subjects/{slug}/topics": {
      get: {
        summary: "Get subject topics",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
          {
            name: "page",
            in: "query",
            schema: {
              type: "integer",
              minimum: 1,
              default: 1,
            },
          },
          {
            name: "limit",
            in: "query",
            schema: {
              type: "integer",
              minimum: 1,
              maximum: 100,
              default: 10,
            },
          },
        ],
        responses: {
          200: {
            description: "Subject topics retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Topic",
                      },
                    },
                    pagination: {
                      $ref: "#/components/schemas/Pagination",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "Subject not found",
          },
        },
      },
    },
    "/subjects/{slug}/ranked-learners": {
      get: {
        summary: "Get ranked learners for a subject",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
          {
            name: "page",
            in: "query",
            schema: {
              type: "integer",
              minimum: 1,
              default: 1,
            },
          },
          {
            name: "limit",
            in: "query",
            schema: {
              type: "integer",
              minimum: 1,
              maximum: 100,
              default: 10,
            },
          },
        ],
        responses: {
          200: {
            description: "Ranked learners retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/RankedLearner",
                      },
                    },
                    pagination: {
                      $ref: "#/components/schemas/Pagination",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
          },
          403: {
            description: "Forbidden - Admin or Teacher access required",
          },
          404: {
            description: "Subject not found",
          },
        },
      },
    },
    "/topics": {
      post: {
        summary: "Create a new topic",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateTopic",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Topic created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Topic",
                },
              },
            },
          },
          400: {
            description: "Invalid data",
          },
          401: {
            description: "Unauthorized",
          },
          403: {
            description: "Forbidden - Admin or Teacher access required",
          },
        },
      },
    },
    "/topics/{slug}": {
      get: {
        summary: "Get topic by slug",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Topic retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Topic",
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "Topic not found",
          },
        },
      },
      put: {
        summary: "Update topic",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateTopic",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Topic updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Topic",
                },
              },
            },
          },
          400: {
            description: "Invalid data",
          },
          401: {
            description: "Unauthorized",
          },
          403: {
            description: "Forbidden - Admin or Teacher access required",
          },
          404: {
            description: "Topic not found",
          },
        },
      },
      delete: {
        summary: "Delete topic",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Topic deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
          },
          403: {
            description: "Forbidden - Admin access required",
          },
          404: {
            description: "Topic not found",
          },
        },
      },
    },
    "/topics/{slug}/complete": {
      post: {
        summary: "Mark topic as completed",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Topic marked as completed successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "Topic not found",
          },
        },
      },
    },
    "/topics/{slug}/completion-status": {
      get: {
        summary: "Get topic completion status",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Topic completion status retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    completed: {
                      type: "boolean",
                    },
                    completedAt: {
                      type: "string",
                      format: "date-time",
                      nullable: true,
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "Topic not found",
          },
        },
      },
    },
    "/topics/{slug}/leaderboard": {
      get: {
        summary: "Get topic leaderboard",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
          {
            name: "page",
            in: "query",
            schema: {
              type: "integer",
              minimum: 1,
              default: 1,
            },
          },
          {
            name: "limit",
            in: "query",
            schema: {
              type: "integer",
              minimum: 1,
              maximum: 100,
              default: 10,
            },
          },
        ],
        responses: {
          200: {
            description: "Topic leaderboard retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/LeaderboardEntry",
                      },
                    },
                    pagination: {
                      $ref: "#/components/schemas/Pagination",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
          },
          403: {
            description: "Forbidden - Admin or Teacher access required",
          },
          404: {
            description: "Topic not found",
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      apiKey: {
        type: "apiKey",
        in: "header",
        name: "X-API-Key",
      },
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Login: {
        type: "object",
        properties: {
          email: {
            type: "string",
            format: "email",
          },
          password: {
            type: "string",
          },
        },
        required: ["email", "password"],
      },
      LoginResponse: {
        type: "object",
        properties: {
          accessToken: {
            type: "string",
          },
          user: {
            $ref: "#/components/schemas/User",
          },
        },
      },
      Register: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          email: {
            type: "string",
            format: "email",
          },
          password: {
            type: "string",
            minLength: 8,
          },
        },
        required: ["name", "email", "password"],
      },
      RegisterResponse: {
        type: "object",
        properties: {
          accessToken: {
            type: "string",
          },
          user: {
            $ref: "#/components/schemas/User",
          },
        },
      },
      ChangePassword: {
        type: "object",
        properties: {
          currentPassword: {
            type: "string",
          },
          newPassword: {
            type: "string",
            minLength: 8,
          },
        },
        required: ["currentPassword", "newPassword"],
      },
      ValidateToken: {
        type: "object",
        properties: {
          token: {
            type: "string",
          },
        },
        required: ["token"],
      },
      User: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
          },
          name: {
            type: "string",
          },
          email: {
            type: "string",
            format: "email",
          },
          role: {
            type: "string",
            enum: ["student", "teacher", "admin"],
          },
        },
      },
      UserProgress: {
        type: "object",
        properties: {
          subjectId: {
            type: "string",
            format: "uuid",
          },
          completedTopics: {
            type: "integer",
          },
          totalTopics: {
            type: "integer",
          },
          progressPercentage: {
            type: "number",
            format: "float",
          },
        },
      },
      CreateSubject: {
        type: "object",
        properties: {
          title: {
            type: "string",
          },
          description: {
            type: "string",
          },
        },
        required: ["title"],
      },
      UpdateSubject: {
        type: "object",
        properties: {
          title: {
            type: "string",
          },
          description: {
            type: "string",
          },
        },
      },
      Subject: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
          },
          title: {
            type: "string",
          },
          description: {
            type: "string",
          },
          slug: {
            type: "string",
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
          },
        },
      },
      CreateTopic: {
        type: "object",
        properties: {
          title: {
            type: "string",
          },
          description: {
            type: "string",
          },
          videoUrl: {
            type: "string",
            format: "uri",
          },
          subjectId: {
            type: "string",
            format: "uuid",
          },
          order: {
            type: "integer",
            minimum: 1,
          },
        },
        required: ["title", "subjectId", "order"],
      },
      UpdateTopic: {
        type: "object",
        properties: {
          title: {
            type: "string",
          },
          description: {
            type: "string",
          },
          videoUrl: {
            type: "string",
            format: "uri",
          },
          order: {
            type: "integer",
            minimum: 1,
          },
        },
      },
      Topic: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
          },
          title: {
            type: "string",
          },
          description: {
            type: "string",
          },
          videoUrl: {
            type: "string",
            format: "uri",
          },
          slug: {
            type: "string",
          },
          order: {
            type: "integer",
          },
          subjectId: {
            type: "string",
            format: "uuid",
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
          },
        },
      },
      RankedLearner: {
        type: "object",
        properties: {
          userId: {
            type: "string",
            format: "uuid",
          },
          name: {
            type: "string",
          },
          completedTopics: {
            type: "integer",
          },
          totalTopics: {
            type: "integer",
          },
          completionRate: {
            type: "number",
            format: "float",
          },
        },
      },
      LeaderboardEntry: {
        type: "object",
        properties: {
          userId: {
            type: "string",
            format: "uuid",
          },
          name: {
            type: "string",
          },
          completedAt: {
            type: "string",
            format: "date-time",
          },
        },
      },
      Pagination: {
        type: "object",
        properties: {
          currentPage: {
            type: "integer",
          },
          totalPages: {
            type: "integer",
          },
          totalItems: {
            type: "integer",
          },
          itemsPerPage: {
            type: "integer",
          },
        },
      },
    },
  },
};

export default swaggerDocument;
