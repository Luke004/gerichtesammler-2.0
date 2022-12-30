import { React, useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { getAllCategories } from '../../util/DatabaseUtil';


export const CategoryFilter = (props) => {
  const [categories, setCategories] = useState();
  const [categoryFilter, setCategoryFilter] = useState(props.initialValue);

  useEffect(() => {
    getAllCategories((results) => {
      setCategories(results);
    })
  }, []);

  return (
    <View style={{ alignItems: "center", marginTop: 5 }}>
      <Text>Kategorie</Text>
      <View style={{ width: "100%", flexDirection: "row", alignItems: "center" }}>
        <Picker
          selectedValue={categoryFilter}
          onValueChange={(itemValue, itemIndex) => {
            setCategoryFilter(itemValue);
            props.onValueChange(itemValue);
          }}
          style={styles.picker}
          itemStyle={{ height: 120 }}
        >
          {
            categories &&
            categories.map((category, index) => (
              <Picker.Item label={category.name} value={category.category_id} key={index} color={category.color} />
            ))
          }
        </Picker>
        <AntDesign name="delete"
          size={30}
          color="#006600"
          onPress={() => props.onDeletePress()}
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  picker: {
    width: 230,
    fontSize: 18,
    padding: 5,
    marginTop: 2,
    marginRight: 5
  }
});