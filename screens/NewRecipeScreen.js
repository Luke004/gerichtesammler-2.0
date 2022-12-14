import { React, useState, useEffect } from "react";
import { Text, View, ScrollView, TextInput, Image, StyleSheet, TouchableOpacity, Dimensions, Platform } from "react-native";
import { Dialog } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { saveImagesToStorage } from '../util/StorageUtil';
import { AirbnbRating } from '@rneui/themed';
import * as ImagePicker from 'expo-image-picker';
import { createNewRecipe, getAllCategories, addImageToDatabase } from '../util/DatabaseUtil';

const recipeRatingDefault = 2;

function NewRecipeScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [images, setImages] = useState([]);
  const [imageIndex, setImageIndex] = useState([]);
  const [confirmDeleteImageDialogVisible, setConfirmDeleteImageDialogVisible] = useState(false);
  // text input states
  const [recipeName, setRecipeName] = useState("");
  const [recipeInstructions, setRecipeInstructions] = useState("");
  const [recipeDuration, setRecipeDuration] = useState("0");
  const [recipeRating, setRecipeRating] = useState(recipeRatingDefault);

  useEffect(() => {
    getAllCategories((results) => {
      setCategories(results);
      setSelectedCategory(results[0].category_id)
    })
  }, []);


  const handlePickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: Platform.OS == 'ios' ? false : true,
      quality: 0.5,
      exif: false
    });

    if (!result.cancelled) {
      setImages((prevImages) => [
        ...prevImages, result
      ]);
    }
  };

  const handleTakePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      console.log("No camera permission granted.")
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: Platform.OS == 'ios' ? false : true,
      quality: 0.5,
      exif: false
    });

    if (!result.cancelled) {
      setImages((prevImages) => [
        ...prevImages, result
      ]);
    }
  };

  const handleRemoveImage = (index) => {
    setImageIndex(index);
    toggleConfirmImageDeleteDialog();
  };

  const toggleConfirmImageDeleteDialog = () => {
    setConfirmDeleteImageDialogVisible(!confirmDeleteImageDialogVisible);
  };

  const removeImage = () => {
    setImages((prevImages) => {
      prevImages.splice(imageIndex, 1);
      return [...prevImages]
    });
    toggleConfirmImageDeleteDialog();
  };

  const handleAddNewRecipe = async () => {
    // create new recipe db entry
    const recipe = {
      name: recipeName,
      instructions: recipeInstructions,
      category: selectedCategory,
      rating: recipeRating,
      duration: recipeDuration
    }
    const recipeId = await createNewRecipe(recipe);

    // save images (if exist)
    const imgData = await saveImagesToStorage(images);
    if (imgData) {
      imgData.forEach((img) => {
        addImageToDatabase(recipeId, img);
      });
    }

    // go back to recipe list (main)
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 10 }}>

      <ScrollView scrollIndicatorInsets={{ right: 1 }}>

        <View>
          <Text style={styles.text}>
            Name
          </Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(value) => setRecipeName(value)}
            value={recipeName}
          />
        </View>

        <View>
          <Text style={styles.text}>
            Beschreibung
          </Text>
          <TextInput
            multiline={true}
            numberOfLines={3}
            style={[styles.textInput, { maxHeight: Math.round(Dimensions.get("window").height / 3) }]}
            onChangeText={(value) => setRecipeInstructions(value)}
            value={recipeInstructions}
          />
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
            style={{ fontSize: 18, padding: 5, backgroundColor: "white" }}
            itemStyle={{ height: 140 }}
          >
            {
              categories.map((category, index) => (
                <Picker.Item label={category.name} value={category.category_id} key={index} color={category.color} />
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
            onChangeText={(value) => setRecipeDuration(value)}
            value={recipeDuration}
          />
        </View>

        <View>
          <Text style={styles.text}>
            Bilder
          </Text>
          <View style={{ flexDirection: "row", marginBottom: 5 }}>
            {
              images.length == 0 &&
              <Text style={{ paddingVertical: 5 }}>Noch keine Bilder ausgew??hlt!</Text>
            }
            {
              images.map((image, index) => (
                <TouchableOpacity key={index} onPress={() => handleRemoveImage(index)}>
                  <Image source={{ uri: image.uri }} style={{ width: 50, height: 50 }}></Image>
                </TouchableOpacity>
              ))
            }
          </View>
          <View style={{ flexDirection: "row" }}>
            <Feather name="paperclip" size={35} color="black" style={{ marginRight: 10 }} onPress={handlePickImage} />
            <Ionicons name="camera" size={35} color="black" onPress={handleTakePhoto} />
          </View>
        </View>

        <View style={{ alignItems: "flex-start" }}>
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
              'Gro??artig',
              'Exzellent'
            ]}
            defaultRating={recipeRatingDefault}
            size={20}
            reviewSize={20}
            onFinishRating={(number) => setRecipeRating(number)}
          />
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddNewRecipe()}
          underlayColor='#fff'>
          <Text style={styles.addButtonText}>Hinzuf??gen</Text>
        </TouchableOpacity>

        <Dialog
          isVisible={confirmDeleteImageDialogVisible}
          onBackdropPress={toggleConfirmImageDeleteDialog}
        >
          <Dialog.Title title="L??schen best??tigen" />
          <Text>Ausgew??hltes Bild wirklich l??schen?</Text>
          <Dialog.Actions>
            <Dialog.Button title="Best??tigen" onPress={removeImage} />
            <Dialog.Button title="Abbrechen" onPress={toggleConfirmImageDeleteDialog} />
          </Dialog.Actions>
        </Dialog>

      </ScrollView>
    </View >
  );
}

const styles = StyleSheet.create({
  text: {
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 20,
    paddingBottom: 3
  },
  textInput: {
    backgroundColor: "white",
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey"
  },
  addButton: {
    margin: 10,
    backgroundColor: '#1E6738',
    padding: 10
  },
  addButtonText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
  },
});

export default NewRecipeScreen;