import { React, useState } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { getInitialOperator, getInitialValue, buildFilterCriteria, isValid } from '../../util/FilterUtil';

const DURATION_OPTIONS = ["länger als", "kürzer als"];

export const DurationFilter = (props) => {
  const [durationOperator, setDurationOperator] = useState(getInitialOperator(props.initialValue));
  const [durationDays, setDurationDays] = useState(getInitialValue(props.initialValue));

  return (
    <View style={{ alignItems: "center", marginTop: 5 }}>
      <Text>Dauer (Minuten)</Text>
      <View style={{ width: "100%", flexDirection: "row", alignItems: "center" }}>
        <Picker
          selectedValue={durationOperator}
          onValueChange={(itemValue, itemIndex) => {
            setDurationOperator(itemValue);
            if (isValid(durationDays)) {
              props.onValueChange(buildFilterCriteria(itemValue, durationDays));
            }
          }}
          style={styles.picker}
          itemStyle={{ height: 120 }}
        >
          {
            DURATION_OPTIONS.map((rating, index) => (
              <Picker.Item label={rating} value={index} key={index} />
            ))
          }
        </Picker>
        <TextInput
          style={{ width: 50, backgroundColor: "white", borderBottomWidth: 1, borderBottomColor: "lightgrey", fontSize: 20, marginRight: 5 }}
          keyboardType={"numeric"}
          onChangeText={(value) => setDurationDays(value)}
          onBlur={() => {
            if (isValid(durationDays)) {
              props.onBlur(buildFilterCriteria(durationOperator, durationDays));
            }
          }}
          value={durationDays}
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
    padding: 5,
    marginTop: 2,
    marginRight: 5
  }
});