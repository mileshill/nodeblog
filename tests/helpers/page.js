const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

class CustomPage {

    // Generate a new puppeteer proxy object to access
    // custom Page functionality
    static async build() {
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        const customPage = new CustomPage(page);

        return new Proxy(customPage, {
            get: function(target, property){
                return customPage[property] || browser[property] || page[property];
            }
        })
    }

    constructor(page){
        this.page = page;
    }

    async login(){
        // User id and session
        //const id = '5b9e49d3d48ecc490b1cb7f7';
        const user = await userFactory();
        const { session, sig } = sessionFactory(user);
        
        // Page already navigated to app
        // Set the cookies on the home page
        // Refresh to show login
        await this.page.setCookie({name: 'session', value: session });
        await this.page.setCookie({name: 'session.sig', value: sig});
        await this.page.goto('localhost:3000');
        await this.page.waitFor('a[href="/auth/logout"]');
    }
}

module.exports = CustomPage;