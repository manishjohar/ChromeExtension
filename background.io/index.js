const io = require('socket.io')();
const puppeteer = require('puppeteer');
const config = require('./configuration');
//data format
// const mockData = [
//     {
//         url: 'https://web-qe.marketo.com/index.html?w=1#/ds/file/49726',
//         xpath: '/html/body/div[4]/div/div[3]/div/div[1]/div/div/div[2]/div/div/div[2]/div[1]/div[2]/label/div/input',
//         value: 'ghjgjgjghgjh',
//     }
// ]
io.listen(5000);
io.on('connection', (socket) => {
    console.log("connected");
    socket.on('watchMeRequest', recordList => {
        //check for websites and emit the valid response
        // requestHandler(recordList)
    });
});

const requestHandler = async () => {
    const recordList = [...mockData]; // for now mock data
    const {page, browser} = await initiateLogin();
    const processEachRecordInterval = setInterval( async () => await processEachRecord({page, browser, recordList}), config.MAX_INTERVAL_CHECK);
    setTimeout(() => {
        clearInterval(processEachRecordInterval);
        browser.close();
    }, config.MAX_MONITORING_TIME);
}

const processEachRecord = async ({ page, recordList= [] }) => {
    for(let i=0; i< recordList.length; i++){
        const {value, xpath, url} = recordList[i];
        await automateUrlAndGetValueByXpath({ page, url, xpath, value});
    }
}

const initiateLogin = async () => {
    const username = 'admin.rubiks06012017@marketo.com';
    const password = 'Bryc3.n311ian';
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 926 });
    await page.goto('https://app-sjqe.marketo.com/#MM0A1', { waitUntil: 'networkidle0' });
    await page.type('#loginUsername', username);
    await page.type('#loginPassword', password);
    await Promise.all([
        page.click('#loginButton'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);
    return { page, browser }
}
const automateUrlAndGetValueByXpath = async ({page, url, xpath, value}) => {
    //"AuthenticationErrorModal_visitLogin" might be using this name later !not imp
    //got to url
    await page.goto(url, { waitUntil: 'networkidle0' });
    //wait for xpath to load
    await page.waitForXPath(xpath, 5000);
    //getting value from xpath
    if(xpath.match('.*input')){
        xpath += '/@value';
    }
    let content = await page.$x(xpath);
    let text = await page.evaluate(element => element.textContent, content[0]);
    console.log(text)
    if(text && text != value){
        console.log("value changed from " + value + " to " + text);
    }
}

