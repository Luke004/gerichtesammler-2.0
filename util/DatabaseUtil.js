import { Platform } from 'react-native';
import { openDatabase } from 'expo-sqlite';
import { deleteImagesFromStorage } from './StorageUtil';

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
      file_name TINYTEXT NOT NULL,
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
            transaction.executeSql(query, [recipe.name, recipe.instructions, recipe.category, recipe.rating, recipe.duration, -1], (res1, res2) => {
                resolve(res2.insertId);
            });
        }, (error) => console.log(error));
    });
}

export function getAllRecipes(results) {
    db.readTransaction((transaction) => {
        transaction.executeSql("SELECT * FROM recipes", undefined, async (res, res2) => {
            let recipes;
            if (Platform.OS == "web") {
                const rows = res2.rows;
                const arr = [];
                for (let i = 0; i < rows.length; ++i) {
                    arr.push(rows[i]);
                }
                recipes = arr;
            } else {
                recipes = res2.rows._array;
            }
            // get and set last cooked info for actual day
            for (let i = 0; i < recipes.length; ++i) {
                recipes[i].last_cooked = await getNumberOfDaysLastCooked(recipes[i]);
            }
            results(recipes)
        });
    },
        (error) => {
            console.log(error);
        });
}

export function addImageToDatabase(recipeId, fileName) {
    db.transaction((transaction) => {
        transaction.executeSql("INSERT INTO images (recipe_id, file_name) VALUES(?, ?);", [recipeId, fileName]);
    });
}

function removeAllImagesForRecipe(recipeId) {
    getRecipePictureNames(recipeId).then((images) => deleteImagesFromStorage(images));

    db.transaction((transaction) => {
        transaction.executeSql("DELETE FROM images WHERE recipe_id = ?;", [recipeId], (res, res2) => {
            console.log("Deleted images rows for recipeId " + recipeId);
        }, (err) => {
            console.log(err);
        });
    }, (err) => console.log(err));
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

export function deleteRecipe(id) {
    return new Promise(resolve => {
        db.transaction((transaction) => {
            transaction.executeSql("DELETE FROM recipes WHERE recipe_id=?", [id], async (res, res2) => {
                if (Platform.OS == "web") {
                    resolve(res2.rows[0])
                } else {
                    removeAllImagesForRecipe(id);
                    resolve(res2.rows._array[0])
                }
            });
        },
            (error) => {
                console.log(error);
            });
    });
}

export function getRecipePictureNames(recipeId) {
    return new Promise(resolve => {
        db.readTransaction((transaction) => {
            transaction.executeSql("SELECT file_name FROM images WHERE recipe_id=?", [recipeId], (res, res2) => {
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

export function markAsCooked(recipeId) {
    return new Promise(resolve => {
        db.transaction((transaction) => {
            transaction.executeSql("UPDATE recipes SET last_cooked = julianday('now') WHERE recipe_id = ?;", [recipeId], (res, res2) => {
                resolve();
            });
        },
            (error) => {
                console.log(error);
            });
    });
}

function getNumberOfDaysLastCooked(recipe) {
    return new Promise(resolve => {
        if (recipe.last_cooked == -1) {
            resolve(-1);
        }
        db.transaction((transaction) => {
            transaction.executeSql("SELECT (julianday('now') - " + recipe.last_cooked + ");", undefined, (res, res2) => {
                let daysSinceLastCooked;
                if (Platform.OS == "web") {
                    daysSinceLastCooked = Math.floor(Object.values(res2.rows[0])[0]);
                } else {
                    daysSinceLastCooked = Math.floor(Object.values(res2.rows._array[0])[0]);
                }
                resolve(daysSinceLastCooked)
            });
        },
            (error) => {
                console.log(error);
            });
    });
}
