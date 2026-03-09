import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";


/* -----------------------------
   Types
------------------------------*/
export type Stimulus = "GO" | "NOGO";

export type TrialResult = {
    stimulus: Stimulus;
    responded: boolean;
    correct: boolean;
    reactionTime: number | null;
    timestamp: number;
};

type Session = {
    id: number;
    date: string;
    results: TrialResult[];
};

/* -----------------------------
   Constants
------------------------------*/
const STIMULUS_DURATION = 800; // ms
const INTER_TRIAL_INTERVAL = 700; // ms
const TOTAL_TRIALS = 20;

/* -----------------------------
   Hooks
------------------------------*/
export function useGoNoGoTask() {
    const [currentStimulus, setCurrentStimulus] = useState<Stimulus | null>(null);
    const [stimulusStartTime, setStimulusStartTime] = useState<number | null>(null);
    const [results, setResults] = useState<TrialResult[]>([]);
    const [trialCount, setTrialCount] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refs to avoid stale closures inside timeouts
    const currentStimulusRef = useRef<Stimulus | null>(null);
    const stimulusStartTimeRef = useRef<number | null>(null);
    const isRunningRef = useRef<boolean>(false);
    const resultsRef = useRef<TrialResult[]>([]);

    /* -----------------------------
        Helpers
    ------------------------------*/
    function clearTimeouts() {
        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

   /* -----------------------------
       Task Logic
    ------------------------------*/
    function startSession() {
        resultsRef.current = [];
        setResults([]);
        setTrialCount(0);
        isRunningRef.current = true;
        setIsRunning(true);
        timeoutRef.current = setTimeout(startTrial, INTER_TRIAL_INTERVAL);
    }
  
    function stopSession(finalResults: TrialResult[]) {
        isRunningRef.current = false;
        setIsRunning(false);
        currentStimulusRef.current = null;
        stimulusStartTimeRef.current = null;
        setCurrentStimulus(null);
        clearTimeouts();
        saveSession(finalResults);
    }
  
     /* -----------------------------
       Trial Logic
    ------------------------------*/

    function startTrial() {
    //Use a functional update to get the latest trial count - avoids stale closure issues
        if (trialCount >= TOTAL_TRIALS) {
            stopSession(resultsRef.current);
        return;
      }
  
        const stimulus: Stimulus = Math.random() < 0.7 ? "GO" : "NOGO";
        currentStimulusRef.current = stimulus;
        stimulusStartTimeRef.current = Date.now();
        setCurrentStimulus(stimulus);

        // auto-end trial after stimulus duration if no response
        timeoutRef.current = setTimeout(() => { // auto-end trial after stimulus duration
            endTrial(false);
        }, STIMULUS_DURATION);
    }
  
    function handlePress() {
        if (currentStimulusRef.current === null) return;
        if (stimulusStartTimeRef.current === null) return;
  
        const reactionTime = Date.now() - stimulusStartTimeRef.current;
        clearTimeouts(); // stop auto timeout
        endTrial(true, reactionTime);
    }
  
    function endTrial(responded: boolean, reactionTime: number | null = null) {
        const stimulus = currentStimulusRef.current;
        if (stimulus === null) return;

        const correct =
            (stimulus === "GO" && responded) ||
            (stimulus === "NOGO" && !responded);
  
        const trial: TrialResult = {
            stimulus,
            responded,
            correct,
            reactionTime,
            timestamp: Date.now(),
        };

        // Clear current stimulus and prepare for next trial
        currentStimulusRef.current = null;
        stimulusStartTimeRef.current = null;
        setCurrentStimulus(null);
        clearTimeouts();

        // Update results state and refs
        const updatedResults = [...resultsRef.current, trial];
        resultsRef.current = updatedResults;
        setResults(updatedResults);
        setTrialCount(updatedResults.length);

        if (updatedResults.length >= TOTAL_TRIALS) {
            stopSession(updatedResults);
        } else {
            timeoutRef.current = setTimeout(startTrial, INTER_TRIAL_INTERVAL);
        }   
    }

  
        // Save trial results
//         setResults((prevResults => {
//             const updatedResults = [...prevResults, trial];
//             const newTrialCount = updatedResults.length;
//             setTrialCount(newTrialCount);

//       setCurrentStimulus(null);
//       setStimulusStartTime(null);
//         clearTimeouts();

  
//         if (newTrialCount >= TOTAL_TRIALS) {
//             stopSession(updatedResults);
//         } else {
//         timeoutRef.current = setTimeout(
//           startTrial,
//           INTER_TRIAL_INTERVAL
//         );
//         }

//         return updatedResults;
//     });
// }
    

  
      //timeoutRef.current = setTimeout(startTrial, INTER_TRIAL_INTERVAL);
    
  
    /* -----------------------------
       Persistence
    ------------------------------*/
    async function saveSession(results: TrialResult[]) {
        try{
        const stored = await AsyncStorage.getItem("sessions");
        const sessions: Session[] = stored ? JSON.parse(stored) : [];
  
        sessions.push({
            id: Date.now(),
            date: new Date().toISOString(),
            results,
        });
  
        await AsyncStorage.setItem("sessions", JSON.stringify(sessions));
    } catch (error) {
        console.error("Failed to save session:", error);
    }
    }

  /* -----------------------------
     Cleanup
  ------------------------------*/
    useEffect(() => {
        return () => clearTimeouts();
    }, []);

  /* -----------------------------
     Expose to Screen
  ------------------------------*/

  return {
    isRunning,
    currentStimulus,
    trialCount,
    totalTrials: TOTAL_TRIALS,
    startSession,
    handlePress,
  };

}