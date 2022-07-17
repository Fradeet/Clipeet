
chrome.storage.local.get({ "list": [] }, function (object) {
    let dataList = object["list"]; //末尾没分号？
    if(dataList.length == 0) {
        let p = document.createElement("p");
        p.innerText = "暂无数据";
        document.body.appendChild(p);
        return;
        }
    
    //显示所有的摘抄
    dataList.forEach(function (text) {
        let div = document.createElement("div"); //创建一个div
        div.innerText = text; //写入div
        document.body.appendChild(div); //？添加新元素至末尾
        })
})//一整个取得列表的get...

//清空按钮
function clearFolder()
{
    chrome.storage.local.get({ "list": [] }, function (object) {
    let dataList = object["list"];
    dataList = [];
    chrome.storage.local.set({ "list": dataList });
    })
    //网页不会重新读取储存，写个强制刷新（或者折中写个弹窗使popup直接关闭）
    window.alert("清空成功");
    location.reload();

}

//本地使用不能写OnClick，折中写id
let btnClearFolder = document.getElementById("clearFolder"); //获取id为xx的元素
btnClearFolder.onclick = clearFolder;
