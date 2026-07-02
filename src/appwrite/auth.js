import conf from "../conf/conf";
import { Client, Account, ID} from "appwrite";

export class AuthService {
  client = new Client();
  account;
  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId)
      // .setKey(conf.appwriteApiKey)
      .setDevKey(conf.appwriteDevKey);
    this.account = new Account(this.client);
  }
  //Create Account
  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name,
      );
      if (userAccount) {
        console.log("Account Created Successfully");
        return this.login({ email, password });
      } else {
        return userAccount;
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  async login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.log("Error while Login", error);
    }
  }
  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {}
  }
  async logout() {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      console.error("Logout Error", error);
    }
  }
}

const authService = new AuthService();

export default authService;
