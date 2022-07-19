//var newDiv = document.getElementById("viewClips");

//显示剪藏网页
chrome.storage.local.get({ "websiteList": [] }, function (object) { //获取所有剪藏
    let dataList = object["websiteList"]; 
        
    dataList.forEach(function (text) {
        let div = document.createElement("div"); 
        //给这些外围div加点id，后面要嵌套剪藏的div
        
        div.innerText = text; 
        document.getElementById("viewClips").appendChild(div); //？添加新元素至末尾
        })   
    })

chrome.storage.local.get({ "clipList": [] }, function (object) { //获取所有剪藏
    let dataList = object["clipList"]; //末尾没分号？
    if(dataList.length == 0) {
        let p = document.createElement("p");
        p.innerText = "暂无数据";
        document.getElementById("viewClips").appendChild(p); //getelements只能写在代码里面，不能作为变量提取
        return;
        }
        
    //显示所有的摘抄
    dataList.forEach(function (text) {
        let div = document.createElement("div"); //创建一个div
        div.innerText = text; //写入div
        document.getElementById("viewClips").appendChild(div); //？添加新元素至末尾
        })
})//一整个取得列表的get...


//清空按钮
function clearFolder()
{
    chrome.storage.local.get({ "clipList": [] }, function (object) {
    let dataList = object["clipList"];
    dataList = [];
    chrome.storage.local.set({ "clipList": dataList });
    })
    //清空网址列表
    chrome.storage.local.get({ "websiteList": [] }, function (object) { 
        let dataList = object["websiteList"];
        dataList = []; 
        chrome.storage.local.set({ "websiteList": dataList });
    })
    //网页不会重新读取储存，写个强制刷新（或者折中写个弹窗使popup直接关闭）
    window.alert("清空完毕");
    location.reload();

}
//本地使用不能写OnClick，折中写id
let btnClearFolder = document.getElementById("click_clearFolder"); //获取id为xx的元素
btnClearFolder.onclick = clearFolder;

function folderRename()
{
    //获取先前名字（Chrome的string值）
}

//addWeb.onclick = addWeb(); //执行此行代码会自动在popup是添加页面

function addWeb()
{
    url = tabUrl;

    //window.alert("已存在");

    //写入Chrome储存
    chrome.storage.local.get({ "websiteList": [] }, function (object) { 
        let dataList = object["websiteList"];
        dataList.push(url); 
        chrome.storage.local.set({ "websiteList": dataList });
    })
    window.alert("添加完毕");
    location.reload();
}

let btnAddWeb = document.getElementById("click_addWeb"); //获取id为xx的元素
btnAddWeb.onclick = addWeb;

//判断当前网站是否已经在集锦内
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

//获取当前标签页url（返回了一个很多信息的数组array）
var tabUrl;
chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    console.log(tabs[0].url);
    tabUrl = tabs[0].url;
});