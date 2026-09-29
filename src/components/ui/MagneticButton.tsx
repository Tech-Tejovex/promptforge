import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";

export default function MagneticButton({
  label,
  onClick,
  variant = "primary",
  size = "md",
  icon,
}: {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}) {
  const sizes = {
    sm: "px-4 py-2 text-sm rounded-2xl",
    md: "px-6 py-3 text-base rounded-3xl",
    lg: "px-8 py-4 text-lg rounded-full",
  };

  const variants = {
    primary:
      "bg-white text-void hover:bg-[#f0f0f0] shadow-[0_0_40px_-12px_rgba(255,255,255,0.25)]",
    secondary:
      "bg-glass border border-glass-border text-white hover:border-glow hover:bg-glass hover:shadow-[0_0_30px_-10px_rgba(255,255,255,0.15)]",
    ghost:
      "text-text-secondary hover:text-white hover:bg-glass",
  };

  return (
    <motion.button
      onClick={onClick}
      className={`
        relative inline-flex items-center justify-center gap-2.5 font-medium
        tracking-tight transition-all duration-300 overflow-hidden group
        ${sizes[size]} ${variants[variant]}
      `}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
      {icon || <Sparkles className="w-4 h-4 opacity-70" />}
      <span className="relative z-10">{label}</span>
      <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-80 transition-opacity" />
    </motion.button>
  );
}
