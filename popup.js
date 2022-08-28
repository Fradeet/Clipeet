//var newDiv = document.getElementById("viewClips");

//获取当前标签页url,标题（返回了一个很多信息的数组array）
var tabUrl,tabTitle;
var urlList_display,titleList_display,clipList_display;
var urlExport,titleExport,clipExport
//var webCount = 0;

//初始化语言-测试
document.getElementById("export-markdown").innerHTML = chrome.i18n.getMessage("exportMD");
document.getElementById("popup_pagetitle").innerHTML = chrome.i18n.getMessage("Clipeet_popupMenu");
//document.getElementById("manage_button").innerHTML = chrome.i18n.getMessage("managePage");
document.getElementById("click_clearFolder").innerHTML = chrome.i18n.getMessage("clearPopupList");
document.getElementById("click_addWeb").innerHTML = "<img src=\"icons/bookmark-plus.svg\" alt=\"Bootstrap\" width=\"20\" height=\"20\" class=\"black-2-write\" id=\"pageStatus\">" + chrome.i18n.getMessage("addWebPageToList");
document.getElementById("currentListName").innerHTML = chrome.i18n.getMessage("currentListName");
document.getElementById("editFolderName").innerHTML = chrome.i18n.getMessage("editListName");

chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    tabUrl = tabs[0].url;
    tabTitle = tabs[0].title;
});

//显示剪藏网页文本
chrome.storage.local.get({ "websiteList": [] }, function (object) { //获取所有剪藏
    urlList_display = object["websiteList"]; 
    
    //检测到当前网页在集锦内，将添加页面按钮改为已加入按钮（后面改为删除按钮
    if(urlList_display.includes(tabUrl) == true){
        document.getElementById("click_addWeb").setAttribute("class","btn btn-warning");
        //document.getElementById("click_addWeb").textContent = "取消添加";
        document.getElementById("click_addWeb").innerHTML = "<img src='icons/bookmark-plus-fill.svg' alt='Bootstrap' width='20' height='20' class='black-2-write' id='pageStatus'>" + chrome.i18n.getMessage("delWebPageToList");
        document.getElementById("click_addWeb").setAttribute("id","click_delWeb");
        //绑定删除函数
        let btndelWeb = document.getElementById("click_delWeb"); //获取id为xx的元素
        btndelWeb.onclick = DelWeb;
    }
    chrome.storage.local.get({"webTitleList":[]},function(object){
        titleList_display = object["webTitleList"];
        chrome.storage.local.get({"webClipList":[]},function(object){
            clipList_display = object["webClipList"]
            //先贴上网址div，再在里面嵌套多个剪藏div。
            displayWebsiteData(urlList_display,titleList_display,clipList_display);
        })
    })
})

chrome.storage.local.get({ "webClipList": [] }, function (object) { //获取所有剪藏
let dataList = object["webClipList"]; //末尾没分号？
if(dataList.length == 0) {
    let p = document.createElement("p");
    p.innerText = chrome.i18n.getMessage("emptyListNotice");
    document.getElementById("viewClips").appendChild(p); //getelements只能写在代码里面，不能作为变量提取
    return;
    }
})
        
    //显示所有的摘抄
//    dataList.forEach(function (text) {
//        let div = document.createElement("div"); //创建一个div
//        div.innerText = text; //写入div
//        document.getElementById("viewClips").appendChild(div); //？添加新元素至末尾
//        })
//一整个取得列表的get...

//显示当前集锦文件夹的名字
chrome.storage.local.get("folderName", function (object) { //获取所有剪藏
    let text = object["folderName"];
    if(text != ""){
        document.getElementById("folderName").innerText = text;
    }
    else
    {
        document.getElementById("folderName").innerText = chrome.i18n.getMessage("noFolderName");
    }
})

//清空按钮
function ClearFolder()
{
    chrome.storage.local.get({ "webClipList": [] }, function (object) {
    let dataList = object["webClipList"];
    dataList = [];
    chrome.storage.local.set({ "webClipList": dataList });
    })
    //清空网址，标题，剪藏列表
    chrome.storage.local.get({ "websiteList": [] }, function (object) { 
        let dataList = object["websiteList"];
        dataList = []; 
        chrome.storage.local.set({ "websiteList": dataList });
    })
    chrome.storage.local.get({ "webClipList": [] }, function (object) { 
        let dataList = object["webClipList"];
        dataList = []; 
        chrome.storage.local.set({ "webClipList": dataList });
    })
    chrome.storage.local.get({ "webTitleList": [] }, function (object) { 
        let dataList = object["webTitleList"];
        dataList = []; 
        chrome.storage.local.set({ "webTitleList": dataList });
    })
    //ClearList("webTitleList");ChromeAPI内不可调用外部函数
    //网页不会重新读取储存，写个强制刷新（或者折中写个弹窗使popup直接关闭）
    window.alert(chrome.i18n.getMessage("clearSuccess"));
    location.reload();

}

