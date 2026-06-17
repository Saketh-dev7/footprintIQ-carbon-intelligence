"use client"

import { useState, useEffect, useCallback } from 'react';
import { FootprintData, AssessmentState, HistoryEntry } from '@/types';

const STORAGE_KEY = 'footprint_iq_data';
const ASSESSMENT_KEY = 'footprint_iq_assessment';
const HISTORY_KEY = 'footprint_iq_history';
const FORECAST_VISITED_KEY = 'footprint_iq_visited_forecast';
const COMPLETED_TASKS_KEY = 'footprint_iq_completed_tasks';

// Cap stored history so localStorage doesn't grow unbounded over time.
const MAX_HISTORY_ENTRIES = 90;

export function useFootprint() {
  const [data, setData] = useState<FootprintData | null>(null);
  const [assessment, setAssessment] = useState<AssessmentState | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [visitedForecast, setVisitedForecast] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      const storedAssessment = localStorage.getItem(ASSESSMENT_KEY);
      const storedHistory = localStorage.getItem(HISTORY_KEY);
      const storedVisitedForecast = localStorage.getItem(FORECAST_VISITED_KEY);
      const storedCompletedTasks = localStorage.getItem(COMPLETED_TASKS_KEY);

      if (storedData) setData(JSON.parse(storedData));
      if (storedAssessment) setAssessment(JSON.parse(storedAssessment));
      if (storedHistory) setHistory(JSON.parse(storedHistory));
      if (storedVisitedForecast) setVisitedForecast(JSON.parse(storedVisitedForecast));
      if (storedCompletedTasks) setCompletedTasks(JSON.parse(storedCompletedTasks));
    } catch (error) {
      console.error('Failed to load footprint data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveData = useCallback((newData: FootprintData, newAssessment: AssessmentState) => {
    try {
      const newHistoryEntry: HistoryEntry = {
        timestamp: newData.timestamp,
        total: newData.total,
        ecoScore: newData.ecoScore,
      };
      setHistory(prevHistory => {
        const newHistory = [...prevHistory, newHistoryEntry].slice(-MAX_HISTORY_ENTRIES);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
        return newHistory;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      localStorage.setItem(ASSESSMENT_KEY, JSON.stringify(newAssessment));
      setData(newData);
      setAssessment(newAssessment);
    } catch (error) {
      console.error('Failed to save footprint data:', error);
    }
  }, []);

  const markForecastVisited = useCallback(() => {
    try {
      const alreadyVisited = localStorage.getItem(FORECAST_VISITED_KEY);
      if (alreadyVisited) return;
      localStorage.setItem(FORECAST_VISITED_KEY, JSON.stringify(true));
      setVisitedForecast(true);
    } catch (error) {
      console.error('Failed to save forecast visit:', error);
    }
  }, []);

  const toggleTaskCompletion = useCallback((day: number) => {
    setCompletedTasks(prev => {
      const updated = prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day];
      try {
        localStorage.setItem(COMPLETED_TASKS_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save task completion:', error);
      }
      return updated;
    });
  }, []);

  const clearData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ASSESSMENT_KEY);
    localStorage.removeItem(HISTORY_KEY);
    localStorage.removeItem(FORECAST_VISITED_KEY);
    localStorage.removeItem(COMPLETED_TASKS_KEY);
    setData(null);
    setAssessment(null);
    setHistory([]);
    setVisitedForecast(false);
    setCompletedTasks([]);
  }, []);

  return {
    data,
    assessment,
    history,
    visitedForecast,
    completedTasks,
    saveData,
    clearData,
    markForecastVisited,
    toggleTaskCompletion,
    isLoading,
  };
}
