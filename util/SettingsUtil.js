export const SORTING_OPTIONS_FRIENDLY = ["Name", "Kategorie", "Bewertung", "Lange nicht zubereitet", "Dauer"];
export const FILTER_OPTIONS_FRIENDLY = ["Kein Filter", "Name", "Kategorie", "Bewertung", "Zubereitet", "Dauer"];

export const SORTING_OPTIONS_DB = ["name", "category", "rating", "last_cooked", "duration"];
export const FILTER_OPTIONS_DB = ["none", "name", "category", "rating", "last_cooked", "duration"];

export const SORTING_OPTIONS = {};

SORTING_OPTIONS["name"] = "Name";
SORTING_OPTIONS["category"] = "Kategorie";
SORTING_OPTIONS["rating"] = "Bewertung";
SORTING_OPTIONS["last_cooked"] = "Lange nicht zubereitet";
SORTING_OPTIONS["duration"] = "Dauer";

export function sortRecipesByCriteria(recipes, criteria) {
    switch (criteria) {
        case "name":
            return recipes.sort(compareByName);
        case "category":
            return recipes.sort(compareByCategory);
        case "rating":
            return recipes.sort(compareByRating);
        case "last_cooked":
            return recipes.sort(compareByLastCooked);
        case "duration":
            return recipes.sort(compareByDuration);
    }

    return recipes;
}

function compareByName(a, b) {
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }
    return 0;
}

function compareByCategory(a, b) {
    if (a.category_id < b.category_id) {
        return -1;
    }
    if (a.category_id > b.category_id) {
        return 1;
    }
    return 0;
}

function compareByRating(a, b) {
    if (a.rating < b.rating) {
        return 1;
    }
    if (a.rating > b.rating) {
        return -1;
    }
    return 0;
}

function compareByLastCooked(a, b) {
    if (a.last_cooked < b.last_cooked) {
        return -1;
    }
    if (a.last_cooked > b.last_cooked) {
        return 1;
    }
    return 0;
}


function compareByDuration(a, b) {
    if (a.duration < b.duration) {
        return -1;
    }
    if (a.duration > b.duration) {
        return 1;
    }
    return 0;
}