import { React, useState } from "react";
import { View, Text, TextInput } from "react-native";
import { AntDesign } from '@expo/vector-icons';


export const NameFilter = (props) => {
  const [nameFilter, setNameFilter] = useState(props.initialValue);

  return (
    <View style={{ alignItems: "center", marginTop: 5 }}>
      <Text>Name</Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          style={{ width: 230, backgroundColor: "white", borderBottomWidth: 1, borderBottomColor: "lightgrey", fontSize: 20, marginRight: 5 }}
          onChangeText={(value) => setNameFilter(value)}
          onBlur={() => {
            if (nameFilter.replace(/\s/g, '').length) { // whitespace only check
              props.onBlur(nameFilter);
            }
          }}
          value={nameFilter}
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