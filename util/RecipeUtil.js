export function convertToReadableLastCookedInfo(lastCooked, detailed = false) {
    if (lastCooked == -1) {
        return detailed ? "noch nie" : "-";
    }
    if (lastCooked == 0) {
        return "heute";
    }
    if (lastCooked == 1) {
        return "gestern";
    }
    if (lastCooked >= 2 && lastCooked <= 6) {
        return "vor " + lastCooked + " Tagen";
    }
    if (lastCooked >= 7 && lastCooked <= 30) {
        const weeks = Math.floor(lastCooked / 7);
        return "vor " + Math.floor(lastCooked / 7) + (weeks == 1 ? " Woche" : " Wochen");
    }
    if (lastCooked >= 31 && lastCooked <= 364) {
        const months = Math.floor(lastCooked / 31);
        return "vor " + Math.floor(lastCooked / 31) + (months == 1 ? " Monat" : " Monaten");
    }
    if (lastCooked >= 365) {
        const years = Math.floor(lastCooked / 365);
        return "vor " + Math.floor(lastCooked / 365) + (years == 1 ? " Jahr" : " Jahren");
    }

    return "-";
}

export function convertToReadableDurationInfo(duration) {
    if (!duration) return "keine Angabe"

    if (duration <= 59) {
        return duration + " Min."
    }
    if (duration >= 60) {
        const hours = Math.floor(duration / 60);
        let minutes = Math.floor(duration % 60);
        if (minutes <= 9) {
            minutes = "0" + minutes;
        }
        return hours + ":" + minutes + " Std.";
    }

    return "keine Angabe"
}