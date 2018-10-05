/**
 * Make sure to include 'await' with any command using puppeteer
 */
const Page = require('./helpers/page');
/**
 *  Setup and Teardown
 */
let page;
beforeEach(async () => {
    page = await Page.build();
    await page.goto('localhost:3000');
});

afterEach(async ()=>{
    await page.close();
})

/**
 *  Integration Testing
 */
// Launch new chromium instance
test('Brand logo in header', async () => {
    // Get logo
    //const text = await page.$eval('a.brand-logo', el => el.innerHTML);
    const text = await page.getContentsOf('a.brand-logo');    
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
    await page.login();
    
    // Wait for the DOM  element to load
    // Extract DOM element and get text
    const text = await page.getContentsOf('#logout');
    expect(text).toEqual('Logout');
});
