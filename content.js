"use strict";
var messageBox;
var selectedElement;


window.onload = function () {
    initProcess();
};



/****
 * function triggers engine init
 * 
 * 
 */
function initProcess() {
    messageBox = new PopupManager();
    messageBox.init();
    recieveBackgroundResponse();
}





/***
 * chrome contenxt menu listners for communication 
 * between content script and background js
 * 
 * 
 */
function recieveBackgroundResponse() {
    chrome.runtime.onMessage.addListener(function (msg, _, sendResponse) {
        if (msg.text == 'runtimeExceptionBackGround') {
            console.log('Error occured in the back ground process !')
            sendResponse()
        } else if (msg.text === 'addItem') {
            sendResponse(pushElementData())
        } else {
            removeElementData();
            sendResponse('Removed Item Successfully')
        }
    });
}




/***
 * 
 * function to add element data to the storage
 * 
 */
function pushElementData() {

    try {
        var value = getValueFromSelectedElement();
        var xpath = getXpathFromSelectedElement();
        var url = window.location.href;
        var elem = new ElementPojo(Date.now(), url, xpath, value, 150, new Number(value) + 10, Date.now(), 'Updated Sample', 'Active', ADD_OPERATION)
        messageBox.success(ADD_WIDGET_SUCCESS)
        return elem.toString();
    } catch (err) {
        messageBox.error(SERVICE_EXCEPTION_MESSAGE)
    }

}

/****
 * 
 * function to remove element data from watchers list
 */
function removeElementData() {

}


/***
 * 
 * prototype helps to create
 * 
 * 
 */
function PopupManager() {

    this.init = function () {
        var link = document.createElement("link");
        link.href = chrome.extension.getURL("toastr.css");
        link.type = "text/css";
        link.rel = "stylesheet";
        document.getElementsByTagName("head")[0].appendChild(link);
    },
        this.success = function (message) {
            toastr.success(message)
        },
        this.error = function (errorMessage) {
            toastr.error(errorMessage)
        },
        this.warning = function (warningMessage) {
            toastr.warning(warningMessage)
        }

}


/**
 * @param{
 * 
 *  @description : method to get the xpath
 *  source : https://github.com/trembacz/xpath-finder/blob/master/inspect.js
 * 
 * }
 */
function getXPath(el) {
    let nodeElem = el;
    /*if (nodeElem.id && this.options.shortid) {
        return `//*[@id="${nodeElem.id}"]`;
    }*/
    const parts = [];
    while (nodeElem && nodeElem.nodeType === Node.ELEMENT_NODE) {
        let nbOfPreviousSiblings = 0;
        let hasNextSiblings = false;
        let sibling = nodeElem.previousSibling;
        while (sibling) {
            if (sibling.nodeType !== Node.DOCUMENT_TYPE_NODE && sibling.nodeName === nodeElem.nodeName) {
                nbOfPreviousSiblings++;
            }
            sibling = sibling.previousSibling;
        }
        sibling = nodeElem.nextSibling;
        while (sibling) {
            if (sibling.nodeName === nodeElem.nodeName) {
                hasNextSiblings = true;
                break;
            }
            sibling = sibling.nextSibling;
        }
        const prefix = nodeElem.prefix ? nodeElem.prefix + ':' : '';
        const nth = nbOfPreviousSiblings || hasNextSiblings ? `[${nbOfPreviousSiblings + 1}]` : '';
        parts.push(prefix + nodeElem.localName + nth);
        nodeElem = nodeElem.parentNode;
    }
    return parts.length ? '/' + parts.reverse().join('/') : '';
}

/****
 * method to extract the xpath of an element 
 * @param{
 *    
 * 
 * }
 * 
 */
window.oncontextmenu = function (event) {
    selectedElement = event.target;
};


/****
 * method to extract the xpath of an element 
 * @param{
 *    
 * 
 * }
 * 
 */
window.onchange = function (event) {
    selectedElement = event.target;
}
/****
 * method to extract the xpath of an element 
 * @param{
 *    
 * 
 * }
 * 
 */
window.onselectionchange = () => {
    selectedElement = event.target;
};

/***
 * 
 * function extracts value from element
 * 
 */
function getValueFromSelectedElement() {
    if (selectedElement == undefined || selectedElement == null)
        throw '500';

    return selectedElement.value == undefined ? '' : selectedElement.value;
}

/***
 * 
 * function extracts xpath from element
 * 
 */
function getXpathFromSelectedElement() {
    if (selectedElement == undefined || selectedElement == null)
        throw '500';

    return getXPath(selectedElement);
}


/****
 * function which validated the xpath before storing in to the chrome 
 * 
 * 
 * 
 */
function validateXpathBeforeStoring(xpath){

}


