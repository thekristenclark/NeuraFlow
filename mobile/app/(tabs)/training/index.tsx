import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useGoNoGoTask } from "../../../hooks/use-go-no-go-task";


/* -----------------------------
   Screen (UI Controller Only)
   NeuraFlow - Go / No-Go Training
------------------------------*/
export default function TrainingScreen() {
  const {
    isRunning,
    currentStimulus,
    trialCount,
    totalTrials,
    startSession,
    handlePress,
  } = useGoNoGoTask();

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
        Trial {trialCount} / {totalTrials}
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
