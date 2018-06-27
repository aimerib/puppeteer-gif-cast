'use strict';
//A little setup ahead of time
const width = 768;
const height = 600;
const puppeteer = require('puppeteer');
const GIFEncoder = require('gif-encoder');
const encoder = new GIFEncoder(width, height);
const fs = require('fs');
const getPixels = require('get-pixels');
const workDir = './temp/';
const gifDir = './gifs/';

if (!fs.existsSync(workDir)) {
    fs.mkdirSync(workDir);
};

if (!fs.existsSync(gifDir)) {
    fs.mkdirSync(gifDir);
};

let url = process.argv[2];
let finalGif = process.argv[3];
let scrollLength = (process.argv[4] != undefined) ? process.argv[4] : 100;


// Setup gif encoder parameters
encoder.setFrameRate(60);
encoder.pipe(file);
encoder.setQuality(40);
encoder.setDelay(500);
encoder.writeHeader();
encoder.setRepeat(0);

//Function Declaration

function addToGif(images, counter = 0) {
    let file = require('fs').createWriteStream(gifDir + finalGif + '.gif');
    getPixels(images[counter], function (err, pixels) {

        encoder.addFrame(pixels.data);
        encoder.read();
        if (counter === images.length - 1) {
            encoder.finish();
            cleanUp(images, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    fs.rmdirSync(workDir);
                    console.log('Gif created!');
                    process.exit(0);
                }
            });

        } else {
            addToGif(images, ++counter);
        }
    })
}



function cleanUp(listOfPNGs, callback) {
    let i = listOfPNGs.length;
    listOfPNGs.forEach(function (filepath) {
        fs.unlink(filepath, function (err) {
            i--;
            if (err) {
                callback(err);
                return;
            } else if (i <= 0) {
                callback(null);
            }
        });
    });
}

exports.createGIF = async function (passedURL, passedFinal) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();



    await page.setViewport({ width: width, height: height });
    await page.goto(passedURL);

    async function scrollPage() {
        await page.evaluate(async (scrollLength) => {
            window.scrollBy(0, scrollLength);
        }, scrollLength);
    }

    for (let i = 0; i < 60; i++) {
        await page.screenshot({ path: workDir + i + ".png" });
        await scrollPage();
    }

    await browser.close();

    /*Creates array of pngs by listing files inside export folder then
    removing extention, sort numerical strings in ascending order, and
    finally adding path and extention to the file. */
    let listOfPNGs = fs.readdirSync(workDir)
        .map(a => a.substr(0, a.length - 4) + '')
        .sort(function (a, b) { return a - b })
        .map(a => workDir + a.substr(0, a.length) + '.png');

    addToGif(listOfPNGs);
};
