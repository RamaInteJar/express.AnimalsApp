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
});

const Animal = model("Animal", animalsOfAfricaSchema);

////////////////////////////////////////////////////
// Middleware
/////////////////////////////////////////////////////
const app = express();
app.set('view engine', 'ejs')
app.use(morgan("tiny")); //logging
app.use(methodOverride("_method")); // override for put and delete requests from forms
app.use(express.urlencoded({ extended: true })); // parse urlencoded request bodies
app.use(express.static("public")); // serve files from public statically

app.get("/", (req, res) => {
  res.send("Hello from the server side!!");
});

//Seed Route: this route will delete everything in our database related to animals 
//and re-seed with some starter data 
app.get("/animals/seed", async (req, res) => {
  const animalsOfAfrica = [
    {
      species: "African Elephant",
      extinct: false,
      location: "Sub-Saharan Africa",
      lifeExpectancy: 60,
      image: ""
    },
    {
      species: "Lion",
      extinct: false,
      location: "Various regions in Africa",
      lifeExpectancy: 10,
      image: ""
    },
    {
      species: "Giraffe",
      extinct: false,
      location: "Savannas of Africa",
      lifeExpectancy: 25,
      image: "https://images.unsplash.com/photo-1486688680290-be46662593bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
    },
    {
      species: "Cheetah",
      extinct: false,
      location: "Various regions in Africa",
      lifeExpectancy: 12,
      image: ""
    },
    {
      species: "African Buffalo",
      extinct: false,
      location: "Sub-Saharan Africa",
      lifeExpectancy: 25,
      image: ""
    },
  ];

  await Animal.deleteMany({});
  const createdAnimals = await Animal.create(animalsOfAfrica);
  res.json(createdAnimals);
});

app.get('/animals', async(req, res)=>{
  const animals = await Animal.find();
  res.render('animals/index.ejs', {animals}) 
})

app.get('/animals/new', (req, res)=>{
  res.render('animals/new.ejs')
})

//show Route:Display the full content of the animal with the specified ID
app.get("/animals/:id", async(req, res)=>{
  const id = req.params.id
  const animal = await Animal.findById(id)
  res.render("animals/show.ejs", {animal})
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Hello from the server side ${PORT}`);
});
