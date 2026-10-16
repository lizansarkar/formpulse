"use client";

import React from "react";
import { Form } from "@/types/form";
import ChatbotWidget from "@/components/chatbot/ChatbotWidget";

interface EmbedWrapperProps {
  form: Form;
}

export default function EmbedWrapper({ form }: EmbedWrapperProps) {
  const handleClose = () => {
    if (typeof window !== "undefined" && window.parent) {
      window.parent.postMessage("formpulse:close", "*");
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-white dark:bg-zinc-950 flex flex-col">
      <ChatbotWidget
        form={form}
        mode="fullscreen"
        onClose={handleClose}
      />
    </div>
  );
}
