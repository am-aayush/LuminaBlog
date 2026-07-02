function CategoryBadge({ category }) {
  const palette = {
    Technology: "rgba(59,130,246,0.12) text-blue-400 border-blue-500/20",
    Design: "rgba(139,92,246,0.12) text-violet-400 border-violet-500/20",
    Engineering: "rgba(16,185,129,0.12) text-emerald-400 border-emerald-500/20",
    Blockchain: "rgba(245,158,11,0.12) text-amber-400 border-amber-500/20",
    Science: "rgba(6,182,212,0.12) text-cyan-400 border-cyan-500/20",
    Culture: "rgba(244,63,94,0.12) text-rose-400 border-rose-500/20",
  };
  const [bg, ...rest] = (
    palette[category] ??
    "rgba(100,116,139,0.12) text-slate-400 border-slate-500/20"
  ).split(" ");
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${rest.join(" ")}`}
      style={{ background: bg }}
    >
      {category}
    </span>
  );
}


export default CategoryBadge