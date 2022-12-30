import * as MediaLibrary from 'expo-media-library';

export const IMAGES_ALBUM_NAME = "gerichtesammler";

export const saveImagesToStorage = async (images) => {
    if (images.length == 0) return;

    if (!await requestPermission()) {
        return;
    }

    // save images to storage
    let album = await MediaLibrary.getAlbumAsync("gerichtesammler");

    const imgData = [];
    const assetIds = [];
    for (const image of images) {
        const asset = await MediaLibrary.createAssetAsync(image.uri);
        imgData.push({ filename: asset.filename, created: asset.creationTime });
        if (!album) {
            console.log("Album 'gerichtesammler' doesn't exist! Creating ...");
            // first asset is added with creation of album
            album = await MediaLibrary.createAlbumAsync(IMAGES_ALBUM_NAME, asset, false);
        } else {
            assetIds.push(asset.id);
        }
    }
    // add the rest of the assets
    await MediaLibrary.addAssetsToAlbumAsync(assetIds, album, false);

    return imgData;
};

export const getImageAssets = async (images) => {
    if (images.length == 0) return [];

    if (!await requestPermission()) {
        return;
    }
    const assets = await findAssetsForImageData(images);

    return assets;
}

export const deleteImagesFromStorage = async (images) => {
    if (images.length == 0) return;

    if (!await requestPermission()) {
        return;
    }

    const assets = await findAssetsForImageData(images);
    const assetsIdsToDelete = assets.map(asset => asset.id);

    MediaLibrary.deleteAssetsAsync(assetsIdsToDelete).then((result) => {
        if (result) {
            console.log("Assets " + assetsIdsToDelete + " successfully deleted.")
        }
    }).catch(() => {
        console.log("User declined deleting recipe picture.")
    });
};

export const deleteAssetsFromStorage = async (assets) => {
    if (assets.length == 0) return;

    if (!await requestPermission()) {
        return;
    }

    const deletedAssetIds = assets.map(asset => asset.id);

    MediaLibrary.deleteAssetsAsync(assets).then((result) => {
        if (result) {
            console.log("Assets " + deletedAssetIds + " successfully deleted.")
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

async function findAssetsForImageData(imgData) {
    const earliestCreationTime = Math.min(...imgData.map(img => img.created));
    const album = await MediaLibrary.getAlbumAsync("gerichtesammler");
    const assetData = await MediaLibrary.getAssetsAsync({ album: album.id, createdAfter: earliestCreationTime - 1 });
    let assets = assetData.assets;
    let imgsNotFound = [];

    const myAssets = [];

    for (const img of imgData) {
        const asset = assets.find(asset => asset.filename === img.file_name);
        if (asset) {
            myAssets.push(asset);
        } else {
            imgsNotFound.push(img);
        }
    }

    if (imgsNotFound.length > 0 && assetData.hasNextPage) {
        const missingAssets = getMoreAssetsUntilAllImagesAreFound(album.id, assetData.endCursor, imgsNotFound);
        myAssets = [...myAssets, ...missingAssets];
    }

    return myAssets;
}

async function getMoreAssetsUntilAllImagesAreFound(albumId, endCursorAsset, imgsNotFound) {
    const foundAssets = [];
    const numOfAssetsToFind = imgsNotFound.length;

    while (foundAssets.length < numOfAssetsToFind) {
        const moreAssetData = await MediaLibrary.getAssetsAsync({ album: albumId, after: endCursorAsset });
        let assets = moreAssetData.assets;
        let imgsStillNotFound = [];

        for (const img of imgsNotFound) {
            const asset = assets.find(asset => asset.filename === img.file_name);
            if (asset) {
                foundAssets.push(asset);
            } else {
                imgsStillNotFound.push(img);
            }
        }
        endCursorAsset = moreAssetData.endCursor;
        imgsNotFound = imgsStillNotFound;
        if (!moreAssetData.hasNextPage) break;
    }

    return foundAssets;
}