import { expect } from "chai";
import apiTester from "../utils/apiTester";
import { testingAccount, editedAccount, testingKeys } from "./testingUtils";

// Token placeholder
let token;

describe("Authentication controller", () => {
  describe("Registration", () => {
    it("should return the user object", async () => {
      const res = await apiTester("post", "/api/auth/register", testingAccount);
      expect(res.data).to.include.all.keys(
        ...testingKeys.auth,
        "password",
        "__v"
      );
    });
  });
  describe("Login", () => {
    it("should return an object with the loggedIn and token props", async () => {
      const res = await apiTester("post", "/api/auth/login", testingAccount);
      expect(res.data).to.include.all.keys("loggedIn", "token");
      token = res.data.token;
    });
  });
  describe("Get current user", () => {
    it("should return all non-sensitive user information", async () => {
      const res = await apiTester("get", "/api/auth/me", null, token);
      expect(res.data).to.include.all.keys(
        ...testingKeys.auth.map(v => v.replace("_id", "id"))
      );
    });
  });
  describe("Edit", () => {
    it("should return the edited user object", async () => {
      const res = await apiTester(
        "put",
        "/api/auth/edit",
        editedAccount,
        token
      );
      expect(res.data).to.include.all.keys(
        ...testingKeys.auth,
        "password",
        "__v"
      );
    });
  });
});
