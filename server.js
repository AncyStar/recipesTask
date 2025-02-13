const express = require("express");
const cors = require("cors");
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const app = express();

const URL = process.env.DB || "mongodb://localhost:27017";
mongoose.connect(URL);

const { Recipe } = require("./model/recipeModel");

console.log("Mongoose Connected!");

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.post("/recipe", async (req, res) => {
  try {
    const recipe = new Recipe({
      title: req.body.title,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
    });
    await recipe.save();
    res.status(201).json({ message: "Recipe Added Successfully", recipe });
  } catch (error) {
    res.status(400).json({ message: "Validation Error!" });
  }
});

app.get("/recipes", async (req, res) => {
  try {
    let recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Error Fetching Recipes" });
  }
});

app.get("/recipe/:id", async (req, res) => {
  try {
    let recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe Not Found" });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: "Error Fetching Recipe" });
  }
});

app.put("/recipe/:id", async (req, res) => {
  let updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!updatedRecipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }
  res.json({ message: "Recipe Updated Successfully", updatedRecipe });
});

app.delete("/recipe/:id", async (req, res) => {
  const deleteRecipe = await Recipe.findByIdAndDelete(req.params.id);
  if (!deleteRecipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }
  res.json({ message: "Recipe Deleted Successfully" });
});

app.listen(3000);
