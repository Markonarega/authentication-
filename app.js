require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption');

mongoose.connect("mongodb://localhost:27017/userdb")
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}
));

const userSchema = new mongoose.Schema({
    email: String,
    paswords: String, Number
});
console.log(process.env.API_KEY)
userSchema.plugin(encrypt, { secret: process.env.secret, encryptedFields: ["password"] });


const User = new mongoose.model("user", userSchema);

app.get('/', (req, res) => {
    res.render("home")
})
app.get('/login', (req, res) => {
    res.render("login")
})
app.get('/register', (req, res) => {
    res.render("register")
})


app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password // Corrected spelling of "password"
    });

    // Move save logic inside this function
    newUser.save();

    res.render("secrets")

});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by email
        const foundUser = await User.findOne({ email: username });
        if (foundUser.pasword === password) {
        }
        res.render("secrets");

    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while processing your request.");
    }
});



app.listen(3000, () => {
    console.log('listening on 3000')
})