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
            result(res2.rows[0]["count(*)"] == 0)
        });
    });
}

export function getAllCategories(results) {
    db.readTransaction((transaction) => {
        transaction.executeSql("SELECT * from categories", undefined, (res, res2) => {
            const rows = res2.rows;
            const arr = [];
            for (let i = 0; i < rows.length; ++i) {
                arr.push(rows[i]);
            }
            results(arr)
        });
    },
        (error) => {
            console.log(error);
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

}

