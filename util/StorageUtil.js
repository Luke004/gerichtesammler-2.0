import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

const IMAGES_ALBUM_NAME = "gerichtesammler";

export const saveImagesToStorage = async (images) => {
    if (images.length == 0) return;

    // request permission
    const permission = await MediaLibrary.requestPermissionsAsync();
    if (!permission.granted) {
        console.log("No media access permission granted.");
        return;
    }

    // save images to storage
    const imgUris = [];
    for (let i = 0; i < images.length; ++i) {
        const asset = await MediaLibrary.createAssetAsync(images[i].uri);
        imgUris.push(asset.uri);
        MediaLibrary.createAlbumAsync(IMAGES_ALBUM_NAME, asset);
    }

    return imgUris;
    /*
    // NOTE: how to read an img file by uri
    const test = await FileSystem.readAsStringAsync(imgUri, {encoding: "base64"});
    */
};