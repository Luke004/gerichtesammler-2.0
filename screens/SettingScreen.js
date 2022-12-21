import { React, useState, useEffect } from "react";
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { SORTING_OPTIONS_FRIENDLY, SORTING_OPTIONS_DB, FILTER_OPTIONS_FRIENDLY, FILTER_OPTIONS_DB } from '../util/SettingsUtil';
import { getSortingCriteria, setSortingCriteria, getFilterCriteria, setFilterCriteria, getAllCategories } from '../util/DatabaseUtil';

let sortingEntryId;
let filterEntryId;

function Settings({ navigation }) {
  const [selectedSorting, setSelectedSorting] = useState();
  const [selectedFilter, setSelectedFilter] = useState();
  const [categories, setCategories] = useState();

  const [nameFilter, setNameFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");


  useEffect(() => {
    getAllCategories((results) => {
      setCategories(results);
    })

    getSortingCriteria().then((result) => {
      setSelectedSorting(result.criteria);
      sortingEntryId = result.id;
    });

    getFilterCriteria().then((result) => {
      setSelectedFilter(result.type);
      filterEntryId = result.id;

      switch (result.type) {
        case "name":
          setNameFilter(result.criteria);
          break;
        case "category":
          console.log("result.criteria")
          console.log(result.criteria)
          setCategoryFilter(result.criteria);
          break;
      }

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
          onValueChange={(itemValue, itemIndex) => {
            setSelectedFilter(itemValue);
            if (itemValue === "none") {
              console.log(itemValue)
              setFilterCriteria(filterEntryId, "none")
            }
          }}
          style={styles.picker}
        >
          {
            FILTER_OPTIONS_FRIENDLY.map((filterOption, index) => (
              <Picker.Item label={filterOption} value={FILTER_OPTIONS_DB[index]} key={index} />
            ))
          }
        </Picker>

        {
          selectedFilter == "name" &&
          <View style={{ marginTop: 10 }}>
            <TextInput
              style={{ backgroundColor: "white", border: "1px solid black", fontSize: 20 }}
              onChangeText={(value) => setNameFilter(value)}
              onBlur={() => {
                if (nameFilter.replace(/\s/g, '').length) { // whitespace only check
                  setFilterCriteria(filterEntryId, "name", nameFilter);
                }
              }}
              value={nameFilter}
            />
          </View>
        }

        {
          selectedFilter == "category" &&
          <View style={{ marginTop: 10 }}>
            <Picker
              selectedValue={categoryFilter}
              onValueChange={(itemValue, itemIndex) => {
                setCategoryFilter(itemValue);
                setFilterCriteria(filterEntryId, "category", itemValue);
              }}
              style={styles.picker}
            >
              {
                categories.map((category, index) => (
                  <Picker.Item label={category.name} value={category.category_id} key={index} />
                ))
              }
            </Picker>
          </View>
        }

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