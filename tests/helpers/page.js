const puppeteer = require('puppeteer');

class CustomPage {

    // Generate a new puppeteer proxy object to access
    // custom Page functionality
    static async build() {
        const browser = await puppeteer.launch({headless: false});
        
        const page = await browser.newPage();
        const customPage = new CustomPage(page);

        return new Proxy(customPage, {
            get: function(target, property){
                return customPage[property] || page[property] || browser[property];
            }
        })
    }

    constructor(page){
        this.page = page;
    }
}

module.exports = CustomPage;