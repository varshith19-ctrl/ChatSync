import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div
      className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50"
      role="main"                              /*  Accessibility: semantic region */
      aria-label="Empty chat screen"          /*  Accessibility: label for screen readers */
    >
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce"
              role="img"                              /*  Accessibility */
              aria-label="Chat icon bouncing to welcome user"  /*  */
            >
              <MessageSquare className="w-8 h-8 text-primary" aria-hidden="true" /> {/*  Icon marked decorative */}
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold">Welcome to ChatSync!</h2>
        <p className="text-base-content/60">
          Start Your Legendary Conversation Now! 
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
