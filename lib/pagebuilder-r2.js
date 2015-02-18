/**
 * Created by msyk on 14/12/29.
 * 
 */

window.onload = function()  {
    "use strict";
    INTERMediator.titleAsLinkInfo = false;
    var wrapNode, node, wrapNodeRepeater, i;
    var language = "en";

    var urlComp = window.location.href.split("/");
    for (i = urlComp.length - 1 ; i >=0 ; i--)  {
        if (urlComp[i].length < 3 && urlComp[i].length > 0)  {
            language = urlComp[i];
            break;
        }
    }
    INTERMediator.addCondition("pagebuilder", {field: "language", operator: "=", value: language});
    INTERMediator.addCondition("newslist", {field: "language", operator: "=", value: language});

    var bodyNode = document.getElementsByTagName("BODY")[0];
    var firstLevelChildren = [];
    while (bodyNode.childNodes.length > 0) {
        firstLevelChildren.push(bodyNode.childNodes[0]);
        bodyNode.removeChild(bodyNode.childNodes[0]);
    }

    wrapNode = document.createElement("DIV");
    wrapNode.setAttribute("id", "_im_pb_PageWrapper");
    wrapNode.setAttribute("data-im-control", "enclosure");
    wrapNode.className = "_im_pb_WrapNodeEnclosure";
    bodyNode.appendChild(wrapNode);

    wrapNodeRepeater = document.createElement("DIV");
    wrapNodeRepeater.setAttribute("data-im-control", "repeater");
    wrapNodeRepeater.className = "_im_pb_WrapNodeRepeater";
    wrapNode.appendChild(wrapNodeRepeater);

    // node = document.createElement("NAV");
    // node.setAttribute("data-im", "pagebuilder@pagenavigation@innerHTML");
    // node.className = "_im_pb_PageNavigation";
    // wrapNodeRepeater.appendChild(node);

    node = document.createElement("DIV");
    node.setAttribute("data-im", "pagebuilder@pageheader@innerHTML");
    node.className = "_im_pb_PageHeader";
    wrapNodeRepeater.appendChild(node);

    for (i = 0 ; i < firstLevelChildren.length ; i++) {
        wrapNodeRepeater.appendChild(firstLevelChildren[i]);
    }

    node = document.createElement("DIV");
    node.setAttribute("data-im", "pagebuilder@pagefooter@innerHTML");
    node.className = "_im_pb_PageFooter";
    wrapNodeRepeater.appendChild(node);

    INTERMediatorOnPage.doAfterConstruct = function() {
        if (document.getElementById("updatedate")) {
            var docDT = new Date(document.lastModified);
            document.getElementById("updatedate").appendChild(document.createTextNode(docDT.toLocaleDateString()));
        }
        if (document.getElementById("thisyear")) {
            var today = new Date();
            document.getElementById("thisyear").appendChild(document.createTextNode(today.getFullYear()));
        }
        localNavSetup();
        gotoTop();
    };

    INTERMediator.construct(true);
};

function showDemoVideo() {
    "use strict";
    var win = window.open("../../demo2.html", null, "width=800,height=630,toolbar=no,location=no,directories=no,status=no");
}

function dropdownSetup() {
    "use strict";
}

function gotoTop() {
    "use strict";
    var el = document.createElement("a");
    el.className = "goto-top";
    el.href = "#top";
    document.body.appendChild(el);
    window.addEventListener("scroll", function() {
        var scrollTop = (document.body.scrollTop) ? document.body.scrollTop : document.documentElement.scrollTop;
        el.style.display = (scrollTop < 500) ? "none" : "block";
    }, false);
}

function pageIndexSetup() {
    "use strict";
    if (document.body.className === "docs") {
        var sectionId, li, a, index, heading, node;
        var parent = document.getElementById('pageIndex');
        heading = document.querySelectorAll("article section h1");
        for (var i = 0; i < heading.length; i++) {
            sectionId = "section" + ("00" + i).slice(-3);
            heading[i].parentNode.id = sectionId;
            li = document.createElement("li");
            a = document.createElement("a");
            a.href= "#" + sectionId;
            a.title = heading[i].textContent;
            a. textContent = heading[i].textContent;
            li.appendChild(a);
            parent.appendChild(li);
        }
    }
}

function sidebarSetup() {
    "use strict";
    window.addEventListener("scroll", function() {
        var sticky = document.querySelectorAll(".sticky");
        for (var i = 0; i < sticky.length; i++) {
            var top = sticky[i].getBoundingClientRect().top;
            var scrollTop = (document.body.scrollTop) ? document.body.scrollTop : document.documentElement.scrollTop;
            if (scrollTop < 389) {
                sticky[i].style.position = "absolute";
                sticky[i].style.top = "";
            } else {
                sticky[i].style.position = "fixed";
                sticky[i].style.top = 0;
            }
        }
    }, false);
}

function localNavSetup() {
    "use strict";
    var pageName = document.body.getAttribute("data-page-title");
    var pages = document.querySelectorAll(".local-nav ul li a");
    var regexp = /^.*\/(.*)\.html/;
    for (var i = pages.length - 1; i >= 0; i--) {
        if (pages[i].href.match(regexp)[1] === pageName) {
            pages[i].parentNode.className = "active";
        }
    }
}