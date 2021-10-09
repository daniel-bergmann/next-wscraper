let chrome = {};
let puppeteer;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  // running on the Vercel platform.
  chrome = require('chrome-aws-lambda');
  puppeteer = require('puppeteer-core');
} else {
  // running locally.
  puppeteer = require('puppeteer');
}

export default async function handler(req, res) {
  const getData = async (url) => {
    try {
      let browser = await puppeteer.launch({
        // args: [...chrome.args, '--hide-scrollbars', '--disable-web-security'],
        defaultViewport: chrome.defaultViewport,
        executablePath: await chrome.executablePath,
        headless: true,
        ignoreHTTPSErrors: true,
      });
      const page = await browser.newPage();
      const url = 'https://www.nytimes.com/section/world';

      await page.goto(url);

      // looking for combined elements
      const nytOutput = await page.evaluate(() =>
        Array.from(document.querySelectorAll('article')).map((d) => ({
          title: d.querySelector('h2, css-byk1jx').innerText.trim(),
          pic: d.querySelector('img').src,
          link: d.querySelector('a').href,
        }))
      );

      await browser.close();
      res.send({ nytOutput });
    } catch (err) {
      console.error(err);
      return null;
    }
  };
  getData();
}

// async function scrape() {
//   const browser = await chromium.puppeteer.launch({
//     args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
//     defaultViewport: chromium.defaultViewport,
//     executablePath: await chromium.executablePath,
//     headless: true,
//     ignoreHTTPSErrors: true,
//   });
//   const page = await browser.newPage();
//   const url = 'https://www.nytimes.com/section/world';

//   await page.goto(url);

//   // looking for combined elements
//   const nytOutput = await page.evaluate(() =>
//     Array.from(document.querySelectorAll('article')).map((d) => ({
//       title: d.querySelector('h2, css-byk1jx').innerText.trim(),
//       pic: d.querySelector('img').src,
//       link: d.querySelector('a').href,
//     }))
//   );

//   await browser.close();
//   res.status(200).json({ nytOutput });
// }
// calling function
// scrape();
