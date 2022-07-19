
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
    id: 'log',
    title: "摘抄: %s",
    contexts: ["selection"] //选中的文本
    });
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId == "log") {
    chrome.storage.local.get({ "clipList": [] }, function (object) { //先get再set
    let dataList = object["clipList"];
    dataList.push(info.selectionText); //猜测是追加
    chrome.storage.local.set({ "clipList": dataList }); //设置名为list的列表
    })
    }
});