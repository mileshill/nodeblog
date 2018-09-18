/**
 * Make sure to include 'await' with any command using puppeteer
 */

const puppeteer = require('puppeteer');
const APP='localhost:3000';

// Launch new chromium instance
test('Brand logo in header', async () => {
    // Open browser
    const browser = await puppeteer.launch({
        headless: false
    });
    // Open page and navigate to app
    const page = await browser.newPage();
    await page.goto(APP);

    // Get logo
    const text = await page.$eval('a.brand-logo', el => el.innerHTML);

    expect(text).toEqual('Blogster');
});