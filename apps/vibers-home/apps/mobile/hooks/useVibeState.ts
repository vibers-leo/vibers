import { useState, useEffect } from 'react';
import { StorageService } from '../services/storage';

export const useVibeState = () => {
  const [credits, setCredits] = useState<number>(100);
  const [drafts, setDrafts] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInitialState = async () => {
      const savedCredits = await StorageService.getCredits();
      const savedDrafts = await StorageService.getAllDrafts();
      setCredits(savedCredits);
      setDrafts(savedDrafts);
      setIsLoading(false);
    };
    loadInitialState();
  }, []);

  const deductCredits = async (amount: number) => {
    const newCount = Math.max(0, credits - amount);
    setCredits(newCount);
    await StorageService.saveCredits(newCount);
  };

  const addCredits = async (amount: number) => {
    const newCount = credits + amount;
    setCredits(newCount);
    await StorageService.saveCredits(newCount);
  };

  const saveProjectDraft = async (projectId: string, files: any) => {
    await StorageService.saveDraft(projectId, files);
    const updatedDrafts = await StorageService.getAllDrafts();
    setDrafts(updatedDrafts);
  };

  return {
    credits,
    deductCredits,
    addCredits,
    drafts,
    saveProjectDraft,
    isLoading,
  };
};
