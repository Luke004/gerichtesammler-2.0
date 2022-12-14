import { React, useState } from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const RATING_OPTIONS = ["1 Stern", "2 Sterne", "3 Sterne", "4 Sterne", "5 Sterne"];

export const RatingFilter = (props) => {
  const [ratingFilter, setRatingFilter] = useState(props.initialValue);

  return (
    <View style={{ alignItems: "center", marginTop: 5 }}>
      <Text>Bewertung</Text>
      <View style={{ width: "100%", flexDirection: "row", alignItems: "center" }}>
        <Picker
          selectedValue={ratingFilter}
          onValueChange={(itemValue) => {
            setRatingFilter(itemValue);
            props.onValueChange(itemValue);
          }}
          style={styles.picker}
          itemStyle={{ height: 120 }}
        >
          {
            RATING_OPTIONS.map((rating, index) => (
              <Picker.Item label={rating} value={index + 1} key={index} />
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
    backgroundColor: Platform.OS != "ios" ? "white" : "",
    padding: 5,
    marginTop: 2,
    marginRight: 5
  }
});