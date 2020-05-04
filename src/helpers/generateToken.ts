import jwt from "jsonwebtoken";
import User from "../db/models/User.model";
import { IUser } from "../interfaces";
import { server } from "../config";

export default async (id: string) => {
  const user: IUser = await User.findById(id).populate("profile");
  if (!user) return;
  const payload = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    createdAt: user.createdAt,
    profile: user.profile ? user.profile : null,
  };
  const token = jwt.sign(payload, server.secret, {
    expiresIn: "1h",
    issuer: server.issuer,
  });
  return `Bearer ${token}`;
};
