//测试Chrome函数
//var tId;
//chrome.tabs.onActivated.addListener((tabId,windowId,changeInfo,tab) =>{
    //console.log(tabId);
//    tId = tabId;
//})
var listLocationNumber;

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'log',
        title:"剪藏: %s",
        contexts: ["selection"] //选中的文本
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId == "log") {
        //获取网址并决定是否新建网址
        //listLocationNumber = NewOrGetWebList(tab.url,tab.title);
        let url = tab.url;
        let title = tab.title;
        chrome.storage.local.get({"websiteList":[]},function(object){
            let dataList = object["websiteList"];
            if(dataList.includes(url) == false)
            {
                dataList.push(url);
                chrome.storage.local.set({ "websiteList": dataList });
                //NewWebTitleList(title);//新建网址标题
                chrome.storage.local.get({"webTitleList":[]},function(object){
                    let dataList = object["webTitleList"];
                    dataList.push(title);
                    chrome.storage.local.set({ "webTitleList": dataList }); //设置名为list的列表
                })
                //NewWebClipList();//新建空剪藏列表
                chrome.storage.local.get({ "webClipList": [] }, function (object) { //先get再set
                    let dataList = object["webClipList"];
                    let emptyList = new Array();
                    dataList.push(emptyList);//不生效,好像又生效
                    dataList[dataList.length-1].push(info.selectionText); //追加，一开始这里怎么都无法定义（写的是切片-1）
                    chrome.storage.local.set({ "webClipList": dataList }); //设置名为list的列表
                    })

                listLocationNumber = -1;
                //发送一个通知提示已自动创建列表
    
                //return -1;
            }
            else
            {
                listLocationNumber = dataList.indexOf(url);
                chrome.storage.local.get({ "webClipList": [] }, function (object) { //先get再set
                    let dataList = object["webClipList"];
                    //检测网址是否存在
                    dataList[this.listLocationNumber].push(info.selectionText); //猜测是追加
                    chrome.storage.local.set({ "webClipList": dataList }); //设置名为list的列表
                })
                //return num;
            }
            //return listLocationNumber;
        })
        //AddClip(listLocationNumber);
    }
});



//已停用（不知为何无法调用子函数
function AddClip(nowClipListNumber){
    //listNumber = CreateAndGetWebList(tab.url);
    chrome.storage.local.get({ "webClipList": [] }, function (object) { //先get再set
        let dataList = object["webClipList"];
        //检测网址是否存在
        dataList[nowClipListNumber].push(info.selectionText); //猜测是追加
    
        chrome.storage.local.set({ "webClipList": dataList }); //设置名为list的列表
    })
}

//已停用
function NewOrGetWebList(url,title){
    chrome.storage.local.get({"websiteList":[]},function(object){
        let dataList = object["websiteList"];
        if(dataList.includes(url) == false)
        {
            dataList.push(url);
            NewWebTitleList(title);//新建网址标题
            NewWebClipList();//新建空剪藏列表
            listLocationNumber = -1;
            chrome.storage.local.set({ "websiteList": dataList });
            //发送一个通知提示已自动创建列表

            //return -1;
        }
        else
        {
            listLocationNumber = dataList.indexOf(url);
            //return num;
        }
        return listLocationNumber;
    })
}

//已停用
function NewWebTitleList(title){
    chrome.storage.local.get({"webTitleList":[]},function(object){
        let dataList = object["webTitleList"];
        dataList.push(title);
        chrome.storage.local.set({ "webTitleList": dataList }); //设置名为list的列表
        })
}

//已停用
function NewWebClipList(){
    chrome.storage.local.get({ "webClipList": [] }, function (object) { //先get再set
        let dataList = object["webClipList"];
        let emptyList = new Array();
        dataList.push(emptyList);//不生效,好像又生效
        chrome.storage.local.set({ "webClipList": dataList }); //设置名为list的列表
        })
}
//chrome.tabs.onHighlighted.addListener((tabIds,windowId) => {
//    console.log(tabIds);
//})