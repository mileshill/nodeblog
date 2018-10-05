/**
 * Make sure to include 'await' with any command using puppeteer
 */

const puppeteer = require('puppeteer');
const APP='localhost:3000';
const sessionFactory = require('./factories/sessionFactory');
const userFactory = require('./factories/userFactory');

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

test('When signed in, shows logout button', async () =>{
    // User id and session
    //const id = '5b9e49d3d48ecc490b1cb7f7';
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);
    
    // Page already navigated to app
    // Set the cookies on the home page
    // Refresh to show login
    await page.setCookie({name: 'session', value: session });
    await page.setCookie({name: 'session.sig', value: sig});
    await page.goto(APP);

    // Wait for the DOM  element to load
    // Extract DOM element and get text
    await page.waitFor('#logout');
    const text = await page.$eval('#logout', el => el.innerHTML);
    
    expect(text).toEqual('Logout');
});
