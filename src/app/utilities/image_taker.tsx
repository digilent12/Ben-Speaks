import { useState } from "react";
import { Button, Image, View, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default async function ImageTaker(): Promise<string | null> {
  //const [image, setImage] = useState<string | null>(null);
  //const [base64Image, setBase64Image] = useState<string | null>(null);
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      throw new Error("Permission to access media library is required!");
    }
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      //setImage(asset.uri)
      //setBase64Image(asset.base64 || null);
      return asset.base64;
    }
    //console.log(base64Image)
  };

  let base64Image = await pickImage();
  if (base64Image) {
    return base64Image;
  } else {
    return null;
  }
}
