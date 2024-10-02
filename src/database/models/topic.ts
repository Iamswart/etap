import { Model, ModelStatic, InferAttributes, InferCreationAttributes } from "sequelize";

export interface TopicAttributes {
  id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  subjectId: string;
  order: number;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Topic extends Model<
  InferAttributes<Topic>,
  InferCreationAttributes<Topic>
> implements TopicAttributes {
  public id!: string;
  public title!: string;
  public description?: string;
  public videoUrl?: string;
  public subjectId!: string;
  public order!: number;
  public slug!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  public static associate(models: {
    Subject: ModelStatic<Model<any, any>>;
    LearningProgress: ModelStatic<Model<any, any>>;
  }): void {
    Topic.belongsTo(models.Subject, {
      foreignKey: "subjectId",
      as: "subject",
    });
    Topic.hasMany(models.LearningProgress, {
      foreignKey: "topicId",
      as: "learningProgress",
    });
  }
}

export default (sequelize: any, DataTypes: any) => {
  Topic.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      videoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      subjectId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Topic",
      tableName: "topics",
      underscored: true,
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["subject_id", "order"],
        },
      ],
    }
  );

  return Topic;
};
