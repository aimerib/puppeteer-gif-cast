# Puppeteer GIF Cast

This little application was written out of necessity for writing documentation about UX/UI. All it does is starts a headless instance of puppeteer, loads the url passed to it, and scrolls the page taking screenshots. At the end it will stitch all the screenshots into one gif as if it was a screencast.

This utility expects two mandatory arguments:
* **URL:** the url of the website you want to screencast
* **NAME:** the name of the gif (.gif will be automatically appended at the end)

Other arguments that can also be passed to control the gif generation:
* Width: defaults to 768
* Height: defaults to 600
* Duration: how long to capture the gif for. Defaults to 60s
* Scroll: How far down to scroll the page per frame, in pixels. Defaults to 100. Higher numbers means the page will scroll farther per frame, which can be useful for long pages or pages that make heavy use of the browser scroll position.


GIFs are saved in the ./gifs/ folder at the end of the process.

## How to use it
clone the repository to your machine:

`git clone https://github.com/aimerib/puppeteer-gif-cast.git`

`cd puppeteer-gif-cast`

initialize the project

`npm install`

to grab a screencast of a website run the command like this:

`npm start http://everylastdrop.co.uk every-last-drop -- --scroll 500`

the generated gif will be located at ./gifs/every-last-drop.gif

![alt text](https://raw.githubusercontent.com/aimerib/aimerib.github.io/master/images/every-last-drop.gif "UK's Every Last Drop website screencast")


the scroll parameter can be ommited safely like so:

`npm start http://everylastdrop.co.uk every-last-drop`

![alt text](https://raw.githubusercontent.com/aimerib/aimerib.github.io/master/images/javascript.gif "Wikipedia's Javascript article")

***Important***

To ensure that optional parameters are sent correctly to the node process you MUST pass them after `--`
Please see examples below

## Help
```
npm start <url> <name>

starts capturing the gif at <url> and save it with <name>.gif

Positionals:
  url   the url to caputre a scrolling gif from                         [string]
  name  the name of the final gif file                                  [string]

Options:
      --help      Show help                                            [boolean]
      --version   Show version number                                  [boolean]
  -w, --width     Sets a width for the captured gif      [number] [default: 768]
  -h, --height    Sets a height for the captured gif     [number] [default: 600]
  -s, --scroll    How far to scroll down the per frame   [number] [default: 100]
  -d, --duration  Sets gif duration in seconds           [number]  [default: 60]
```
### Examples:
```bash
# capture gif using default values and saves it as every_last_drop.gif
npm start http://everylastdrop.co.uk every_last_drop
```

```bash
# capture gif with custom dimensions
npm start http://everylastdrop.co.uk every_last_drop -- --width 1080 --height 720
```

```bash
# capture gif for 120 seconds
npm start http://everylastdrop.co.uk every_last_drop -- --duration 120
```