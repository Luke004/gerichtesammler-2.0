import { React, useState, useEffect } from "react";
import { Text, View, TextInput, Button, Image, StyleSheet, ScrollView } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import ColorPicker from 'react-native-wheel-color-picker'
import { Dialog } from '@rneui/themed';
import { getAllCategories, updateCategoriesDatabase, removeCategoryFromDatabase } from '../util/DatabaseUtil'

let categoryToDeleteIdx = -1;
let categoryToChangeColorIdx = -1;

let categoriesReference;

function EditCategoriesScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [removeCategoryDialogVisible, setRemoveCategoryDialogVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState();
  const [nameChange, setNameChange] = useState({});
  categoriesReference = categories;

  useEffect(() => {
    getAllCategories((results) => {
      setCategories(results);
    })
  }, []);

  useEffect(() => {
    // this listener is called when user leaves this screen
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      // for some reason state 'categories' is empty here so we use a reference to it which still has them
      updateCategoriesDatabase(categoriesReference);
    });
    return unsubscribe;
  }, [navigation]);

  const addNewCategory = () => {
    setCategories((prevCategories) => {
      const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
      prevCategories.push({ id: Math.random(), name: "Kategorie " + (prevCategories.length + 1), color: randomColor });
      return [...prevCategories]
    });
  };

  const handleColorPickerPress = (category, index) => {
    categoryToChangeColorIdx = index;
    setSelectedColor(category.color)
    setColorPickerVisible(true);
  };

  const handleChangeColor = (color) => {
    categories[categoryToChangeColorIdx].wasChanged = true;
    setSelectedColor(color);
    categories[categoryToChangeColorIdx].color = color;
  };

  const handleChangeText = (value, index) => {
    categories[index].wasChanged = true;
    setNameChange(value);
    categories[index].name = value;
  };

  const handleCategoryDeletePress = (index) => {
    categoryToDeleteIdx = index;
    setRemoveCategoryDialogVisible(true);
  };

  const handleCategoryDelete = () => {
    const category = categories[categoryToDeleteIdx];

    if (!category.category_id) {
      // category was not in db yet - just remove locally
      removeCategoryFromList(categoryToDeleteIdx);
    } else {
      removeCategoryFromDatabase(category, () => {
        removeCategoryFromList(categoryToDeleteIdx);
      });
    }
    setRemoveCategoryDialogVisible(false);
    categoryToDeleteIdx = -1;
  };

  const removeCategoryFromList = (index) => {
    setCategories((prevCategories) => {
      prevCategories.splice(index, 1);
      return [...prevCategories]
    });
  };

  return (
    <View style={{ display: "flex", flex: 1, justifyContent: "flex-start" }}>

      <ScrollView style={{ flexBasis: 0 }}>
        {
          categories.map((category, index) => (
            <View key={index} style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", marginBottom: 1 }}>
              <TextInput
                style={styles.textInput}
                value={category.name}
                onChangeText={(value) => handleChangeText(value, index)}
              />
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: category.color
                }}>
                <Entypo name="round-brush" size={24} color="black" onPress={() => handleColorPickerPress(category, index)} />
              </View>

              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "white"
                }}>
                <AntDesign name="delete" size={24} color="black" onPress={() => handleCategoryDeletePress(index)} />
              </View>
            </View>

          ))
        }
      </ScrollView>

      <Dialog
        isVisible={colorPickerVisible}
        onBackdropPress={() => setColorPickerVisible(false)}
      >
        <View style={{ marginBottom: 20 }}>
          <Dialog.Title title="Farbe wählen" />
        </View>
        <ColorPicker
          color={selectedColor}
          onColorChangeComplete={(color) => handleChangeColor(color)}
          thumbSize={40}
          sliderSize={40}
          noSnap={true}
          gapSize={10}
          row={false}
          swatchesLast={false}
        />
        <View style={{ justifyContent: "center", marginTop: 20 }}>
          <Dialog.Button title="FERTIG" onPress={() => setColorPickerVisible(false)} />
        </View>
      </Dialog>

      <Dialog
        isVisible={removeCategoryDialogVisible}
        onBackdropPress={() => setRemoveCategoryDialogVisible(false)}
      >
        <Dialog.Title title="Löschen bestätigen" />
        <Text>Kategorie "{categoryToDeleteIdx != -1 ? categories[categoryToDeleteIdx].name : ""}" wirklich löschen?</Text>
        <Dialog.Actions>
          <Dialog.Button title="Bestätigen" onPress={() => handleCategoryDelete()} />
          <Dialog.Button title="Abbrechen" onPress={() => setRemoveCategoryDialogVisible(false)} />
        </Dialog.Actions>
      </Dialog>

      <AntDesign name="pluscircleo"
        size={70}
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
        }}
        color="#006600"
        onPress={() => addNewCategory()}
      />

    </View >
  );
}

const styles = StyleSheet.create({
  textInput: {
    flex: 4,
    fontSize: 20,
    backgroundColor: "white",
    padding: 10
  }
});

export default EditCategoriesScreen;