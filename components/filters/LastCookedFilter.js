import { React, useState } from "react";
import { StyleSheet, View, Text, TextInput, Platform } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { getInitialOperator, getInitialValue, buildFilterCriteria, isValid } from '../../util/FilterUtil';

const LAST_COOKED_OPTIONS = ["länger als", "kürzer als"];

export const LastCookedFilter = (props) => {
  const [lastCookedOperator, setLastCookedOperator] = useState(getInitialOperator(props.initialValue));
  const [lastCookedDays, setLastCookedDays] = useState(getInitialValue(props.initialValue));

  return (
    <View style={{ alignItems: "center", marginTop: 5 }}>
      <Text>Zuletzt zubereitet (Tage)</Text>
      <View style={{ width: "100%", flexDirection: "row", alignItems: "center" }}>
        <Picker
          selectedValue={lastCookedOperator}
          onValueChange={(itemValue, itemIndex) => {
            setLastCookedOperator(itemValue);
            if (isValid(lastCookedDays)) {
              props.onValueChange(buildFilterCriteria(itemValue, lastCookedDays));
            }
          }}
          style={styles.picker}
          itemStyle={{ height: 120 }}
        >
          {
            LAST_COOKED_OPTIONS.map((rating, index) => (
              <Picker.Item label={rating} value={index} key={index} />
            ))
          }
        </Picker>
        <TextInput
          style={{ width: 50, backgroundColor: "white", borderBottomWidth: 1, borderBottomColor: "lightgrey", fontSize: 20, marginRight: 5 }}
          keyboardType={"numeric"}
          onChangeText={(value) => setLastCookedDays(value)}
          onBlur={() => {
            if (isValid(lastCookedDays)) {
              props.onBlur(buildFilterCriteria(lastCookedOperator, lastCookedDays));
            }
          }}
          value={lastCookedDays}
        />
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
    width: 175,
    fontSize: 18,
    backgroundColor: Platform.OS != "ios" ? "white" : "",
    padding: 5,
    marginTop: 2,
    marginRight: 5
  }
});