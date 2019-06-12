//SPDX-License-Identifier: Apache-2.0

// nodejs server setup 

// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var http = require('http')
var fs = require('fs');
var Fabric_Client = require('fabric-client');
var path = require('path');
var util = require('util');
var os = require('os');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

var cors = require('cors');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

// Middleware
app.use(bodyParser.json());
app.use(methodOverride('_method'));
//app.set('view engine', 'ejs');

// Mongo URI
var MongoClient = require('mongodb').MongoClient;
const mongoURI = 'mongodb://localhost:27017/Images';
const mongoURL = 'mongodb://localhost:27017/Users';

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: "Helmi",
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

app.get('/', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      res.render('index', { files: false });
    } else {
      files.map(file => {
        if (
          file.contentType === 'image/jpeg' ||
          file.contentType === 'image/png'
        ) {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
      res.render('index', { files: files });
    }
  });
});

app.get('/image/:fileHash', (req, res) => {
  console.log(req.params.fileHash)
  gfs.files.findOne({ md5: req.params.fileHash }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ file: req.file });
  //res.redirect('/');
});

app.post('/AddUser', (req, res) => {
  var name = req.body.name;
  MongoClient.connect(mongoURL, function (err, db) {
    if (err) throw err;
    // db pointing to newdb
    console.log("Switched to " + db.databaseName + " database");
    var doc = {
      name: name,
      Tokens: []
    };
    db.collection("users").insertOne(doc, function (err, res) {
      if (err) throw err;
      console.log("Document inserted");
    });
    res.send(doc)
  })
})

app.post('/EditTokenList', (req, res) => {
  var TokenId = req.body.TokenId;
  var _name = req.body.name;
  MongoClient.connect(mongoURL, function (err, db) {
    if (err) throw err;
    // db pointing to newdb
    console.log("Switched to " + db.databaseName + " database");
    //
    
    db.collection("users").findOne({ "name": _name })
      .then(item => {
       // console.log(item.Tokens)
        var aa=item.Tokens
        //console.log(aa)
        aa.push(TokenId)
        //console.log(item.Tokens)
         var Newdoc={
           name:_name,
           Tokens:aa
         }
        db.collection("users").updateOne({ "name": _name }, Newdoc, function (err, res) {
          if (err) throw err;
          console.log("1 document updated");
        });
        res.send(Newdoc)
      })
      .catch(err => {
        res.send(err)
      })
    
  })
})

app.get('/GetTokenList/:user', (req, res) => {
  var name = req.params.user
  MongoClient.connect(mongoURL, function (err, db) {
    if (err) throw err;
    // db pointing to newdb
    console.log("Switched to " + db.databaseName + " database");
    db.collection("users").findOne({ "name": name })
      .then(item => {
        res.send(item.Tokens)
      })
      .catch(err => {
        res.send("Can not Find this user")
      })
  })

});

app.get('/hello', (req, res) => {
  res.json("Hello Helmi");
  //res.redirect('/');
});


require('./routes.js')(app);


//app.use(express.static(path.join(__dirname, './client')));

// Save our port
var port = process.env.PORT || 3000;

// Start the server and listen on port 
app.listen(port, function () {
  console.log("Live on port: " + port);
});

