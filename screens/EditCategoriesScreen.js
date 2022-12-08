import { React, useState } from "react";
import { Text, View, TextInput, Button, Image, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import ColorPicker from 'react-native-wheel-color-picker'
import { Dialog } from '@rneui/themed';

function EditCategoriesScreen({ navigation }) {
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedColor, setSelectedColor] = useState();

  const categories = [{ id: 1, name: "myCategory1", color: "#74eb34" }, { id: 2, name: "myCategory2", color: "#eb8634" }]

  const addNewCategory = () => {

  };

  const handleColorPickerPress = (category) => {
    setSelectedColor(category.color)
    setSelectedCategory(category)
    setColorPickerVisible(true);
  };

  const handleCategoryColorChange = (color) => {
    setSelectedColor(color);
    selectedCategory.color = color;
  };

  return (

    <View style={{ flex: 1, justifyContent: "flex-start", padding: 5 }}>

      <View style={{ width: '100%', gap: 4 }}>
        {
          categories.map((category, index) => (
            <View key={index} style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start" }}>
              <TextInput
                style={styles.textInput}
                value={category.name}
              />
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: selectedCategory && (category.id == selectedCategory.id) ? selectedColor : category.color
                }}>
                <Entypo name="round-brush" size={24} color="black" onPress={() => handleColorPickerPress(category)} />
              </View>
            </View>

          ))
        }
      </View>

      <Dialog
        isVisible={colorPickerVisible}
        onBackdropPress={() => setColorPickerVisible(false)}
      >
        <View style={{ marginBottom: 20 }}>
          <Dialog.Title title="Farbe wählen" />
        </View>
        <ColorPicker
          color={selectedColor}
          onColorChangeComplete={(color) => handleCategoryColorChange(color)}
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



      <AntDesign name="pluscircleo"
        size={70}
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
        }}
        color="#006600"
        onPress={() => addNewCategory}
      />

    </View >
  );
}

const styles = StyleSheet.create({
  textInput: {
    flex: 3,
    fontSize: 20,
    backgroundColor: "white",
    padding: 10
  }
});

export default EditCategoriesScreen;