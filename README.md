# Puppeteer GIF Cast

This little application was written out of necessity for writing documentation about UX/UI. All it does is starts a headless instance of puppeteer, loads the url passed to it, and scrolls the page taking screenshots. At the end it will stitch all the screenshots into one gif as if it was a screencast.

This utility expects two mandatory arguments and one optional:
* **URL:** the url of the website you want to screencast
* **NAME:** the name of the gif (.gif will be automatically appended at the end)
* ScrollBy: the ammount of scroll to use during the scrolling. If nothing is passed it will scroll by 100 pixels.

GIFs are saved in the ./gifs/ folder at the end of the process.

## TO DO
* Implement W x H parameters. Right now it defaults to 768x600
* Implement duration time. Right now it takes 60 screenshots and stops
* Make code more resilient. Any invalid arguments or parameters break the code as it is.