let express = require('express');
let app = express();
let gif = require('./puppeteer-gif-cast.js');
const fs = require("fs");
let path = require('path');
const width = 768;
const height = 600;
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
  res.locals.name = name;
  //gif.createGifFromArray(await gif.createGifDataArray(url, 100, width, height),width,height, res);
  //console.log(await gif.createGIF(url,name));
  //let listOfGifs = fs.readdirSync('./gifs').filter(function(file) { return path.extname(file) === '.gif';})
    console.log(await gif.createGifFromArray(await gif.createGifDataArray(url, 100, width, height),width,height, res))
  
    
});

app.get('/view', async function (req, res){
  let listOfGifs = fs.readdirSync('./gifs').filter(function(file) { return path.extname(file) === '.gif';})
 res.render('gif.ejs', { gifs: listOfGifs});
    
});


app.post('/', function (req, res) {
    res.render('add.ejs');
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});


