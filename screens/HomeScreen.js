import { React, useState, useEffect } from "react";
import { Text, View, ImageBackground, ScrollView, TouchableOpacity } from "react-native";
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AirbnbRating, Card, Dialog } from '@rneui/themed';
import { MenuTrigger, Menu, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { convertToReadableDurationInfo, convertToReadableLastCookedInfo } from "../util/RecipeUtil";
import { getAllRecipes, getCategoryColorById, hasNoCategoriesInDatabase, markAsCooked, deleteRecipe } from '../util/DatabaseUtil'

const HomeScreen = ({ navigation }) => {
  const [recipes, setRecipes] = useState([]);
  const [hasNoCategories, setHasNoCategories] = useState(false);
  const [removeRecipeDialogVisible, setRemoveRecipeDialogVisible] = useState(false);

  let contextMenuRefs = {};

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      hasNoCategoriesInDatabase((result) => {
        setHasNoCategories(result);
      });

      getAllRecipes(async (results) => {
        // cache repeated categories for less db requests
        let cachedCategories = {};
        for (let i = 0; i < results.length; ++i) {
          const recipe = results[i];
          // get and set category color
          const category = await getCategoryColorById(recipe.category_id);
          if (!cachedCategories[category.category_id]) {
            cachedCategories[category.category_id] = category.color;
          }
          recipe.categoryColor = cachedCategories[category.category_id];
        }
        setRecipes(results);
      })
    });

    return unsubscribe;
  }, [navigation]);

  const handleMarkAsCooked = (recipe_id) => {
    markAsCooked(recipe_id).then(() => updateRecipe(recipe_id))
  }

  const handleEdit = (recipe_id) => {

  }

  const handleDelete = (recipe_id) => {
    deleteRecipe(recipe_id).then(() => {
      setRecipes(
        recipes.filter(r =>
          r.recipe_id !== recipe_id
        )
      );
      setRemoveRecipeDialogVisible(false);
    })
  }

  const updateRecipe = (recipeId) => {
    const myNextRecipes = [...recipes];
    const recipe = myNextRecipes.find(
      r => r.recipe_id === recipeId
    );
    recipe.last_cooked = 0;
    setRecipes(myNextRecipes);
  }

  const setContextMenuRef = (ref, index) => {
    contextMenuRefs[index] = ref;
  }

  return (
    <View style={{ flex: 1, justifyContent: "flex-start" }}>
      {
        hasNoCategories &&
        <View style={{ display: "flex", flexDirection: "row", padding: 10, alignItems: "center", backgroundColor: "#ebd321" }}>
          <AntDesign name="warning" size={30} color="#e09558" style={{ flex: 1 }} />
          <Text style={{ flex: 6, fontWeight: "bold" }}>Sie haben noch keine Kategorien hinzugefügt. Bitte tun Sie dies, bevor Sie neue Rezepte hinzufügen.</Text>
        </View>
      }
      <ScrollView style={{ width: '100%', flexBasis: 0 }}>
        {
          recipes.map((recipe, index) => (
            <TouchableOpacity key={recipe.recipe_id}
              onPress={() => navigation.navigate('RecipeDetail', { recipe: recipe })}
              onLongPress={() => contextMenuRefs[index].open()}
            >
              <Card containerStyle={{
                margin: 0, paddingVertical: 7, paddingHorizontal: 15, backgroundColor: "white"
              }}>

                <Menu ref={ref => setContextMenuRef(ref, index)}>
                  <MenuTrigger />
                  <MenuOptions customStyles={{ optionWrapper: { padding: 10 }, optionText: { fontSize: 20 } }} >
                    <MenuOption onSelect={() => handleMarkAsCooked(recipe.recipe_id)} text='Heute zubereitet' />
                    <MenuOption onSelect={() => handleEdit(recipe.recipe_id)} text='Bearbeiten' />
                    <MenuOption onSelect={() => setRemoveRecipeDialogVisible(true)} >
                      <Text style={{ fontWeight: "bold", fontSize: 20, color: "red" }}>Löschen</Text>
                    </MenuOption>
                  </MenuOptions>
                </Menu>

                <Dialog
                  isVisible={removeRecipeDialogVisible}
                  onBackdropPress={() => setRemoveRecipeDialogVisible(false)}
                >
                  <Dialog.Title title="Löschen bestätigen" />
                  <Text>Rezept "{recipe ? recipe.name : ""}" wirklich löschen?</Text>
                  <Dialog.Actions>
                    <Dialog.Button title="Bestätigen" onPress={() => handleDelete(recipe.recipe_id)} />
                    <Dialog.Button title="Abbrechen" onPress={() => setRemoveRecipeDialogVisible(false)} />
                  </Dialog.Actions>
                </Dialog>

                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <View style={{ flexShrink: 1 }}>
                    <ImageBackground source={require('../assets/backgrounds/pencil-draw.png')} resizeMode="stretch"
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
                  <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Ionicons name="time" size={24} color="black" />
                    <Text style={{ paddingLeft: 3 }}>{convertToReadableDurationInfo(recipe.duration)}</Text>
                  </View>
                  <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 3 }}>
                    <MaterialCommunityIcons name="silverware-fork-knife" size={24} color="black" />
                    <Text style={{ paddingLeft: 3 }}>{convertToReadableLastCookedInfo(recipe.last_cooked)}</Text>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>

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