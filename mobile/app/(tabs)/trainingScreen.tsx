import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

/* -----------------------------
   Types
------------------------------*/
type Stimulus = "GO" | "NOGO";

type TrialResult = {
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
   Screen
------------------------------*/
export default function TrainingScreen() {
  const [currentStimulus, setCurrentStimulus] =
    useState<Stimulus | null>(null);

  const [stimulusStartTime, setStimulusStartTime] =
    useState<number | null>(null);

  const [results, setResults] = useState<TrialResult[]>([]);
  const [trialCount, setTrialCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* -----------------------------
     Task Logic
  ------------------------------*/
  function startSession() {
    setResults([]);
    setTrialCount(0);
    setIsRunning(true);
    startTrial();
  }

  function stopSession() {
    setIsRunning(false);
    setCurrentStimulus(null);
    setStimulusStartTime(null);
    clearTimeouts();
    saveSession(results);
  }

  function clearTimeouts() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }

  function startTrial() {
    if (trialCount >= TOTAL_TRIALS) {
      stopSession();
      return;
    }

    const stimulus: Stimulus =
      Math.random() < 0.7 ? "GO" : "NOGO";

    setCurrentStimulus(stimulus);
    setStimulusStartTime(Date.now());
    setTrialCount(prev => prev + 1);

    timeoutRef.current = setTimeout(() => {
      endTrial(false);
    }, STIMULUS_DURATION);
  }

  function handlePress() {
    if (!currentStimulus || !stimulusStartTime) return;

    const reactionTime = Date.now() - stimulusStartTime;
    endTrial(true, reactionTime);
  }

  function endTrial(
    responded: boolean,
    reactionTime: number | null = null
  ) {
    if (!currentStimulus || !stimulusStartTime) return;

    const correct =
      (currentStimulus === "GO" && responded) ||
      (currentStimulus === "NOGO" && !responded);

    const trial: TrialResult = {
      stimulus: currentStimulus,
      responded,
      correct,
      reactionTime,
      timestamp: Date.now(),
    };

    setResults(prev => [...prev, trial]);
    setCurrentStimulus(null);
    setStimulusStartTime(null);
    clearTimeouts();

    timeoutRef.current = setTimeout(
      startTrial,
      INTER_TRIAL_INTERVAL
    );
  }

  /* -----------------------------
     Persistence
  ------------------------------*/
  async function saveSession(results: TrialResult[]) {
    try {
      const stored = await AsyncStorage.getItem("sessions");
      const sessions: Session[] = stored
        ? JSON.parse(stored)
        : [];

      sessions.push({
        id: Date.now(),
        date: new Date().toISOString(),
        results,
      });

      await AsyncStorage.setItem(
        "sessions",
        JSON.stringify(sessions)
      );
    } catch (err) {
      console.error("Failed to save session", err);
    }
  }

  /* -----------------------------
     Cleanup
  ------------------------------*/
  useEffect(() => {
    return () => clearTimeouts();
  }, []);

  /* -----------------------------
     UI
  ------------------------------*/
  if (!isRunning) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Training Module</Text>
        <Text style={styles.subtitle}>
          Go / No-Go Task
        </Text>

        <Pressable style={styles.button} onPress={startSession}>
          <Text style={styles.buttonText}>Start Session</Text>
        </Pressable>

        <Text style={styles.footer}>
          Sessions are saved locally
        </Text>
      </View>
    );
  }

  return (
    <Pressable style={styles.taskContainer} onPress={handlePress}>
      {currentStimulus && (
        <Text
          style={[
            styles.stimulus,
            currentStimulus === "GO"
              ? styles.go
              : styles.nogo,
          ]}
        >
          {currentStimulus === "GO" ? "●" : "✕"}
        </Text>
      )}

      <Text style={styles.counter}>
        Trial {trialCount} / {TOTAL_TRIALS}
      </Text>
    </Pressable>
  );
}

/* -----------------------------
   Styles
------------------------------*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F8",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    marginTop: 20,
    color: "#777",
    fontSize: 12,
  },
  taskContainer: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  stimulus: {
    fontSize: 96,
    fontWeight: "700",
  },
  go: {
    color: "#22C55E",
  },
  nogo: {
    color: "#EF4444",
  },
  counter: {
    position: "absolute",
    bottom: 40,
    color: "white",
    fontSize: 14,
  },
});
