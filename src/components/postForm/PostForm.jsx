import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Upload,
  Icon,
  Bold,
  Italic,
  Quote,
  List,
  Link2,
  Code2,
} from "lucide-react";
import { GlowButton, RTE } from "../index";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";

function PostForm({ post }) {
  const [category, setCategory] = useState("Technology");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);
  const navigate = useNavigate();

  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.slug || "",
        category: post?.category || "",
        content: post?.content || "",
        status: post?.status || "draft",
      },
    });

  const CATEGORIES = [
    "All",
    "Technology",
    "Design",
    "Engineering",
    "Blockchain",
    "Science",
    "Culture",
  ];

  const imageField = register("image", {
    required: true,
  });

  const handleImageSelect = (files) => {
    if (!files || files.length === 0) return;
    setValue("image", files, { shouldValidate: true, shouldDirty: true });
  };

  const userData = useSelector((state) => state.auth.userData);
  const submitWithStatus = (status) =>
    handleSubmit((data) => submit({ ...data, status }))();

  const submit = async (data) => {
    if (post) {
      //Handle Edit thing here
    } else {
      const file = await appwriteService.uploadFile(data.image[0]);
      if (file) {
        const fileId = file.$id;
        data.featuredImage = fileId;
        data.userId = userData.$id;
        console.log(data);
        const dbPost = await appwriteService.createPost({
          ...data,
        });
        if (dbPost) {
          navigate(`/viewpost/${dbPost.$id}`);
        }
      }
    }
  };

  const selectedImage = watch("image");
  const selectedImageName = selectedImage?.[0]?.name;
  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }
    return "";
  }, []);
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title, { shouldValidate: true }));
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [watch, slugTransform, setValue]);

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-7">
          <h1
            className="text-2xl font-bold text-slate-100"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Write a New Post
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Share your ideas with the Lumina community
          </p>
        </div>
        <form onSubmit={handleSubmit(submit)} encType="multipart/form-data">
          <div className="space-y-4">
            {/* Title */}
            <div
              className="rounded-2xl p-6 border"
              style={{
                background: "rgba(255,255,255,0.025)",
                borderColor: "rgba(255,255,255,0.07)",
              }}
            >
              <input
                type="text"
                placeholder="Your article title..."
                className="w-full bg-transparent text-2xl font-bold text-slate-100 placeholder-slate-700 focus:outline-none"
                style={{ fontFamily: "var(--font-display)" }}
                {...register("title", { required: true })}
              />
            </div>
            {/* About the Blog */}
            <div
              className="rounded-2xl p-6 border"
              style={{
                background: "rgba(255,255,255,0.025)",
                borderColor: "rgba(255,255,255,0.07)",
              }}
            >
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
                Excerpt / Summary
              </label>
              <input
                type="text"
                placeholder="Short description shown in post cards..."
                className="w-full bg-transparent  font-bold text-slate-100 placeholder-slate-700 focus:outline-none"
                style={{ fontFamily: "var(--font-display)" }}
                {...register("blogAbout", { required: true })}
              />
            </div>

            {/* Category + thumbnail */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Category picker */}
              <div
                className="rounded-2xl p-5 border"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
              >
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-3">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                    <button
                      key={cat}
                      {...register("category")}
                      onClick={(e) => {
                        e.preventDefault();
                        setCategory(cat);
                        setValue("category", cat, { shouldValidate: true });
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
                        category === cat
                          ? "text-blue-400"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                      style={
                        category === cat
                          ? {
                              background: "rgba(59,130,246,0.15)",
                              borderColor: "rgba(59,130,246,0.35)",
                            }
                          : {
                              background: "rgba(255,255,255,0.03)",
                              borderColor: "rgba(255,255,255,0.08)",
                            }
                      }
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image upload */}
              <div
                className="rounded-2xl p-5 border"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
              >
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-3">
                  Cover Image
                </label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    handleImageSelect(e.dataTransfer.files);
                  }}
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed rounded-xl py-7 flex flex-col items-center gap-2 cursor-pointer transition-all duration-200"
                  style={
                    dragOver
                      ? {
                          borderColor: "rgba(59,130,246,0.6)",
                          background: "rgba(59,130,246,0.07)",
                        }
                      : {
                          borderColor: "rgba(255,255,255,0.10)",
                          background: "transparent",
                        }
                  }
                  onMouseEnter={(e) => {
                    if (!dragOver)
                      e.currentTarget.style.borderColor =
                        "rgba(59,130,246,0.35)";
                  }}
                  onMouseLeave={(e) => {
                    if (!dragOver)
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.10)";
                  }}
                >
                  <Upload
                    className={`w-5 h-5 transition-colors ${dragOver ? "text-blue-400" : "text-slate-600"}`}
                  />
                  {selectedImageName ? (
                    <p className="mt-1 max-w-full truncate text-xs font-medium text-slate-300">
                      Selected: {selectedImageName}
                    </p>
                  ) : (
                    <>
                      <p className="text-xs text-slate-500">
                        Drop image or{" "}
                        <span className="text-blue-400 font-medium">
                          browse files
                        </span>
                      </p>
                      <p className="text-[11px] text-slate-700">
                        PNG, JPG up to 5 MB
                      </p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/png, image/jpeg, image/jpg image/gif"
                  {...imageField}
                  ref={(element) => {
                    imageField.ref(element);
                    fileRef.current = element;
                  }}
                />
              </div>
            </div>

            {/* Editor */}
            <div
              className="rounded-2xl border overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.025)",
                borderColor: "rgba(255,255,255,0.07)",
              }}
            >
              {/* Toolbar */}
              <div
                className="flex items-center gap-1 px-4 py-3 border-b flex-wrap"
                style={{ borderColor: "rgba(255,255,255,0.06)" }}
              >
                <span
                  className="text-[11px] ml-auto px-2 py-0.5 rounded-md font-mono"
                  style={{
                    color: "#475569",
                    background: "rgba(255,255,255,0.04)",
                  }}
                >
                  4{/* {content.length} chars */}
                </span>
              </div>
              <RTE
                name="content"
                control={control}
                defaultValue={getValues("content")}
              />
            </div>
            {/* Action bar */}
            <div className="flex items-center justify-between pt-1 pb-4">
              <GlowButton
                type="button"
                variant="ghost"
                className="cursor-pointer"
                onClick={() => submitWithStatus("draft")}
              >
                Save Draft
              </GlowButton>
              <div className="flex items-center gap-3">
                <GlowButton
                  type="button"
                  variant="ghost"
                  className="cursor-pointer "
                  onClick={() => submitWithStatus("draft")}
                >
                  Preview
                </GlowButton>
                <GlowButton
                  type="button"
                  className="px-6 cursor-pointer"
                  onClick={() => submitWithStatus("active")}
                >
                  Publish Post
                </GlowButton>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostForm;
