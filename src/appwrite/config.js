import conf from "../conf/conf";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
  client = new Client();
  databases;
  bucket;
  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId)
      .setDevKey(conf.appwriteDevKey);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost({
    title,
    slug,
    content,
    category,
    featuredImage,
    status,
    userId,
    blogAbout,
    userName,
  }) {
    try {
      console.log(
        title,
        slug,
        content,
        category,
        featuredImage,
        status,
        userId,
        blogAbout,
        userName,
      );
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        ID.unique(),
        {
          title,
          content,
          featuredImage,
          status,
          userId,
          category,
          slug,
          blogAbout,
          userName,
        },
      );
    } catch (error) {
      console.error("Error while Creating Post");
    }
  }

  async updatePost(documentId,{ title, slug, category, content, featuredImage, status , blogAbout }) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        documentId,
        {
          title,
          slug,
          content,
          category,
          featuredImage,
          status,
          blogAbout,
        },
      );
    } catch (error) {
      console.log("Error While Updating the Post");
    }
  }

  async deletePost(documentID) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        documentID,
      );
    } catch (error) {
      console.error("Error While Deleting the Document");
    }
  }

  async getPost(documentID) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        documentID,
      );
    } catch (error) {}
  }

  async getAllPost() {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        [Query.equal("status", "active")],
      );
    } catch (error) {}
  }

  async getMyPosts(userId){
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        [Query.equal("userId",userId)]
      )
    } catch (error) {
      
    }
  }
  //File Upload Services

  async uploadFile(file) {
    try {
      return await this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file,
      );
    } catch (error) {
      console.error("Error while Uploding the File");
    }
  }

  async deleteFile(fileID) {
    try {
      await this.bucket.deleteFile(conf.appwriteBucketId, fileID);
      return true;
    } catch (error) {}
  }

  getFileView(fileID) {
    try {
      return this.bucket.getFileView(conf.appwriteBucketId, fileID);
    } catch (error) {
      // console.log("Error while Viewing the File", error);
    }
  }

  async updateLikes(documentID, likes, userId, likedBy, decrement=true) {
    if (decrement) {
      likedBy = likedBy.filter((id) => id !== userId);
    } else {
      likedBy.push(userId);
    }
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        documentID,
        { likes, likedBy },
      );
    } catch (error) {
      console.error("Error while updating the likes");
    }
  }
}

const appwriteService = new Service();

export default appwriteService;
