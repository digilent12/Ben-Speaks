import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Dimensions } from "react-native";
import CheckmarkSVG from "@/assets/icons/checkmark";
import speechButton from "../models/speech-button";
import { addSpeechButton } from "../services/database-service";
import { router } from "expo-router";

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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <SafeAreaView style={styles.cameraContainer}>
            <View>
              <TouchableOpacity style={styles.camera} onPress={() => {}}>
                {/* You may want to change this to a PNG or use react-native-svg for SVG */}
                <Image
                  source={require("../../assets/icons/camera.svg")} // Change to PNG or SVG handling
                  style={styles.image}
                />
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
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 30, // Adjusted from 'bottom: 100'
  },

  container: {
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 10, // Adjusted from 'bottom: 100'
    paddingHorizontal: 20,
  },

  label: {
    height: 40,
    width: 300, // Dynamic width based on screen size
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
  },

  cameraContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 1,
  },

  image: {
    height: 75,
    width: 75,
  },

  buttonContainer: {
    flexDirection: "row", // Align the buttons next to each other
    justifyContent: "space-evenly", // Space out buttons evenly within the container
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
