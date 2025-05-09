import React, { useEffect } from "react";
import { ChatWebLLM } from "@langchain/community/chat_models/webllm";
import { HumanMessage } from "@langchain/core/messages";
export const useLLM = () => {
  const modelConfig = {
    model: "Phi-3-mini-4k-instruct-q4f16_1-MLC",
    chatOptions: {
      temperature: 0.5,
    },
  };

  const model = new ChatWebLLM(modelConfig);

  const initializeModel = async () => {
    await model.initialize((progress) => {
      console.log(progress);
    });
  };

  const invokeModel = async (message) => {
    try {
      const response = await model.invoke([
        new HumanMessage({ content: message }),
      ]);
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const streamModel = async (message) => {
    try {
      const stream = await model.stream([
        new HumanMessage({ content: message }),
      ]);
      return stream;
    } catch (error) {
      console.error(error);
    }
  };

  const llmResponse = async (message) => {
    return invokeModel(message);
  };

  const llmResponseStream = async (message) => {
    return streamModel(message);
  };

  useEffect(() => {
    initializeModel();
  }, []);

  return {
    llmResponse,
    llmResponseStream,
  };
};
