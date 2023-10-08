const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();
const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;

const port = process.env.PORT || 3000;

mongoose.connect(
  `mongodb+srv://${username}:${password}@cluster0.fajufqy.mongodb.net/registrationFormDB`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Create a registration schema
const registrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Display the registration form
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Handle form submission and save data to MongoDB
app.post("/register", async (req, res) => {
  try {
    // Extract data from the request body
    const { name, email, password } = req.body;

    // Check if a user with the same email exists in MongoDB
    const existingUser = await Registration.findOne({ email });

    if (!existingUser) {
      // Create a new registration document
      const registrationData = new Registration({
        name,
        email,
        password,
      });

      // Save the document to MongoDB
      await registrationData.save();

      // Redirect to success page upon successful registration
      res.redirect("/success");
    } else {
      // Redirect to an error page if the user already exists
      res.redirect("/error");
    }
  } catch (err) {
    // Handle any errors that occur during registration
    console.error(err);
    res.redirect("/error");
  }
});

// Display a success page after successful registration
app.get("/success", (req, res) => {
  res.sendFile(__dirname + "/views/success.html");
});

// Display an error page in case of any errors
app.get("/error", (req, res) => {
  res.sendFile(__dirname + "/views/error.html");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
