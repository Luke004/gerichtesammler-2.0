import { Platform } from 'react-native';
import { openDatabase } from 'expo-sqlite';


const db = openDatabase('myDb', "1.0");

export function initTables() {
    const createTableCategory = `CREATE TABLE IF NOT EXISTS categories (
        category_id INTEGER PRIMARY KEY,
        name TINYTEXT NOT NULL,
        color TINYTEXT NOT NULL
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
      uri TINYTEXT NOT NULL,
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

export function hasNoCategoriesInDatabase(result) {
    db.transaction((transaction) => {
        transaction.executeSql("SELECT count(*) FROM categories;", undefined, (res, res2) => {
            let rowsArray;

            if (Platform.OS == "web") {
                rowsArray = res2.rows[0];
            } else {
                rowsArray = res2.rows._array[0];
            }

            result(rowsArray["count(*)"] == 0)
        });
    });
}

export function getAllCategories(results) {
    db.readTransaction((transaction) => {
        transaction.executeSql("SELECT * FROM categories", undefined, (res, res2) => {
            if (Platform.OS == "web") {
                const rows = res2.rows;
                const arr = [];
                for (let i = 0; i < rows.length; ++i) {
                    arr.push(rows[i]);
                }
                results(arr)
            } else {
                results(res2.rows._array)
            }
        });
    },
        (error) => {
            console.log(error);
        });
}

export function getCategoryColorById(id) {
    return new Promise(resolve => {
        db.readTransaction((transaction) => {
            transaction.executeSql("SELECT category_id, color FROM categories WHERE category_id=?", [id], (res, res2) => {
                if (Platform.OS == "web") {
                    resolve(res2.rows[0])
                } else {
                    resolve(res2.rows._array[0])
                }
            });
        },
            (error) => {
                console.log(error);
            });
    });
}

export function updateCategoriesDatabase(categories) {
    categories.forEach((category) => {
        if (!category.wasChanged) {
            return;
        }

        const existsCategory = category.category_id != undefined;
        if (!existsCategory) {
            // add new category
            db.transaction((transaction) => {
                transaction.executeSql("INSERT INTO categories (name, color) VALUES(?, ?);", [category.name, category.color]);
            });
        } else {
            // update category
            db.transaction((transaction) => {
                transaction.executeSql("UPDATE categories SET name = ?, color = ? WHERE category_id = ?;", [category.name, category.color, category.category_id]);
            });
        }
    });
}

export function removeCategoryFromDatabase(category, success) {
    db.transaction((transaction) => {
        transaction.executeSql("DELETE FROM categories WHERE category_id = ?;", [category.category_id], success());
    });
}

export function createNewRecipe(recipe) {
    return new Promise(resolve => {
        const query = `INSERT INTO recipes (name, instructions, category_id, rating, duration, last_cooked) 
                    VALUES(?, ?, ?, ?, ?, ?);`
        db.transaction((transaction) => {
            transaction.executeSql(query, [recipe.name, recipe.instructions, recipe.category, recipe.rating, recipe.duration, recipe.lastCooked], (res1, res2) => {
                resolve(res2.insertId);
            });
        });
    });
}

export function getAllRecipes(results) {
    db.readTransaction((transaction) => {
        transaction.executeSql("SELECT * FROM recipes", undefined, (res, res2) => {
            if (Platform.OS == "web") {
                const rows = res2.rows;
                const arr = [];
                for (let i = 0; i < rows.length; ++i) {
                    arr.push(rows[i]);
                }
                results(arr)
            } else {
                results(res2.rows._array)
            }
        });
    },
        (error) => {
            console.log(error);
        });
}

export function addImageUriToDatabase(recipeId, uri) {
    db.transaction((transaction) => {
        transaction.executeSql("INSERT INTO images (recipe_id, uri) VALUES(?, ?);", [recipeId, uri]);
    });
}

export function getRecipeById(id) {
    return new Promise(resolve => {
        db.readTransaction((transaction) => {
            transaction.executeSql("SELECT * FROM recipes WHERE category_id=?", [id], (res, res2) => {
                if (Platform.OS == "web") {
                    resolve(res2.rows[0])
                } else {
                    resolve(res2.rows._array[0])
                }
            });
        },
            (error) => {
                console.log(error);
            });
    });
}

export function getRecipePictureUris(recipeId) {
    return new Promise(resolve => {
        db.readTransaction((transaction) => {
            transaction.executeSql("SELECT uri FROM images WHERE recipe_id=?", [recipeId], (res, res2) => {
                if (Platform.OS == "web") {
                    resolve(res2.rows)
                } else {
                    resolve(res2.rows._array)
                }
            });
        },
            (error) => {
                console.log(error);
            });
    });
}
