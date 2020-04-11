import { Application } from "express";
import helmet from "helmet";
import { json, urlencoded } from "body-parser";
import logger from "./logger";
import router from "./router";
import authStrategy from "../auth";
import cors from "cors";

export default (app: Application): void => {
  app.use(cors());
  app.use(helmet());
  app.use(json());
  app.use(urlencoded({ extended: true }));
  logger(app);
  authStrategy(app);
  router(app);
};
