import { React, useState, useEffect } from "react";
import { Text, View, ScrollView, TextInput, Button, Image, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { Dialog } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { saveImagesToStorage, getImageAssets } from '../util/StorageUtil';
import { AirbnbRating } from '@rneui/themed';
import * as ImagePicker from 'expo-image-picker';
import { updateRecipe, getAllCategories, getRecipePictureNames, addImageToDatabase, removeImageAssetsForRecipe, getCategoryColorById } from '../util/DatabaseUtil';

let imageAssetsToRemove = [];

function EditRecipeScreen({ route, navigation }) {
  const recipe = route.params.recipe;

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(recipe.category_id);
  const [imageAssets, setImageAssets] = useState([]);
  const [assetIndex, setImageIndex] = useState([]);
  const [confirmDeleteImageDialogVisible, setConfirmDeleteImageDialogVisible] = useState(false);
  // text input states
  const [recipeName, setRecipeName] = useState(recipe.name);
  const [recipeInstructions, setRecipeInstructions] = useState(recipe.instructions);
  const [recipeDuration, setRecipeDuration] = useState(recipe.duration);
  const [recipeRating, setRecipeRating] = useState(recipe.rating);


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      imageAssetsToRemove = [];

      getAllCategories((results) => {
        setCategories(results);
      })

      if (Platform.OS !== "web") {
        getRecipePictureNames(recipe.recipe_id).then((images) => {
          getImageAssets(images).then((assets) => setImageAssets(assets));
        });
      }
    });
    return unsubscribe;
  }, [navigation]);


  const handlePickImage = async () => {
    // No permissions request is necessary for launching the imageAsset library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
      exif: false
    });

    const newAsset = result.assets[0];
    newAsset.isNew = true;

    if (!result.canceled) {
      setImageAssets((prevImages) => [
        ...prevImages, newAsset
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
      allowsEditing: true,
      quality: 0.5,
      exif: false
    });

    const newAsset = result.assets[0];
    newAsset.isNew = true;

    if (!result.canceled) {
      setImageAssets((prevImages) => [
        ...prevImages, newAsset
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
    imageAssetsToRemove.push(imageAssets[assetIndex]);
    setImageAssets((prevImages) => {
      prevImages.splice(assetIndex, 1);
      return [...prevImages]
    });
    toggleConfirmImageDeleteDialog();
  };

  const handleSaveRecipe = async () => {
    // update recipe db entry
    const updatedRecipe = {
      name: recipeName,
      instructions: recipeInstructions,
      category: selectedCategory,
      rating: recipeRating,
      duration: recipeDuration
    }
    updateRecipe(updatedRecipe, recipe.recipe_id);

    // remove deleted assets from db + storage
    removeImageAssetsForRecipe(recipe.recipe_id, imageAssetsToRemove);

    // save new images to db + storage
    const newImageAssets = [];
    imageAssets.forEach((asset) => {
      if (asset.isNew) {
        newImageAssets.push(asset);
      }
    })

    const imgFileNames = await saveImagesToStorage(newImageAssets);
    if (imgFileNames) {
      imgFileNames.forEach((fileName) => {
        addImageToDatabase(recipe.recipe_id, fileName);
      });
    }

    const routes = navigation.getState()?.routes;
    const prevRoute = routes[routes.length - 2];
    if (prevRoute.name === "RecipeDetail") {
      // if we come from RecipeDetail screen, add the other 2 recipe params so it will display the recipe correctly
      updatedRecipe.categoryColor = await getCategoryColorById(updatedRecipe.category);
      updatedRecipe.last_cooked = recipe.last_cooked;
      navigation.navigate("RecipeDetail", { recipe: updatedRecipe });
    } else {
      // go back to recipe list (main)
      navigation.goBack();
    }
  };

  return (
    <View style={{ justifyContent: "flex-start", padding: 10, gap: 10 }}>
      <ScrollView>

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
            editable
            multiline
            numberOfLines={3}
            style={styles.textInput}
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
            style={{ fontSize: 18, padding: 5 }}
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
          <View style={{ flexDirection: "row", gap: 3 }}>
            {
              imageAssets.length == 0 &&
              <Text style={{ paddingVertical: 5 }}>Noch keine Bilder ausgewählt!</Text>
            }
            {
              imageAssets.map((imageAsset, index) => (
                <TouchableOpacity key={index} onPress={() => handleRemoveImage(index)}>
                  <Image source={{ uri: imageAsset.uri }} style={{ width: 50, height: 50, marginRight: 5 }}></Image>
                </TouchableOpacity>
              ))
            }
          </View>
          <View style={{ flexDirection: "row", gap: 5 }}>
            <Feather name="paperclip" size={35} color="black" onPress={handlePickImage} />
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
              'Großartig',
              'Exzellent'
            ]}
            defaultRating={recipe.rating}
            size={20}
            reviewSize={20}
            onFinishRating={(number) => setRecipeRating(number)}
          />
        </View>

        <Button
          title="Speichern"
          onPress={() => handleSaveRecipe()}
        />

        <Dialog
          isVisible={confirmDeleteImageDialogVisible}
          onBackdropPress={toggleConfirmImageDeleteDialog}
        >
          <Dialog.Title title="Löschen bestätigen" />
          <Text>Ausgewähltes Bild wirklich löschen?</Text>
          <Dialog.Actions>
            <Dialog.Button title="Bestätigen" onPress={removeImage} />
            <Dialog.Button title="Abbrechen" onPress={toggleConfirmImageDeleteDialog} />
          </Dialog.Actions>
        </Dialog>

      </ScrollView>
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

export default EditRecipeScreen;