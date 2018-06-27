let express = require('express');
let app = express();
let gif = require('./puppeteer-gif-cast.js');
const fs = require("fs");
var path = require('path');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('gifs'))
// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
    res.render('add.ejs');
  //res.send('hello world')
});

app.post('/create', async function (req, res){
  let url = req.body.url;
  let name = req.body.name;
  await gif.createGIF(url, name)
  let listOfGifs = fs.readdirSync('./gifs').filter(function(file) { return path.extname(file) === '.gif';})
  //res.send(`<a href="${name}.gif">${name} GIF</a>`);
 res.render('gif.ejs', { gifs: listOfGifs});
    
});

app.get('/test', async function (req, res) {
    //let url = req.params[0];
    //let name = req.params.name;
    //await gif.createGIF(url, name);
    //res.send('gif created', url);
  })

app.listen(4000, () => console.log('Example app listening on port 3000!'))


