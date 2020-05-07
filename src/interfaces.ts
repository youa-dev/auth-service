import { Request } from "express";
import { Document, ConnectionOptions } from "mongoose";

export interface ILoginValidationError {
  emailEmpty?: String;
  emailNotValid?: String;
  passwordEmpty?: String;
}

export interface IRegistrationValidationError extends ILoginValidationError {
  firstNameEmpty?: String;
  lastNameEmpty?: String;
  confirmPasswordEmpty?: String;
  passwordLength?: String;
  passwordsNotMatching?: String;
}

export interface IProfile extends Document {
  profilePicture?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  dev?: string;
  stackoverflow?: string;
  biography?: string;
  followers?: string[];
  id?: string;
  handle?: string;
  owner?: string;
}

export interface IUser extends Document {
  id?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  createdAt?: string;
  profile?: IProfile;
}

export interface IRequest extends Request {
  user?: IUser;
}

export interface IConnectionArguments {
  uris?: string;
  options?: ConnectionOptions;
}

export interface IProfileCreationValidationErrors {
  websiteInvalid?: string;
  githubInvalid?: string;
  linkedinInvalid?: string;
  devInvalid?: string;
  stackoverflowInvalid?: string;
}

export interface IValidatorGenerator {
  auth?: {
    register: (object) => IRegistrationValidationError | false;
    login: (object) => ILoginValidationError | false;
    edit: (object) => IRegistrationValidationError | false;
  };
  profile?: {
    create: (object) => IProfileCreationValidationErrors | false;
    edit: (object) => IProfileCreationValidationErrors | false;
  };
}
