const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minLength: 1,
        maxLength: 100,
    },
    summary: {
        type:String,
        required: false,
        minLength: 1,
        maxLength: 1000
    },
    duration: {
        type: Number,
        required: [true, "Duration is required"],
        min: 0,
        validate:{
            validator: Number.isInteger
        }
    },
    steps: {
        type: ["String"],
        required: [true, "Steps are required"]
    },
    tags: {
        type: ["String"],
        required:  [true, "Tags are required"]
    },
    createdBy:{
        type: String
    },
    imageUrl:{
        type: String
    }
})

recipeSchema.methods.cleanup = function(){
    return {
        _id: this._id,
        name: this.name,
        summary: this.summary,
        duration: this.duration,
        steps: this.steps,
        tags: this.tags,
        createdBy:this.createdBy,
        imageUrl: this.imageUrl

    }
}

const Recipe = mongoose.model("Recipe", recipeSchema);
module.exports = Recipe;
