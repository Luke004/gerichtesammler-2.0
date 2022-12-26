import { Platform } from 'react-native';
import { openDatabase } from 'expo-sqlite';
import { deleteImagesFromStorage, deleteAssetsFromStorage } from './StorageUtil';
import { SORTING_OPTIONS_DB } from './SortUtil';


const db = openDatabase('myDb', "1.0");

export function initTables() {
    const tables = [
        `CREATE TABLE IF NOT EXISTS categories (
            category_id INTEGER PRIMARY KEY,
            name TINYTEXT NOT NULL,
            color TINYTEXT NOT NULL
    );`,
        `CREATE TABLE IF NOT EXISTS recipes (
            recipe_id INTEGER PRIMARY KEY,
            name TINYTEXT NOT NULL,
            instructions TEXT,
            category_id INTEGER NOT NULL,
            rating INTEGER,
            duration INTEGER,
            last_cooked INTEGER,
            FOREIGN KEY(category_id) REFERENCES categories(category_id)
    );`,
        `CREATE TABLE IF NOT EXISTS images (
            image_id INTEGER PRIMARY KEY,
            recipe_id INTEGER NOT NULL,
            file_name TINYTEXT NOT NULL,
            created INTEGER,
            FOREIGN KEY(recipe_id) REFERENCES recipes(recipe_id)
    );`,
        `CREATE TABLE IF NOT EXISTS config_sorting (
            sorting_id INTEGER PRIMARY KEY,
            criteria TINYTEXT
    );`,
        `CREATE TABLE IF NOT EXISTS config_filter (
            filter_id INTEGER PRIMARY KEY,
            type TINYTEXT,
            criteria TINYTEXT
    );`
    ];

    let tablesCreated = 0;

    new Promise(resolve => {
        tables.forEach((table) => {
            db.transaction((transaction) => {
                transaction.executeSql(table);
            },
                (error) => {
                    console.log(error);
                }, () => {
                    console.log("table created");
                    tablesCreated++;
                    if (tablesCreated == tables.length) {
                        resolve();
                    }
                });
        });
    }).then(() => {
        getSortingMethod().then((res) => {
            if (!res) {
                initSortingCriteria();
            }
        });
    });
    //dropTable();
}

function dropTable() {
    db.transaction((transaction) => { transaction.executeSql("DROP TABLE config_sorting;") },
        (error) => console.log(error));
}

function initSortingCriteria() {
    db.transaction((transaction) => { transaction.executeSql("INSERT INTO config_sorting (criteria) VALUES(?);", SORTING_OPTIONS_DB[0]) },
        (error) => console.log(error));
}

export function getSortingMethod() {
    return new Promise(resolve => {
        db.readTransaction((transaction) => {
            transaction.executeSql("SELECT * FROM config_sorting", undefined, (res, res2) => {
                let rows;
                if (Platform.OS == "web") {
                    rows = res2.rows[0];
                } else {
                    rows = res2.rows._array[0];
                }
                resolve(rows ? { id: rows.sorting_id, criteria: rows.criteria } : undefined);
            });
        },
            (error) => {
                console.log(error);
            });
    });
}

export function getFilters() {
    return new Promise(resolve => {
        db.readTransaction((transaction) => {
            transaction.executeSql("SELECT * FROM config_filter", undefined, (res, res2) => {
                let rows;
                if (Platform.OS == "web") {
                    rows = res2.rows;
                } else {
                    rows = res2.rows._array;
                }
                resolve(rows ? rows : undefined);
            });
        },
            (error) => {
                console.log(error);
            });
    });
}

export function setSortingCriteria(id, criteria) {
    return new Promise(resolve => {
        db.transaction((transaction) => {
            transaction.executeSql("UPDATE config_sorting SET criteria = ? WHERE sorting_id = ?;", [criteria, id]);
        },
            (error) => {
                console.log(error);
            }, () => {
                resolve();
            });
    });
}

export function addFilter(type, criteria) {
    return new Promise(resolve => {
        db.transaction((transaction) => {
            transaction.executeSql("INSERT INTO config_filter (type, criteria) VALUES(?, ?);", [type, criteria], (res, res2) => {
                resolve(res2.insertId);
            },);
        },
            (error) => {
                console.log(error);
            });
    });
}

export function removeFilter(filterId) {
    return new Promise(resolve => {
        db.transaction((transaction) => {
            transaction.executeSql("DELETE FROM config_filter WHERE filter_id = ?;", [filterId]);
        },
            (error) => {
                console.log(error);
            }, () => {
                resolve();
            });
    });
}

export function updateFilter(id, type, criteria) {
    return new Promise(resolve => {
        db.transaction((transaction) => {
            transaction.executeSql("UPDATE config_filter SET type = ?, criteria = ? WHERE filter_id = ?;", [type, criteria.toString(), id]);
        },
            (error) => {
                console.log(error);
            }, () => {
                resolve();
            });
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
            transaction.executeSql("SELECT color FROM categories WHERE category_id=?", [id], (res, res2) => {
                if (Platform.OS == "web") {
                    resolve(res2.rows[0].color)
                } else {
                    resolve(res2.rows._array[0].color)
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

export function updateRecipe(recipe, id) {
    const query = `UPDATE recipes SET name = ?, instructions = ?, category_id = ?, rating = ?, duration = ? WHERE recipe_id = ?;`
    db.transaction((transaction) => {
        transaction.executeSql(query, [recipe.name, recipe.instructions, recipe.category, recipe.rating, recipe.duration, id]);
    }, (error) => console.log(error));
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

export function addImageToDatabase(recipeId, img) {
    db.transaction((transaction) => {
        transaction.executeSql("INSERT INTO images (recipe_id, file_name, created) VALUES(?, ?, ?);", [recipeId, img.filename, img.created]);
    });
}

function removeAllImagesForRecipe(recipeId) {
    getRecipePictureData(recipeId).then((images) => deleteImagesFromStorage(images));

    db.transaction((transaction) => {
        transaction.executeSql("DELETE FROM images WHERE recipe_id = ?;", [recipeId], (res, res2) => {
            console.log("Deleted images rows for recipeId " + recipeId);
        }, (err) => {
            console.log(err);
        });
    }, (err) => console.log(err));
}

export function removeImageAssetsForRecipe(recipeId, imageAssets) {
    imageAssets.forEach((asset) => {
        db.transaction((transaction) => {
            transaction.executeSql("DELETE FROM images WHERE recipe_id = ? AND file_name = ?;", [recipeId, asset.filename],
                undefined,
                (err) => {
                    console.log(err);
                });
        }, (err) => console.log(err), () => {
            console.log("Deleted image row " + asset.id + " for recipeId " + recipeId);
        });
    });

    deleteAssetsFromStorage(imageAssets);
}

export function getRecipeById(id) {
    return new Promise(resolve => {
        db.readTransaction((transaction) => {
            transaction.executeSql("SELECT * FROM recipes WHERE recipe_id=?", [id], (res, res2) => {
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

export function getRecipePictureData(recipeId) {
    return new Promise(resolve => {
        db.readTransaction((transaction) => {
            transaction.executeSql("SELECT file_name, created FROM images WHERE recipe_id=?", [recipeId], (res, res2) => {
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
