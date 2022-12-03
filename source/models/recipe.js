const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    summary: {
        type:String,
        required: true
    },
    verified: {
        type: Boolean,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    steps: {
        type: ["String"],
        required: true
    },
    tags: {
        type: ["String"],
        required:  true
    }
})

recipeSchema.methods.cleanup = function(){
    return {
        name: this.name,
        summary: this.summary,
        duration: this.duration,
        steps: this.steps,
        tags: this.tags
    }
}

const Recipe = mongoose.model("Recipe", recipeSchema);
module.exports = Recipe;
