import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Minus, RotateCcw, Home } from "lucide-react";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";

interface GameResultProps {
  isOpen: boolean;
  result: "win" | "draw" | null;
  winner: string | null;
  winnerSymbol: "X" | "O" | null;
  onRematch: () => void;
  onLeave: () => void;
  scores: Record<string, number>;
}

export default function GameResult({
  isOpen,
  result,
  winner,
  winnerSymbol,
  onRematch,
  onLeave,
  scores,
}: GameResultProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {result === "win" && (
            <Confetti
              width={windowSize.width}
              height={windowSize.height}
              recycle={false}
              numberOfPieces={500}
              gravity={0.3}
            />
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onLeave()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <Card
                className={`p-8 max-w-sm w-full text-center border-2 ${
                  result === "win"
                    ? "border-win"
                    : result === "draw"
                      ? "border-draw"
                      : "border-card-border"
                }`}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="mb-6"
                >
                  {result === "win" ? (
                    <Trophy className="w-20 h-20 mx-auto text-win" />
                  ) : (
                    <Minus className="w-20 h-20 mx-auto text-draw" />
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2
                    data-testid="text-result"
                    className="text-3xl font-bold mb-2"
                  >
                    {result === "win" ? "Victory!" : "It's a Draw!"}
                  </h2>
                  {result === "win" && winner && winnerSymbol && (
                    <div className="mb-6">
                      <p
                        data-testid="text-winner"
                        className="text-lg text-muted-foreground"
                      >
                        {winner} wins!
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Score: {scores[winnerSymbol] || 0} (+1)
                      </p>
                    </div>
                  )}
                  {result === "draw" && (
                    <p className="text-lg text-muted-foreground mb-6">
                      Nobody wins this round
                    </p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3 mt-8"
                >
                  <Button
                    data-testid="button-rematch"
                    onClick={onRematch}
                    className="w-full"
                    size="lg"
                  >
                    <RotateCcw className="mr-2" />
                    Play Again
                  </Button>
                  <Button
                    data-testid="button-leave-game"
                    onClick={onLeave}
                    variant="outline"
                    className="w-full"
                  >
                    <Home className="mr-2" />
                    Leave Game
                  </Button>
                </motion.div>
              </Card>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
