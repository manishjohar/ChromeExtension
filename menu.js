
/***
 *  Provide an interface for creating families of related or dependent objects without specifying their concrete classes.
 * @author babin
 * 
 */
function ContentMenuFactory() {
 
    this.create = function(name,id) {
        return new SelectionContextMenu(name,id);
    };
}


/***
 *  Provide an impl or instance of selection context menu
 * @author babin
 * 
 */
function SelectionContextMenu(name,id) {
    this.name = name;
    this.id=id;

    chrome.contextMenus.create( {
        title: this.name,
        id: this.id,
        contexts: ['selection']
    });
    chrome.contextMenus.create({
      type: "separator",
      id: new String(this.id).concat('seperator'),
      contexts: ['all']
    });
}

