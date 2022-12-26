export const FILTER_OPTIONS_FRIENDLY = ["Name", "Kategorie", "Bewertung", "Zubereitet", "Dauer"];
export const FILTER_OPTIONS_DB = ["name", "category", "rating", "last_cooked", "duration"];


export function filterRecipesByCriteria(recipes, filter) {
    if (filter.type === "none") return recipes;

    switch (filter.type) {
        case "name":
            return recipes.filter(recipe => recipe.name.toLowerCase().includes(filter.criteria.toLowerCase()));
        case "category":
            return recipes.filter(recipe => recipe.category_id == filter.criteria);
        case "rating":
            return recipes.filter(recipe => recipe.rating == filter.criteria);
        case "last_cooked":
            switch (filter.criteria.substring(0, 1)) {
                case "s":
                    return recipes.filter(recipe => recipe.last_cooked <= filter.criteria.substring(2));
                case "l":
                    return recipes.filter(recipe => recipe.last_cooked >= filter.criteria.substring(2));
            }
        case "duration":
            switch (filter.criteria.substring(0, 1)) {
                case "s":
                    return recipes.filter(recipe => recipe.duration <= filter.criteria.substring(2));
                case "l":
                    return recipes.filter(recipe => recipe.duration >= filter.criteria.substring(2));
            }
    }

    return recipes;
}

export function getInitialOperator(initialValue) {
    return letterToIndex(initialValue.substring(0, 1));
}

export function getInitialValue(initialValue) {
    return initialValue.substring(2);
}

export function isValid(number) {
    if (number.replace(/\s/g, '').length) { // not only whitespaces check
        if (/^\d+$/.test(number)) { // only numbers check
            return true;
        }
    }
    return false;
}

export function buildFilterCriteria(index, value) {
    return indexToLetter(index) + " " + value;
}

function indexToLetter(index) {
    if (index == 0) {
        return "l";
    } else {
        return "s";
    }
}

function letterToIndex(letter) {
    switch (letter) {
        case "l":
            return 0;
        case "s":
            return 1;
    }
}