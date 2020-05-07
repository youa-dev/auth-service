import { Schema } from "mongoose";
import generator from "./model.generator";

const schema = new Schema({
  _id: Schema.Types.ObjectId,
  owner: {
    type: String,
    required: true,
    unique: true,
  },
  handle: {
    type: String,
    required: true,
    unique: true,
  },
  profilePicture: {
    type: String,
    default:
      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
  },
  website: {
    type: String,
    default: "",
  },
  github: {
    type: String,
    default: "",
  },
  linkedin: {
    type: String,
    default: "",
  },
  dev: {
    type: String,
    default: "",
  },
  stackoverflow: {
    type: String,
    default: "",
  },
  biography: {
    type: String,
    default: "",
  },
  followers: [
    {
      type: Schema.Types.ObjectId,
    },
  ],
});

export default generator("profile", schema);
