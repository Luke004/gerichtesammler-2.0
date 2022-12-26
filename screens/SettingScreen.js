import { React, useState, useEffect } from "react";
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { AntDesign } from '@expo/vector-icons';
import { SORTING_OPTIONS_FRIENDLY, SORTING_OPTIONS_DB } from '../util/SortUtil';
import { FILTER_OPTIONS_DB, FILTER_OPTIONS_FRIENDLY } from '../util/FilterUtil';
import { getSortingMethod, getFilters, setSortingCriteria, addFilter, updateFilter, removeFilter } from '../util/DatabaseUtil';

import { NameFilter } from '../components/filters/NameFilter';
import { CategoryFilter } from '../components/filters/CategoryFilter';
import { RatingFilter } from '../components/filters/RatingFilter';
import { LastCookedFilter } from '../components/filters/LastCookedFilter';
import { DurationFilter } from '../components/filters/DurationFilter';

let sortingEntryId;

function Settings({ navigation }) {
  const [selectedSorting, setSelectedSorting] = useState();
  const [selectedFilter, setSelectedFilter] = useState(0);

  const [filters, setFilters] = useState([]);


  useEffect(() => {
    setSelectedFilter(FILTER_OPTIONS_DB[0]);

    getSortingMethod().then((result) => {
      setSelectedSorting(result.criteria);
      sortingEntryId = result.id;
    });

    getFilters().then((filters) => {
      if (!filters) return;
      const myFilters = [];
      for (const filter of filters) {
        myFilters.push({ id: filter.filter_id, type: filter.type, value: filter.criteria });
      }
      setFilters(myFilters);
    });

  }, []);


  const handleNewFilterPress = () => {
    let initialValue;
    switch (selectedFilter) {
      case "name":
        initialValue = "";
        break;
      case "rating":
        initialValue = 3;
        break;
      case "last_cooked":
        initialValue = "s 31";
        break;
      case "duration":
        initialValue = "s 60";
        break;
    }

    addFilter(selectedFilter, initialValue).then((insertId) => {
      setFilters([...filters, { id: insertId, type: selectedFilter, value: initialValue }]);
    })
  };

  const handleRemoveFilterPress = (filterId) => {
    removeFilter(filterId).then(() => {
      console.log(filters)
      setFilters(
        filters.filter(f =>
          f.id !== filterId
        )
      );
    })
  };

  let myFilters = filters.map((item, key) => {
    switch (item.type) {
      case "name":
        return (
          <NameFilter key={item.id}
            initialValue={item.value}
            onBlur={(value) => updateFilter(item.id, "name", value)}
            onDeletePress={() => handleRemoveFilterPress(item.id)}
          />
        );
      case "category":
        return (
          <CategoryFilter key={item.id}
            initialValue={item.value}
            onValueChange={(value) => updateFilter(item.id, "category", value)}
            onDeletePress={() => handleRemoveFilterPress(item.id)}
          />
        );
      case "rating":
        return (
          <RatingFilter key={item.id}
            initialValue={item.value}
            onValueChange={(value) => updateFilter(item.id, "rating", value)}
            onDeletePress={() => handleRemoveFilterPress(item.id)}
          />
        );
      case "last_cooked":
        return (
          <LastCookedFilter key={item.id}
            initialValue={item.value}
            onValueChange={(value) => updateFilter(item.id, "last_cooked", value)}
            onBlur={(value) => updateFilter(item.id, "last_cooked", value)}
            onDeletePress={() => handleRemoveFilterPress(item.id)}
          />
        );
      case "duration":
        return (
          <DurationFilter key={item.id}
            initialValue={item.value}
            onValueChange={(value) => updateFilter(item.id, "duration", value)}
            onBlur={(value) => updateFilter(item.id, "duration", value)}
            onDeletePress={() => handleRemoveFilterPress(item.id)}
          />
        );
    }
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
            onPress={() => handleNewFilterPress()}
          />
        </View>

        {
          myFilters
        }

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