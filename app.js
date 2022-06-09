// Web server config
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

// creating an app using express
const app = express();
// Setting ejs as a viewing engine
app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(express.static("public"));

// Setup mongoose connection:
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/wikidb");
}

// Schema
const articleSchema = {
  title: String,
  content: String
};
// Creating model
const Article = mongoose.model("Article", articleSchema);

// ///////////////////////// Requests targeting all Articles //////////////////

app.route("/articles")
  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (!err) {
        res.send("Successfully added a new article.");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("Successfully deleted all articles.");
      }
    });
  });

/////////////////////////// Requests targeting a Specific Articles //////////////////

app.route("/articles/:articleTitle")

  .get(function(req, res) {
    Article.findOne({ title: req.params.articleTitle }, function(err, foundArticle) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No articles matching that title was found.");
      }
    });
  })

  .put(function(req, res) {
    Article.replaceOne(
      {title: req.params.articleTitle},
      req.body,
      function(err) {
        if (!err) {
          res.send("Successfully updated!");
        } else {
          res.send(err);
        }
      }
    );
  });

// Updating one field of data in the document
app.patch("/articles/:articleTitle", function(req, res) {
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err) {
      if (!err) {
        res.send("Successfully updated article!");
      } else {
        res.send(err);
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