function ClearList(listName){
    chrome.storage.local.get({ listName: [] }, function (object) { 
        let dataList = object[listName];
        dataList = []; 
        chrome.storage.local.set({ listName: dataList });
    })
}
//本地使用不能写OnClick，折中写id
let btnClearFolder = document.getElementById("click_clearFolder"); //获取id为xx的元素
btnClearFolder.onclick = ClearFolder;

function folderRename()
{
    //获取先前名字（Chrome的string值）
    chrome.storage.local.get( "folderName", function (object) { //获取所有剪藏
        let text = object["folderName"];
        //初始化避免空错误
        let name = text;
        if(text != ""){
            name = prompt(chrome.i18n.getMessage("folderRenameNotice"),text);
        }
        else
        {
            name = prompt(chrome.i18n.getMessage("folderRenameNotice"),chrome.i18n.getMessage("noFolderName"));
        }
        if(name != null){
            chrome.storage.local.set({"folderName":name});
            location.reload();
        }
    })
}
let urlClearFolder = document.getElementById("editFolderName"); //获取id为xx的元素
urlClearFolder.onclick = folderRename;

//addWeb.onclick = addWeb(); //执行此行代码会自动在popup是添加页面

function AddWeb()
{
    let url = tabUrl;
    chrome.storage.local.get({ "websiteList": [] }, function (object) { 
        let dataList = object["websiteList"];
    //写入Chrome储存
        dataList.push(url); 
        chrome.storage.local.set({ "websiteList": dataList });
    })
    chrome.storage.local.get({"webTitleList":[]},function(object){
        let dataList = object["webTitleList"];
        dataList.push(tabTitle);
        chrome.storage.local.set({ "webTitleList": dataList }); //设置名为list的列表
    })
    chrome.storage.local.get({ "webClipList": [] }, function (object) { //先get再set
        let dataList = object["webClipList"];
        let emptyList = new Array();
        dataList.push(emptyList);//不生效,好像又生效
        chrome.storage.local.set({ "webClipList": dataList }); //设置名为list的列表
    })
    //NewWebTitleList(tabTitle);
    //NewWebClipList();//新建空剪藏列表
    window.alert(chrome.i18n.getMessage("addSuccess"));
    location.reload();
}
let btnAddWeb = document.getElementById("click_addWeb"); //获取id为xx的元素
btnAddWeb.onclick = AddWeb;

//与background相同
//function NewWebTitleList(title){
//    chrome.storage.local.get({"webTitleList":[]},function(object){
//        let dataList = object["webTitleList"];
//        dataList.push(title);
//        chrome.storage.local.set({ "webTitleList": dataList }); //设置名为list的列表
//        })
//}
//function NewWebClipList(){
//    chrome.storage.local.get({ "webClipList": [] }, function (object) { //先get再set
//        let dataList = object["webClipList"];
//        let emptyList = new Array();
//        dataList.push(emptyList);//不生效,好像又生效
//        chrome.storage.local.set({ "webClipList": dataList }); //设置名为list的列表
//        })
//}

//判断当前网站是否已经在集锦内(暂时没用)
function CheckWebIn(webSite)
{
    chrome.storage.local.get({ "websiteList": [] }, function (object) { 
        let dataList = object["websiteList"];
        if (dataList.includes(webSite) == true);
        {
            return true ;
        }
    })
    
}

function DelWeb()
{
    let url = tabUrl;
    let num;
    chrome.storage.local.get({ "websiteList": [] }, function (object) { 
        let dataList = object["websiteList"];
        //定位在网站列表的位置
        num = dataList.indexOf(url);
        //dataList = arrayRemove(dataList,url);//旧版代码，使用遍历
    })
        //TODO:移除标题，链接，剪藏
        chrome.storage.local.get({"webTitleList":[]},function(object){
            let dataList = object["webTitleList"];
            dataList.splice(num,1);//直接操作列表不返回值
            chrome.storage.local.set({ "webTitleList": dataList });
        })
        chrome.storage.local.get({"webClipList":[]},function(object){
            let dataList = object["webClipList"];
            dataList.splice(num,1);//直接操作列表不返回值
            chrome.storage.local.set({ "webClipList": dataList });
        })
        chrome.storage.local.get({"websiteList":[]},function(object){
            let dataList = object["websiteList"];
            dataList.splice(num,1);//直接操作列表不返回值
            chrome.storage.local.set({ "websiteList": dataList });
        })

        //RemoveListElement("webTitleList",num);
        //RemoveListElement("webClipList",num);
        //RemoveListElement("websiteList",num);

    window.alert(chrome.i18n.getMessage("delSuccess"));
    location.reload();
}

