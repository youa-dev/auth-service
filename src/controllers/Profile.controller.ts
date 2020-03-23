import { IProfile } from "./../interfaces";
import { Request, Response } from "express";
import { IRequest } from "../interfaces";
import { server } from "../config";
import Profile from "../db/models/Profile.model";
import CustomException from "../helpers/CustomException";

const randomHandleNumber = () =>
  `${Math.floor(Math.random() * 10)}${Math.floor(
    Math.random() * 10
  )}${Math.floor(Math.random() * 10)}`;

const generateHandle = name => `${name}-${randomHandleNumber()}`;

class ProfileController {
  public async createProfile(req: IRequest, res: Response) {
    // TODO: Input validation
    try {
      const profile = await Profile.findOne({ userID: req.user.id });
      if (profile)
        throw new CustomException(403, "You already have a profile.");
      const handle = generateHandle(
        `${req.user.firstName
          .toLowerCase()
          .replace(" ", "")}-${req.user.lastName
          .toLowerCase()
          .replace(" ", "")}`
      );
      const newProfile = await Profile.create({
        userID: req.user.id,
        handle,
        profilePicture: req.body.profilePicture,
        website: req.body.website,
        github: req.body.github,
        linkedin: req.body.linkedin,
        dev: req.body.dev,
        stackoverflow: req.body.stackoverflow,
        biography: req.body.biography
      });
      return res.status(200).json(newProfile);
    } catch (err) {
      return res.status(err.status || 500).json(err.message || err);
    }
  }
  public async getProfile(req: Request, res: Response) {
    const profile = await Profile.findOne({
      handle: req.params.handle
    });
    if (!profile)
      return res
        .status(404)
        .json({ error: "A profile with this handle has not been found." });
    return res.status(200).json(profile);
  }
  public async editProfile(req: IRequest, res: Response) {
    // TODO: Input validation
    try {
      const profile: IProfile = await Profile.findOne({
        userID: req.user.id
      });
      if (!profile)
        throw new CustomException(404, "You do not have a profile.");
      const handle = generateHandle(
        `${req.user.firstName
          .toLowerCase()
          .replace(" ", "")}-${req.user.lastName
          .toLowerCase()
          .replace(" ", "")}`
      );
      profile.handle = handle;
      profile.profilePicture = req.body.profilePicture;
      profile.website = req.body.website;
      profile.github = req.body.github;
      profile.linkedin = req.body.linkedin;
      profile.dev = req.body.dev;
      profile.stackoverflow = req.body.stackoverflow;
      profile.biography = req.body.biography;
      profile.save().then(updated => res.status(200).json(updated));
    } catch (error) {
      return res
        .status(error.status || 500)
        .json(error.message || "An error has occured.");
    }
  }
  public async followProfile(req: IRequest, res: Response) {
    try {
      const profile: IProfile = await Profile.findOne({
        handle: req.params.handle
      });
      if (!profile) throw new CustomException(404, "Profile not found.");
      // Allow while in test environment -> Check if the user is trying to follow it's own account.
      if (server.env !== "test") {
        if (profile.userID === req.user.id)
          throw new CustomException(400, "You cannot follow your own profile.");
      }
      // Iterate over followers, then handle the request
      const { followers } = profile;
      profile.followers = followers.includes(req.user.id)
        ? followers.filter(v => v !== req.user.id)
        : [...followers, req.user.id];
      profile.save().then(updated => res.status(200).json(updated));
    } catch (error) {
      return res
        .status(error.status || 500)
        .json(error.message || "An error has occured.");
    }
  }
  public deleteProfile(req: IRequest, res: Response) {
    Profile.findOne({
      userID: req.user.id
    }).then(profile => {
      profile.remove();
      return res.status(200).json({ deleted: true, timestamp: Date.now() });
    });
  }
}

export default new ProfileController();
