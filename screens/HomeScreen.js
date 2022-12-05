import React from "react";
import { Text, View, ImageBackground, TouchableOpacity, TextInput, Button } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Recipe } from "../recipe";

import { AirbnbRating, Card } from '@rneui/themed';


const rec1 = new Recipe("Spaghetti", "Die gehen so", "category");
rec1.lastCooked = 7;
rec1.duration = 555;

const rec2 = new Recipe("Suppenhähnchen mit Spargel und Gemüse", "der geht so..", "category2")

const test = [rec1, rec2];


function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "flex-start" }}>
      <View style={{ width: '100%' }}>
        {
          test.map((recipe, index) => (
            <Card key={recipe.id} containerStyle={{ margin: 0, paddingVertical: 7, paddingHorizontal: 15, backgroundColor: "white" }}>

              <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>

                <View style={{ flexShrink: 1 }}>
                  <ImageBackground source={{ uri: require('../assets/test.png') }} resizeMode="stretch" imageStyle={{ tintColor: "#d8a203", opacity: 0.8 }}>
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

              <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", marginTop: 15 }}>
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 3 }}>
                  <Ionicons name="time" size={24} color="black" />
                  <Text>{recipe.getDurationInfo()}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 3 }}>
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