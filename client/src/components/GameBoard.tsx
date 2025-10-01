import { useState } from "react";
import { motion } from "framer-motion";
import GameCell from "./GameCell";
import PlayerInfo from "./PlayerInfo";
import { Card } from "@/components/ui/card";

type CellValue = "X" | "O" | null;

interface GameBoardProps {
  playerX: string;
  playerO: string;
  currentPlayer: "X" | "O";
  board: CellValue[];
  onCellClick: (index: number) => void;
  currentTurn: "X" | "O";
  winningLine: number[] | null;
  scores: Record<string, number>;
}

export default function GameBoard({
  playerX,
  playerO,
  currentPlayer,
  board,
  onCellClick,
  currentTurn,
  winningLine,
  scores,
}: GameBoardProps) {
  const isMyTurn = currentPlayer === currentTurn;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-card">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <PlayerInfo
          playerX={playerX}
          playerO={playerO}
          currentTurn={currentTurn}
          currentPlayer={currentPlayer}
          scores={scores}
        />

        <Card className="p-6">
          <div className="text-center mb-6">
            <motion.p
              key={currentTurn}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              data-testid="text-turn-status"
              className="text-lg font-semibold"
            >
              {isMyTurn ? "Your Turn" : `${currentTurn === "X" ? playerX : playerO}'s Turn`}
            </motion.p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            {board.map((value, index) => (
              <GameCell
                key={index}
                index={index}
                value={value}
                onClick={() => onCellClick(index)}
                disabled={!isMyTurn || !!winningLine}
                isWinningCell={winningLine?.includes(index) || false}
              />
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
