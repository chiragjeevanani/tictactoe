import { motion } from "framer-motion";
import { X, Circle } from "lucide-react";

interface GameCellProps {
  value: "X" | "O" | null;
  onClick: () => void;
  disabled: boolean;
  isWinningCell: boolean;
  index: number;
}

export default function GameCell({
  value,
  onClick,
  disabled,
  isWinningCell,
  index,
}: GameCellProps) {
  return (
    <motion.button
      data-testid={`cell-${index}`}
      onClick={onClick}
      disabled={disabled || !!value}
      whileHover={!value && !disabled ? { scale: 1.02 } : {}}
      whileTap={!value && !disabled ? { scale: 0.98 } : {}}
      className={`
        aspect-square rounded-2xl bg-card border-2
        flex items-center justify-center
        transition-all duration-200
        ${!value && !disabled ? "hover-elevate cursor-pointer" : "cursor-not-allowed"}
        ${isWinningCell ? "border-win shadow-lg shadow-win/30" : "border-card-border"}
      `}
    >
      {value === "X" && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <X className="w-12 h-12 md:w-16 md:h-16 text-player-x" strokeWidth={3} />
        </motion.div>
      )}
      {value === "O" && (
        <motion.div
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <Circle className="w-12 h-12 md:w-16 md:h-16 text-player-o" strokeWidth={3} />
        </motion.div>
      )}
    </motion.button>
  );
}
