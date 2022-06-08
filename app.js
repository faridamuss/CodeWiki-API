// Web server config
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;

// creating an app using express
const app = express();
// Setting ejs as a viewing engine
app.set('view engine', 'ejs');

// Setup mongoose connection:
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/wikidb');
}

// Schema
const articleSchema = {
  title: String, 
  content: String
}
// Creating model
const Article = mongoose.model ("Article", articleSchema);

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));



// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.send('hello world')
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

