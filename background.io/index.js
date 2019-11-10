const io = require('socket.io')()
const puppeteer = require('puppeteer')
const config = require('./configuration')

io.listen(5000)
io.on('connection', (client) => {
  client.on('watchMeRequest', ({clientID, data}, fn) => {
    fn("connection-received");
    console.log(data)
    if(data.length !== 0){
        requestHandler({clientID, recordList: data})
    }
  })
})

const requestHandler = async ({ clientID, recordList=[] }) => {
  // do login
  const { page, browser } = await initiateLogin() 
  console.log("LOGIN DONE");
  //time calculation
  const RECORLIST_REPEAT_INTERVAL = config.MAX_INTERVAL_PER_XPATH * recordList.length;
  const MAX_MONITORING_TIME = (RECORLIST_REPEAT_INTERVAL > config.MAX_MONITORING_TIME / 5) ? RECORLIST_REPEAT_INTERVAL * 5 : config.MAX_MONITORING_TIME;
  
  const processEachRecordInterval = setInterval(async () => {
    await processEachRecord({ page, browser, recordList, clientID })
  }, RECORLIST_REPEAT_INTERVAL)
  
  setTimeout(() => {
    clearInterval(processEachRecordInterval)
    browser.close()
  }, MAX_MONITORING_TIME)
}

const processEachRecord = async ({ page, recordList = [], clientID }) => {
  for (let i = 0; i < recordList.length; i++) {
    const record = recordList[i]
    await automateUrlAndGetValueByXpath({ page, clientID, ...record })
  }
}

const initiateLogin = async () => {
  const username = 'admin.rubiks06012017@marketo.com'
  const password = 'Bryc3.n311ian'
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewport({ width: 1920, height: 926 })
  await page.goto('https://app-sjqe.marketo.com/#MM0A1', { waitUntil: 'networkidle0' })
  await page.type('#loginUsername', username)
  await page.type('#loginPassword', password)
  await Promise.all([
    page.click('#loginButton'),
    page.waitForNavigation({ waitUntil: 'networkidle0' })
  ])
  return { page, browser }
}
const automateUrlAndGetValueByXpath = async ({ page, url, xpath, value, nid, clientID="" }) => {
  // "AuthenticationErrorModal_visitLogin" might be using this name later !not imp
  // got to url
  await page.goto(url, { waitUntil: 'networkidle0' })
  // wait for xpath to load
  await page.waitForXPath(xpath, 5000)
  // getting value from xpath
  if (xpath.match('.*input')) {
    xpath += '/@value'
  }
  const content = await page.$x(xpath)
  const text = await page.evaluate(element => element.textContent, content[0])
  if (text && text !== value) {
    console.log('value changed from ' + value + ' to ' + text)
    io.emit(`watchMeResponse-${clientID}`, {
        clientID, nid, url, xpath, value, newValue: text
    });
  }
}
