import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DisconnectNotificationProps {
  isVisible: boolean;
  message: string;
  onDismiss: () => void;
}

export default function DisconnectNotification({
  isVisible,
  message,
  onDismiss,
}: DisconnectNotificationProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
        >
          <div className="bg-destructive text-destructive-foreground rounded-lg p-4 shadow-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p data-testid="text-disconnect-message" className="flex-1 font-medium">
              {message}
            </p>
            <Button
              data-testid="button-dismiss"
              size="icon"
              variant="ghost"
              className="flex-shrink-0 h-8 w-8 text-destructive-foreground hover:bg-destructive-foreground/20"
              onClick={onDismiss}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
