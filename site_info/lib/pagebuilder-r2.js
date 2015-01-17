/**
 * Created by msyk on 14/12/29.
 */

window.onload = function()  {
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

    node = document.createElement("NAV");
    node.setAttribute("data-im", "pagebuilder@pagenavigation@innerHTML");
    node.className = "_im_pb_PageNavigation";
    wrapNodeRepeater.appendChild(node);

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
        var today = new Date();
        var docDT = document.lastModified;
        document.getElementById("updatedate").appendChild(document.createTextNode(docDT.toLocaleDateString()));
        document.getElementById("thisyear").appendChild(document.createTextNode(today.getFullYear()));
    };

    INTERMediator.construct(true);
};

