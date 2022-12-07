import { openDatabase } from 'expo-sqlite';


const db = openDatabase('myDb', "1.0");

export function initTables() {
    const createTableCategory = `CREATE TABLE IF NOT EXISTS categories (
        category_id INTEGER PRIMARY KEY,
        name TINYTEXT NOT NULL
      );`

    const createTableRecipe = `CREATE TABLE IF NOT EXISTS recipes (
      recipe_id INTEGER PRIMARY KEY,
      name TINYTEXT NOT NULL,
      instructions TEXT,
      category_id INTEGER NOT NULL,
      rating INTEGER,
      duration INTEGER,
      last_cooked INTEGER,
      FOREIGN KEY(category_id) REFERENCES categories(category_id)
    );`

    const createTableImage = `CREATE TABLE IF NOT EXISTS images (
      image_id INTEGER PRIMARY KEY,
      recipe_id INTEGER NOT NULL,
      FOREIGN KEY(recipe_id) REFERENCES recipes(recipe_id)
    );`

    db.transaction((transaction) => {
        transaction.executeSql(createTableCategory);
    },
        (error) => {
            console.log(error);
        }, () => {
            console.log("success createTableCategory");
        });

    db.transaction((transaction) => {
        transaction.executeSql(createTableRecipe);
    },
        (error) => {
            console.log(error);
        }, () => {
            console.log("success createTableRecipe");
        });

    db.transaction((transaction) => {
        transaction.executeSql(createTableImage);
    },
        (error) => {
            console.log(error);
        }, () => {
            console.log("success createTableImage");
        });
}

export function createNewRecipe(recipe) {
    
}

