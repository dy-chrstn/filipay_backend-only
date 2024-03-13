import { UserModel } from "../model/users";

// User Actions
export const createUser = (
  data : object
) => new UserModel(data).save();

export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserById = (id: object) => UserModel.findOne({ _id: id });
export const updateUser = async (id: object, data: any) => {
  return await UserModel.findOneAndUpdate({ _id: id }, data, { new: true });
}
