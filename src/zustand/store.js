// store.js
import { create } from "zustand";

const useStore = create((set) => ({
  query: "", // The string state
  setQuery: (newQuery) => set({ query: newQuery }), // Action to update the string

  //   _______________
  llmModelDownloadLink: "", // The string state
  setllmModelDownloadLink: (newllmModelDownloadLink) =>
    set({ llmModelDownloadLink: newllmModelDownloadLink }), // Action to update the string
}));

export default useStore;
