import { React, useLayoutEffect } from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import { Feather, Ionicons } from "@expo/vector-icons";
import { MenuProvider } from 'react-native-popup-menu';
import HomeScreen from "./screens/HomeScreen";
import SettingScreen from "./screens/SettingScreen";
import RecipeDetailScreen from "./screens/RecipeDetailScreen";
import EditCategoriesScreen from "./screens/EditCategoriesScreen";
import NewRecipeScreen from "./screens/NewRecipeScreen";
import EditRecipeScreen from "./screens/EditRecipeScreen";
import { initTables } from './util/DatabaseUtil';


const Stack = createStackNavigator();

export default function App() {

  useLayoutEffect(() => {
    initTables();
  }, []);

  return (
    <MenuProvider>
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor="lightgrey"
      />
      <NavigationContainer>
        <Stack.Navigator headerTitleStyle="font-weight: bold" initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={({ navigation }) => ({
              title: 'Gerichtesammler',
              headerTitleStyle: {
                color: "black"
              },
              headerStyle: {
                backgroundColor: "lightgrey"
              },
              headerRight: () => (
                <Ionicons name="ios-settings-outline"
                  size={30}
                  style={{ paddingRight: 10 }}
                  color="#006600"
                  onPress={() => navigation.navigate('Settings')}
                />
              ),
            })}
          />
          <Stack.Screen name="Settings" component={SettingScreen}
            options={{
              title: "Einstellungen"
            }}
          />
          <Stack.Screen name="EditCategories" component={EditCategoriesScreen}
            options={{
              title: "Katgorien bearbeiten"
            }}
          />
          <Stack.Screen
            name="NewRecipe"
            options={({ navigation }) => ({
              title: 'Neues Rezept hinzuf??gen',
              headerTitleStyle: {
                color: "black"
              },
              headerStyle: {
                backgroundColor: "lightgrey"
              }
            })}
            component={NewRecipeScreen}
          />
          <Stack.Screen
            name="EditRecipe"
            options={({ route }) => ({
              title: route.params.recipe.name + " bearbeiten",
              headerTitleStyle: {
                color: "black"
              },
              headerStyle: {
                backgroundColor: "lightgrey"
              }
            })}
            component={EditRecipeScreen}
          />
          <Stack.Screen
            name="RecipeDetail"
            component={RecipeDetailScreen}
            options={({ route, navigation }) => ({
              title: "Rezeptansicht",
              headerTitleStyle: {
                color: "black"
              },
              headerStyle: {
                backgroundColor: "lightgrey"
              },
              headerRight: () => (
                <Feather name="edit"
                  size={30}
                  style={{ paddingRight: 10 }}
                  color="#006600"
                  onPress={() => navigation.navigate('EditRecipe', { recipe: route.params.recipe })}
                />
              ),
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
}