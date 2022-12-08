import { React, useState, useEffect } from "react";
import { Text, View, Image, ImageBackground, TouchableOpacity, TextInput, Button } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Recipe } from "../recipe";
import { AirbnbRating, Card } from '@rneui/themed';
import { hasNoCategoriesInDatabase } from '../util/DatabaseUtil'

function HomeScreen({ navigation }) {
  const [hasNoCategories, setHasNoCategories] = useState(false);

  const rec1 = new Recipe("Spaghetti", "Die gehen so", "category");
  rec1.lastCooked = 7;
  rec1.duration = 555;

  const rec2 = new Recipe("Suppenhähnchen mit Spargel und Gemüse", "der geht so..", "category2")

  const test = [rec1, rec2];

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      hasNoCategoriesInDatabase((result) => {
        setHasNoCategories(result);
      });
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: "flex-start" }}>
      {
        hasNoCategories &&
        <View style={{display: "flex", flexDirection: "row", padding: 10, alignItems: "center", justifyContent: "center", alignContent: "center", gap: 15}}>
          <AntDesign name="warning" size={30} color="#e09558" />
          <Text style={{ fontWeight: "bold" }}>Sie haben noch keine Kategorien hinzugefügt. Bitte dies vor dem Hinzufügen neuer Rezepte tun.</Text>
        </View>
      }
      <View style={{ width: '100%' }}>
        {
          test.map((recipe, index) => (
            <Card key={recipe.id} containerStyle={{ margin: 0, paddingVertical: 7, paddingHorizontal: 15, backgroundColor: "white" }}>
              <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <View style={{ flexShrink: 1 }}>
                  <ImageBackground source={require('../assets/test.png')} resizeMode="stretch" imageStyle={{ tintColor: "#d8a203", opacity: 0.8 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 16, padding: 8 }}>{recipe.name}</Text>
                  </ImageBackground>
                </View>
                <AirbnbRating
                  count={5}
                  reviews={[
                    'Okay',
                    'Good',
                    'Tasty',
                    'Great',
                    'Excellent'
                  ]}
                  defaultRating={2}
                  size={10}
                  reviewSize={12}
                  showRating={false}
                  isDisabled={true}
                />
              </View>
              <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 15 }}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 3 }}>
                  <Ionicons name="time" size={24} color="black" />
                  <Text>{recipe.getDurationInfo()}</Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 3 }}>
                  <MaterialCommunityIcons name="silverware-fork-knife" size={24} color="black" />
                  <Text>{recipe.getLastCookedInfo()}</Text>
                </View>
              </View>
            </Card>
          ))
        }
      </View>

      <AntDesign name="pluscircleo"
        size={70}
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
        }}
        color="#006600"
        onPress={() => navigation.navigate('NewRecipe')}
      />
    </View >
  );
}

export default HomeScreen;