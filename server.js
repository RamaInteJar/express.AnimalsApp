require("dotenv").config(); // Load ENV Variables
const express = require("express"); // import express
const morgan = require("morgan"); //import morgan
const methodOverride = require("method-override");
const mongoose = require("mongoose");

// Database Connection
/////////////////////////////////////////////
// Setup inputs for our connect function
const DATABASE_URL = process.env.DATABASE_URL;
const CONFIG = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Establish Connection
mongoose.connect(DATABASE_URL, CONFIG);

// Events for when connection opens/disconnects/errors
mongoose.connection
  .on("open", () => console.log("Connected to MongoDB"))
  .on("close", () => console.log("Disconnected from MongoDB"))
  .on("error", (error) => console.log(error));

// Our Models
////////////////////////////////////////////////
// pull schema and model from mongoose
const { Schema, model } = mongoose;

const animalsOfAfricaSchema = new Schema({
  species: String,
  extinct: Boolean,
  location: String,
  lifeExpectancy: Number,
  image: String, // Add an 'image' field to the schema
});

const Animal = model("Animal", animalsOfAfricaSchema);

////////////////////////////////////////////////////
// Middleware
/////////////////////////////////////////////////////
const app = express();
app.set("view engine", "ejs");
app.use(morgan("tiny")); //logging
app.use(methodOverride("_method")); // override for put and delete requests from forms
app.use(express.urlencoded({ extended: true })); // parse urlencoded request bodies
app.use(express.static("public")); // serve files from public statically

// Hello Route
app.get("/", (req, res) => {
  res.send("Hello from the server side!!");
});

// Seed Route: Delete existing data and reseed with starter data
app.get("/animals/seed", async (req, res) => {
  const animalsOfAfrica = [
    // ... (Array of starter animal data)
  ];

  await Animal.deleteMany({});
  const createdAnimals = await Animal.create(animalsOfAfrica);
  res.json(createdAnimals);
});

// Index Route: Display a list of all animals
app.get("/animals", async (req, res) => {
  const animals = await Animal.find();
  res.render("animals/index.ejs", { animals });
});

// New Route: Render form to add a new animal
app.get("/animals/new", (req, res) => {
  res.render("animals/new.ejs");
});

// Delete Route: Delete a specific animal by its ID
app.delete("/animals/:index", async (req, res) => {
  const idToDelete = req.params.index;
  await Animal.findByIdAndDelete(idToDelete);
  res.redirect("/animals");
});

// Show Route: Display details of a specific animal by its ID
app.get("/animals/:id", async (req, res) => {
  const id = req.params.id;
  const animal = await Animal.findById(id);
  res.render("animals/show.ejs", { animal });
});

// Create Route: Add a new animal to the database
app.post("/animals", async (req, res) => {
  req.body.extinct = req.body.extinct === "on" ? true : false;
  await Animal.create(req.body);
  res.redirect("/animals");
});

// Edit Route: Render form to edit an existing animal
app.get("/animals/:id/edit", async (req, res) => {
  const id = req.params.id;
  const animal = await Animal.findById(id);
  res.render("animals/edit.ejs", { animal });
});

const PORT = process.env.PORT || 3300;

// Start the server
app.listen(PORT, () => {
  console.log(`Hello from the server side ${PORT}`);
});
