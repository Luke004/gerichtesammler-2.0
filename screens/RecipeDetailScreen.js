import { React, useState, useEffect } from "react";
import { Text, View, ScrollView, Image, ImageBackground, TouchableHighlight, Modal, Dimensions, Platform } from "react-native";
import { WebView } from "react-native-webview";
import { Card } from '@rneui/themed';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { convertToReadableDurationInfo, convertToReadableLastCookedInfo } from "../util/RecipeUtil";
import { getImageAssets } from '../util/StorageUtil'
import { getRecipePictureNames } from '../util/DatabaseUtil'

const PAPER_BACKGROUND = require('../assets/backgrounds/old-paper.jpg');
const PAPER_BACKGROUND_SMALL = require('../assets/backgrounds/old-paper-small.jpg');
const PAPER_BACKGROUND_LARGE = require('../assets/backgrounds/old-paper-large.jpg');


function RecipeDetailScreen({ route, navigation }) {
  const [imageAssets, setImageAssets] = useState([]);
  const [zoomIndex, setZoomIndex] = useState(0);
  const [imageZoomViewVisible, setImageZoomViewVisible] = useState(false);

  // below is a workaround fix for WebView which permission settings do not work accordingly
  const [webViewRenderedOnce, setWebViewRenderedOnce] = useState(false);
  const onLoadWebView = () => {
    setWebViewRenderedOnce(true);
  };

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
        getRecipePictureNames(recipe.recipe_id).then((images) => {
          getImageAssets(images).then((assets) => setImageAssets(assets));
        });
      });
      return unsubscribe;
    }, [navigation]);
  }

  const handleImagePress = (index) => {
    setZoomIndex(index);
    setImageZoomViewVisible(true);
  }

  return (
    <View style={{ flex: 1, height: 800 }}>
      <ScrollView>
        <Card containerStyle={{ margin: 0 }}>
          <ImageBackground source={require('../assets/backgrounds/pencil-draw.png')} resizeMode="stretch"
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
                <TouchableHighlight key={index} onPress={() => handleImagePress(index)}>
                  <Image source={{ uri: imageAsset.uri }} style={{ width: "100%", maxHeight: 400, aspectRatio: 1, marginBottom: 10 }} />
                </TouchableHighlight>
              ))
            }

            {imageAssets.length > 0 &&
              <Modal
                animationType={"fade"}
                transparent={false}
                visible={imageZoomViewVisible}
                onRequestClose={() => {
                  setImageZoomViewVisible(false);
                }}
              >
                <View style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "space-between"
                }}>
                  <WebView
                    allowFileAccess={true}
                    onLoad={onLoadWebView}
                    source={webViewRenderedOnce ? { uri: imageAssets[zoomIndex].uri } : undefined}
                    style={{
                      height: Math.round(Dimensions.get("window").height),
                      width: Math.round(Dimensions.get("window").width),
                      flex: 1
                    }}
                  />
                </View>
              </Modal>
            }

          </View>
        </Card>

      </ScrollView>
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