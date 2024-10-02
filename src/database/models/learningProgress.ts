import {
  Model,
  ModelStatic,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

export interface LearningProgressAttributes {
  id: string;
  userId: string;
  topicId: string;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class LearningProgress
  extends Model<
    InferAttributes<LearningProgress>,
    InferCreationAttributes<LearningProgress>
  >
  implements LearningProgressAttributes
{
  public id!: string;
  public userId!: string;
  public topicId!: string;
  public completed!: boolean;
  public completedAt?: Date;
  public createdAt!: Date;
  public updatedAt!: Date;

  public static associate(models: {
    User: ModelStatic<Model<any, any>>;
    Topic: ModelStatic<Model<any, any>>;
  }): void {
    LearningProgress.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
    LearningProgress.belongsTo(models.Topic, {
      foreignKey: "topicId",
      as: "topic",
    });
  }
}

export default (sequelize: any, DataTypes: any) => {
  LearningProgress.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      topicId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'completed_at',
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "LearningProgress",
      tableName: "learning_progress",
      underscored: true,
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["user_id", "topic_id"],
        },
      ],
    }
  );

  return LearningProgress;
};
