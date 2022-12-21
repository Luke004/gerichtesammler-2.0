import { React, useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { SORTING_OPTIONS_FRIENDLY, SORTING_OPTIONS_DB, SORTING_OPTIONS, FILTER_OPTIONS_FRIENDLY, FILTER_OPTIONS_DB } from '../util/SettingsUtil';
import { getSortingCriteria, setSortingCriteria } from '../util/DatabaseUtil';

let sortingEntryId;

function Settings({ navigation }) {
  const [selectedSorting, setSelectedSorting] = useState();
  const [selectedFilter, setSelectedFilter] = useState("Kein Filter");

  useEffect(() => {
    getSortingCriteria().then((result) => {
      setSelectedSorting(result.criteria);
      sortingEntryId = result.id;
    });
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>

      <View style={{ width: "100%", alignItems: "center" }}>
        <Text style={styles.pickerInfoText}>Sortieren nach:</Text>
        <Picker
          selectedValue={selectedSorting}
          onValueChange={(itemValue, itemIndex) => {
            setSelectedSorting(itemValue);
            setSortingCriteria(sortingEntryId, SORTING_OPTIONS_DB[itemIndex]);
          }}
          style={styles.picker}
        >
          {
            SORTING_OPTIONS_FRIENDLY.map((sortingOption, index) => (
              <Picker.Item label={sortingOption} value={SORTING_OPTIONS_DB[index]} key={index} />
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
            FILTER_OPTIONS_FRIENDLY.map((filterOption, index) => (
              <Picker.Item label={filterOption} value={FILTER_OPTIONS_DB[index]} key={index} />
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