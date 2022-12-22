import { React, useState, useEffect } from "react";
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { AntDesign } from '@expo/vector-icons';
import { SORTING_OPTIONS_FRIENDLY, SORTING_OPTIONS_DB, FILTER_OPTIONS_FRIENDLY, FILTER_OPTIONS_DB } from '../util/SettingsUtil';
import { getSortingCriteria, setSortingCriteria, getFilterCriteria, setFilterCriteria, getAllCategories } from '../util/DatabaseUtil';

import { NameFilter } from '../components/filters/NameFilter';
import { CategoryFilter } from '../components/filters/CategoryFilter';
import { RatingFilter } from '../components/filters/RatingFilter';
import { LastCookedFilter } from '../components/filters/LastCookedFilter';
import { DurationFilter } from '../components/filters/DurationFilter';

let sortingEntryId;
let filterEntryId;

function Settings({ navigation }) {
  const [selectedSorting, setSelectedSorting] = useState();
  const [selectedFilter, setSelectedFilter] = useState(0);

  const [nameFilterIds, setNameFilterIds] = useState([]);



  useEffect(() => {
    setSelectedFilter(FILTER_OPTIONS_DB[0]); // TODO change with actual DB data
    /*

    getSortingCriteria().then((result) => {
      setSelectedSorting(result.criteria);
      sortingEntryId = result.id;
    });

    getFilterCriteria().then((filter) => {
      setSelectedFilter(filter.type);
      filterEntryId = filter.id;

      switch (filter.type) {
        case "name":
          setNameFilter(filter.criteria);
          break;
        case "category":
          setCategoryFilter(Number(filter.criteria));
          break;
      }

    });
    */

  }, []);


  const addNewFilter = () => {
    switch (selectedFilter) {
      case "name":
        setNameFilterIds([...nameFilterIds, nameFilterIds.length]);
        break;
      case "category":
      case "rating":
      case "last_cooked":
      case "duration":
    }
  };

  let myNameFilterArray = nameFilterIds.map((item, key) => {
    return (
      <NameFilter key={item} onBlur={(a) => console.log(item)} ></NameFilter>
    );
  });


  return (

    <View style={{ width: "100%", padding: 30 }}>

      <View style={{ width: "100%", alignItems: "center" }}>

        <TouchableOpacity
          style={styles.editCategoriesButton}
          onPress={() => navigation.navigate('EditCategories')}
          underlayColor='#fff'>
          <Text style={styles.editCategoriesButtonText}>Kategorien bearbeiten</Text>
        </TouchableOpacity>

        <View style={styles.separator} />

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

        <Text style={styles.pickerInfoText}>Filter:</Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
          <Picker
            selectedValue={selectedFilter}
            onValueChange={(itemValue, itemIndex) => {
              setSelectedFilter(itemValue);
            }}
            style={[styles.picker, { marginRight: 5 }]}
          >
            {
              FILTER_OPTIONS_FRIENDLY.map((filterOption, index) => (
                <Picker.Item label={filterOption} value={FILTER_OPTIONS_DB[index]} key={index} />
              ))
            }
          </Picker>
          <AntDesign name="pluscircleo"
            size={30}
            color="#006600"
            onPress={() => addNewFilter()}
          />
        </View>

        {
          myNameFilterArray
        }

        <CategoryFilter></CategoryFilter>
        <RatingFilter></RatingFilter>
        <LastCookedFilter></LastCookedFilter>
        <DurationFilter></DurationFilter>

      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  separator: {
    borderWidth: 0.5,
    borderColor: 'lightgrey',
    marginVertical: 20,
    width: "100%"
  },
  filterSeparator: {
    width: "30%"
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
    width: 230,
    backgroundColor: "white",
    fontSize: 18,
    padding: 5
  },
  pickerInfoText: {
    fontSize: 20,
    marginBottom: 5
  }
});

export default Settings;