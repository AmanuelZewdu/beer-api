const express = require("express");
const mongoose = require("mongoose");
const Beer = require("./models/beerModel");
const app = express();

app.use(express.json());

// routes

app.get("/", (req, res) => {
  res.send("Hello Node Api");
});

app.get("/blog", (req, res) => {
  res.send("Hello Beer, My name is Beer ");
});

// Get All beers
app.get("/beers", async (req, res) => {
  try {
    const beers = await Beer.find({});
    res.status(200).json(beers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Search beers by id

app.get("/beers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const beer = await Beer.findById(id);
    res.status(200).json(beer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search beers by name
app.get("/beers/search/:name", async (req, res) => {
  const searchTerm = req.params.name.toLowerCase();
  try {
    const beers = await Beer.find({
      name: { $regex: new RegExp(searchTerm, "i") },
    });
    res.status(200).json(beers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update beer rating
app.put("/beers/:id", async (req, res) => {
  const beerId = req.params.id;
  const newRating = req.body.rating;

  try {
    const beer = await Beer.findById(beerId);
    if (!beer) {
      res.status(404).json({ message: "Beer not found" });
      return;
    }

    beer.ratings.push(newRating);
    const averageRating =
      beer.ratings.reduce((acc, val) => acc + val, 0) / beer.ratings.length;
    beer.rating = averageRating;

    await beer.save();
    res.status(200).json({ message: "Beer rating updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Add Beer
app.post("/beer", async (req, res) => {
  try {
    const beer = await Beer.create(req.body);
    res.status(200).json(beer);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

mongoose
  .connect(
    "mongodb+srv://admin:123456789Aman@cluster0.ukddws6.mongodb.net/Node-API?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(3000, () => {
      console.log("Node API app is running on port 3000");
    });
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });
