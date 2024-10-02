import {
  Model,
  ModelStatic,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import { Role as RoleEnum } from "../../interfaces/constant";

export interface RoleAttributes {
  id: string;
  name: RoleEnum;
  createdAt: Date;
  updatedAt: Date;
}

export class Role
  extends Model<InferAttributes<Role>, InferCreationAttributes<Role>>
  implements RoleAttributes
{
  public id!: string;
  public name!: RoleEnum;
  public createdAt!: Date;
  public updatedAt!: Date;

  public static associate(models: {
    User: ModelStatic<Model<any, any>>;
  }): void {
    Role.hasMany(models.User, {
      foreignKey: "roleId",
      as: "users",
    });
  }
}

export default (sequelize: any, DataTypes: any) => {
  Role.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isIn: [Object.values(RoleEnum)]
        }
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Role",
      tableName: "roles",
      underscored: true,
      timestamps: true,
    }
  );

  return Role;
};