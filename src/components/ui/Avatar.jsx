import React from "react";

const Avatar = ({ initials, size = "md" }) => {
  const sz = {
    sm: "w-7 h-7 text-[10px]",
    md: "w-9 h-9 text-xs",
    lg: "w-11 h-11 text-sm",
  }[size];
  return (
    <div
      className={`${sz} rounded-full flex items-center justify-center font-bold text-white shrink-0`}
      style={{ background: "linear-gradient(135deg, #3B82F6, #6366F1)" }}
    >
      {initials}
    </div>
  );
};

export default Avatar;
