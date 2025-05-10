import React, { useEffect } from "react";
import { ChatWebLLM } from "@langchain/community/chat_models/webllm";
import { HumanMessage } from "@langchain/core/messages";
import useStore from "../../zustand/store";
import Dashboard from "../../components/pages/Dashboard";

export const useLLM = () => {
  const { llmModelDownloadLink, setllmModelDownloadLink } = useStore();
  const llmModelHuggungFace = llmModelDownloadLink;
  useEffect(() => {
    setllmModelDownloadLink(llmModelHuggungFace);
  }, []);

  const modelConfig = {
    model: llmModelDownloadLink,
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