//遍历查找数组内某个值并删除
function arrayRemove(arr, item) {
    for(var i=arr.length-1;i>=0;i--)
      {
       if(arr[i]==item)
         {
           arr.splice(i,1);
          }
       }
    return arr;
}

//注：在其他子函数内无法调用
function RemoveListElement(listName,num){
    chrome.storage.local.get({listName:[]},function(object){
        let dataList = object[listName];
        dataList.splice(num,1);//直接操作列表不返回值
        chrome.storage.local.set({ listName: dataList });
    })
}

function displayWebsiteData(urlList,titleList,clipList){
    let webCount = 0;
    //获取数组长度,铺相应段落
    urlListLong = urlList.length;
    //若是a链接元素的话就不能嵌套div，在外面再写一个空白段落
    for (let longNumber = 0; longNumber < urlListLong; longNumber++) {
        let webArea = document.createElement("p"); 
        let webCount_id = "web_" +  longNumber;
        webArea.setAttribute("id",webCount_id);
        document.getElementById("viewClips").appendChild(webArea); //？添加新元素至末尾
    
    }

        //贴上网址连接
        urlList.forEach(function (text) {
        let linkUrl = document.createElement("a"); 
        //给这些外围div加点id，后面要嵌套剪藏的div
        let urlCount_id = "url_" +  webCount;
        let webCount_id = "web_" +  webCount;
        linkUrl.setAttribute("id",urlCount_id);
        linkUrl.setAttribute("href",text); 
        linkUrl.setAttribute("target","_blank")
        document.getElementById(webCount_id).appendChild(linkUrl); //？添加新元素至末尾
        webCount += 1;   
        })
    webCount = 0;
    titleList.forEach(function(text){
        //let linkTitle = document.createElement("div"); 
        //linkTitle.innerText = text;
        let urlCount_id = "url_" +  webCount;
        document.getElementById(urlCount_id).innerText = text;
        webCount += 1;
        //document.getElementById(urlCount_id).textContent = text;
    })
    for (let longNumber = 0; longNumber < urlListLong; longNumber++) {
        let webArea = document.createElement("ul"); 
        let clipCount_id = "clip_" +  longNumber;
        let webCount_id = "web_" +  longNumber;
        webArea.setAttribute("id",clipCount_id);
        document.getElementById(webCount_id).appendChild(webArea); //？添加新元素至末尾
    
    }
    webCount = 0;
    clipList.forEach(function(clipSimpleList){
        if (clipSimpleList.length != 0) {
            clipSimpleList.forEach(function(text){
                let clip = document.createElement("li");
                let textnode=document.createTextNode(text);
                //clip.innerText = text;
                clip.appendChild(textnode);
                let clipCount_id = "clip_" +  webCount;
                document.getElementById(clipCount_id).appendChild(clip); //？添加新元素至末尾
            })            
        }
        webCount += 1;
    })
}

function noticeTest(){
    window.alert("Test");
}

//将字符串转换为文件下载
function CreateAndDownloadFile(fileName, content) {
    let aTag = document.createElement('a');
    let blob = new Blob([content]);
    aTag.download = fileName;
    aTag.href = URL.createObjectURL(blob);
    aTag.click();
    URL.revokeObjectURL(blob);
}

function ExportFolder(){
    //打开3个数据表后一个一个来
    chrome.storage.local.get({"webTitleList":[]},function(object){
        titleExport = object["webTitleList"];
        chrome.storage.local.get({"webClipList":[]},function(object){
            clipExport = object["webClipList"];
            chrome.storage.local.get({"websiteList":[]},function(object){
                urlExport = object["websiteList"];
                chrome.storage.local.get("folderName", function (object) { //获取所有剪藏
                    let name = object["folderName"];
                    //let num = urlExport.length;
                    //使用Windows的换行模式
                    let finalExportText = "# " + name + "\r\n";
                    for (let webNumber = 0; webNumber < urlExport.length; webNumber++) {
                        finalExportText = finalExportText + "[" +titleExport[webNumber] + "](" + urlExport[webNumber] + ")\r\n";
                        clipExport[webNumber].forEach(function (clipText) {
                        finalExportText = finalExportText + "- " + clipText + "\r\n";
                        })
                    finalExportText = finalExportText + "\r\n";
                }
                    fileName = name+ " " + Date() + ".md";
                    CreateAndDownloadFile(fileName,finalExportText);//这里后面加个时间
                })
            }) 
        })
    })
}
let btnExport = document.getElementById("export-markdown"); //获取id为xx的元素
btnExport.onclick = ExportFolder;
