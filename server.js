require("dotenv").config(); // Load ENV Variables
const express = require("express"); // import express
const app = express();
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
  .on("open", () => console.log("Connected to Mongoose"))
  .on("close", () => console.log("Disconnected from Mongoose"))
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

const AnimalsOfAfrica = model("AnimalsOfAfrica", animalsOfAfricaSchema);

////////////////////////////////////////////////////
// Middleware
/////////////////////////////////////////////////////
app.use(morgan("tiny")); //logging
app.use(methodOverride("_method")); // override for put and delete requests from forms
app.use(express.urlencoded({ extended: true })); // parse urlencoded request bodies
app.use(express.static("public")); // serve files from public statically


app.get("/", (req, res)=>{
    res.send("Your server is running...You better catch it")
})

//Seed Route: this route will delete everything in our data base related to animals 
//and re-seed with some starter data 
app.get("/animals/seed", async (req, res) => {
  const animalsOfAfrica = [
    {
      species: "African Elephant",
      extinct: false,
      location: "Sub-Saharan Africa",
      lifeExpectancy: 60,
    },
    {
      species: "Lion",
      extinct: false,
      location: "Various regions in Africa",
      lifeExpectancy: 10,
    },
    {
      species: "Giraffe",
      extinct: false,
      location: "Savannas of Africa",
      lifeExpectancy: 25,
    },
    {
      species: "Cheetah",
      extinct: false,
      location: "Various regions in Africa",
      lifeExpectancy: 12,
    },
    {
      species: "African Buffalo",
      extinct: false,
      location: "Sub-Saharan Africa",
      lifeExpectancy: 25,
    },
  ];

  await AnimalsOfAfrica.deleteMany({});
  const createdAnimals = await AnimalsOfAfrica.create(animalsOfAfrica);
  res.json(createdAnimals);
});

//Index Route:  Retrieve and return a list of all the data
app.get("/animals", async(req, res)=>{
    const animals = await AnimalsOfAfrica.find({})
    res.render("/animals/index.ejs", {animals})
})



const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Hello from the server side ${PORT}`);
});
