
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
    id: 'log',
    title: "摘抄: %s",
    contexts: ["selection"] //选中的文本
    });
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId == "log") {
    chrome.storage.local.get({ "list": [] }, function (object) { //先get再set
    let dataList = object["list"];
    dataList.push(info.selectionText); //猜测是追加
    chrome.storage.local.set({ "list": dataList }); //设置名为list的列表
    })
    }
});