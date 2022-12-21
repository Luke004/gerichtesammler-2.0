import { React, useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Picker } from '@react-native-picker/picker';


const sortingOptions = ["Name", "Kategorie", "Bewertung", "Lange nicht zubereitet", "Dauer"]
const filterOptions = ["Kein Filter", "Name", "Kategorie", "Bewertung", "Zubereitet", "Dauer"]

function Settings({ navigation }) {
  const [selectedSorting, setSelectedSorting] = useState("Kategorie");
  const [selectedFilter, setSelectedFilter] = useState("Kein Filter");

  return (
    <View style={{ flex: 1, padding: 20 }}>

      <View style={{ width: "100%", alignItems: "center" }}>
        <Text style={styles.pickerInfoText}>Sortieren nach:</Text>
        <Picker
          selectedValue={selectedSorting}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedSorting(itemValue)
          }
          style={styles.picker}
        >
          {
            sortingOptions.map((sortingOption, index) => (
              <Picker.Item label={sortingOption} value={sortingOption} key={index} />
            ))
          }
        </Picker>

        <View style={styles.separator} />

        <Text style={styles.pickerInfoText}>Filtern nach:</Text>
        <Picker
          selectedValue={selectedFilter}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedFilter(itemValue)
          }
          style={styles.picker}
        >
          {
            filterOptions.map((filterOption, index) => (
              <Picker.Item label={filterOption} value={filterOption} key={index} />
            ))
          }
        </Picker>

        <View style={styles.separator} />

        <TouchableOpacity
          style={styles.editCategoriesButton}
          onPress={() => navigation.navigate('EditCategories')}
          underlayColor='#fff'>
          <Text style={styles.editCategoriesButtonText}>Kategorien bearbeiten</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  separator: {
    borderWidth: 0.5,
    borderColor: 'lightgrey',
    marginVertical: 20,
    width: "50%"
  },
  editCategoriesButton: {
    backgroundColor: '#1E6738',
    padding: 10
  },
  editCategoriesButtonText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
  },
  picker: {
    fontSize: 18,
    padding: 5
  },
  pickerInfoText: {
    fontSize: 20,
    marginBottom: 5
  }
});

export default Settings;