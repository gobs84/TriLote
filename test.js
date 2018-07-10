const puppeteer = require('puppeteer');

/*let scrape = async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto('https://clasificados.lostiempos.com/inmuebles-mapa', {
                waitUntil: 'networkidle2',
                timeout: 3000000
            });
    //let data = []; // Create an empty array that will store our data
    //let elements = Array.from(document.querySelectorAll('.view-content')); // Select all Products
    //console.log(elements.length);
    await page.click('#gmap-auto1map-gmap0 > div > div > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2)');
    await page.waitFor(1000);

    const result = await page.evaluate(() => {
        let title = document.querySelector('.seccion').innerText;
        let price = document.querySelector('.precio').innerText;

        return {
            title,
            price
        }

    });

    browser.close();
    return result;
};

scrape().then((value) => {
    console.log(value); // Success!
});*/


//==========
/*
const puppeteer = require('puppeteer');

let scrape = async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto('http://books.toscrape.com/');

    const result = await page.evaluate(() => {
        let data = []; // Create an empty array that will store our data
        let elements = document.querySelectorAll('.product_pod'); // Select all Products

        for (var element of elements){ // Loop through each proudct
            let title = element.childNodes[5].innerText; // Select the title
            let price = element.childNodes[7].children[0].innerText; // Select the price

            data.push({title, price}); // Push an object with the data onto our array
        }

        return data; // Return our data array
    });

    browser.close();
    return result; // Return the data
};

scrape().then((value) => {
    console.log(value); // Success!
});*/