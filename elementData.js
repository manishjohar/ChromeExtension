
/**
 *  Element POJO 
 * 
 * 
 */
function ElementPojo(captureDate, pageUrl, xPath, oldValue, notoficationValue, currentValue, lastUpdated, message, status,operation) {

    this.captureDate = captureDate;
    this.pageUrl = pageUrl;
    this.xPath = xPath;
    this.oldValue = oldValue;
    this.notoficationValue = notoficationValue;
    this.currentValue = currentValue;
    this.lastUpdated = lastUpdated;
    this.message = message;
    this.status = status;
    this.operation=operation;

    this.toString = function () {
        return JSON.stringify(this)
    };

}