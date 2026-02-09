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

  function accuracy(session: Session) {
    return (
      session.results.filter(r => r.correct).length /
      session.results.length
    );
  }

  function avgRT(session: Session): number | null {
    const goTrials = session.results.filter(
      r => r.stimulus === "GO" && r.reactionTime !== null
    );

    if (goTrials.length === 0) return null;

      const total = goTrials.reduce(
        (sum, r) => sum + r.reactionTime!, 0);

    return total / goTrials.length;
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