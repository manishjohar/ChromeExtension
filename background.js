'use strict';

var menuFact;
var popUpManager;

chrome.runtime.onInstalled.addListener(function () {
  initBackGroundProcess()
});


/***
 * init watch me plugin engine
 * 
 */
function initBackGroundProcess() {
  var contextManager = new ContextManager();
  contextManager.setUpContextMenus();
}



function ContextManager() {

  this.selectionText = ''

  /**
   * 
   * func which helps to create context menu
   * 
   */
  this.setUpContextMenus = function () {
    try {
      menuFact = new ContentMenuFactory();
      menuFact.create(ADD_WIDGET_COMMAND, ADD_WIDGET);
      menuFact.create(REMOVE_WIDGET_COMMAND, REMOVE_WIDGET);
      var eventHandler = new EventHandler();
      eventHandler.addClickListener();
      eventHandler.addBrowserAction();
    }
    catch (err) {
      chrome.tabs.sendMessage(tab.id, { text: 'runtimeExceptionBackGround' }, doStuffWithDom);
    }

  }

  /**
   * get selected text from the context
   * 
   */
  this.getSelectedTextFromContext = function () {
    return this.selectionText;
  }


  /**
   * set selected text from the context
   * 
   */
  this.setSelectedTextFromContext = function (selectionText) {
    this.selectionText = selectionText;
  }


}


function EventHandler() {

  /****
   *  method to add click listener to chrome context menu
   * 
   */
  this.addClickListener = function () {
    chrome.contextMenus.onClicked.addListener(function (info, tab) {
      switch (info.menuItemId) {
        case ADD_WIDGET:
          chrome.tabs.sendMessage(tab.id, { text: 'addItem' }, callBackAfterOperation);
          break;
        case REMOVE_WIDGET:
          chrome.tabs.sendMessage(tab.id, { text: 'removeItem' }, callBackAfterOperation);
          break;
        default:
          console.log(NO_MATCH_FOUND)

      }
    });
  },


    /**
     * method to add browser action
     * 
     */
    this.addBrowserAction = function () {
      chrome.browserAction.onClicked.addListener(function (tab) {
        chrome.tabs.create({ url: chrome.extension.getURL('index.html') });
      });
    }

}

// A function to use as callback
function callBackAfterOperation(data) {
  try {
    var inputData = JSON.parse(data)
    if (inputData.operation == 1) {
      addDataToStorage(inputData);
    }
  } catch (err) {
    throw 500;
  }


}






