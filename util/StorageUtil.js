import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

const IMAGES_ALBUM_NAME = "gerichtesammler";

export const saveImagesToStorage = async (images) => {
    // request permission
    const permission = await MediaLibrary.requestPermissionsAsync();
    if (!permission.granted) {
        console.log("No media access permission granted.");
        // TODO: save recipe without images
        return;
    }

    // save images to storage
    images.forEach((img) => {
        MediaLibrary.createAssetAsync(img.uri).then((asset) => {
            const imgUri = asset.uri;
            MediaLibrary.createAlbumAsync(IMAGES_ALBUM_NAME, asset);
        });
    });
    /*
    // NOTE: how to read an img file by uri
    const test = await FileSystem.readAsStringAsync(imgUri, {encoding: "base64"});
    */
};