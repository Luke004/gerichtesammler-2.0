export class Recipe {

    /*
    constructor(obj) {
        obj = obj != null ? obj : {};
        this.id = obj.id != null ? obj.id : '';
        this.name = obj.name != null ? obj.name : '';
        this.instructions = obj.instructions != null ? obj.instructions : '';
        this.category = obj.category != null ? obj.category : '';
        this.pictures = obj.pictures != null ? obj.pictures : '';
        this.rating = obj.rating != null ? obj.rating : '';
        this.duration = obj.duration != null ? obj.duration : '';
        this.lastCooked = obj.lastCooked != null ? obj.lastCooked : '';
    }
    */

    constructor(name, instructions, category) {
        this.id = Math.random();
        this.name = name;
        this.instructions = instructions;
        this.category = category;
    }


    getLastCookedInfo() {
        if (!this.lastCooked) return "-"

        if (this.lastCooked == 1) {
            return "gestern";
        }
        if (this.lastCooked >= 2 && this.lastCooked <= 6) {
            return "vor " + this.lastCooked + " Tagen";
        }
        if (this.lastCooked >= 7 && this.lastCooked <= 30) {
            const weeks = Math.floor(this.lastCooked / 7);
            return "vor " + Math.floor(this.lastCooked / 7) + (weeks == 1 ? " Woche" : " Wochen");
        }
        if (this.lastCooked >= 31 && this.lastCooked <= 364) {
            const months = Math.floor(this.lastCooked / 31);
            return "vor " + Math.floor(this.lastCooked / 31) + (months == 1 ? " Monat" : " Monaten");
        }
        if (this.lastCooked >= 365) {
            const years = Math.floor(this.lastCooked / 365);
            return "vor " + Math.floor(this.lastCooked / 365) + (years == 1 ? " Jahr" : " Jahren");
        }

        return "-"
    }

    getDurationInfo() {
        if (!this.duration) return "keine Angabe"

        if (this.duration <= 59) {
            return this.duration + " Min."
        }
        if (this.duration >= 60) {
            const hours = Math.floor(this.duration / 60);
            let minutes = Math.floor(this.duration % 60);
            if (minutes <= 9) {
                minutes = "0" + minutes;
            }
            return hours + ":" + minutes + " Std.";
        }

        return "keine Angabe"
    }
}