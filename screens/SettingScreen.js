import React from "react";
import { Text, View, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Settings = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <Button title="Kategorien bearbeiten" onPress={() => navigation.navigate('EditCategories')}></Button>
    </View>
  );
};

export default Settings;