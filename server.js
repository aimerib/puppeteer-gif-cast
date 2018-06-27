let express = require('express');
let app = express();
let gif = require('./puppeteer-gif-cast.js');
const fs = require("fs");
var path = require('path');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('gifs'))

app.get('/', function (req, res) {
    res.render('add.ejs');
});

app.post('/create', async function (req, res){
  let url = req.body.url;
  let name = req.body.name;
  await gif.createGIF(url, name);
  //let listOfGifs = fs.readdirSync('./gifs').filter(function(file) { return path.extname(file) === '.gif';})
 //res.render('gif.ejs', { gifs: listOfGifs});
  setTimeout(function () {
    res.redirect('/view');
}, 1000);
  
    
});

app.get('/view', async function (req, res){
  let listOfGifs = fs.readdirSync('./gifs').filter(function(file) { return path.extname(file) === '.gif';})
 res.render('gif.ejs', { gifs: listOfGifs});
    
});


app.post('/', function (req, res) {
    res.render('add.ejs');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});


