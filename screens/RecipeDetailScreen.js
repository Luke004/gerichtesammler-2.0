import { React, useState, useEffect } from "react";
import { Text, View, ScrollView, Image, ImageBackground, TouchableHighlight, Dimensions, Platform } from "react-native";
import ImageView from "react-native-image-viewing";
import { Card } from '@rneui/themed';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { convertToReadableDurationInfo, convertToReadableLastCookedInfo } from "../util/RecipeUtil";
import { getImageAssets } from '../util/StorageUtil'
import { getRecipePictureData } from '../util/DatabaseUtil'

const PAPER_BACKGROUND = require('../assets/backgrounds/old-paper.jpg');
const PAPER_BACKGROUND_SMALL = require('../assets/backgrounds/old-paper-small.jpg');
const PAPER_BACKGROUND_LARGE = require('../assets/backgrounds/old-paper-large.jpg');

const IMAGE_HORIZONTAL_MARGIN = 40;
const IMAGE_WIDTH = Math.round(Dimensions.get("window").width) - IMAGE_HORIZONTAL_MARGIN;

function RecipeDetailScreen({ route, navigation }) {
  const [imageAssets, setImageAssets] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [visible, setIsVisible] = useState(false);

  const recipe = route.params.recipe;

  let paperBackground;
  if (recipe.instructions.length < 250) {
    paperBackground = PAPER_BACKGROUND_SMALL;
  } else if (recipe.instructions.length < 700) {
    paperBackground = PAPER_BACKGROUND;
  } else {
    paperBackground = PAPER_BACKGROUND_LARGE;
  }

  if (Platform.OS !== 'web') {
    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        getRecipePictureData(recipe.recipe_id).then((images) => {
          getImageAssets(images).then((assets) => setImageAssets(assets));
        });
      });
      return unsubscribe;
    }, [navigation]);
  }

  const handleImagePress = (index) => {
    setImageIndex(index);
    setIsVisible(true);
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView scrollIndicatorInsets={{ right: 1 }}>
        <Card containerStyle={{ margin: 0 }}>
          <ImageBackground
            source={require('../assets/backgrounds/pencil-draw.png')}
            resizeMode="stretch"
            imageStyle={{ tintColor: recipe.categoryColor, opacity: 0.3, position: "absolute", top: -15 }}>
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
                <Text style={{ paddingLeft: 3 }}>{convertToReadableDurationInfo(recipe.duration)}</Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
                <MaterialCommunityIcons name="silverware-fork-knife" size={24} color="black" />
                <Text style={{ paddingLeft: 3 }}>{convertToReadableLastCookedInfo(recipe.last_cooked, true)}</Text>
              </View>
            </View>

            {
              imageAssets.map((imageAsset, index) => (
                <TouchableHighlight style={{ width: "100%" }} key={index} onPress={() => handleImagePress(index)}>
                  <Image source={{ uri: imageAsset.uri }}
                    style={{
                      width: IMAGE_WIDTH,
                      height: IMAGE_WIDTH / imageAsset.width * imageAsset.height,
                      resizeMode: "contain",
                      marginBottom: 10
                    }} />
                </TouchableHighlight>
              ))
            }

            {imageAssets.length > 0 &&
              <ImageView
                images={imageAssets}
                imageIndex={imageIndex}
                visible={visible}
                onRequestClose={() => setIsVisible(false)}
                FooterComponent={(imageIndex) => (
                  <View style={{
                    height: 64,
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Text style={{
                      fontSize: 17,
                      color: "white"
                    }}>{imageIndex.imageIndex + 1} / {imageAssets.length}</Text>
                  </View>
                )}
              />
            }

          </View>
        </Card>

      </ScrollView>
    </View>
  );
};

export default RecipeDetailScreen;