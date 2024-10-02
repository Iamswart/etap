import { Model, ModelStatic, InferAttributes, InferCreationAttributes } from "sequelize";

export interface SubjectAttributes {
  id: string;
  title: string;
  description?: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Subject extends Model<
  InferAttributes<Subject>,
  InferCreationAttributes<Subject>
> implements SubjectAttributes {
  public id!: string;
  public title!: string;
  public description?: string;
  public slug!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  public static associate(models: {
    Topic: ModelStatic<Model<any, any>>;
  }): void {
    Subject.hasMany(models.Topic, {
      foreignKey: "subjectId",
      as: "topics",
    });
  }
}

export default (sequelize: any, DataTypes: any) => {
  Subject.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
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
      modelName: "Subject",
      tableName: "subjects",
      underscored: true,
      timestamps: true,
    }
  );

  return Subject;
};