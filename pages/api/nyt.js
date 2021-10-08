const puppeteer = require('puppeteer');
const chromium = require('chrome-aws-lambda');
// // const cors = require('cors');
// // const app = express();
// // app.use(cors());

export default async function handler(req, res) {
  async function scrape() {
    const browser = await chromium.puppeteer.launch({
      executablePath: await chromium.executablePath,
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
    res.status(200).json({ nytOutput });
  }
  // calling function
  scrape();
}
