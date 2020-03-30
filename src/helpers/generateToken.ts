import jwt from "jsonwebtoken";
import { server } from "../config";

export default ({
  _id: id,
  email,
  firstName,
  lastName,
  createdAt,
  profile
}: any) => {
  const payload = {
    id,
    email,
    firstName,
    lastName,
    createdAt,
    profile: profile ? profile : null
  };
  const token = jwt.sign(payload, server.secret, {
    expiresIn: "1h",
    issuer: server.issuer
  });
  return `Bearer ${token}`;
};
