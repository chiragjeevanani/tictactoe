import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Loader2 } from "lucide-react";
import { useState } from "react";

interface WaitingRoomProps {
  roomCode: string;
  playerNickname: string;
  onLeave: () => void;
}

export default function WaitingRoom({
  roomCode,
  playerNickname,
  onLeave,
}: WaitingRoomProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-card">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 text-center space-y-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-12 h-12 text-primary mx-auto" />
          </motion.div>

          <div>
            <h2 className="text-2xl font-bold mb-2">Waiting for Opponent</h2>
            <p className="text-muted-foreground">
              Share this room code with a friend
            </p>
          </div>

          <div className="bg-card p-4 rounded-lg border-2 border-primary/20">
            <p className="text-sm text-muted-foreground mb-2">Room Code</p>
            <div className="flex items-center justify-center gap-2">
              <code
                data-testid="text-room-code"
                className="text-3xl font-mono font-bold tracking-wider"
              >
                {roomCode}
              </code>
              <Button
                data-testid="button-copy-code"
                size="icon"
                variant="ghost"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="w-5 h-5 text-win" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          <div className="pt-2">
            <p className="text-sm text-muted-foreground mb-4">
              Playing as: <span className="font-semibold">{playerNickname}</span>
            </p>
            <Button
              data-testid="button-leave-room"
              onClick={onLeave}
              variant="outline"
              className="w-full"
            >
              Leave Room
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
