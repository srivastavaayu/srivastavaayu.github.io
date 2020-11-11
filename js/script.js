document.addEventListener("DOMContentLoaded",
function (event){
    var self=this;
    var viewPortHeight=window.innerHeight;
    document.querySelector("#resume").style.height=((((viewPortHeight-document.querySelector(".navbar").clientHeight+1)-document.querySelector(".page-title").clientHeight+1)-document.querySelector("#copyright-aayush").clientHeight+1)+"px");
});