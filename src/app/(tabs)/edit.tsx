import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import CameraIcon from "@/assets/icons/camera";
import CheckmarkSVG from "@/assets/icons/checkmark";
import speechButton from "../models/speech-button";
import { addSpeechButton } from "../services/database-service";
import { router } from "expo-router";
import XmarkSVG from "@/assets/icons/xmark";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const App = () => {
  const [label, setLabel] = useState<string>("");
  const [speechPhrase, setSpeechPhrase] = useState<string>("");

  const onSavePressed = () => {
    if (label == "" || speechPhrase == "") {
      Alert.alert(
        "Validation Failed",
        "A label and spreech phrase (audio) should both be included",
        [{ text: "OK", onPress: () => {} }]
      );
      return;
    }

    const newItem = new speechButton(1, label, speechPhrase, null);

    addSpeechButton(newItem);
    resetInputs();
    router.push("/");
  };
  const resetInputs = () => {
    setLabel("");
    setSpeechPhrase("");
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.cameraContainer}>
        <View>
          <TouchableOpacity style={styles.camera} onPress={() => {}}>
            <CameraIcon />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <SafeAreaView>
            <View style={styles.container}>
              <TextInput style={styles.label} placeholder="LABEL" />
              <TextInput style={styles.label} placeholder="AUDIO" />
            </View>

            {/* Save buttons container */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => {}} style={styles.saveButton}>
                <XmarkSVG />
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          <SafeAreaView>
            <View style={styles.container}>
              <TextInput
                style={styles.label}
                placeholder="LABEL"
                value={label}
                onChangeText={(text) => setLabel(text)}
              />
              <TextInput
                style={styles.label}
                placeholder="AUDIO"
                value={speechPhrase}
                onChangeText={(text) => setSpeechPhrase(text)}
              />

              {/* Save buttons container */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => {
                    resetInputs();
                    router.push("/");
                  }}
                  style={styles.saveButton}
                >
                  <Image
                    source={require("../../assets/icons/xmark-square.svg")} // Change to PNG or SVG handling
                    style={styles.image}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onSavePressed()}
                  style={styles.saveButton}
                >
                  <CheckmarkSVG />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-end", // Align content at the bottom of the screen
    paddingBottom: 30, // Adjusted from 'bottom: 100'
    paddingHorizontal: 20,
  },

  container: {
    justifyContent: "flex-end", // Align everything to the bottom
    alignItems: "center",
    paddingBottom: 10, // Adjusted from 'bottom: 100'
    paddingHorizontal: 20,
    flex: 1, // Ensure this takes up the full height of the screen
  },

  formContainer: {
    justifyContent: "flex-end", // Ensures the form is aligned at the bottom
    alignItems: "center",
    marginBottom: 50, // Adjust this to give some breathing room
  },

  label: {
    height: 40,
    width: 230, // Adjusted width to fit side by side with buttons
    margin: 10,
    borderWidth: 1,
    padding: 10,
  },

  camera: {
    backgroundColor: "#4CAF50",
    width: 300,
    height: 300,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40, // Push camera button further down
  },

  cameraContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40, // Move camera button further down
  },

  buttonContainer: {
    flexDirection: "row", // Align the buttons next to each other
    justifyContent: "flex-start", // Space out buttons evenly within the container
    alignItems: "center", // Vertically center the buttons within the container
    marginTop: 20, // Adds spacing above the buttons
    width: "100%", // Set the container width to 100% of the parent
    paddingHorizontal: 4, // Add padding around the buttons
  },

  saveButton: {
    padding: 5,
    backgroundColor: "#4CAF50", // Example style
    borderRadius: 1,
    height: 75,
    width: 75,
    justifyContent: "center",
    alignItems: "center", // Center the icon within the button
  },
});

export default App;
