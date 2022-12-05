import { React, useState } from "react";
import { Text, View, TextInput, Button, Image, StyleSheet } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import { AirbnbRating } from '@rneui/themed';

const categories = ["Fleisch", "Vegetarisch", "Suppe"]


function NewRecipeScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState();
  const [images, setImages] = useState([]);

  const handleSelectImage = () => {
    launchImageLibrary({
      mediaType: "photo",
      saveToPhotos: false,
      selectionLimit: false
    }, (res) => {
      const selectedImages = res.assets;
      setImages((prevImages) => [
        ...prevImages, ...selectedImages
      ]);

    })
  };

  return (
    <View style={{ justifyContent: "flex-start", padding: 10, gap: 10 }}>
      <View>
        <Text style={styles.text}>
          Name
        </Text>
        <TextInput style={styles.textInput} />
      </View>

      <View>
        <Text style={styles.text}>
          Beschreibung
        </Text>
        <TextInput
          editable
          multiline
          numberOfLines={3}
          style={styles.textInput} />
      </View>

      <View>
        <Text style={styles.text}>
          Kategorie
        </Text>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedCategory(itemValue)
          }
          style={{ fontSize: 18, padding: 5 }}
        >
          {
            categories.map((category, index) => (
              <Picker.Item label={category} value={category} key={index} />
            ))
          }
        </Picker>
      </View>

      <View>
        <Text style={styles.text}>
          Dauer (Min.)
        </Text>
        <TextInput
          keyboardType="numeric"
          style={[styles.textInput, { width: "50%" }]}
        />
      </View>

      <View>
        <Text style={styles.text}>
          Bilder
        </Text>
        <View style={{ flexDirection: "row", gap: 3 }}>
          {
            images.length == 0 ? <Text style={{ paddingVertical: 5 }}>Noch keine Bilder ausgewählt!</Text> : ""
          }
          {
            images.map((image, index) => (
              <Image key={index} source={{ uri: image.uri }} style={{ width: 50, height: 50 }}  ></Image>
            ))
          }
        </View>
        <View style={{ flexDirection: "row", gap: 5 }}>
          <Feather name="paperclip" size={35} color="black" onPress={handleSelectImage} />
          <Ionicons name="camera" size={35} color="black" />
        </View>
      </View>

      <View style={{alignItems: "flex-start"}}>
        <Text style={styles.text}>
          Bewertung
        </Text>
        <AirbnbRating
          ratingContainerStyle={{ flexDirection: "row-reverse" }}
          count={5}
          reviews={[
            'Okay',
            'Gut',
            'Lecker',
            'Großartig',
            'Exzellent'
          ]}
          defaultRating={2}
          size={20}
          reviewSize={20}
        />
      </View>

      <Button
        title="Rezept Hinzufügen"
      />

    </View >
  );
}

const styles = StyleSheet.create({
  text: {
    fontWeight: "bold",
    fontSize: 18,
    paddingBottom: 3
  },
  textInput: {
    fontSize: 20,
    border: "1px solid black",
    backgroundColor: "white"
  },
});

export default NewRecipeScreen;