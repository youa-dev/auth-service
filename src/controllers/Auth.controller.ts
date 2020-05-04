import { Request, Response } from "express";
import { IUser, IRequest, IProfile } from "../interfaces";
import { compareSync } from "bcrypt";
import User from "../db/models/User.model";
import CustomException from "../helpers/CustomException";
import hashPassword from "../helpers/hashPassword";
import generateToken from "../helpers/generateToken";
import registerUser from "../helpers/registerUser";
import Profile from "../db/models/Profile.model";
import generateHandle from "../helpers/generateHandle";

class AuthController {
  public async register(req: Request, res: Response) {
    try {
      const { firstName, lastName, email, password } = req.body;
      const user: IUser = await User.findOne({ email });
      if (user) throw new CustomException(403, "This email is already in use.");
      // Create user
      registerUser(
        email,
        { givenName: firstName, familyName: lastName },
        password,
        false,
        (err, user) => {
          if (err) throw new CustomException(500, err);
          return res.status(200).json(user);
        }
      );
    } catch (err) {
      /**
       * Concept:
       * If we throw a custom exception, use the provided info from it.
       * Otherwise just resolve into a 500 HTTP code,
       * and return whatever error gets passed into the block.
       */
      return res.status(err.status || 500).json(err.message || err);
    }
  }
  public async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user: IUser = await User.findOne({ email }).populate("profile");
      if (!user)
        throw new CustomException(
          404,
          "The provided email address is not in use."
        );
      // Check if the provided password is valid
      const match = compareSync(password, user.password);
      if (!match)
        throw new CustomException(422, "The provided password is not valid.");
      // Generate token
      const token = await generateToken(user.id);
      // Return the generated token
      return res.status(200).json({ loggedIn: true, token });
    } catch (err) {
      return res.status(err.status || 500).json(err.message || err);
    }
  }
  public async getCurrentUser(req: IRequest, res: Response) {
    const { id, email, firstName, lastName, createdAt, profile } = req.user;
    return res
      .status(200)
      .json({ id, email, firstName, lastName, createdAt, profile });
  }
  public async edit(req: IRequest, res: Response) {
    try {
      const user: IUser = await User.findById(req.user.id);
      if (!user) throw new CustomException(404, "User not found.");
      const { firstName, lastName, email, password } = req.body;
      // Edit user
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.password = hashPassword(password);
      // Check if the user has a profile
      if (req.user.profile) {
        // If a profile exists, generate a new handle
        const profile: IProfile = await Profile.findById(req.user.id);
        profile.handle = generateHandle(req.user.firstName, req.user.lastName);
        await profile.save();
      }
      // Save and return
      user.save().then((updated) => res.status(200).json(updated));
    } catch (err) {
      return res.status(err.status || 500).json(err.message || err);
    }
  }
  public async delete(req: IRequest, res: Response) {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found." });
    await user.remove();
    return res.status(200).json({ deleted: true, timestamp: Date.now() });
  }
  public async generateJWTfromOAuth(req: IRequest, res: Response) {
    const token = await generateToken(req.user.id);
    return res.status(200).json({
      loggedIn: true,
      token,
    });
  }
}

export default new AuthController();
