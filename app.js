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

// create a get route that fetches all the articles
app.get("/articles", function (req, res) {
  Article.find(function (err, foundArticles) {
    if (!err) {
    // sending all items from our database to browser
      res.send(foundArticles);
    } else {
      res.send(err);
    };
  });
});

// POST requests
app.post("/articles", function (req, res) {
  
  const newArticle = new Article ({
    title: req.body.title,
    content:req.body.content
  });

  newArticle.save(function (err) {
    if(!err) {
      res.send("Successfully added a new article.");
    } else {
      res.send(err);
    }

  });

});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

