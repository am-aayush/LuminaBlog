function GlowButton({
  children,
  onClick,
  className = "",
  variant = "primary",
  type,
}) {
  if (variant === "ghost") {
    return (
      <button
        type={type}
        onClick={onClick}
        className={`px-5 py-2.5 border border-white/8 rounded-xl text-sm text-slate-400 hover:text-slate-200 transition-all duration-200 ${className}`}
        style={{ background: "rgba(255,255,255,0.04)" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(255,255,255,0.07)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "rgba(255,255,255,0.04)")
        }
      >
        {children}
      </button>
    );
  }
  return (
    <button
      type={type}
      onClick={onClick}
      className={`relative px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 ${className}`}
      style={{
        background: "linear-gradient(135deg, #3B82F6, #2563EB)",
        boxShadow: "0 4px 24px rgba(59,130,246,0.25)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background =
          "linear-gradient(135deg, #60A5FA, #3B82F6)";
        e.currentTarget.style.boxShadow = "0 6px 32px rgba(59,130,246,0.42)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background =
          "linear-gradient(135deg, #3B82F6, #2563EB)";
        e.currentTarget.style.boxShadow = "0 4px 24px rgba(59,130,246,0.25)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {children}
    </button>
  );
}

export default GlowButton;
