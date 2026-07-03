import React, { useEffect, useState } from "react";
import EditPostPage from "../components/postForm/EditForm";
import { useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
const EditPost = () => {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) {
      console.log("Slug is not defined");
      navigate("/myposts");
    } else {
      appwriteService.getPost(slug).then((post) => {
        if (!post) {
          navigate("/myposts");
        } else {
          setPost(post);
        }
      });
    }
  }, []);  
  if (!post) {
    return <div>Loading...</div>;
  }
  return <EditPostPage post={post} />;
};

export default EditPost;
