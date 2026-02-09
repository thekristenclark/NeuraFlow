// Import the router hook from Expo Router so we can navigate between screens
import { useRouter } from 'expo-router';

// Import basic React Native UI components and styling utility
import { Button, StyleSheet, Text, View } from "react-native";

// This is the main functional component for the Home / Onboarding screen
export default function index() {

  // Initialize the router so we can programmatically change screens
  const router = useRouter();

  // JSX returned here defines what appears on the screen
  return (

    // Root container that holds all content on the page
    <View style={styles.container}>

      {/* App title / welcome message */}
      <Text style={styles.title}>Welcome to NeuraFlow</Text>
      <Text style={styles.subtitle}>Your daily cognitive & motor training app</Text>


      {/* First button wrapper for spacing and width control */}
      <View style={styles.buttonContainer}>
        <Button
          title="Start Training"
          onPress={() => router.push('/(tabs)/trainingScreen')}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="View Progress"
          onPress={() => router.push('/(tabs)/progressScreen')}
        />
      </View>

    </View>
  );
}

// Centralized styling object using React Native StyleSheet
const styles = StyleSheet.create({
  container: { flex: 1 // Take up full screen height
  , justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#F0F4F8' },
  
  // Title text styles
  title: { fontSize: 28, fontWeight: '600', marginBottom: 10, color: '#333' },
  
  // Subtitle text styles
  subtitle: { fontSize: 16, marginBottom: 30, color: '#555', textAlign: 'center' },
  
  // Wrapper style for each button
  buttonContainer: { marginVertical: 10, width: '60%' },
});