const io = require('socket.io')();
const puppeteer = require('puppeteer');

io.listen(5000);
io.on('connection', (socket) => {
    console.log("connected");
    socket.on('watchMeRequest', dataList => {
        //check for websites and emit the valid response
        let response = [];
        for(let data of dataList){
            const value = automateUrlAndGetValueByXpath(data);
            if(value !== data.value){
                response.push("value has been changes from " + data.value + "to" + value);
            }
        }
        socket.emit('watchMeResponse', response);
    });
});

const automateUrlAndGetValueByXpath = async ({xpath, url}) => {
    const username = 'admin.rubiks06012017@marketo.com';
    const password = 'Bryc3.n311ian';

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 926 });

    //login
    await page.goto('https://app-sjqe.marketo.com/#MM0A1', { waitUntil: 'networkidle0' });
    await page.type('#loginUsername', username);
    await page.type('#loginPassword', password);
    await Promise.all([
        page.click('#loginButton'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);

    //get value in that xpath
    await page.goto(url, { waitUntil: 'networkidle0' });
    const text = await page.evaluate(() => {
        // $x() is not a JS standard -
        // this is only sugar syntax in chrome devtools
        // use document.evaluate()
        const featureArticle = document
            .evaluate(
                xpath,
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            )
            .singleNodeValue;

        return featureArticle.textContent;
    });
    return text;
}

