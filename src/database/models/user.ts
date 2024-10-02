import { Model, ModelStatic, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import { Role as RoleEnum } from "../../interfaces/constant";

export interface UserAttributes {
  id: CreationOptional<string>;
  email: string;
  name: string;
  password: string;
  roleId: string | null;
  lastLoginAt?: Date;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
}

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> implements UserAttributes {
  public id!: CreationOptional<string>;
  public email!: string;
  public name!: string;
  public password!: string;
  public roleId!: string | null;
  public lastLoginAt?: Date;
  public createdAt!: CreationOptional<Date>;
  public updatedAt!: CreationOptional<Date>;

  public static associate(models: {
    Role: ModelStatic<Model<any, any>>;
    LearningProgress: ModelStatic<Model<any, any>>;
  }): void {
    User.belongsTo(models.Role, {
      foreignKey: "roleId",
      as: "role",
    });
    User.hasMany(models.LearningProgress, {
      foreignKey: "userId",
      as: "learningProgress",
    });
  }

  public async getRole(): Promise<{ name: RoleEnum } | null> {
    return (this as any).getRole();
  }

  public async setRole(role: RoleEnum | Model<any, any>): Promise<void> {
    if (typeof role === 'string') {
      const roleModel = await (this.sequelize.models.Role as any).findOne({ where: { name: role } });
      if (roleModel) {
        await (this as any).setRole(roleModel);
      } else {
        throw new Error(`Role "${role}" not found`);
      }
    } else {
      await (this as any).setRole(role);
    }
  }

  public async hasRole(roleName: RoleEnum): Promise<boolean> {
    const role = await this.getRole();
    return role !== null && role.name === roleName;
  }
}

export default (sequelize: any, DataTypes: any) => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [8, 100] 
        },
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'roles',
          key: 'id',
        },
        field: 'role_id',
      },
      lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      underscored: true,
      timestamps: true,
      hooks: {
        beforeCreate: async (user: User) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
        beforeUpdate: async (user: User) => {
          if (user.changed('password')) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        }
      }
    }
  );

  return User;
};