require('dotenv').config();
var express = require('express');
var mongoClient = require("mongodb").MongoClient;
const dbUrl = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/fcc-errpr`;
const appUrl = "http://localhost:3000/";
var app = express();

app.get("/new/*", function (request, response) {
  mongoClient.connect(dbUrl, (error, client) => {
    if(error) {
      console.log("Database error: " + error);
    } else {
      let db = client.db('fcc-errpr');
      let urls = db.collection("urls");
      let urlsCounter = db.collection("urls-counter");
      urls.findOne({ "url" : request.params[0] }).then(result => {
        if(result) {
          response.json({
            "original_url" : result["url"],
            "short_url" : appUrl + result["short_url"]
          });
          client.close();
        } else {
          response.json(result);
          client.close();
          // urlsCounter.findOneAndUpdate({"name":"urlCounter"}, {$inc:{"counterValue":1}}).then(result2 => {
          //   let counter = result2.value.counterValue;
          //   urls.insertOne({"url": request.params[0], "short_url": counter }).then(result3 => {
          //     response.json({"original_url": request.params[0], "short_url": appUrl + counter });
          //     client.close();
          //   });
          // }).catch(err => client.close());
        }
      });
      // if(url['0']) {
      //   response.json({
      //     "original_url" : url["0"]["original_url"],
      //     "short_url" : appUrl + url["0"]["id"]
      //   });
      // } else {
      //   let counter;
      //   urlsCounter.findOneAndUpdate({"name":"urlCounter"}, {$inc:{"counterValue":1}}).then(result => {

      //   });
      //   urls.insertOne({})
      // }

    }
  });
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
