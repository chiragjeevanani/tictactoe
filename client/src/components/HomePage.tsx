import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Gamepad2, Plus, LogIn } from "lucide-react";

interface HomePageProps {
  onCreateGame: (nickname: string) => void;
  onJoinGame: (nickname: string, roomCode: string) => void;
}

export default function HomePage({ onCreateGame, onJoinGame }: HomePageProps) {
  const [nickname, setNickname] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [showJoinInput, setShowJoinInput] = useState(false);

  const handleCreateGame = () => {
    if (nickname.trim()) {
      onCreateGame(nickname.trim());
    }
  };

  const handleJoinGame = () => {
    if (nickname.trim() && roomCode.trim()) {
      onJoinGame(nickname.trim(), roomCode.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-card">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block mb-4"
          >
            <Gamepad2 className="w-16 h-16 text-primary mx-auto" />
          </motion.div>
          <h1 className="text-4xl font-bold mb-2 font-[family-name:var(--font-sans)]">
            Tic Tac Toe
          </h1>
          <p className="text-muted-foreground">
            Challenge your friends in real-time!
          </p>
        </div>

        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="nickname">
              Your Nickname
            </label>
            <Input
              id="nickname"
              data-testid="input-nickname"
              type="text"
              placeholder="Enter your nickname..."
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="text-lg"
              maxLength={20}
            />
          </div>

          {showJoinInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-2"
            >
              <label className="text-sm font-medium" htmlFor="room-code">
                Room Code
              </label>
              <Input
                id="room-code"
                data-testid="input-room-code"
                type="text"
                placeholder="Enter room code..."
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="text-lg font-mono"
                maxLength={6}
              />
            </motion.div>
          )}

          <div className="space-y-3 pt-2">
            {!showJoinInput ? (
              <>
                <Button
                  data-testid="button-create-game"
                  onClick={handleCreateGame}
                  disabled={!nickname.trim()}
                  className="w-full text-lg py-6"
                  size="lg"
                >
                  <Plus className="mr-2" />
                  Create Game
                </Button>
                <Button
                  data-testid="button-show-join"
                  onClick={() => setShowJoinInput(true)}
                  disabled={!nickname.trim()}
                  variant="outline"
                  className="w-full text-lg py-6"
                  size="lg"
                >
                  <LogIn className="mr-2" />
                  Join Game
                </Button>
              </>
            ) : (
              <>
                <Button
                  data-testid="button-join-game"
                  onClick={handleJoinGame}
                  disabled={!nickname.trim() || !roomCode.trim()}
                  className="w-full text-lg py-6"
                  size="lg"
                >
                  <LogIn className="mr-2" />
                  Join Game
                </Button>
                <Button
                  data-testid="button-back"
                  onClick={() => {
                    setShowJoinInput(false);
                    setRoomCode("");
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Back
                </Button>
              </>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
