import * as MediaLibrary from 'expo-media-library';

export const IMAGES_ALBUM_NAME = "gerichtesammler";

export const saveImagesToStorage = async (images) => {
    if (images.length == 0) return;

    // request permission
    const permission = await MediaLibrary.requestPermissionsAsync();
    if (!permission.granted) {
        console.log("No media access permission granted.");
        return;
    }

    // save images to storage
    const imgFileNames = [];
    for (let i = 0; i < images.length; ++i) {
        const asset = await MediaLibrary.createAssetAsync(images[i].uri);
        imgFileNames.push(asset.filename);
        MediaLibrary.createAlbumAsync(IMAGES_ALBUM_NAME, asset, false);
    }

    return imgFileNames;
};