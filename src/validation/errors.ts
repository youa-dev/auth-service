export enum authErrors {
  // First and last names
  FIRST_NAME_EMPTY = "Please provide your first name.",
  LAST_NAME_EMPTY = "Please provide your last name.",
  // Email
  EMAIL_EMPTY = "Please provide your email address.",
  EMAIL_INVALID = "The email address you have provided is not valid.",
  // Password
  PASSWORD_EMPTY = "Please provide a password.",
  CONFIRM_PASSWORD_EMPTY = "Please provide a confirmation password.",
  PASSWORD_NOT_LONG_ENOUGH = "Your password must be at least 8 characters long.",
  PASSWORDS_NOT_MATCHING = "The password and confirmation passwords have to be matching.",
}

export enum profileErrors {
  WEBSITE_INVALID = "The provided personal website URL is not valid.",
  GITHUB_INVALID = "The provided GitHub URL is not valid.",
  LINKEDIN_INVALID = "The provided LinkedIn URL is not valid.",
  STACKOVERFLOW_INVALID = "The provided StackOverflow URL is not valid.",
  DEV_INVALID = "The provided dev.to URL is not valid.",
}
