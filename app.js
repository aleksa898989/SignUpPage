// jshint esversion: 6
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.use(express.static("public"));
// ova linija koda omogućava da se koriste i stvari sa lokala i CDN
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;

  var data = {
    members: [
      {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }
  ]
};

  var jsonData = JSON.stringify(data);

  var options = {
    url: "https://us20.api.mailchimp.com/3.0/lists/940651ec06",
    method: "POST",
    headers: {
      "Authorization": "aleksa1 963c23c5ea68d24f7a648bc20a2e28b6-us20"
    },
    body: jsonData
  };

  request(options, function(error, response, body) {
    if (error) {
      res.sendFile(__dirname + "/failure.html");
    } else {
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    }
  });
  console.log(firstName, lastName, email);
  // ovde uz pomoć bodyParsera izvačim iz htmla elemente po njihovom imenu i koristim ovde
});


// ovo je da za slucaj da signin ne radi korisnik vrati na početnu stranicu
app.post("/failure.html" , function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("server is running at port 3000");
});
// process.env.PORT je dinamic port, on omogućava da server bira sam PORT koji želi a u isto vreme radi i na localhost:3000

// 963c23c5ea68d24f7a648bc20a2e28b6-us20 API key
// 940651ec06 List ID
