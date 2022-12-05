import { Platform, PermissionsAndroid } from "react-native";

export const writeFileToStorage = async (base64Data, fileName) => {
    if (Platform.OS == 'android') {
        try {
            const result = await PermissionsAndroid.request(WRITE_EXTERNAL_STORAGE);
            if (result == PermissionsAndroid.RESULTS.GRANTED) {
                write(base64Data, fileName);
            } else {
                console.log('Permission Not Granted');
            }
        } catch (err) {
            console.log(err);
        }
    } else if (Platform.OS == 'ios') {
        write(base64Data, fileName);
    }
};

const write = (base64Data, fileName) => {
    //const dirs = RNFetchBlob.fs.dirs;
    //const folderPath = dirs.SDCardDir + '/gerichtesammler-images/';
    //const fullPath = folderPath + fileName;
    /*

    RNFetchBlob.fs.mkdir(folderPath).then((res) => {
        console.log('res', res);
    });

    RNFetchBlob.fs.writeFile(fullPath, base64Data, 'base64').then((res) => {
        console.log('file saved :', res);
    });
    */
};

export const getUniqueFileName = (fileExt) => {
    const date = new Date();
    return "IMG" + date.getFullYear() + "_" + date.getMonth() + "_" + date.getDate() + "_" + date.getHours() + "_" + date.getMinutes() + '.' + fileExt;
};