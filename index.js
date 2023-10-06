const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();
const password = process.env.MONGO_PASSWORD;

const port = process.env.PORT || 3000;

// Connect to MongoDB
const connection = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://deepesh85b:${password}@cluster0.fajufqy.mongodb.net/registrationFormDB`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("database connected!");
  } catch (error) {
    console.log("Error while connection with database", error.message);
  }
}

connection();
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
  console.log(req.body);
  const { name, email, password } = req.body;
  // Create a new registration document
  const registrationData = new Registration({
    name,
    email,
    password,
  });

  try {
    // Save the document to MongoDB using await
    await registrationData.save();
    // find this registrationData in mongodb
    const data = await Registration.findOne({
      username: registrationData.username,
    });
    console.log(data);
    res.redirect("/success");
  } catch (err) {
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
