document.addEventListener("DOMContentLoaded",
function (event){
    var self=this;
    var viewPortHeight=window.innerHeight;
    document.querySelector("#resume").style.height=((viewPortHeight-160)+"px");
    document.querySelector("#project").style.height=((viewPortHeight-160)+"px");
});