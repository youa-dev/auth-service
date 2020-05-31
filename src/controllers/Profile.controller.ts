import { IProfile, IUser } from "./../interfaces";
import { Request, Response } from "express";
import { IRequest } from "../interfaces";
import { server } from "../config";
import Profile from "../db/models/Profile.model";
import CustomException from "../helpers/CustomException";
import generateHandle from "../helpers/generateHandle";
import User from "../db/models/User.model";
import generateToken from "../helpers/generateToken";

class ProfileController {
  public async createProfile(req: IRequest, res: Response) {
    // TODO: Input validation
    try {
      const [user, profile]: [IUser, IProfile] = await Promise.all([
        User.findById(req.user.id),
        Profile.findById(req.user.id),
      ]);
      if (profile)
        throw new CustomException(403, "You already have a profile.");
      const handle = generateHandle(req.user.firstName, req.user.lastName);
      const newProfile = await Profile.create({
        _id: req.user.id,
        handle,
        // TODO => Implement file uploads rather than using URLs
        profilePicture: req.body.profilePicture,
        website: req.body.website,
        github: req.body.github,
        linkedin: req.body.linkedin,
        dev: req.body.dev,
        stackoverflow: req.body.stackoverflow,
        biography: req.body.biography,
        owner: req.user.id,
      });
      user.profile = newProfile.id;
      const updated = await user.save(),
        token = await generateToken(updated.id); // Refreshed user token

      res.status(200).json({
        profile: newProfile,
        token,
      });
    } catch (err) {
      return res.status(err.status || 500).json(err.message || err);
    }
  }
  public async getProfile(req: Request, res: Response) {
    const profile: IProfile = await Profile.findOne({
      handle: req.params.handle,
    });
    if (!profile)
      return res
        .status(404)
        .json({ error: "A profile with this handle has not been found." });
    const { firstName, lastName, id }: IUser = await User.findById(
      profile.owner
    );
    return res.status(200).json({ firstName, lastName, id, profile });
  }
  public async editProfile(req: IRequest, res: Response) {
    // TODO: Input validation
    try {
      const profile: IProfile = await Profile.findById(req.user.id);
      if (!profile)
        throw new CustomException(404, "You do not have a profile.");
      profile.handle = generateHandle(req.user.firstName, req.user.lastName);
      profile.profilePicture = req.body.profilePicture;
      profile.website = req.body.website;
      profile.github = req.body.github;
      profile.linkedin = req.body.linkedin;
      profile.dev = req.body.dev;
      profile.stackoverflow = req.body.stackoverflow;
      profile.biography = req.body.biography;
      const updated = await profile.save(),
        token = await generateToken(updated.id);
      res.status(200).json({ profile: updated, token });
    } catch (error) {
      return res
        .status(error.status || 500)
        .json(error.message || "An error has occured.");
    }
  }
  public async followProfile(req: IRequest, res: Response) {
    try {
      const profile: IProfile = await Profile.findById(req.params.profileID);
      if (!profile) throw new CustomException(404, "Profile not found.");
      // Check if the user is trying to follow it's own account.
      if (profile.id === req.user.id)
        throw new CustomException(400, "You cannot follow your own profile.");
      // Iterate over followers, then handle the request
      // Check if the profile is already being followed by the user
      if (profile.followers.includes(req.user.id)) {
        // If so, remove the user from the array, and remove the profile ID from the req.user profile
        profile.followers = profile.followers.filter((p) => p != req.user.id);
        req.user.profile.following = req.user.profile.following.filter(
          (p) => p != profile.id
        );
      } else {
        // Else, add the IDs to both the user keeping track of all the profiles it's following and the profile followers array
        profile.followers = [...profile.followers, req.user.id];
        req.user.profile.following.push(profile.id);
      }
      const updated = await profile.save();
      await req.user.profile.save();
      const updatedUser = await req.user.save();
      const token = await generateToken(updatedUser.id);
      return res.status(200).json({ profile: updated, token });
    } catch (error) {
      return res
        .status(error.status || 500)
        .json(error.message || "An error has occured.");
    }
  }
  public deleteProfile(req: IRequest, res: Response) {
    Profile.findById(req.user.id).then((profile) => {
      profile.remove();
      return res.status(200).json({ deleted: true, timestamp: Date.now() });
    });
  }
}

export default new ProfileController();
