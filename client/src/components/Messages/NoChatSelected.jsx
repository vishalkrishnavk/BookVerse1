import React from "react";
import { BotMessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-primary">
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-blue/10 flex items-center justify-center">
              <BotMessageSquare className="w-8 h-8 text-blue" />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <p className="text-ascent-2">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
