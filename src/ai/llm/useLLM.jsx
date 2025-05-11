import React, { useEffect, useState } from "react";
import { ChatWebLLM } from "@langchain/community/chat_models/webllm";
import { HumanMessage } from "@langchain/core/messages";
import {
  getModelFromIndexedDB,
  checkModelExistsInIndexedDB,
} from "../utlits/indexedDBUtils";

export const useLLM = () => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState(null);

  const modelConfig = {
    model: () => getModelFromIndexedDB(), // Use default MODEL_KEY
    chatOptions: {
      temperature: 0.5,
    },
  };

  const model = new ChatWebLLM(modelConfig);

  const initializeModel = async () => {
    try {
      // Check if model exists in IndexedDB before initializing
      const modelExists = await checkModelExistsInIndexedDB();
      if (!modelExists) {
        setLoadingError("Model not found. Please download the model first.");
        return;
      }

      await model.initialize(async (progress) => {
        console.log("Model loading progress:", progress);
        if (progress === "complete") {
          setIsModelLoaded(true);
        }
      });
    } catch (error) {
      console.error("Error initializing model:", error);
      setLoadingError(`Error initializing model: ${error.message}`);
    }
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
