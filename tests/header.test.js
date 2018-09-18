/**
 * Make sure to include 'await' with any command using puppeteer
 */

const puppeteer = require('puppeteer');
const APP='localhost:3000';

let browser, page;
beforeEach(async () => {
    // Open browser
    browser = await puppeteer.launch({
        headless: false
    });
    // Open page and navigate to app
    page = await browser.newPage();
    await page.goto(APP);
});

afterEach(async ()=>{
    await browser.close();
})

// Launch new chromium instance
test('Brand logo in header', async () => {
    // Get logo
    const text = await page.$eval('a.brand-logo', el => el.innerHTML);
    expect(text).toEqual('Blogster');
});

// Verify link to OAuth google flow
test('Clicking login starts oauth flow', async () => {
    // Clicking the 'Login with Google' anchor
    await page.click('.right a');
    // Look at url and verify accounts.google.com domain
    const url = await page.url();
    expect(url).toMatch(/accounts\.google\.com/);
});