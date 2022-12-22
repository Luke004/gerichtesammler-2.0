import { React, useState } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const LAST_COOKED_OPTIONS = ["länger als", "kürzer als"];

export const LastCookedFilter = (props) => {
  const [lastCookedFilter, setLastCookedFilter] = useState("");
  const [lastCookedDays, setLastCookedDays] = useState("");

  return (
    <View style={{ alignItems: "center", marginTop: 5 }}>
      <Text>Zuletzt zubereitet (Tage)</Text>
      <View style={{ width: "100%", flexDirection: "row", alignItems: "center" }}>
        <Picker
          selectedValue={lastCookedFilter}
          onValueChange={(itemValue, itemIndex) => {
            setLastCookedFilter(itemValue);
            //setFilterCriteria(filterEntryId, "category", itemValue);
          }}
          style={styles.picker}
        >
          {
            LAST_COOKED_OPTIONS.map((rating, index) => (
              <Picker.Item label={rating} value={rating} key={index} />
            ))
          }
        </Picker>
        <TextInput
          style={{ width: 50, backgroundColor: "white", border: "1px solid black", fontSize: 20, marginRight: 5 }}
          onChangeText={(value) => setLastCookedDays(value)}
          onBlur={() => {
            if (lastCookedDays.replace(/\s/g, '').length) { // whitespace only check
              //setFilterCriteria(filterEntryId, "name", lastCookedDays);
              props.onBlur(lastCookedDays);
            }
          }}
          value={lastCookedDays}
        />
        <AntDesign name="delete"
          size={30}
          color="#006600"
          onPress={() => addNewCategory()}
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  picker: {
    width: 175,
    backgroundColor: "white",
    fontSize: 18,
    padding: 5,
    marginTop: 2,
    marginRight: 5
  }
});