import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from 'react-native';

/* -----------------------------
Types (same shape as Training)
------------------------------*/
type TrialResult = {
  stimulus: "GO" | "NOGO";
  responded: boolean;
  correct: boolean;
  reactionTime: number | null;
};

type Session = {
  id: number;
  date: string;
  results: TrialResult[];
};


export default function progressScreen() {

  const [sessions, setSessions] = useState<Session[]>([]);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("sessions").then(data => {
        setSessions(data ? JSON.parse(data) : []);
      });
    }, [])
  );

  function accuracy(session: Session): number {

    const totalTrials = session.results.length;

    if (totalTrials === 0) return 0; // prevents errors if no trials yet

    // Count how many trials were correct
    const correctTrials = session.results.reduce(
      (count, trial) => 
        // If this trial is correct, add 1 to the count
        // Otherwise, add 0
        count + (trial.correct ? 1 : 0),
      0 // Start counting from 0
    );

    return correctTrials / totalTrials;
  }

  function avgRT(session: Session): number | null {
    
    let totalRT = 0; // Variable to store the total reaction time
    let count = 0; // Variable to count how many valid GO trials we include

    // Loop through every trial in the session
    for (const trial of session.results) {

      // Only include GO trials that have a recorded reaction time
      if (trial.stimulus === "GO" && trial.reactionTime !== null) {
        
        totalRT += trial.reactionTime; // Add this trial's reaction time to the total
        count++; // Increase the count of valid trials
      }
    }

    // If no valid GO trials were found, return null
    if (count === 0) return null;

    // Otherwise, return the average reaction time
    return totalRT / count;
  }


  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progress</Text>

      {sessions.length === 0 && (
        <Text style={styles.subtitle}>No sessions yet</Text>
      )}
      {sessions.map(session => (
        <View key={session.id} style={styles.card}>
          <Text style={styles.date}>
            {new Date(session.date).toLocaleDateString()}
          </Text>
        
          <Text>Accuracy: {(accuracy(session) * 100).toFixed(1)}%</Text>
        <Text>
          Avg RT: {avgRT(session) ? Math.round(avgRT(session)!) : "–"} ms
        </Text>
      </View>
    ))}
  </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#F0F4F8' },
  title: { fontSize: 28, fontWeight: '600', marginBottom: 20, color: '#333' },
  subtitle: { fontSize: 16, color: '#555', textAlign: 'center' },
  card: {backgroundColor: "white", padding: 16, borderRadius: 10, marginBottom: 12,},
  date: { fontWeight: "600", marginBottom: 6 },
});