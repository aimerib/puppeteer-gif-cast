"use strict";
exports.createGifDataArray = async function(passedURL, scroll, width, height) {
  const puppeteer = require("puppeteer");
  const getPixels = require("get-pixels");
  let scrollLength = scroll != undefined ? scroll : 100;
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();

  await page.setViewport({ width: width, height: height });
  await page.goto(passedURL);

  async function scrollPage() {
    await page.evaluate(async scrollLength => {
      window.scrollBy(0, scrollLength);
    }, scrollLength);
  }
  let pixelData = [];

  for (let i = 0; i < 60; i++) {
    getPixels(
        await page.screenshot({ path: "test.png" }),
        'image/png',
        function(err, pixels){
            pixelData.push(pixels.data);
        }
    );
    await scrollPage();
    //console.log(pixelData);
  }

  await browser.close();

  //let test = addToGif(listOfPNGs);

  return pixelData;
};

exports.createGifFromArray = async function(dataArray, width, height, response){
    var GIFEncoder = require('gifencoder');
    function createGifEncoder(resolution, response) {

        var encoder = new GIFEncoder(resolution.width, resolution.height);
      
        var stream = encoder.createReadStream();
        response.type("gif");
        //console.log(response);
        stream.pipe(response);
      
        encoder.start();
        encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
        encoder.setDelay(150);  // frame delay in ms
        encoder.setQuality(15); // image quality. 10 is default.
      
        return encoder;
      
      }

      function sendAsGIF(response, data) {

        var encoder = createGifEncoder({width, height}, response);
        for (let i = 0; i < data.length; i++) {
            encoder.addFrame(data[i])
        }
        encoder.finish();
        return encoder;
      
      };
      return sendAsGIF(response, dataArray);

};