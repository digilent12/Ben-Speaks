import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Text,
  Button,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import CameraIcon from "@/assets/icons/camera";
import CheckmarkSVG from "@/assets/icons/checkmark";
import speechButton from "./models/speech-button";
import {
  addSpeechButton,
  getSpeechButtonById,
  updateSpeechButton,
} from "./services/database-service";
import { router, useLocalSearchParams } from "expo-router";
import XmarkSVG from "@/assets/icons/xmark";
import ImageGetter from "./utilities/image_taker";
import ImageTaker from "./utilities/image_picker";

const App = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<speechButton | undefined | null>(undefined);

  const [modalVisible, setModalVisible] = useState(false);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [label, setLabel] = useState<string>("");
  const [speechPhrase, setSpeechPhrase] = useState<string>("");
  const handleImagePicker = async () => {
    const image = await ImageGetter();
    setBase64Image(image);
    setModalVisible(false);
  };
  const handleImageTaker = async () => {
    const image = await ImageTaker();
    setBase64Image(image);
    setModalVisible(false);
  };

  const isInvalidRequest = () => {
    return label == "" || speechPhrase == "";
  };

  const raiseValidationAlert = () => {
    Alert.alert(
      "Validation Failed",
      "A label and spreech phrase (audio) should both be included",
      [{ text: "OK", onPress: () => {} }]
    );
  };

  const isRequestAnUpdate = () => {
    return id !== undefined && id !== null;
  };

  const onSavePressed = () => {
    if (isRequestAnUpdate()) {
      if (isInvalidRequest()) {
        raiseValidationAlert();
        return;
      }
      if (item !== undefined && item !== null) {
        item.label = label;
        item.speech_phrase = speechPhrase;
        updateSpeechButton(item);
      }
    } else {
      if (isInvalidRequest()) {
        raiseValidationAlert();
        return;
      }
      const newItem = new speechButton(1, label, speechPhrase, base64Image);

      addSpeechButton(newItem);
    }
    resetInputs();
    router.push("/");
  };

  const resetInputs = () => {
    setLabel("");
    setSpeechPhrase("");
    setItem(undefined);
  };

  useEffect(() => {
    if (isRequestAnUpdate()) {
    }
    const populateSpeechButtonData = async () => {
      const speechButton = await getSpeechButtonById(Number(id));

      return speechButton;
    };

    populateSpeechButtonData().then((data) => {
      if (data !== undefined && data !== null) {
        setItem(data);
        setLabel(data.label);
        setSpeechPhrase(data.speech_phrase);
      }
    });
  }, []);

  return (
    <SafeAreaProvider>
      <View>
        <Modal
          animationType="slide"
          visible={modalVisible}
          transparent={true}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                Would you like to select an image from library or take one?
              </Text>
              <Button
                title="Select an image from library"
                onPress={() => {
                  handleImagePicker();
                }}
              />
              <Button
                title="Take photo with camera"
                onPress={() => {
                  handleImageTaker();
                }}
              />
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          automaticallyAdjustKeyboardInsets
        >
          <SafeAreaView style={styles.cameraContainer}>
            <View>
              <TouchableOpacity
                style={styles.camera}
                onPress={() => {
                  setModalVisible(true);
                }}
              >
                {!base64Image && <CameraIcon />}
                {base64Image && (
                  <Image
                    style={styles.image}
                    source={{ uri: `data:image/jpeg;base64,${base64Image}` }}
                  />
                )}
              </TouchableOpacity>
            </View>
          </SafeAreaView>
          <SafeAreaView style={styles.container}>
            <View style={styles.formContainer}>
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
                  <XmarkSVG />
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
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  image: {
    height: 250,
    width: 250,
    top: 25,
    alignSelf: "center",
  },
});

export default App;
