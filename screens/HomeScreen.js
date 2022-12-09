import { React, useState, useEffect } from "react";
import { Text, View, ImageBackground, ScrollView } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AirbnbRating, Card } from '@rneui/themed';
import { getDurationInfo, getLastCookedInfo } from "../util/RecipeUtil";
import { getAllRecipes, getCategoryColorById, hasNoCategoriesInDatabase } from '../util/DatabaseUtil'

function HomeScreen({ navigation }) {
  const [recipes, setRecipes] = useState([]);
  const [hasNoCategories, setHasNoCategories] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log("FOCUS")
      hasNoCategoriesInDatabase((result) => {
        setHasNoCategories(result);
      });

      getAllRecipes(async (results) => {
        let cachedCategories = {};
        for (let i = 0; i < results.length; ++i) {
          const category = await getCategoryColorById(results[i].category_id);
          if (!cachedCategories[category.category_id]) {
            cachedCategories[category.category_id] = category.color;
          }
          results[i].categoryColor = cachedCategories[category.category_id]
        }

        setRecipes(results);
      })
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: "flex-start" }}>
      {
        hasNoCategories &&
        <View style={{ display: "flex", flexDirection: "row", padding: 10, alignItems: "center", backgroundColor: "#ebd321" }}>
          <AntDesign name="warning" size={30} color="#e09558" style={{ flex: 1}} />
          <Text style={{ flex: 6, fontWeight: "bold" }}>Sie haben noch keine Kategorien hinzugefügt. Bitte tun Sie dies, bevor Sie neue Rezepte hinzufügen.</Text>
        </View>
      }
      <ScrollView style={{ width: '100%', flexBasis: 0 }}>
        {
          recipes.map((recipe, index) => (
            <Card key={recipe.recipe_id} containerStyle={{ margin: 0, paddingVertical: 7, paddingHorizontal: 15, backgroundColor: "white" }}>
              <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <View style={{ flexShrink: 1 }}>
                  <ImageBackground source={require('../assets/test.png')} resizeMode="stretch"
                    imageStyle={{ tintColor: recipe.categoryColor ? recipe.categoryColor : "orange", opacity: 0.8 }}>
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
                  defaultRating={recipe.rating}
                  size={10}
                  reviewSize={12}
                  showRating={false}
                  isDisabled={true}
                />
              </View>
              <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 15 }}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 3 }}>
                  <Ionicons name="time" size={24} color="black" />
                  <Text>{getDurationInfo(recipe.duration)}</Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 3 }}>
                  <MaterialCommunityIcons name="silverware-fork-knife" size={24} color="black" />
                  <Text>{getLastCookedInfo(recipe.lastCooked)}</Text>
                </View>
              </View>
            </Card>
          ))
        }
      </ScrollView>

      <AntDesign name="pluscircleo"
        size={70}
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
        }}
        color="#006600"
        onPress={() => {
          if (!hasNoCategories) {
            navigation.navigate('NewRecipe');
          }
        }}
      />
    </View >
  );
}

export default HomeScreen;