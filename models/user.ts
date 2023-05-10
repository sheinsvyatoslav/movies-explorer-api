import bcrypt from "bcryptjs";
import mongoose, { Model } from "mongoose";
import validator from "validator";

export type User = {
  email: string;
  password: string;
  name: string;
  _id: string;
};

type UserModelType = {
  findUserByCredentials: (email: string, password: string) => Promise<User>;
} & Model<User>;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email: string) => validator.isEmail(email),
      message: "Поле email должно быть валидным адресом",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user: User) => {
      if (!user) {
        return Promise.reject(new Error("Неправильные почта или пароль"));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Неправильные почта или пароль"));
        }

        return user;
      });
    });
};

export const UserModel = mongoose.model<unknown, UserModelType>("user", userSchema);
