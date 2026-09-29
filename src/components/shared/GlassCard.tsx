import { motion } from "framer-motion";

export default function GlassCard({
  children,
  className = "",
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-3xl
        bg-glass border border-glass-border
        backdrop-blur-2xl
        shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]
        ${hover ? "hover:border-glow hover:shadow-[0_16px_48px_0_rgba(255,255,255,0.04)] transition-all duration-500" : ""}
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.005 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
}
