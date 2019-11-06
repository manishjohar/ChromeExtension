
/**\
 * 
 * 
 * api to perform chrome storage operation
 */

function addDataToStorage(data) {
    let url = data.pageUrl;
    try {
        let values = localStorage.getItem(url);
        if (values == null || values == undefined) {
            values = [data]
            localStorage.setItem(url, JSON.stringify(values))
        } else {
            values=JSON.parse(values);
            if (canUpdateStorageDataBasedOnXpath(data.xPath, data, values) == false)
                values.push(data);
            localStorage.setItem(url, JSON.stringify(values))
        }

    } catch (err) {
        throw 500;
    }

}

function canUpdateStorageDataBasedOnXpath(currentXpath, presentData, array) {
    let obj = array.find(o => o.xPath === currentXpath)
    if (obj == null || obj == undefined) {
        return false;
    } else {
        let index = array.indexOf(obj);
        array[index]=presentData;
        return true;
    }

}




