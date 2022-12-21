import * as MediaLibrary from 'expo-media-library';

export const IMAGES_ALBUM_NAME = "gerichtesammler";

export const saveImagesToStorage = async (images) => {
    if (images.length == 0) return;

    if (!await requestPermission()) {
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

export const getImageUris = async (images) => {
    if (images.length == 0) return [];

    if (!await requestPermission()) {
        return;
    }

    const album = await MediaLibrary.getAlbumAsync("gerichtesammler");
    const assets = (await MediaLibrary.getAssetsAsync({ album: album.id })).assets;

    const uris = [];
    for (let i = 0; i < images.length; ++i) {
        for (let j = 0; j < assets.length; ++j) {
            if (images[i].file_name == assets[j].filename) {
                uris.push(assets[j].uri)
                break;
            }
        }
    }

    return uris;
}

export const deleteImagesFromStorage = async (images) => {
    if (images.length == 0) return;

    if (!await requestPermission()) {
        return;
    }

    // delete images from storage
    const album = await MediaLibrary.getAlbumAsync("gerichtesammler");
    const assets = (await MediaLibrary.getAssetsAsync({ album: album.id })).assets;

    const assetsToDelete = [];
    for (let i = 0; i < images.length; ++i) {
        for (let j = 0; j < assets.length; ++j) {
            if (images[i].file_name == assets[j].filename) {
                assetsToDelete.push(assets[j].id);
                break;
            }
        }
    }
    MediaLibrary.deleteAssetsAsync(assetsToDelete).then((result) => {
        if (result) {
            console.log("Assets " + assetsToDelete + " successfully deleted.")
        }
    });
};

async function requestPermission() {
    const permission = await MediaLibrary.requestPermissionsAsync();
    if (!permission.granted) {
        console.log("No media access permission granted.");
        return false;
    }
    return true;
}