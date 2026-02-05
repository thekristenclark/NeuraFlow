import { StyleSheet, Text, View } from 'react-native';

export default function progressScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progress Dashboard</Text>
      <Text style={styles.subtitle}>Your session trends will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#F0F4F8' },
  title: { fontSize: 28, fontWeight: '600', marginBottom: 10, color: '#333' },
  subtitle: { fontSize: 16, color: '#555', textAlign: 'center' },
});