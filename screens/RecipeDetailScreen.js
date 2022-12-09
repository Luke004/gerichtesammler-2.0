import React from "react";
import { Text, View, ImageBackground } from "react-native";
import { Card } from '@rneui/themed';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getDurationInfo, getLastCookedInfo } from "../util/RecipeUtil";

const PAPER_BACKGROUND = require('../assets/backgrounds/old-paper.jpg');
const PAPER_BACKGROUND_SMALL = require('../assets/backgrounds/old-paper-small.jpg');
const PAPER_BACKGROUND_LARGE = require('../assets/backgrounds/old-paper-large.jpg');

function RecipeDetailScreen({ route, navigation }) {
  const recipe = route.params.recipe;

  let paperBackground;
  if (recipe.instructions.length < 250) {
    paperBackground = PAPER_BACKGROUND_SMALL;
  } else if (recipe.instructions.length < 700) {
    paperBackground = PAPER_BACKGROUND;
  } else {
    paperBackground = PAPER_BACKGROUND_LARGE;
  }

  return (
    <View>

      <Card containerStyle={{ margin: 0 }}>
        <ImageBackground source={require('../assets/backgrounds/pencil-draw.png')} resizeMode="stretch"
          imageStyle={{ tintColor: "orange", opacity: 0.3, position: "absolute", top: -15 }}>
          <Card.Title style={{ fontSize: 20 }} >{recipe.name}</Card.Title>

        </ImageBackground>
        <Card.Divider style={{ paddingTop: 10, width: "50%", alignSelf: "center" }} />
        <View style={{ alignItems: "center" }}>
          {
            recipe.instructions != "" &&
            <View style={{ display: "flex", width: "100%" }}>
              <ImageBackground
                source={paperBackground}
                resizeMode="stretch">
                <View style={{ justifyContent: "center", alignItems: "center", alignContent: "center" }}>
                  <Text style={{ fontSize: 16, fontWeight: "500", padding: 20 }}>
                    {recipe.instructions}
                  </Text>
                </View>
              </ImageBackground>
            </View>
          }
          <View style={{ display: "flex", width: "100%", flexDirection: "row", justifyContent: "space-around", padding: 5 }}>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="time" size={24} color="black" />
              <Text style={{ paddingLeft: 3 }}>{getDurationInfo(recipe.duration)}</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
              <MaterialCommunityIcons name="silverware-fork-knife" size={24} color="black" />
              <Text style={{ paddingLeft: 3 }}>{getLastCookedInfo(recipe.lastCooked, true)}</Text>
            </View>
          </View>
        </View>
      </Card>

    </View>
  );
};

/*
RecipeDetail.navigationOptions = (navData) => {
  return {
    headerTitle: navData.navigation.getParam("username"),
  };
};
*/

export default RecipeDetailScreen;