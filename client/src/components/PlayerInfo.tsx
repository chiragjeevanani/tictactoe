import { motion } from "framer-motion";
import { X, Circle } from "lucide-react";

interface PlayerInfoProps {
  playerX: string;
  playerO: string;
  currentTurn: "X" | "O";
  currentPlayer: "X" | "O";
  scores: Record<string, number>;
}

export default function PlayerInfo({
  playerX,
  playerO,
  currentTurn,
  currentPlayer,
  scores,
}: PlayerInfoProps) {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <motion.div
        animate={{
          scale: currentTurn === "X" ? 1.05 : 1,
        }}
        className={`
          flex-1 p-4 rounded-xl border-2 transition-all
          ${
            currentTurn === "X"
              ? "border-player-x bg-player-x/10"
              : "border-card-border bg-card"
          }
        `}
      >
        <div className="flex items-center gap-2">
          <X
            className={`w-6 h-6 ${currentTurn === "X" ? "text-player-x" : "text-muted-foreground"}`}
            strokeWidth={3}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground">Player X</p>
            <p
              data-testid="text-player-x"
              className="font-semibold truncate"
            >
              {playerX}
              {currentPlayer === "X" && (
                <span className="text-xs text-muted-foreground ml-1">(You)</span>
              )}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Score: {scores["X"] || 0}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{
          scale: currentTurn === "O" ? 1.05 : 1,
        }}
        className={`
          flex-1 p-4 rounded-xl border-2 transition-all
          ${
            currentTurn === "O"
              ? "border-player-o bg-player-o/10"
              : "border-card-border bg-card"
          }
        `}
      >
        <div className="flex items-center gap-2">
          <Circle
            className={`w-6 h-6 ${currentTurn === "O" ? "text-player-o" : "text-muted-foreground"}`}
            strokeWidth={3}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground">Player O</p>
            <p
              data-testid="text-player-o"
              className="font-semibold truncate"
            >
              {playerO}
              {currentPlayer === "O" && (
                <span className="text-xs text-muted-foreground ml-1">(You)</span>
              )}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Score: {scores["O"] || 0}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
