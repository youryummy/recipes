import { Schema, model } from "mongoose";

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
    },
    ingredients: {
        type: ["String"],
        required:  [true, "Ingredients are required"]
    }
})

export default model("Recipe", recipeSchema, "recipe");