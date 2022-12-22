export const SORTING_OPTIONS_FRIENDLY = ["Name", "Kategorie", "Bewertung", "Lange nicht zubereitet", "Dauer"];
export const FILTER_OPTIONS_FRIENDLY = ["Name", "Kategorie", "Bewertung", "Zubereitet", "Dauer"];

export const SORTING_OPTIONS_DB = ["name", "category", "rating", "last_cooked", "duration"];
export const FILTER_OPTIONS_DB = ["name", "category", "rating", "last_cooked", "duration"];

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

export function filterRecipesByCriteria(recipes, filterCriteria) {
    if (filterCriteria.type === "none") return recipes;

    switch (filterCriteria.type) {
        case "name":
            return recipes.filter(recipe => recipe.name.toLowerCase().includes(filterCriteria.criteria.toLowerCase()));
        case "category":
            return recipes.filter(recipe => recipe.category_id == filterCriteria.criteria);
    }

    return recipes;
}