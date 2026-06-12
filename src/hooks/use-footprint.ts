"use client"

import { useState, useEffect } from 'react';
import { FootprintData, AssessmentState } from '@/types';

const STORAGE_KEY = 'footprint_iq_data';
const ASSESSMENT_KEY = 'footprint_iq_assessment';

export function useFootprint() {
  const [data, setData] = useState<FootprintData | null>(null);
  const [assessment, setAssessment] = useState<AssessmentState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      const storedAssessment = localStorage.getItem(ASSESSMENT_KEY);
      
      if (storedData) setData(JSON.parse(storedData));
      if (storedAssessment) setAssessment(JSON.parse(storedAssessment));
    } catch (error) {
      console.error('Failed to load footprint data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveData = (newData: FootprintData, newAssessment: AssessmentState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      localStorage.setItem(ASSESSMENT_KEY, JSON.stringify(newAssessment));
      setData(newData);
      setAssessment(newAssessment);
    } catch (error) {
      console.error('Failed to save footprint data:', error);
    }
  };

  const clearData = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ASSESSMENT_KEY);
    setData(null);
    setAssessment(null);
  };

  return { data, assessment, saveData, clearData, isLoading };
}
