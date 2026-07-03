import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Bold,
  Italic,
  Quote,
  List,
  Link2,
  Code2,
  ChevronLeft,
  Upload,
  CheckCircle2,
  FileEdit,
} from "lucide-react"; // Assuming lucide-react based on icon names
import { GlowButton, RTE } from "../index";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import appwriteService from "../../appwrite/config";
import notify from "../../utils/notify";
import { ToastContainer } from "react-toastify";
const CATEGORIES = [
  "All",
  "Technology",
  "Design",
  "Engineering",
  "Blockchain",
  "Science",
  "Culture",
];
function StatusTag({ status }) {
  return status === "active" ? (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border"
      style={{
        background: "rgba(16,185,129,0.12)",
        borderColor: "rgba(16,185,129,0.25)",
        color: "#34D399",
      }}
    >
      <CheckCircle2 className="w-3 h-3" />
      Published
    </span>
  ) : (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border"
      style={{
        background: "rgba(245,158,11,0.12)",
        borderColor: "rgba(245,158,11,0.25)",
        color: "#FBBF24",
      }}
    >
      <FileEdit className="w-3 h-3" />
      Draft
    </span>
  );
}

function EditPostPage({ post }) {
  //   const source = post;
  const [category, setCategory] = useState(post.category);
  const [status, setStatus] = useState(post.status);
  const [dragOver, setDragOver] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef(null);
  const navigate = useNavigate();

  const submitWithStatus = (status) =>
    handleSubmit((data) => submit({ ...data, status, category }))();
  //Handling Form Submission //
  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.slug || "",
        category: post?.category || "",
        featuredImage: post?.featuredImage || "",
        content: post?.content || "",
        blogAbout: post?.blogAbout || "",
        status: post?.status || "active",
      },
    });

  const imageField = register("image", {
    required: false,
  });
  const handleImageSelect = (files) => {
    if (!files || files.length === 0) return;
    setValue("image", files, { shouldValidate: true, shouldDirty: true });
  };
  const submit = async (data) => {
    try {
      const file = data.image[0]
        ? await appwriteService.uploadFile(data.image[0])
        : null;
      console.log("Uploaded file:", file);
      if (file) {
        try {
          appwriteService.deleteFile(post.featuredImage);
        } catch (error) {
          console.error("Error while deleting the old file:", error);
        }
      }
      data.featuredImage = file ? file.$id : undefined;
      const updatedPost = await appwriteService.updatePost(post.$id, data);
      if (updatedPost) {
        setSaved(true);
        notify("Post updated successfully!");
        notify("Redirecting...");
        setTimeout(() => {
          navigate(`/viewpost/${post.$id}`);
        }, 1500);
      } else {
        notify("Error while updating the post");
      }
    } catch (error) {
      console.error("Error while submitting the form:", error);
    }
  };

  function getImage(featuredImageId) {
    if (!featuredImageId) return null;
    const imageUrl = appwriteService.getFileView(featuredImageId);
    return imageUrl;
  }

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
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link to={"/myposts"}>
            <button className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
              My Posts
            </button>
          </Link>
          <span className="text-slate-700 text-sm">/</span>
          <span className="text-sm text-slate-400 truncate max-w-xs">
            {post.title}
          </span>
          <div className="ml-auto">
            <StatusTag status={status} />
          </div>
        </div>

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
              className="w-full bg-transparent text-2xl font-bold text-slate-100 placeholder-slate-700 focus:outline-none"
              style={{ fontFamily: "var(--font-display)" }}
              {...register("title", { required: true })}
            />
          </div>

          {/* Excerpt */}
          <div
            className="rounded-2xl p-5 border"
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
              className="w-full bg-transparent text-2xl font-bold text-slate-100 placeholder-slate-700 focus:outline-none"
              style={{ fontFamily: "var(--font-display)" }}
              {...register("blogAbout", { required: true })}
            />
          </div>

          {/* Category + thumbnail */}
          <div className="grid sm:grid-cols-2 gap-4">
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
                    onClick={() => setCategory(cat)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150"
                    style={
                      category === cat
                        ? {
                            background: "rgba(59,130,246,0.15)",
                            borderColor: "rgba(59,130,246,0.35)",
                            color: "#60A5FA",
                          }
                        : {
                            background: "rgba(255,255,255,0.03)",
                            borderColor: "rgba(255,255,255,0.08)",
                            color: "#64748B",
                          }
                    }
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

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
              {/* Current thumbnail preview */}
              <div className="flex gap-3 items-center mb-3">
                <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                  <img
                    src={getImage(post?.featuredImage)}
                    alt="Current cover"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[11px] text-slate-500">
                  Current cover
                </span>
              </div>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  handleImageSelect(e.dataTransfer.files);
                  e.preventDefault();
                  setDragOver(false);
                }}
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed rounded-xl py-4 flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
                style={
                  dragOver
                    ? {
                        borderColor: "rgba(59,130,246,0.6)",
                        background: "rgba(59,130,246,0.07)",
                      }
                    : { borderColor: "rgba(255,255,255,0.10)" }
                }
                onMouseEnter={(e) => {
                  if (!dragOver)
                    e.currentTarget.style.borderColor = "rgba(59,130,246,0.35)";
                }}
                onMouseLeave={(e) => {
                  if (!dragOver)
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.10)";
                }}
              >
                <Upload className="w-4 h-4 text-slate-600" />
                {selectedImageName ? (
                  <p className="text-xs text-slate-400">{selectedImageName}</p>
                ) : (
                  <p className="text-xs text-slate-500">
                    Replace image or{" "}
                    <span className="text-blue-400 font-medium">browse</span>
                  </p>
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
            <div
              className="flex items-center gap-1 px-4 py-3 border-b flex-wrap"
              style={{ borderColor: "rgba(255,255,255,0.06)" }}
            >
              <div
                className="w-px h-4 mx-1"
                style={{ background: "rgba(255,255,255,0.08)" }}
              />
              <span
                className="text-[11px] ml-auto px-2 py-0.5 rounded-md"
                style={{
                  color: "#475569",
                  background: "rgba(255,255,255,0.04)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {5} chars
              </span>
            </div>
            <RTE
              name="content"
              control={control}
              defaultValue={getValues("content")}
            />
          </div>

          {/* Save notification */}
          {saved && (
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-xl border text-sm text-emerald-400"
              style={{
                background: "rgba(16,185,129,0.08)",
                borderColor: "rgba(16,185,129,0.2)",
              }}
            >
              <CheckCircle2 className="w-4 h-4" />
              Changes saved successfully
            </div>
          )}

          {/* Action bar */}
          <div className="flex items-center justify-between pt-1 pb-6">
            <Link to={"/myposts"}>
              <button className="text-sm text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1.5">
                <ChevronLeft className="w-4 h-4" />
                Discard changes
              </button>
            </Link>
            <div className="flex items-center gap-3">
              <GlowButton
                variant="ghost"
                onClick={() => submitWithStatus("draft")}
              >
                Save as Draft
              </GlowButton>
              <GlowButton
                className="px-6"
                onClick={() => submitWithStatus("active")}
              >
                {status === "active" ? "Update Post" : "Publish Post"}
              </GlowButton>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default EditPostPage;
