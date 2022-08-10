'use strict';

//A little setup ahead of time
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

let args = yargs(hideBin(process.argv))
    .usage('$0 <url> <name>', 'starts capturing the gif at <url> and save it with <name>.gif', (yargs) => {
        yargs.positional('url', {
            describe: 'the url to caputre a scrolling gif from',
            type: 'string'
        })
            .positional('name', {
                describe: "the name of the final gif file",
                type: "string"
            })
    })
    .option('width', {
        alias: 'w',
        type: 'number',
        description: 'Sets a width for the captured gif',
        default: 768
    })
    .option('height', {
        alias: 'h',
        type: 'number',
        description: 'Sets a height for the captured gif',
        default: 600
    })
    .option('scroll', {
        alias: 's',
        type: 'number',
        description: 'How far to scroll down the per frame',
        default: 100
    })
    .option('duration', {
        alias: 'd',
        type: 'number',
        description: 'Sets gif duration in seconds',
        default: 60
    })
    .example([
        ['npm start http://example.com example', 'capture gif using default values and saves it as example.gif'],
        ['npm start http://example.com example -- --width 1080 --height 720', 'capture gif with custom dimensions'],
        ['npm start http://example.com example -- --duration 120', 'capture gif for 120 seconds']
    ])
    .parse()

const { width, height, name, duration, url, scroll } = args;

const puppeteer = require('puppeteer');
const GIFEncoder = require('gif-encoder');
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

let file = require('fs').createWriteStream(gifDir + name + '.gif');



// Setup gif encoder and parameters
const encoder = new GIFEncoder(width, height);
encoder.setFrameRate(60);
encoder.pipe(file);
encoder.setQuality(40);
encoder.setDelay(500);
encoder.writeHeader();
encoder.setRepeat(0);

// Function Declarations
function addToGif(images, counter = 0) {
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

// This is where the magic happens:
(async () => {
    console.info(`Capturing gif "${name}.gif" with following parameters:`)
    console.info(`Origin URL: ${url}`)
    console.info(`Width: ${width}`)
    console.info(`Height: ${height}`)
    console.info(`Duration: ${duration}`)
    console.info(`Scroll length: ${scroll}\n`)

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();



    await page.setViewport({ width: width, height: height });
    await page.goto(url);

    async function scrollPage() {
        await page.evaluate(async (scrollLength) => {
            window.scrollBy(0, scrollLength);
        }, scroll);
    }

    for (let i = 0; i < duration; i++) {
        await page.screenshot({ path: workDir + i + ".png" });
        await scrollPage();
    }

    await browser.close();

    /* Creates array of pngs by listing files inside export folder then
    removing extention, sort numerical strings in ascending order, and
    finally adding path and extention to the file. */
    let listOfPNGs = fs.readdirSync(workDir)
        .map(a => a.substr(0, a.length - 4) + '')
        .sort(function (a, b) { return a - b })
        .map(a => workDir + a.substr(0, a.length) + '.png');

    addToGif(listOfPNGs);
})();

