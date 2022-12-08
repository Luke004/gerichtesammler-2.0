import React from "react";
import { Button, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./screens/HomeScreen";
import SettingScreen from "./screens/SettingScreen";
import UserScreen from "./screens/UserScreen";
import EditCategoriesScreen from "./screens/EditCategoriesScreen";
import NewRecipeScreen from "./screens/NewRecipeScreen";
import { initTables } from './util/DatabaseUtil';


const Stack = createStackNavigator();

export default function App() {
  initTables();

  return (
    <NavigationContainer>
      <Stack.Navigator headerTitleStyle="font-weight: bold" initialRouteName="EditCategories">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            title: 'Gerichtesammler 2.0',
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
        <Stack.Screen name="Settings" component={SettingScreen} />
        <Stack.Screen name="EditCategories" component={EditCategoriesScreen} 
         options = {{
          title: "Katgorien bearbeiten"
         }}
        />
        <Stack.Screen
          name="NewRecipe"
          options={({ navigation }) => ({
            title: 'Neues Rezept hinzufügen',
            headerTitleStyle: {
              color: "black"
            },
            headerStyle: {
              backgroundColor: "lightgrey"
            }
          })}
          component={NewRecipeScreen}
        />
        <Stack.Screen name="User" component={UserScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}