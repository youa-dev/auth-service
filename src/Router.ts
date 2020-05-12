import express from "express";
import passport from "passport";
import AuthController from "./controllers/Auth.controller";
import ProfileController from "./controllers/Profile.controller";
import validateInput from "./middleware/validateInput";
import normalizeInput from "./middleware/normalizeInput";

class Router {
  public AUTH_ROUTER = express.Router();
  public PROFILE_ROUTER = express.Router();
  constructor() {
    this.setAuthEndpoints();
    this.setProfileEndpoints();
  }
  private setAuthEndpoints(): void {
    // Your API endpoints go here
    this.AUTH_ROUTER.post(
      "/register",
      normalizeInput,
      validateInput,
      AuthController.register
    );
    this.AUTH_ROUTER.post("/login", validateInput, AuthController.login);
    this.AUTH_ROUTER.get(
      "/me",
      passport.authenticate("jwt", { session: false }),
      AuthController.getCurrentUser
    );
    this.AUTH_ROUTER.put(
      "/edit",
      passport.authenticate("jwt", { session: false }),
      normalizeInput,
      validateInput,
      AuthController.edit
    );
    this.AUTH_ROUTER.delete(
      "/delete",
      passport.authenticate("jwt", { session: false }),
      AuthController.delete
    );
    // OAuth routes
    this.AUTH_ROUTER.get(
      "/oauth",
      passport.authenticate("google", {
        session: false,
        scope: [
          "https://www.googleapis.com/userinfo.profile",
          "https://www.googleapis.com/userinfo.email",
        ],
      })
    );
    this.AUTH_ROUTER.get(
      "/oauth/redirect",
      passport.authenticate("google", {
        session: false,
        failureRedirect: "/login",
      }),
      AuthController.generateJWTfromOAuth
    );
  }
  private setProfileEndpoints(): void {
    this.PROFILE_ROUTER.post(
      "/create",
      passport.authenticate("jwt", { session: false }),
      validateInput,
      ProfileController.createProfile
    );
    this.PROFILE_ROUTER.get("/get/:handle", ProfileController.getProfile);
    this.PROFILE_ROUTER.put(
      "/edit",
      passport.authenticate("jwt", { session: false }),
      validateInput,
      ProfileController.editProfile
    );
    this.PROFILE_ROUTER.patch(
      "/follow/:profileID",
      passport.authenticate("jwt", { session: false }),
      ProfileController.followProfile
    );
    this.PROFILE_ROUTER.delete(
      "/delete",
      passport.authenticate("jwt", { session: false }),
      ProfileController.deleteProfile
    );
  }
}

const { AUTH_ROUTER, PROFILE_ROUTER } = new Router();

export { AUTH_ROUTER, PROFILE_ROUTER };
