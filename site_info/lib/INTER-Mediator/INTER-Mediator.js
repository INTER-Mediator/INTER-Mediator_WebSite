/*
 * INTER-Mediator Ver.4.6 Released 2014-12-30
 *
 *   by Masayuki Nii  msyk@msyk.net Copyright (c) 2010-2014 Masayuki Nii, All rights reserved.
 *
 *   This project started at the end of 2009.
 *   INTER-Mediator is supplied under MIT License.
 */

//"use strict"

var INTERMediator;
INTERMediator = {
    /*
     Properties
     */
    debugMode: false,
    // Show the debug messages at the top of the page.
    separator: '@',
    // This must be referred as 'INTERMediator.separator'. Don't use 'this.separator'
    defDivider: '|',
    // Same as the "separator".
    defaultTargetInnerHTML: false,
    // For general elements, if target isn't specified, the value will be set to innerHTML.
    // Otherwise, set as the text node.
    navigationLabel: null,
    // Navigation is controlled by this parameter.
    elementIds: [],
    //widgetElementIds: [],
    radioNameMode: false,
    dontSelectRadioCheck: false,
    ignoreOptimisticLocking: false,
    supressDebugMessageOnPage: false,
    supressErrorMessageOnPage: false,
    additionalFieldValueOnNewRecord: {},
    additionalFieldValueOnUpdate: {},
    additionalFieldValueOnDelete: {},
    waitSecondsAfterPostMessage: 4,
    pagedAllCount: 0,
    totalRecordCount: null,  // for DB_FileMaker_FX
    currentEncNumber: 0,
    isIE: false,
    isTrident: false,
    ieVersion: -1,
    titleAsLinkInfo: true,
    classAsLinkInfo: true,
    isDBDataPreferable: false,
    noRecordClassName: "_im_for_noresult_",
    //   nullAcceptable: true,

    rootEnclosure: null,
    // Storing to retrieve the page to initial condition.
    // {node:xxx, parent:xxx, currentRoot:xxx, currentAfter:xxxx}

    useSessionStorage: true,
    // Use sessionStorage for the Local Context instead of Cookie.

    errorMessages: [],
    debugMessages: [],

    partialConstructing: false,
    linkedElmCounter: 0,
    pusherObject: null,
    buttonIdNum: 0,
    masterNodeOriginalDisplay: "block",
    detailNodeOriginalDisplay: "none",
    pusherAvailable: false,

    dateTimeFunction: false,

    /* These following properties moved to the setter/getter architecture, and defined out side of this object.*/
    //startFrom: 0,
    //pagedSize: 0,
    //additionalCondition: {},
    //additionalSortKey: {},

    //=================================
    // Message for Programmers
    //=================================

    setDebugMessage: function (message, level) {
        if (level === undefined) {
            level = 1;
        }
        if (INTERMediator.debugMode >= level) {
            INTERMediator.debugMessages.push(message);
            if (typeof console != 'undefined') {
                console.log("INTER-Mediator[DEBUG:%s]: %s", new Date(), message);
            }
        }
    },

    setErrorMessage: function (ex, moreMessage) {
        moreMessage = moreMessage === undefined ? "" : (" - " + moreMessage);
        if ((typeof ex == 'string' || ex instanceof String)) {
            INTERMediator.errorMessages.push(ex + moreMessage);
            if (typeof console != 'undefined') {
                console.error("INTER-Mediator[ERROR]: %s", ex + moreMessage);
            }
        } else {
            if (ex.message) {
                INTERMediator.errorMessages.push(ex.message + moreMessage);
                if (typeof console != 'undefined') {
                    console.error("INTER-Mediator[ERROR]: %s", ex.message + moreMessage);
                }
            }
            if (ex.stack && typeof console != 'undefined') {
                console.error(ex.stack);
            }
        }
    },

    flushMessage: function () {
        var debugNode, title, body, i, j, lines, clearButton, tNode, target;

        if (!INTERMediator.supressErrorMessageOnPage
            && INTERMediator.errorMessages.length > 0) {
            debugNode = document.getElementById('_im_error_panel_4873643897897');
            if (debugNode === null) {
                debugNode = document.createElement('div');
                debugNode.setAttribute('id', '_im_error_panel_4873643897897');
                debugNode.style.backgroundColor = '#FFDDDD';
                title = document.createElement('h3');
                title.appendChild(document.createTextNode('Error Info from INTER-Mediator'));
                title.appendChild(document.createElement('hr'));
                debugNode.appendChild(title);
                body = document.getElementsByTagName('body')[0];
                body.insertBefore(debugNode, body.firstChild);
            }
            debugNode.appendChild(document.createTextNode(
                "============ERROR MESSAGE on " + new Date() + "============"));
            debugNode.appendChild(document.createElement('hr'));
            for (i = 0; i < INTERMediator.errorMessages.length; i++) {
                lines = INTERMediator.errorMessages[i].split("\n");
                for (j = 0; j < lines.length; j++) {
                    if (j > 0) {
                        debugNode.appendChild(document.createElement('br'));
                    }
                    debugNode.appendChild(document.createTextNode(lines[j]));
                }
                debugNode.appendChild(document.createElement('hr'));
            }
        }
        if (!INTERMediator.supressDebugMessageOnPage
            && INTERMediator.debugMode
            && INTERMediator.debugMessages.length > 0) {
            debugNode = document.getElementById('_im_debug_panel_4873643897897');
            if (debugNode === null) {
                debugNode = document.createElement('div');
                debugNode.setAttribute('id', '_im_debug_panel_4873643897897');
                debugNode.style.backgroundColor = '#DDDDDD';
                clearButton = document.createElement('button');
                clearButton.setAttribute('title', 'clear');
                INTERMediatorLib.addEvent(clearButton, 'click', function () {
                    target = document.getElementById('_im_debug_panel_4873643897897');
                    target.parentNode.removeChild(target);
                });
                tNode = document.createTextNode('clear');
                clearButton.appendChild(tNode);
                title = document.createElement('h3');
                title.appendChild(document.createTextNode('Debug Info from INTER-Mediator'));
                title.appendChild(clearButton);
                title.appendChild(document.createElement('hr'));
                debugNode.appendChild(title);
                body = document.getElementsByTagName('body')[0];
                if (body) {
                    if (body.firstChild) {
                        body.insertBefore(debugNode, body.firstChild);
                    } else {
                        body.appendChild(debugNode);
                    }
                }
            }
            debugNode.appendChild(document.createTextNode(
                "============DEBUG INFO on " + new Date() + "============ "));
            if (INTERMediatorOnPage.getEditorPath()) {
                var aLink = document.createElement('a');
                aLink.setAttribute('href', INTERMediatorOnPage.getEditorPath());
                aLink.appendChild(document.createTextNode('Definition File Editor'));
                debugNode.appendChild(aLink);
            }
            debugNode.appendChild(document.createElement('hr'));
            for (i = 0; i < INTERMediator.debugMessages.length; i++) {
                lines = INTERMediator.debugMessages[i].split("\n");
                for (j = 0; j < lines.length; j++) {
                    if (j > 0) {
                        debugNode.appendChild(document.createElement('br'));
                    }
                    debugNode.appendChild(document.createTextNode(lines[j]));
                }
                debugNode.appendChild(document.createElement('hr'));
            }
        }
        INTERMediator.errorMessages = [];
        INTERMediator.debugMessages = [];
    },

    // Detect Internet Explorer and its version.
    propertyIETridentSetup: function () {
        var ua, msiePos, c, i;
        ua = navigator.userAgent;
        msiePos = ua.toLocaleUpperCase().indexOf('MSIE');
        if (msiePos >= 0) {
            INTERMediator.isIE = true;
            for (i = msiePos + 4; i < ua.length; i++) {
                c = ua.charAt(i);
                if (!(c == ' ' || c == '.' || (c >= '0' && c <= '9'))) {
                    INTERMediator.ieVersion = INTERMediatorLib.toNumber(ua.substring(msiePos + 4, i));
                    break;
                }
            }
        }
        msiePos = ua.indexOf('; Trident/');
        if (msiePos >= 0) {
            INTERMediator.isTrident = true;
            for (i = msiePos + 10; i < ua.length; i++) {
                c = ua.charAt(i);
                if (!(c == ' ' || c == '.' || (c >= '0' && c <= '9'))) {
                    INTERMediator.ieVersion = INTERMediatorLib.toNumber(ua.substring(msiePos + 10, i)) + 4;
                    break;
                }
            }
        }
    },

    initialize: function () {
        INTERMediatorOnPage.removeCookie('_im_localcontext');
//      INTERMediatorOnPage.removeCookie('_im_username');
//      INTERMediatorOnPage.removeCookie('_im_credential');
//      INTERMediatorOnPage.removeCookie('_im_mediatoken');

        INTERMediator.additionalCondition = {};
        INTERMediator.additionalSortKey = {};
        INTERMediator.startFrom = 0;
        IMLibLocalContext.archive();
    },
    /**
     * //=================================
     * // Construct Page
     * //=================================

     * Construct the Web Page with DB Data
     * You should call here when you show the page.
     *
     * parameter: true=construct page, others=construct partially
     */
    construct: function (indexOfKeyFieldObject) {
        var timerTask;
        INTERMediatorOnPage.showProgress();
        if (indexOfKeyFieldObject === true || indexOfKeyFieldObject === undefined) {
            timerTask = function () {
                INTERMediator.constructMain(true)
            };
        } else {
            timerTask = function () {
                INTERMediator.constructMain(indexOfKeyFieldObject)
            };
        }
        setTimeout(timerTask, 0);
    },

    /* ===========================================================

     INTERMediator.constructMain() is the public entry for generating page.
     This has 3-way calling conventions.

     [1] INTERMediator.constructMain() or INTERMediator.constructMain(true)
     This happens to generate page from scratch.

     [2] INTERMediator.constructMain(context)
     This will be reconstracted to nodes of the "context" parameter.
     The context parameter should be refered to a IMLIbContext object.

     [3] INTERMediator.constructMain(context, recordset)
     This will append nodes to the enclocure of the "context" as a repeater.
     The context parameter should be refered to a IMLIbContext object.
     The recordset parameter is the newly created record as the form of an array of an dictionary.

     */
    constructMain: function (updateRequiredContext, recordset) {
        var i, theNode, currentLevel = 0, postSetFields = [],
            eventListenerPostAdding = [], isInsidePostOnly, nameAttrCounter = 1, imPartsShouldFinished = [],
            isAcceptNotify = false, originalNodes, appendingNodesAtLast, parentNode, sybilingNode;

        IMLibPageNavigation.deleteInsertOnNavi = [];
        appendingNodesAtLast = [];
        IMLibEventResponder.setup();
        INTERMediatorOnPage.retrieveAuthInfo();
        try {
            if (Pusher.VERSION) {
                INTERMediator.pusherAvailable = true;
                if (! INTERMediatorOnPage.clientNotificationKey)    {
                    INTERMediator.setErrorMessage(
                        Error("Pusher Configuration Error"), INTERMediatorOnPage.getMessages()[1039]);
                    INTERMediator.pusherAvailable = false;
                }
            }
        } catch (ex) {
            INTERMediator.pusherAvailable = false;
            if (INTERMediatorOnPage.clientNotificationKey)    {
                INTERMediator.setErrorMessage(
                    Error("Pusher Configuration Error"), INTERMediatorOnPage.getMessages()[1038]);
            }
        }

        try {
            if (updateRequiredContext === true || updateRequiredContext === undefined) {
                this.partialConstructing = false;
                INTERMediator.buttonIdNum = 1;
                IMLibContextPool.clearAll();
                pageConstruct();
            } else {
                this.partialConstructing = true;
                isInsidePostOnly = false;
                postSetFields = [];

                try {
                    if (!recordset) {
                        updateRequiredContext.removeContext();
                        originalNodes = updateRequiredContext.original;
                        for (i = 0; i < originalNodes.length; i++) {
                            updateRequiredContext.enclosureNode.appendChild(originalNodes[i].cloneNode(true));
                        }
                        seekEnclosureNode(
                            updateRequiredContext.enclosureNode,
                            updateRequiredContext.foreignValue,
                            updateRequiredContext.dependingParentObjectInfo,
                            updateRequiredContext);
                    }
                    else {
                        expandRepeaters(
                            updateRequiredContext,
                            updateRequiredContext.enclosureNode,
                            {recordset: recordset, targetTotalCount: 1, targetCount: 1}
                        );
                    }
                } catch (ex) {
                    if (ex == "_im_requath_request_") {
                        throw ex;
                    } else {
                        INTERMediator.setErrorMessage(ex, "EXCEPTION-8");
                    }
                }

                for (i = 0; i < postSetFields.length; i++) {
                    document.getElementById(postSetFields[i]['id']).value = postSetFields[i]['value'];
                }
                IMLibCalc.updateCalculationFields();
                IMLibPageNavigation.navigationSetup();
            }
        } catch (ex) {
            if (ex == "_im_requath_request_") {
                if (INTERMediatorOnPage.requireAuthentication) {
                    if (!INTERMediatorOnPage.isComplementAuthData()) {
                        INTERMediatorOnPage.authChallenge = null;
                        INTERMediatorOnPage.authHashedPassword = null;
                        INTERMediatorOnPage.authenticating(
                            function () {
                                INTERMediator.constructMain(updateRequiredContext);
                            }
                        );
                        return;
                    }
                }
            } else {
                INTERMediator.setErrorMessage(ex, "EXCEPTION-7");
            }
        }

        for (i = 0; i < imPartsShouldFinished.length; i++) {
            imPartsShouldFinished[i].finish();
        }

        INTERMediatorOnPage.hideProgress();

        for (i = 0; i < appendingNodesAtLast.length; i++) {
            theNode = appendingNodesAtLast[i].targetNode;
            parentNode = appendingNodesAtLast[i].parentNode;
            sybilingNode = appendingNodesAtLast[i].siblingNode;
            if (theNode && parentNode) {
                if (sybilingNode) {
                    parentNode.insertBefore(theNode, sybilingNode);
                } else {
                    parentNode.appendChild(theNode);
                }
            }
        }

        // Event listener should add after adding node to document.
        for (i = 0; i < eventListenerPostAdding.length; i++) {
            theNode = document.getElementById(eventListenerPostAdding[i].id);
            if (theNode) {
                INTERMediatorLib.addEvent(
                    theNode, eventListenerPostAdding[i].event, eventListenerPostAdding[i].todo);
            }
        }

        if (INTERMediatorOnPage.doAfterConstruct) {
            INTERMediatorOnPage.doAfterConstruct();
        }

        INTERMediator.flushMessage(); // Show messages

        /* --------------------------------------------------------------------
         This function is called on case of below.

         [1] INTERMediator.constructMain() or INTERMediator.constructMain(true)
         */
        function pageConstruct() {
            var i, bodyNode, emptyElement;

            IMLibCalc.calculateRequiredObject = {};
            INTERMediator.currentEncNumber = 1;
            INTERMediator.elementIds = [];
            //INTERMediator.widgetElementIds = [];
            isInsidePostOnly = false;

            // Restoring original HTML Document from backup data.
            bodyNode = document.getElementsByTagName('BODY')[0];
            if (INTERMediator.rootEnclosure === null) {
                INTERMediator.rootEnclosure = bodyNode.innerHTML;
            } else {
                bodyNode.innerHTML = INTERMediator.rootEnclosure;
            }
            postSetFields = [];

            try {
                seekEnclosureNode(bodyNode, null, null, null);
            } catch (ex) {
                if (ex == "_im_requath_request_") {
                    throw ex;
                } else {
                    INTERMediator.setErrorMessage(ex, "EXCEPTION-9");
                }
            }


            // After work to set up popup menus.
            for (i = 0; i < postSetFields.length; i++) {
                if (postSetFields[i]['value'] == ""
                    && document.getElementById(postSetFields[i]['id']).tagName == "SELECT") {
                    // for compatibility with Firefox when the value of select tag is empty.
                    emptyElement = document.createElement('option');
                    emptyElement.setAttribute("value", "");
                    document.getElementById(postSetFields[i]['id']).insertBefore(
                        emptyElement, document.getElementById(postSetFields[i]['id']).firstChild);
                }
                document.getElementById(postSetFields[i]['id']).value = postSetFields[i]['value'];
            }
            IMLibLocalContext.bindingDescendant(bodyNode);
            IMLibCalc.updateCalculationFields();
            IMLibPageNavigation.navigationSetup();

            if (isAcceptNotify && INTERMediator.pusherAvailable) {
                var channelName = INTERMediatorOnPage.clientNotificationIdentifier();
                var appKey = INTERMediatorOnPage.clientNotificationKey();
                if (appKey && appKey != "_im_key_isnt_supplied" && !INTERMediator.pusherObject) {
                    try {
                        Pusher.log = function (message) {
                            if (window.console && window.console.log) {
                                window.console.log(message);
                            }
                        };

                        INTERMediator.pusherObject = new Pusher(appKey);
                        INTERMediator.pusherChannel = INTERMediator.pusherObject.subscribe(channelName);
                        INTERMediator.pusherChannel.bind('update', function (data) {
                            IMLibContextPool.updateOnAnotherClient('update', data);
                        });
                        INTERMediator.pusherChannel.bind('create', function (data) {
                            IMLibContextPool.updateOnAnotherClient('create', data);
                        });
                        INTERMediator.pusherChannel.bind('delete', function (data) {
                            IMLibContextPool.updateOnAnotherClient('delete', data);
                        });
                    } catch (ex) {
                        INTERMediator.setErrorMessage(ex, "EXCEPTION-47");
                    }
                }
            }
            appendCredit();
        }

        /** --------------------------------------------------------------------
         * Seeking nodes and if a node is an enclosure, proceed repeating.
         */

        function seekEnclosureNode(node, currentRecord, parentObjectInfo, currentContextObj) {
            var children, className, i, attr;
            if (node.nodeType === 1) { // Work for an element
                try {
                    if (INTERMediatorLib.isEnclosure(node, false)) { // Linked element and an enclosure
                        className = INTERMediatorLib.getClassAttributeFromNode(node);
                        attr = node.getAttribute("data-im-control");
                        if ((className && className.match(/_im_post/))
                            || (attr && attr == "post")) {
                            setupPostOnlyEnclosure(node);
                        } else {
                            if (INTERMediator.isIE) {
                                try {
                                    expandEnclosure(node, currentRecord, parentObjectInfo, currentContextObj);
                                } catch (ex) {
                                    if (ex == "_im_requath_request_") {
                                        throw ex;
                                    }
                                }
                            } else {
                                expandEnclosure(node, currentRecord, parentObjectInfo, currentContextObj);
                            }
                        }
                    } else {
                        children = node.childNodes; // Check all child nodes.
                        if (children) {
                            for (i = 0; i < children.length; i++) {
                                if (children[i].nodeType === 1) {
                                    seekEnclosureNode(children[i], currentRecord, parentObjectInfo, currentContextObj);
                                }
                            }
                        }
                    }
                } catch (ex) {
                    if (ex == "_im_requath_request_") {
                        throw ex;
                    } else {
                        INTERMediator.setErrorMessage(ex, "EXCEPTION-10");
                    }
                }

            }
        }

        /* --------------------------------------------------------------------
         Post only mode.
         */
        function setupPostOnlyEnclosure(node) {
            var nodes, k, currentWidgetNodes, plugin, setupWidget = false;
            var postNodes = INTERMediatorLib.getElementsByClassNameOrDataAttr(node, '_im_post');
            for (var i = 1; i < postNodes.length; i++) {
                INTERMediatorLib.addEvent(
                    postNodes[i],
                    'click',
                    (function () {
                        var targetNode = postNodes[i];
                        return function () {
                            IMLibUI.clickPostOnlyButton(targetNode);
                        }
                    })());
            }
            nodes = node.childNodes;

            isInsidePostOnly = true;
            for (i = 0; i < nodes.length; i++) {
                seekEnclosureInPostOnly(nodes[i]);
            }
            isInsidePostOnly = false;
            // -------------------------------------------
            function seekEnclosureInPostOnly(node) {
                var children, i, wInfo;
                if (node.nodeType === 1) { // Work for an element
                    try {
                        if (INTERMediatorLib.isWidgetElement(node)) {
                            wInfo = INTERMediatorLib.getWidgetInfo(node);
                            if (wInfo[0]) {
//                                setupWidget = true;
                                //IMParts_Catalog[wInfo[0]].instanciate.apply(IMParts_Catalog[wInfo[0]], [node]);
                                IMParts_Catalog[wInfo[0]].instanciate(node);
                                if (imPartsShouldFinished.indexOf(IMParts_Catalog[wInfo[0]]) < 0) {
                                    imPartsShouldFinished.push(IMParts_Catalog[wInfo[0]]);
                                }
                            }
                        } else if (INTERMediatorLib.isEnclosure(node, false)) { // Linked element and an enclosure
                            expandEnclosure(node, null, null, null);
                        } else {
                            children = node.childNodes; // Check all child nodes.
                            for (i = 0; i < children.length; i++) {
                                seekEnclosureInPostOnly(children[i]);
                            }
                        }
                    } catch (ex) {
                        if (ex == "_im_requath_request_") {
                            throw ex;
                        } else {
                            INTERMediator.setErrorMessage(ex, "EXCEPTION-11");
                        }
                    }
                }
            }
        }

        /** --------------------------------------------------------------------
         * Expanding an enclosure.
         */

        function expandEnclosure(node, currentRecord, parentObjectInfo, currentContextObj) {
            var linkedNodes, encNodeTag, repeatersOriginal, repeaters, linkDefs, voteResult, currentContextDef,
                fieldList, repNodeTag, joinField, relationDef, index, fieldName, i, ix, targetRecords, newNode,
                keyValue, selectedNode, calcDef, calcFields, contextObj, masterContext, masterNaviControlValue,
                currentNaviControlValue;

            currentLevel++;

            encNodeTag = node.tagName;
            repNodeTag = INTERMediatorLib.repeaterTagFromEncTag(encNodeTag);
            repeatersOriginal = collectRepeatersOriginal(node, repNodeTag); // Collecting repeaters to this array.
            repeaters = collectRepeaters(repeatersOriginal);  // Collecting repeaters to this array.
            linkedNodes = INTERMediatorLib.seekLinkedAndWidgetNodes(repeaters, true).linkedNode;
            linkDefs = collectLinkDefinitions(linkedNodes);
            voteResult = tableVoting(linkDefs);
            currentContextDef = voteResult.targettable;

            //masterContext = IMLibContextPool.getMasterContext();
            //if (masterContext) {
            //    masterNaviControlValue = masterContext.getContextDef()['navi-control'];
            //    currentNaviControlValue = currentContextDef['navi-control'];
            //    if (masterNaviControlValue
            //        && currentNaviControlValue
            //        && masterNaviControlValue.match(/hide/i)
            //        && currentNaviControlValue.match(/detail/i))
            //    {
            //        currentLevel--;
            //        return;
            //    }
            //}
            //
            INTERMediator.currentEncNumber++;

            if (!node.getAttribute('id')) {
                node.setAttribute('id', nextIdValue());
            }

            if (!currentContextDef) {
                for (i = 0; i < repeatersOriginal.length; i++) {
                    newNode = node.appendChild(repeatersOriginal[i]);

                    // for compatibility with Firefox
                    if (repeatersOriginal[i].getAttribute("selected") != null) {
                        selectedNode = newNode;
                    }
                    if (selectedNode !== undefined) {
                        selectedNode.selected = true;
                    }

                    seekEnclosureNode(newNode, null, node, currentContextObj);
                }
            } else {
                contextObj = new IMLibContext(currentContextDef['name']);
                contextObj.enclosureNode = node;
                contextObj.repeaterNodes = repeaters;
                contextObj.original = repeatersOriginal;
                contextObj.parentContext = currentContextObj;
                contextObj.sequencing = true;

                fieldList = []; // Create field list for database fetch.
                calcDef = currentContextDef['calculation'];
                calcFields = [];
                for (ix in calcDef) {
                    calcFields.push(calcDef[ix]["field"]);
                }
                for (i = 0; i < voteResult.fieldlist.length; i++) {
                    if (!calcFields[voteResult.fieldlist[i]]) {
                        calcFields.push(voteResult.fieldlist[i]);
                    }
                }

                if (currentRecord) {
                    try {
                        relationDef = currentContextDef['relation'];
                        contextObj.setOriginal(repeatersOriginal);
                        if (relationDef) {
                            for (index in relationDef) {
                                if (relationDef[index]['portal'] == true) {
                                    currentContextDef['portal'] = true;
                                }
                                joinField = relationDef[index]['join-field'];
                                contextObj.addForeignValue(joinField, currentRecord[joinField]);
                                for (fieldName in parentObjectInfo) {
                                    if (fieldName == relationDef[index]['join-field']) {
                                        contextObj.addDependingObject(parentObjectInfo[fieldName]);
                                        contextObj.dependingParentObjectInfo
                                            = JSON.parse(JSON.stringify(parentObjectInfo));
                                    }
                                }
                            }
                        }
                    } catch (ex) {
                        if (ex == "_im_requath_request_") {
                            throw ex;
                        } else {
                            INTERMediator.setErrorMessage(ex, "EXCEPTION-25");
                        }
                    }
                }

                targetRecords = retrieveDataForEnclosure(currentContextDef, fieldList, contextObj.foreignValue);
                contextObj.registeredId = targetRecords.registeredId;
                contextObj.nullAcceptable = targetRecords.nullAcceptable;
                isAcceptNotify |= !(INTERMediatorOnPage.notifySupport === false);
                expandRepeaters(contextObj, node, targetRecords);
                setupInsertButton(currentContextDef, keyValue, node, contextObj.foreignValue);
                setupBackNaviButton(contextObj, node);
                callbackForEnclosure(currentContextDef, node);
                contextObj.sequencing = false;

            }
            currentLevel--;
        }

        /** --------------------------------------------------------------------
         * Expanding an repeater.
         */

        function expandRepeaters(contextObj, node, targetRecords) {
            var newNode, nodeClass, dataAttr, recordCounter, repeatersOneRec, linkedElements, currentWidgetNodes,
                currentLinkedNodes, shouldDeleteNodes, dbspec, keyField, foreignField, foreignValue, foreignFieldValue,
                keyValue, keyingValue, k, nodeId, replacedNode, children, wInfo, nameTable, nodeTag, typeAttr,
                linkInfoArray, nameTableKey, nameNumber, nameAttr, nInfo, curVal, j, curTarget, newlyAddedNodes,
                encNodeTag, repNodeTag, ix, repeatersOriginal, targetRecordset, targetTotalCount, i,
                currentContextDef, idValuesForFieldName, indexContext, insertNode;

            encNodeTag = node.tagName;
            repNodeTag = INTERMediatorLib.repeaterTagFromEncTag(encNodeTag);

            idValuesForFieldName = {};
            repeatersOriginal = contextObj.original;
            currentContextDef = contextObj.getContextDef();
            targetRecordset = targetRecords.recordset;
            targetTotalCount = targetRecords.totalCount;

            if (targetRecords.count == 0) {
                for (i = 0; i < repeatersOriginal.length; i++) {
                    newNode = repeatersOriginal[i].cloneNode(true);
                    nodeClass = INTERMediatorLib.getClassAttributeFromNode(newNode);
                    dataAttr = newNode.getAttribute("data-im-control");
                    if (nodeClass == INTERMediator.noRecordClassName || dataAttr == "noresult") {
                        node.appendChild(newNode);
                        setIdValue(newNode);
                    }
                }
            }

            recordCounter = 0;
            for (ix = 0; ix < targetRecordset.length; ix++) { // for each record
                try {
                    recordCounter++;
                    repeatersOneRec = cloneEveryNodes(repeatersOriginal);
                    linkedElements = INTERMediatorLib.seekLinkedAndWidgetNodes(repeatersOneRec, true);
                    currentWidgetNodes = linkedElements.widgetNode;
                    currentLinkedNodes = linkedElements.linkedNode;
                    shouldDeleteNodes = [];
                    for (i = 0; i < repeatersOneRec.length; i++) {
                        setIdValue(repeatersOneRec[i]);
                        shouldDeleteNodes.push(repeatersOneRec[i].getAttribute('id'));
                    }

                    dbspec = INTERMediatorOnPage.getDBSpecification();
                    if (dbspec["db-class"] != null && dbspec["db-class"] == "FileMaker_FX") {
                        keyField = currentContextDef["key"] ? currentContextDef["key"] : "-recid";
                    } else {
                        keyField = currentContextDef["key"] ? currentContextDef["key"] : "id";
                    }
                    if (currentContextDef['portal'] == true) {
                        keyField = "-recid";
                        foreignField = currentContextDef['name'] + "::-recid";
                        foreignValue = targetRecordset[ix][foreignField];
                        foreignFieldValue = foreignField + "=" + foreignValue;
                    } else {
                        foreignFieldValue = "=";
                        foreignValue = null;
                    }
                    keyValue = targetRecordset[ix][keyField];
                    keyingValue = keyField + "=" + keyValue;

                    for (k = 0; k < currentLinkedNodes.length; k++) {
                        // for each linked element
                        nodeId = currentLinkedNodes[k].getAttribute("id");
                        replacedNode = setIdValue(currentLinkedNodes[k]);
                        typeAttr = replacedNode.getAttribute("type");
                        if (typeAttr == "checkbox" || typeAttr == "radio") {
                            children = replacedNode.parentNode.childNodes;
                            for (i = 0; i < children.length; i++) {
                                if (children[i].nodeType === 1 && children[i].tagName == "LABEL" &&
                                    nodeId == children[i].getAttribute("for")) {
                                    children[i].setAttribute("for", replacedNode.getAttribute("id"));
                                    break;
                                }
                            }
                        }
                    }
                    for (k = 0; k < currentWidgetNodes.length; k++) {
                        wInfo = INTERMediatorLib.getWidgetInfo(currentWidgetNodes[k]);
                        if (wInfo[0]) {
                            IMParts_Catalog[wInfo[0]].instanciate(currentWidgetNodes[k]);
                            if (imPartsShouldFinished.indexOf(IMParts_Catalog[wInfo[0]]) < 0) {
                                imPartsShouldFinished.push(IMParts_Catalog[wInfo[0]]);
                            }
                        }
                    }
                } catch (ex) {
                    if (ex == "_im_requath_request_") {
                        throw ex;
                    } else {
                        INTERMediator.setErrorMessage(ex, "EXCEPTION-26");
                    }
                }

                if (currentContextDef['portal'] != true
                    || (currentContextDef['portal'] == true && targetTotalCount > 0)) {
                    nameTable = {};
                    for (k = 0; k < currentLinkedNodes.length; k++) {
                        try {
                            nodeTag = currentLinkedNodes[k].tagName;
                            nodeId = currentLinkedNodes[k].getAttribute('id');
                            if (INTERMediatorLib.isWidgetElement(currentLinkedNodes[k])) {
                                nodeId = currentLinkedNodes[k]._im_getComponentId();
                                // INTERMediator.widgetElementIds.push(nodeId);
                            }
                            // get the tag name of the element
                            typeAttr = currentLinkedNodes[k].getAttribute('type');
                            // type attribute
                            linkInfoArray = INTERMediatorLib.getLinkedElementInfo(currentLinkedNodes[k]);
                            // info array for it  set the name attribute of radio button
                            // should be different for each group
                            if (typeAttr == 'radio') { // set the value to radio button
                                nameTableKey = linkInfoArray.join('|');
                                if (!nameTable[nameTableKey]) {
                                    nameTable[nameTableKey] = nameAttrCounter;
                                    nameAttrCounter++
                                }
                                nameNumber = nameTable[nameTableKey];
                                nameAttr = currentLinkedNodes[k].getAttribute('name');
                                if (nameAttr) {
                                    currentLinkedNodes[k].setAttribute('name', nameAttr + '-' + nameNumber);
                                } else {
                                    currentLinkedNodes[k].setAttribute('name', 'IM-R-' + nameNumber);
                                }
                            }

                            var isContext = false;
                            for (j = 0; j < linkInfoArray.length; j++) {
                                nInfo = INTERMediatorLib.getNodeInfoArray(linkInfoArray[j]);
                                curVal = targetRecordset[ix][nInfo['field']];
                                if (!INTERMediator.isDBDataPreferable || curVal != null) {
                                    IMLibCalc.updateCalculationInfo(
                                        currentContextDef, nodeId, nInfo, targetRecordset[ix]);
                                }
                                if (nInfo['table'] == currentContextDef['name']) {
                                    isContext = true;
                                    curTarget = nInfo['target'];
                                    //    objectReference[nInfo['field']] = nodeId;

                                    // Set data to the element.
                                    if (curVal === null) {
                                        if (IMLibElement.setValueToIMNode(currentLinkedNodes[k], curTarget, '')) {
                                            postSetFields.push({'id': nodeId, 'value': curVal});
                                        }
                                    } else if ((typeof curVal == 'object' || curVal instanceof Object)) {
                                        if (curVal && curVal.length > 0) {
                                            if (IMLibElement.setValueToIMNode(
                                                    currentLinkedNodes[k], curTarget, curVal[0])) {
                                                postSetFields.push({'id': nodeId, 'value': curVal[0]});
                                            }
                                        }
                                    } else {
                                        if (IMLibElement.setValueToIMNode(currentLinkedNodes[k], curTarget, curVal)) {
                                            postSetFields.push({'id': nodeId, 'value': curVal});
                                        }
                                    }
                                    contextObj.setValue(keyingValue, nInfo['field'], curVal, nodeId, curTarget, foreignValue);
                                    idValuesForFieldName[nInfo['field']] = nodeId;
                                }
                            }

                            if (isContext
                                && !isInsidePostOnly
                                && (nodeTag == 'INPUT' || nodeTag == 'SELECT' || nodeTag == 'TEXTAREA')) {
                                //IMLibChangeEventDispatch.setExecute(nodeId, IMLibUI.valueChange);
                                var changeFunction =function (a) {
                                    var id = a;
                                    return function () {
                                        IMLibUI.valueChange(id);
                                    };
                                };
                                eventListenerPostAdding.push({
                                    'id': nodeId,
                                    'event': 'change',
                                    'todo': changeFunction(nodeId)
                                });
                                if (nodeTag != 'SELECT') {
                                    eventListenerPostAdding.push({
                                        'id': nodeId,
                                        'event': 'keydown',
                                        'todo': IMLibUI.keyDown
                                    });
                                    eventListenerPostAdding.push({
                                        'id': nodeId,
                                        'event': 'keyup',
                                        'todo': IMLibUI.keyUp
                                    });
                                }
                            }

                        } catch (ex) {
                            if (ex == "_im_requath_request_") {
                                throw ex;
                            } else {
                                INTERMediator.setErrorMessage(ex, "EXCEPTION-27");
                            }
                        }
                    }
                }

                if (currentContextDef['portal'] == true) {
                    keyField = "-recid";
                    foreignField = currentContextDef['name'] + "::-recid";
                    foreignValue = targetRecordset[ix][foreignField];
                    foreignFieldValue = foreignField + "=" + foreignValue;
                } else {
                    foreignField = "";
                    foreignValue = "";
                    foreignFieldValue = "=";
                }

                setupDeleteButton(encNodeTag, repNodeTag, repeatersOneRec[repeatersOneRec.length - 1],
                    currentContextDef, keyField, keyValue, foreignField, foreignValue, shouldDeleteNodes);
                setupNavigationButton(encNodeTag, repNodeTag, repeatersOneRec[repeatersOneRec.length - 1],
                    currentContextDef, keyField, keyValue, foreignField, foreignValue);

                if (currentContextDef['portal'] != true
                    || (currentContextDef['portal'] == true && targetTotalCount > 0)) {
                    newlyAddedNodes = [];
                    insertNode = null;
                    if (!contextObj.sequencing) {
                        indexContext = contextObj.checkOrder(targetRecordset[ix]);
                        insertNode = contextObj.getRepeaterEndNode(indexContext + 1)
                    }
                    for (i = 0; i < repeatersOneRec.length; i++) {
                        newNode = repeatersOneRec[i];
                        //newNode = repeatersOneRec[i].cloneNode(true);
                        nodeClass = INTERMediatorLib.getClassAttributeFromNode(newNode);
                        dataAttr = newNode.getAttribute("data-im-control");
                        if ((nodeClass != INTERMediator.noRecordClassName) && (dataAttr != "noresult")) {
                            if (!insertNode) {
                                node.appendChild(newNode);
                            } else {
                                insertNode.parentNode.insertBefore(newNode, insertNode);
                            }
                            newlyAddedNodes.push(newNode);
                            setIdValue(newNode);
                            contextObj.setValue(keyingValue, "_im_repeater", "", newNode.id, "", foreignValue);
                            idValuesForFieldName[nInfo['field']] = nodeId;
                            seekEnclosureNode(newNode, targetRecordset[ix], idValuesForFieldName, contextObj);
                        }
                    }
                    callbackForRepeaters(currentContextDef, node, newlyAddedNodes);
                }
                contextObj.rearrangePendingOrder();
            }
        }

        /* --------------------------------------------------------------------

         */
        function retrieveDataForEnclosure(currentContextDef, fieldList, relationValue) {
            var ix, keyField, targetRecords, counter, oneRecord, isMatch, index, fieldName, condition,
                recordNumber, useLimit, optionalCondition = [], pagingValue, recordsValue;

            if (currentContextDef['cache'] == true) {
                try {
                    if (!INTERMediatorOnPage.dbCache[currentContextDef['name']]) {
                        INTERMediatorOnPage.dbCache[currentContextDef['name']]
                            = INTERMediator_DBAdapter.db_query({
                            name: currentContextDef['name'],
                            records: null,
                            paging: null,
                            fields: fieldList,
                            parentkeyvalue: null,
                            conditions: null,
                            useoffset: false
                        });
                    }
                    if (relationValue === null) {
                        targetRecords = INTERMediatorOnPage.dbCache[currentContextDef['name']];
                    } else {
                        targetRecords = {recordset: [], count: 0};
                        counter = 0;
                        for (ix in INTERMediatorOnPage.dbCache[currentContextDef['name']].recordset) {
                            oneRecord = INTERMediatorOnPage.dbCache[currentContextDef['name']].recordset[ix];
                            isMatch = true;
                            index = 0;
                            for (keyField in relationValue) {
                                fieldName = currentContextDef['relation'][index]['foreign-key'];
                                if (oneRecord[fieldName] != relationValue[keyField]) {
                                    isMatch = false;
                                    break;
                                }
                                index++;
                            }
                            if (isMatch) {
                                pagingValue = currentContextDef['paging'] ? currentContextDef['paging'] : false;
                                recordsValue = currentContextDef['records'] ? currentContextDef['records'] : 10000000000;

                                if (!pagingValue || (pagingValue && ( counter >= INTERMediator.startFrom ))) {
                                    targetRecords.recordset.push(oneRecord);
                                    targetRecords.count++;
                                    if (recordsValue <= targetRecords.count) {
                                        break;
                                    }
                                }
                                counter++;
                            }
                        }
                    }
                } catch (ex) {
                    if (ex == "_im_requath_request_") {
                        throw ex;
                    } else {
                        INTERMediator.setErrorMessage(ex, "EXCEPTION-24");
                    }
                }
            } else {   // cache is not active.
                try {
                    if (currentContextDef["portal"] == true) {
                        for (condition in INTERMediator.additionalCondition) {
                            optionalCondition.push(INTERMediator.additionalCondition[condition]);
                            break;
                        }
                    }
                    useLimit = false;
                    if (currentContextDef["records"] && currentContextDef["paging"]) {
                        useLimit = true;
                    }
                    if (currentContextDef['maxrecords'] && useLimit && Number(INTERMediator.pagedSize) > 0
                        && Number(currentContextDef['maxrecords']) >= Number(INTERMediator.pagedSize)) {
                        recordNumber = Number(INTERMediator.pagedSize);
                    } else {
                        recordNumber = Number(currentContextDef['records']);
                    }
                    targetRecords = INTERMediator_DBAdapter.db_query({
                        "name": currentContextDef['name'],
                        "records": isNaN(recordNumber) ? 100000000 : recordNumber,
                        "paging": currentContextDef['paging'],
                        "fields": fieldList,
                        "parentkeyvalue": relationValue,
                        "conditions": optionalCondition,
                        "useoffset": true,
                        "uselimit": useLimit
                    });
                } catch (ex) {
                    if (ex == "_im_requath_request_") {
                        throw ex;
                    } else {
                        INTERMediator.setErrorMessage(ex, "EXCEPTION-12");
                    }
                }
            }
            return targetRecords;
        }

        /* --------------------------------------------------------------------

         */
        function setIdValue(node) {
            var i, elementInfo, comp, overwrite = true;

            if (node.getAttribute('id') === null) {
                node.setAttribute('id', nextIdValue());
            } else {
                if (INTERMediator.elementIds.indexOf(node.getAttribute('id')) >= 0) {
                    elementInfo = INTERMediatorLib.getLinkedElementInfo(node);
                    for (i = 0; i < elementInfo.length; i++) {
                        comp = elementInfo[i].split(INTERMediator.separator);
                        if (comp[2] == "#id") {
                            overwrite = false;
                        }
                    }
                    if (overwrite) {
                        node.setAttribute('id', nextIdValue());
                    }
                }
                INTERMediator.elementIds.push(node.getAttribute('id'));
            }
            return node;
        }

        /* --------------------------------------------------------------------

         */
        function nextIdValue() {
            INTERMediator.linkedElmCounter++;
            return currentIdValue();
        }

        /* --------------------------------------------------------------------

         */
        function currentIdValue() {
            return 'IM' + INTERMediator.currentEncNumber + '-' + INTERMediator.linkedElmCounter;
        }

        /* --------------------------------------------------------------------

         */
        function callbackForRepeaters(currentContextDef, node, newlyAddedNodes) {
            try {
                if (INTERMediatorOnPage.additionalExpandingRecordFinish[currentContextDef['name']]) {
                    INTERMediatorOnPage.additionalExpandingRecordFinish[currentContextDef['name']](node);
                    INTERMediator.setDebugMessage(
                        "Call the post enclosure method 'INTERMediatorOnPage.additionalExpandingRecordFinish["
                        + currentContextDef['name'] + "] with the context.", 2);
                }
            } catch (ex) {
                if (ex == "_im_requath_request_") {
                    throw ex;
                } else {
                    INTERMediator.setErrorMessage(ex,
                        "EXCEPTION-33: hint: post-repeater of " + currentContextDef.name);
                }
            }
            try {
                if (INTERMediatorOnPage.expandingRecordFinish != null) {
                    INTERMediatorOnPage.expandingRecordFinish(currentContextDef['name'], newlyAddedNodes);
                    INTERMediator.setDebugMessage(
                        "Call INTERMediatorOnPage.expandingRecordFinish with the context: "
                        + currentContextDef['name'], 2);
                }

                if (currentContextDef['post-repeater']) {
                    INTERMediatorOnPage[currentContextDef['post-repeater']](newlyAddedNodes);

                    INTERMediator.setDebugMessage("Call the post repeater method 'INTERMediatorOnPage."
                    + currentContextDef['post-repeater'] + "' with the context: "
                    + currentContextDef['name'], 2);
                }
            } catch (ex) {
                if (ex == "_im_requath_request_") {
                    throw ex;
                } else {
                    INTERMediator.setErrorMessage(ex, "EXCEPTION-23");
                }
            }

        }

        /* --------------------------------------------------------------------

         */
        function callbackForEnclosure(currentContextDef, node) {
            try {
                if (INTERMediatorOnPage.additionalExpandingEnclosureFinish[currentContextDef['name']]) {
                    INTERMediatorOnPage.additionalExpandingEnclosureFinish[currentContextDef['name']](node);
                    INTERMediator.setDebugMessage(
                        "Call the post enclosure method 'INTERMediatorOnPage.additionalExpandingEnclosureFinish["
                        + currentContextDef['name'] + "] with the context.", 2);
                }
            } catch (ex) {
                if (ex == "_im_requath_request_") {
                    throw ex;
                } else {
                    INTERMediator.setErrorMessage(ex,
                        "EXCEPTION-32: hint: post-enclosure of " + currentContextDef.name);
                }
            }
            try {
                if (INTERMediatorOnPage.expandingEnclosureFinish != null) {
                    INTERMediatorOnPage.expandingEnclosureFinish(currentContextDef['name'], node);
                    INTERMediator.setDebugMessage(
                        "Call INTERMediatorOnPage.expandingEnclosureFinish with the context: "
                        + currentContextDef['name'], 2);
                }
            } catch (ex) {
                if (ex == "_im_requath_request_") {
                    throw ex;
                } else {
                    INTERMediator.setErrorMessage(ex, "EXCEPTION-21");
                }
            }
            try {
                if (currentContextDef['post-enclosure']) {
                    INTERMediatorOnPage[currentContextDef['post-enclosure']](node);
                    INTERMediator.setDebugMessage(
                        "Call the post enclosure method 'INTERMediatorOnPage." + currentContextDef['post-enclosure']
                        + "' with the context: " + currentContextDef['name'], 2);
                }
            } catch (ex) {
                if (ex == "_im_requath_request_") {
                    throw ex;
                } else {
                    INTERMediator.setErrorMessage(ex,
                        "EXCEPTION-22: hint: post-enclosure of " + currentContextDef.name);
                }
            }
        }

        /* --------------------------------------------------------------------

         */
        function collectRepeatersOriginal(node, repNodeTag) {
            var i, repeatersOriginal = [], children;

            children = node.childNodes; // Check all child node of the enclosure.
            for (i = 0; i < children.length; i++) {
                if (children[i].nodeType === 1 && children[i].tagName == repNodeTag) {
                    // If the element is a repeater.
                    repeatersOriginal.push(children[i]); // Record it to the array.
                }
            }
            return repeatersOriginal;
        }

        /* --------------------------------------------------------------------

         */
        function collectRepeaters(repeatersOriginal) {
            var i, repeaters = [], inDocNode, parentOfRep, cloneNode;
            for (i = 0; i < repeatersOriginal.length; i++) {
                inDocNode = repeatersOriginal[i];
                parentOfRep = repeatersOriginal[i].parentNode;
                cloneNode = repeatersOriginal[i].cloneNode(true);
                repeaters.push(cloneNode);
                cloneNode.setAttribute('id', nextIdValue());
                parentOfRep.removeChild(inDocNode);
            }
            return repeaters;
        }

        /* --------------------------------------------------------------------

         */
        function collectLinkDefinitions(linkedNodes) {
            var linkDefs = [], nodeDefs, j, k;
            for (j = 0; j < linkedNodes.length; j++) {
                nodeDefs = INTERMediatorLib.getLinkedElementInfo(linkedNodes[j]);
                if (nodeDefs !== null) {
                    for (k = 0; k < nodeDefs.length; k++) {
                        linkDefs.push(nodeDefs[k]);
                    }
                }
            }
            return linkDefs;
        }

        /* --------------------------------------------------------------------

         */
        function tableVoting(linkDefs) {
            var j, nodeInfoArray, nodeInfoField, nodeInfoTable, maxVoted, maxTableName, tableName,
                nodeInfoTableIndex, context,
                tableVote = [],    // Containing editable elements or not.
                fieldList = []; // Create field list for database fetch.

            for (j = 0; j < linkDefs.length; j++) {
                nodeInfoArray = INTERMediatorLib.getNodeInfoArray(linkDefs[j]);
                nodeInfoField = nodeInfoArray['field'];
                nodeInfoTable = nodeInfoArray['table'];
                nodeInfoTableIndex = nodeInfoArray['tableindex'];   // Table name added "_im_index_" as the prefix.
                if (nodeInfoTable != IMLibLocalContext.contextName) {
                    if (nodeInfoField != null
                        && nodeInfoField.length != 0
                        && nodeInfoTable.length != 0
                        && nodeInfoTable != null) {
                        if (!fieldList[nodeInfoTableIndex]) {
                            fieldList[nodeInfoTableIndex] = [];
                        }
                        fieldList[nodeInfoTableIndex].push(nodeInfoField);
                        if (!tableVote[nodeInfoTableIndex]) {
                            tableVote[nodeInfoTableIndex] = 1;
                        } else {
                            ++tableVote[nodeInfoTableIndex];
                        }
                    } else {
                        INTERMediator.setErrorMessage(
                            INTERMediatorLib.getInsertedStringFromErrorNumber(1006, [linkDefs[j]]));
                        //   return null;
                    }
                }
            }
            maxVoted = -1;
            maxTableName = ''; // Which is the maximum voted table name.
            for (tableName in tableVote) {
                if (maxVoted < tableVote[tableName]) {
                    maxVoted = tableVote[tableName];
                    maxTableName = tableName.substring(10);
                }
            }
            context = INTERMediatorLib.getNamedObject(INTERMediatorOnPage.getDataSources(), 'name', maxTableName);
            return {targettable: context, fieldlist: fieldList["_im_index_" + maxTableName]};
        }

        /* --------------------------------------------------------------------

         */
        function cloneEveryNodes(originalNodes) {
            var i, clonedNodes = [];
            for (i = 0; i < originalNodes.length; i++) {
                clonedNodes.push(originalNodes[i].cloneNode(true));
            }
            return clonedNodes;
        }

        /* --------------------------------------------------------------------

         */
        function setupDeleteButton(encNodeTag, repNodeTag, endOfRepeaters, currentContextDef, keyField, keyValue, foreignField, foreignValue, shouldDeleteNodes) {
            // Handling Delete buttons
            var buttonNode, thisId, deleteJSFunction, tdNodes, tdNode;

            if (!currentContextDef['repeat-control']
                || !currentContextDef['repeat-control'].match(/delete/i)) {
                return;
            }
            if (currentContextDef['relation']
                || currentContextDef['records'] === undefined
                || (currentContextDef['records'] > 1 && Number(INTERMediator.pagedSize) != 1)) {

                buttonNode = document.createElement('BUTTON');
                INTERMediatorLib.setClassAttributeToNode(buttonNode, "IM_Button_Delete");
                buttonNode.appendChild(document.createTextNode(INTERMediatorOnPage.getMessages()[6]));
                thisId = 'IM_Button_' + INTERMediator.buttonIdNum;
                buttonNode.setAttribute('id', thisId);
                INTERMediator.buttonIdNum++;
                deleteJSFunction = function (a, b, c, d, e) {
                    var contextName = a, keyField = b, keyValue = c, removeNodes = d, confirming = e;

                    return function () {
                        IMLibUI.deleteButton(
                            contextName, keyField, keyValue, foreignField, foreignValue, removeNodes, confirming);
                    };
                };
                eventListenerPostAdding.push({
                    'id': thisId,
                    'event': 'click',
                    'todo': deleteJSFunction(
                        currentContextDef['name'],
                        keyField,
                        keyValue,
                        shouldDeleteNodes,
                        currentContextDef['repeat-control'].match(/confirm-delete/i))
                });

                // endOfRepeaters = repeatersOneRec[repeatersOneRec.length - 1];
                switch (encNodeTag) {
                    case 'TBODY':
                        tdNodes = endOfRepeaters.getElementsByTagName('TD');
                        tdNode = tdNodes[tdNodes.length - 1];
                        tdNode.appendChild(buttonNode);
                        break;
                    case 'UL':
                    case 'OL':
                        endOfRepeaters.appendChild(buttonNode);
                        break;
                    case 'DIV':
                    case 'SPAN':
                        if (repNodeTag == "DIV" || repNodeTag == "SPAN") {
                            endOfRepeaters.appendChild(buttonNode);
                        }
                        break;
                }
            } else {
                IMLibPageNavigation.deleteInsertOnNavi.push({
                    kind: 'DELETE',
                    name: currentContextDef['name'],
                    key: keyField,
                    value: keyValue,
                    confirm: currentContextDef['repeat-control'].match(/confirm-delete/i)
                });
            }
        }

        /* --------------------------------------------------------------------

         */
        function setupInsertButton(currentContextDef, keyValue, node, relationValue) {
            var buttonNode, shouldRemove, enclosedNode, footNode, trNode, tdNode, liNode, divNode, insertJSFunction, i,
                firstLevelNodes, targetNodeTag, existingButtons, keyField, dbspec, thisId, encNodeTag, repNodeTag;

            encNodeTag = node.tagName;
            repNodeTag = INTERMediatorLib.repeaterTagFromEncTag(encNodeTag);

            if (currentContextDef['repeat-control'] && currentContextDef['repeat-control'].match(/insert/i)) {
                if (relationValue.length > 0 || !currentContextDef['paging'] || currentContextDef['paging'] === false) {
                    buttonNode = document.createElement('BUTTON');
                    INTERMediatorLib.setClassAttributeToNode(buttonNode, "IM_Button_Insert");
                    buttonNode.appendChild(document.createTextNode(INTERMediatorOnPage.getMessages()[5]));
                    thisId = 'IM_Button_' + INTERMediator.buttonIdNum;
                    buttonNode.setAttribute('id', thisId);
                    INTERMediator.buttonIdNum++;
                    shouldRemove = [];
                    switch (encNodeTag) {
                        case 'TBODY':
                            targetNodeTag = "TFOOT";
                            if (currentContextDef['repeat-control'].match(/top/i)) {
                                targetNodeTag = "THEAD";
                            }
                            enclosedNode = node.parentNode;
                            firstLevelNodes = enclosedNode.childNodes;
                            footNode = null;
                            for (i = 0; i < firstLevelNodes.length; i++) {
                                if (firstLevelNodes[i].tagName === targetNodeTag) {
                                    footNode = firstLevelNodes[i];
                                    break;
                                }
                            }
                            if (footNode === null) {
                                footNode = document.createElement(targetNodeTag);
                                enclosedNode.appendChild(footNode);
                            }
                            existingButtons = INTERMediatorLib.getElementsByClassName(footNode, 'IM_Button_Insert');
                            if (existingButtons.length == 0) {
                                trNode = document.createElement('TR');
                                tdNode = document.createElement('TD');
                                setIdValue(trNode);
                                footNode.appendChild(trNode);
                                trNode.appendChild(tdNode);
                                tdNode.appendChild(buttonNode);
                                shouldRemove = [trNode.getAttribute('id')];
                            }
                            break;
                        case 'UL':
                        case 'OL':
                            liNode = document.createElement('LI');
                            existingButtons = INTERMediatorLib.getElementsByClassName(liNode, 'IM_Button_Insert');
                            if (existingButtons.length == 0) {
                                liNode.appendChild(buttonNode);
                                if (currentContextDef['repeat-control'].match(/top/i)) {
                                    node.insertBefore(liNode, node.firstChild);
                                } else {
                                    node.appendChild(liNode);
                                }
                            }
                            break;
                        case 'DIV':
                        case 'SPAN':
                            if (repNodeTag == "DIV" || repNodeTag == "SPAN") {
                                divNode = document.createElement(repNodeTag);
                                existingButtons = INTERMediatorLib.getElementsByClassName(divNode, 'IM_Button_Insert');
                                if (existingButtons.length == 0) {
                                    divNode.appendChild(buttonNode);
                                    if (currentContextDef['repeat-control'].match(/top/i)) {
                                        node.insertBefore(divNode, node.firstChild);
                                    } else {
                                        node.appendChild(divNode);
                                    }
                                }
                            }
                            break;
                    }
                    insertJSFunction = function (a, b, c, d, e) {
                        var contextName = a, relationValue = b, nodeId = c, removeNodes = d, confirming = e;
                        return function () {
                            IMLibUI.insertButton(contextName, keyValue, relationValue, nodeId, removeNodes, confirming);
                        }
                    };

                    INTERMediatorLib.addEvent(
                        buttonNode,
                        'click',
                        insertJSFunction(
                            currentContextDef['name'],
                            relationValue,
                            node.getAttribute('id'),
                            shouldRemove,
                            currentContextDef['repeat-control'].match(/confirm-insert/i))
                    );

                } else {
                    dbspec = INTERMediatorOnPage.getDBSpecification();
                    if (dbspec["db-class"] != null && dbspec["db-class"] == "FileMaker_FX") {
                        keyField = currentContextDef["key"] ? currentContextDef["key"] : "-recid";
                    } else {
                        keyField = currentContextDef["key"] ? currentContextDef["key"] : "id";
                    }
                    IMLibPageNavigation.deleteInsertOnNavi.push({
                        kind: 'INSERT',
                        name: currentContextDef['name'],
                        key: keyField,
                        confirm: currentContextDef['repeat-control'].match(/confirm-insert/i)
                    });
                }
            }
        }

        /* --------------------------------------------------------------------

         */
        function setupNavigationButton(encNodeTag, repNodeTag, endOfRepeaters, currentContextDef, keyField, keyValue, foreignField, foreignValue) {
            // Handling Detail buttons
            var buttonNode, thisId, navigateJSFunction, tdNodes, tdNode, firstInNode, contextDef, isHide,
                detailContext, showingNode, isHidePageNavi;

            if (!currentContextDef['navi-control']
                || !currentContextDef['navi-control'].match(/master/i)) {
                return;
            }

            isHide = currentContextDef['navi-control'].match(/hide/i);
            isHidePageNavi = isHide && (currentContextDef['paging'] == true);

            if (INTERMediator.detailNodeOriginalDisplay) {
                detailContext = IMLibContextPool.getDetailContext();
                if (detailContext) {
                    showingNode = detailContext.enclosureNode;
                    if (showingNode.tagName == 'TBODY') {
                        showingNode = showingNode.parentNode;
                    }
                    INTERMediator.detailNodeOriginalDisplay = showingNode.style.display;
                }
            }

            buttonNode = document.createElement('BUTTON');
            INTERMediatorLib.setClassAttributeToNode(buttonNode, "IM_Button_Master");
            buttonNode.appendChild(document.createTextNode(INTERMediatorOnPage.getMessages()[12]));
            thisId = 'IM_Button_' + INTERMediator.buttonIdNum;
            buttonNode.setAttribute('id', thisId);
            INTERMediator.buttonIdNum++;
            navigateJSFunction = function (encNodeTag, keyField, keyValue, foreignField, foreignValue, isHide, isHidePageNavi) {
                var f = keyField, v = keyValue, ff = foreignField, fv = foreignValue;
                var fvalue = {}, etag = encNodeTag, isMasterHide = isHide, isPageHide = isHidePageNavi;
                fvalue[ff] = fv;

                return function () {
                    var masterContext, detailContext, contextName, masterEnclosure, detailEnclosure, conditions;

                    masterContext = IMLibContextPool.getMasterContext();
                    detailContext = IMLibContextPool.getDetailContext();
                    if (detailContext) {
                        contextDef = detailContext.getContextDef();
                        contextName = contextDef.name;
                        conditions = INTERMediator.additionalCondition;
                        conditions[contextName] = {field: f, operator: "=", value: v};
                        INTERMediator.additionalCondition = conditions;
                        INTERMediator.constructMain(detailContext);
                        if (isMasterHide) {
                            masterEnclosure = masterContext.enclosureNode;
                            if (etag == 'TBODY') {
                                masterEnclosure = masterEnclosure.parentNode;
                            }
                            INTERMediator.masterNodeOriginalDisplay = masterEnclosure.style.display;
                            masterEnclosure.style.display = "none";

                            detailEnclosure = detailContext.enclosureNode;
                            if (detailEnclosure.tagName == 'TBODY') {
                                detailEnclosure = detailEnclosure.parentNode;
                            }
                            detailEnclosure.style.display = INTERMediator.detailNodeOriginalDisplay;
                        }
                        if (isPageHide) {
                            document.getElementById("IM_NAVIGATOR").style.display = "none";
                        }
                    }
                };
            };
            eventListenerPostAdding.push({
                'id': thisId,
                'event': 'click',
                'todo': navigateJSFunction(encNodeTag, keyField, keyValue, foreignField, foreignValue, isHide, isHidePageNavi)
            });

            switch (encNodeTag) {
                case 'TBODY':
                    tdNodes = endOfRepeaters.getElementsByTagName('TD');
                    tdNode = tdNodes[0];
                    firstInNode = tdNode.childNodes[0];
                    if (firstInNode) {
                        tdNode.insertBefore(buttonNode, firstInNode);
                    } else {
                        tdNode.appendChild(buttonNode);
                    }
                    break;
                case 'UL':
                case 'OL':
                    firstInNode = endOfRepeaters.childNodes[0];
                    if (firstInNode) {
                        endOfRepeaters.insertBefore(buttonNode, firstInNode);
                    } else {
                        endOfRepeaters.appendChild(buttonNode);
                    }
                    break;
                case 'DIV':
                case 'SPAN':
                    if (repNodeTag == "DIV" || repNodeTag == "SPAN") {
                        firstInNode = endOfRepeaters.childNodes[0];
                        if (firstInNode) {
                            endOfRepeaters.insertBefore(buttonNode, firstInNode);
                        } else {
                            endOfRepeaters.appendChild(buttonNode);
                        }
                    }
                    break;
            }

        }

        /* --------------------------------------------------------------------

         */
        function setupBackNaviButton(currentContext, node) {
            var buttonNode, shouldRemove, enclosedNode, footNode, trNode, tdNode, liNode, divNode,
                insertJSFunction, i, firstLevelNodes, targetNodeTag, existingButtons, masterContext,
                naviControlValue, thisId, repNodeTag, currentContextDef, showingNode, targetNode, isHidePageNavi;

            currentContextDef = currentContext.getContextDef();

            if (!currentContextDef['navi-control']
                || !currentContextDef['navi-control'].match(/detail/i)) {
                return;
            }

            masterContext = IMLibContextPool.getMasterContext();
            naviControlValue = masterContext.getContextDef()['navi-control'];
            if (!naviControlValue
                || (!naviControlValue.match(/hide/i))) {
                return;
            }
            isHidePageNavi = masterContext.getContextDef()['paging'] == true;

            showingNode = currentContext.enclosureNode;
            if (showingNode.tagName == "TBODY") {
                showingNode = showingNode.parentNode;
            }
            if (INTERMediator.detailNodeOriginalDisplay) {
                INTERMediator.detailNodeOriginalDisplay = showingNode.style.display;
            }
            showingNode.style.display = "none";

            buttonNode = document.createElement('BUTTON');
            INTERMediatorLib.setClassAttributeToNode(buttonNode, "IM_Button_BackNavi");
            buttonNode.appendChild(document.createTextNode(INTERMediatorOnPage.getMessages()[13]));
            thisId = 'IM_Button_' + INTERMediator.buttonIdNum;
            buttonNode.setAttribute('id', thisId);
            INTERMediator.buttonIdNum++;

            shouldRemove = [];
            switch (node.tagName) {
                case 'TBODY':
                    if (currentContextDef['navi-control'].match(/top/i)) {
                        targetNodeTag = "THEAD";
                    } else if (currentContextDef['navi-control'].match(/bottom/i)) {
                        targetNodeTag = "TFOOT";
                    } else {
                        targetNodeTag = "THEAD";
                    }
                    enclosedNode = node.parentNode;
                    firstLevelNodes = enclosedNode.childNodes;
                    targetNode = null;
                    for (i = 0; i < firstLevelNodes.length; i++) {
                        if (firstLevelNodes[i].tagName === targetNodeTag) {
                            targetNode = firstLevelNodes[i];
                            break;
                        }
                    }
                    if (targetNode === null) {
                        targetNode = document.createElement(targetNodeTag);
                        //if (targetNodeTag == "THEAD") {
                        //    enclosedNode.insertBefore(targetNode, enclosedNode.firstChild);
                        //} else {
                        //    enclosedNode.appendChild(targetNode);
                        //}
                        appendingNodesAtLast.push({
                            targetNode: targetNode,
                            parentNode: enclosedNode,
                            siblingNode: (targetNodeTag == "THEAD") ? enclosedNode.firstChild : null
                        });
                    }
                    existingButtons = INTERMediatorLib.getElementsByClassName(targetNode, 'IM_Button_BackNavi');
                    if (existingButtons.length == 0) {
                        trNode = document.createElement('TR');
                        tdNode = document.createElement('TD');
                        setIdValue(trNode);
                        targetNode.appendChild(trNode);
                        trNode.appendChild(tdNode);
                        tdNode.appendChild(buttonNode);
                        shouldRemove = [trNode.getAttribute('id')];
                    }
                    break;
                case 'UL':
                case 'OL':
                    liNode = document.createElement('LI');
                    existingButtons = INTERMediatorLib.getElementsByClassName(liNode, 'IM_Button_BackNavi');
                    if (existingButtons.length == 0) {
                        liNode.appendChild(buttonNode);
                        if (currentContextDef['repeat-control'].match(/bottom/i)) {
                            node.appendChild(liNode);
                        } else {
                            node.insertBefore(liNode, node.firstChild);
                        }
                    }
                    break;
                case 'DIV':
                case 'SPAN':
                    repNodeTag = INTERMediatorLib.repeaterTagFromEncTag(node.tagName);
                    if (repNodeTag == "DIV" || repNodeTag == "SPAN") {
                        divNode = document.createElement(repNodeTag);
                        existingButtons = INTERMediatorLib.getElementsByClassName(divNode, 'IM_Button_BackNavi');
                        if (existingButtons.length == 0) {
                            divNode.appendChild(buttonNode);
                            if (currentContextDef['repeat-control'].match(/bottom/i)) {
                                node.appendChild(divNode);
                            } else {
                                node.insertBefore(divNode, node.firstChild);
                            }
                        }
                    }
                    break;
            }
            insertJSFunction = function (a, b, c) {
                var masterContextCL = a, detailContextCL = b, pageNaviShow = c;
                return function () {
                    var showingNode;
                    showingNode = detailContextCL.enclosureNode;
                    if (showingNode.tagName == "TBODY") {
                        showingNode = showingNode.parentNode;
                    }
                    showingNode.style.display = "none";

                    showingNode = masterContextCL.enclosureNode;
                    if (showingNode.tagName == "TBODY") {
                        showingNode = showingNode.parentNode;
                    }
                    showingNode.style.display = INTERMediator.masterNodeOriginalDisplay

                    if (pageNaviShow) {
                        document.getElementById("IM_NAVIGATOR").style.display = "block";
                    }
                }
            };

            INTERMediatorLib.addEvent(
                buttonNode,
                'click',
                insertJSFunction(masterContext, currentContext, isHidePageNavi)
            );

        }

        /* --------------------------------------------------------------------

         */
        function getEnclosedNode(rootNode, tableName, fieldName) {
            var i, j, nodeInfo, nInfo, children, r;

            if (rootNode.nodeType == 1) {
                nodeInfo = INTERMediatorLib.getLinkedElementInfo(rootNode);
                for (j = 0; j < nodeInfo.length; j++) {
                    nInfo = INTERMediatorLib.getNodeInfoArray(nodeInfo[j]);
                    if (nInfo['table'] == tableName && nInfo['field'] == fieldName) {
                        return rootNode;
                    }
                }
            }
            children = rootNode.childNodes; // Check all child node of the enclosure.
            for (i = 0; i < children.length; i++) {
                r = getEnclosedNode(children[i], tableName, fieldName);
                if (r !== null) {
                    return r;
                }
            }
            return null;
        }

        /* --------------------------------------------------------------------

         */
        function appendCredit() {
            var bodyNode, creditNode, cNode, spNode, aNode;

            if (document.getElementById('IM_CREDIT') === null) {
                bodyNode = document.getElementsByTagName('BODY')[0];
                creditNode = document.createElement('div');
                bodyNode.appendChild(creditNode);
                creditNode.setAttribute('id', 'IM_CREDIT');
                creditNode.setAttribute('class', 'IM_CREDIT');

                cNode = document.createElement('div');
                creditNode.appendChild(cNode);
                cNode.style.backgroundColor = '#F6F7FF';
                cNode.style.height = '2px';

                cNode = document.createElement('div');
                creditNode.appendChild(cNode);
                cNode.style.backgroundColor = '#EBF1FF';
                cNode.style.height = '2px';

                cNode = document.createElement('div');
                creditNode.appendChild(cNode);
                cNode.style.backgroundColor = '#E1EAFF';
                cNode.style.height = '2px';

                cNode = document.createElement('div');
                creditNode.appendChild(cNode);
                cNode.setAttribute('align', 'right');
                cNode.style.backgroundColor = '#D7E4FF';
                cNode.style.padding = '2px';
                spNode = document.createElement('span');
                cNode.appendChild(spNode);
                cNode.style.color = '#666666';
                cNode.style.fontSize = '7pt';
                aNode = document.createElement('a');
                aNode.appendChild(document.createTextNode('INTER-Mediator'));
                aNode.setAttribute('href', 'http://inter-mediator.org/');
                aNode.setAttribute('target', '_href');
                spNode.appendChild(document.createTextNode('Generated by '));
                spNode.appendChild(aNode);
                spNode.appendChild(document.createTextNode(' Ver.4.6(2014-12-30)'));
            }
        }
    },

    getLocalProperty: function (localKey, defaultValue) {
        var value;
        value = IMLibLocalContext.getValue(localKey);
        return value === null ? defaultValue : value;
    },

    setLocalProperty: function (localKey, value) {
        IMLibLocalContext.setValue(localKey, value, true);
    },

    addCondition: function (contextName, condition) {
        var value = INTERMediator.additionalCondition;
        if (value[contextName]) {
            value[contextName].push(condition);
        } else {
            value[contextName] = [condition];
        }
        INTERMediator.additionalCondition = value;
        IMLibLocalContext.archive();
    },

    clearCondition: function (contextName) {
        var value = INTERMediator.additionalCondition;
        if (value[contextName]) {
            delete value[contextName];
            INTERMediator.additionalCondition = value;
            IMLibLocalContext.archive();
        }
    },

    addSortKey: function (contextName, sortKey) {
        var value = INTERMediator.additionalSortKey;
        if (value[contextName]) {
            value[contextName].push(sortKey);
        } else {
            value[contextName] = [sortKey];
        }
        INTERMediator.additionalSortKey = value;
        IMLibLocalContext.archive();
    },

    clearSortKey: function (contextName) {
        var value = INTERMediator.additionalSortKey;
        if (value[contextName]) {
            delete value[contextName];
            INTERMediator.additionalSortKey = value;
            IMLibLocalContext.archive();
        }
    }
};

/**
 * Compatibility for IE8
 */
if (!Object.keys) {
    Object.keys = function (obj) {
        var results=[], prop;
        if (obj !== Object(obj)) {
            throw new TypeError('Object.keys called on a non-object');
        }
        for (prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                results.push(prop);
            }
        }
        return results;
    }
};

if (!Array.indexOf) {
    var isWebkit = 'WebkitAppearance' in document.documentElement.style;
    if (!isWebkit) {
        Array.prototype.indexOf = function (target) {
            var i;
            for (i = 0; i < this.length; i++) {
                if (this[i] === target) {
                    return i;
                }
            }
            return -1;
        };
    }
}

if (typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, ''); 
    }
}
/*
 * INTER-Mediator Ver.4.6 Released 2014-12-30
 *
 *   by Masayuki Nii  msyk@msyk.net Copyright (c) 2010-2014 Masayuki Nii, All rights reserved.
 *
 *   This project started at the end of 2009.
 *   INTER-Mediator is supplied under MIT License.
 */

var IMLibElement = {
    setValueToIMNode: function (element, curTarget, curVal, clearField) {
        var styleName, statement, currentValue, scriptNode, typeAttr, valueAttr, textNode,
            needPostValueSet = false, nodeTag, curValues, i;
        // IE should \r for textNode and <br> for innerHTML, Others is not required to convert

        if (curVal === undefined) {
            return false;   // Or should be an error?
        }
        if (!element) {
            return false;   // Or should be an error?
        }
        if (curVal === null || curVal === false) {
            curVal = '';
        }

        nodeTag = element.tagName;

        if (clearField === true && curTarget == "") {
            switch (nodeTag) {
                case "INPUT":
                    switch (element.getAttribute("type")) {
                        case "text":
                            element.value = "";
                            break;
                        default:
                            break;
                    }
                case "SELECT":
                    break;
                default:
                    while (element.childNodes.length > 0) {
                        element.removeChild(element.childNodes[0]);
                    }
                    break;
            }
        }

        if (curTarget != null && curTarget.length > 0) { //target is specified
            if (curTarget.charAt(0) == '#') { // Appending
                curTarget = curTarget.substring(1);
                if (curTarget == 'innerHTML') {
                    if (INTERMediator.isIE && nodeTag == "TEXTAREA") {
                        curVal = curVal.replace(/\r\n/g, "\r").replace(/\n/g, "\r").replace(/\r/g, "<br>");
                    }
                    element.innerHTML += curVal;
                } else if (curTarget == 'textNode' || curTarget == 'script') {
                    textNode = document.createTextNode(curVal);
                    if (nodeTag == "TEXTAREA") {
                        curVal = curVal.replace(/\r\n/g, "\r").replace(/\n/g, "\r");
                    }
                    element.appendChild(textNode);
                } else if (curTarget.indexOf('style.') == 0) {
                    styleName = curTarget.substring(6, curTarget.length);
                    element.style[styleName] = curVal;
                } else {
                    currentValue = element.getAttribute(curTarget);
                    element.setAttribute(curTarget, currentValue + curVal);
                }
            }
            else if (curTarget.charAt(0) == '$') { // Replacing
                curTarget = curTarget.substring(1);
                if (curTarget == 'innerHTML') {
                    if (INTERMediator.isIE && nodeTag == "TEXTAREA") {
                        curVal = curVal.replace(/\r\n/g, "\r").replace(/\n/g, "\r").replace(/\r/g, "<br>");
                    }
                    element.innerHTML = element.innerHTML.replace("$", curVal);
                } else if (curTarget == 'textNode' || curTarget == 'script') {
                    if (nodeTag == "TEXTAREA") {
                        curVal = curVal.replace(/\r\n/g, "\r").replace(/\n/g, "\r");
                    }
                    element.innerHTML = element.innerHTML.replace("$", curVal);
                } else if (curTarget.indexOf('style.') == 0) {
                    styleName = curTarget.substring(6, curTarget.length);
                    element.style[styleName] = curVal;
                } else {
                    currentValue = element.getAttribute(curTarget);
                    element.setAttribute(curTarget, currentValue.replace("$", curVal));
                }
            } else { // Setting
                if (INTERMediatorLib.isWidgetElement(element)) {
                    element._im_setValue(curVal);
                } else if (curTarget == 'innerHTML') { // Setting
                    if (INTERMediator.isIE && nodeTag == "TEXTAREA") {
                        curVal = curVal.replace(/\r\n/g, "\r").replace(/\n/g, "\r").replace(/\r/g, "<br>");
                    }
                    element.innerHTML = curVal;
                } else if (curTarget == 'textNode') {
                    if (nodeTag == "TEXTAREA") {
                        curVal = curVal.replace(/\r\n/g, "\r").replace(/\n/g, "\r");
                    }
                    textNode = document.createTextNode(curVal);
                    element.appendChild(textNode);
                } else if (curTarget == 'script') {
                    textNode = document.createTextNode(curVal);
                    if (nodeTag == "SCRIPT") {
                        element.appendChild(textNode);
                    } else {
                        scriptNode = document.createElement("script");
                        scriptNode.type = "text/javascript";
                        scriptNode.appendChild(textNode);
                        element.appendChild(scriptNode);
                    }
                } else if (curTarget.indexOf('style.') == 0) {
                    styleName = curTarget.substring(6, curTarget.length);
                    element.style[styleName] = curVal;
                } else {
                    element.setAttribute(curTarget, curVal);
                }
            }
        } else { // if the 'target' is not specified.
            if (INTERMediatorLib.isWidgetElement(element)) {
                element._im_setValue(curVal);
            } else if (nodeTag == "INPUT") {
                typeAttr = element.getAttribute('type');
                if (typeAttr == 'checkbox' || typeAttr == 'radio') { // set the value
                    valueAttr = element.value;
                    curValues = curVal.toString().split("\n");
                    if (typeAttr == 'checkbox' && curValues.length > 1) {
                        for (i = 0; i < curValues.length; i++) {
                            if (valueAttr == curValues[i] && !INTERMediator.dontSelectRadioCheck) {
                                if (INTERMediator.isIE) {
                                    element.setAttribute('checked', 'checked');
                                } else {
                                    element.checked = true;
                                }
                            }
                        }
                    } else {
                        if (valueAttr == curVal && !INTERMediator.dontSelectRadioCheck) {
                            if (INTERMediator.isIE) {
                                element.setAttribute('checked', 'checked');
                            } else {
                                element.checked = true;
                            }
                        } else {
                            element.checked = false;
                        }
                    }
                } else { // this node must be text field
                    element.value = curVal;
                }
            } else if (nodeTag == "SELECT") {
                needPostValueSet = true;
                element.value = curVal;
            } else { // include option tag node
                if (INTERMediator.defaultTargetInnerHTML) {
                    if (INTERMediator.isIE && nodeTag == "TEXTAREA") {
                        curVal = curVal.replace(/\r\n/g, "\r").replace(/\n/g, "\r").replace(/\r/g, "<br/>");
                    }
                    element.innerHTML = curVal;
                } else {
                    if (nodeTag == "TEXTAREA") {
                        if (INTERMediator.isTrident && INTERMediator.ieVersion >= 11) {
                            // for IE11
                            curVal = curVal.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
                        } else {
                            curVal = curVal.replace(/\r\n/g, "\r").replace(/\n/g, "\r");
                        }
                    }
                    textNode = document.createTextNode(curVal);
                    element.appendChild(textNode);
                }
            }
        }
        return needPostValueSet;
    },

    getValueFromIMNode: function (element) {
        var nodeTag, typeAttr, newValue, dbspec, mergedValues, targetNodes, k, valueAttr;

        if (element) {
            nodeTag = element.tagName;
            typeAttr = element.getAttribute('type');
        } else {
            return "";
        }
        if (INTERMediatorLib.isWidgetElement(element)
            || (INTERMediatorLib.isWidgetElement(element.parentNode))) {
            newValue = element._im_getValue();
        } else if (nodeTag == "INPUT") {
            if (typeAttr == 'checkbox') {
                dbspec = INTERMediatorOnPage.getDBSpecification();
                if (dbspec["db-class"] != null && dbspec["db-class"] == "FileMaker_FX") {
                    mergedValues = [];
                    targetNodes = element.parentNode.getElementsByTagName('INPUT');
                    for (k = 0; k < targetNodes.length; k++) {
                        if (targetNodes[k].checked) {
                            mergedValues.push(targetNodes[k].getAttribute('value'));
                        }
                    }
                    newValue = mergedValues.join("\n");
                } else {
                    valueAttr = element.getAttribute('value');
                    if (element.checked) {
                        newValue = valueAttr;
                    } else {
                        newValue = '';
                    }
                }
            } else if (typeAttr == 'radio') {
                newValue = element.value;
            } else { //text, password
                newValue = element.value;
            }
        } else if (nodeTag == "SELECT") {
            newValue = element.value;
//            if (element.firstChild.value == "") {
//                // for compatibility with Firefox when the value of select tag is empty.
//                element.removeChild(element.firstChild);
//            }
        } else if (nodeTag == "TEXTAREA") {
            newValue = element.value;
        } else {
            newValue = element.innerHTML;
        }
        return newValue;
    },

    checkOptimisticLock: function (element, target) {
        var linkInfo, nodeInfo, idValue, contextInfo, keyingComp, keyingField, keyingValue, checkQueryParameter,
            currentVal, response, targetField, targetContext, initialvalue, newValue, isOthersModified,
            isCheckResult, portalKey, portalIndex, currentFieldVal;

        if (!element) {
            return false;
        }
        linkInfo = INTERMediatorLib.getLinkedElementInfo(element);
        nodeInfo = INTERMediatorLib.getNodeInfoArray(linkInfo[0]);
        if (nodeInfo.table == IMLibLocalContext.contextName) {
            return false;
        }
        idValue = element.getAttribute('id');
        contextInfo = IMLibContextPool.getContextInfoFromId(idValue, target);   // suppose to target = ""
        if (INTERMediator.ignoreOptimisticLocking) {
            return true;
        }
        targetContext = contextInfo['context'];
        targetField = contextInfo['field'];
        keyingComp = contextInfo['record'].split('=');
        keyingField = keyingComp[0];
        keyingComp.shift();
        keyingValue = keyingComp.join('=');
        checkQueryParameter = {
            name: contextInfo['context'].contextName,
            records: 1,
            paging: false,
            fields: [targetField],
            parentkeyvalue: null,
            conditions: [
                {field: keyingField, operator: '=', value: keyingValue}
            ],
            useoffset: false,
            primaryKeyOnly: true
        };
        try {
            currentVal = INTERMediator_DBAdapter.db_query(checkQueryParameter);
        } catch (ex) {
            if (ex == "_im_requath_request_") {
                if (INTERMediatorOnPage.requireAuthentication && !INTERMediatorOnPage.isComplementAuthData()) {
                    INTERMediatorOnPage.authChallenge = null;
                    INTERMediatorOnPage.authHashedPassword = null;
                    INTERMediatorOnPage.authenticating(
                        function () {
                            INTERMediator.db_query(checkQueryParameter);
                        }
                    );
                    return;
                }
            } else {
                INTERMediator.setErrorMessage(ex, "EXCEPTION-1");
            }
        }
        if (contextInfo.portal) {
            isCheckResult = false;
            portalKey = contextInfo.context.contextName + "::-recid";
            if (currentVal.recordset && currentVal.recordset[0]) {
                for (portalIndex in currentVal.recordset[0]) {
                    var portalRecord = currentVal.recordset[0][portalIndex];
                    if (portalRecord[portalKey]
                        && portalRecord[targetField] !== undefined
                        && portalRecord[portalKey] == contextInfo.portal) {
                        currentFieldVal = portalRecord[targetField];
                        isCheckResult = true;
                    }
                }
            }
            if (! isCheckResult) {
                alert(INTERMediatorLib.getInsertedString(
                    INTERMediatorOnPage.getMessages()[1003], [targetField]));
                return false;
            }
        } else {
            if (currentVal.recordset === null
                || currentVal.recordset[0] === null
                || currentVal.recordset[0][targetField] === undefined) {
                alert(INTERMediatorLib.getInsertedString(
                    INTERMediatorOnPage.getMessages()[1003], [targetField]));
                return false;
            }
            if (currentVal.totalCount > 1) {
                response = confirm(INTERMediatorOnPage.getMessages()[1024]);
                if (!response) {
                    return false;
                }
            }
            currentFieldVal = currentVal.recordset[0][targetField];
        }
        initialvalue = targetContext.getValue(contextInfo['record'], targetField, contextInfo.portal);

        switch (element.tagName) {
            case "INPUT":
                switch (element.getAttribute("type")) {
                    case "checkbox":
                        if (initialvalue == element.value) {
                            isOthersModified = false;
                        } else if (!parseInt(currentFieldVal)) {
                            isOthersModified = false;
                        } else {
                            isOthersModified = true;
                        }
                        break;
                    default:
                        isOthersModified = (initialvalue != currentFieldVal);
                        break;
                }
                break;
            default:
                isOthersModified = (initialvalue != currentFieldVal);
                break;
        }

//        console.error(isOthersModified, initialvalue, newValue, currentFieldVal);

        if (isOthersModified) {
            // The value of database and the field is different. Others must be changed this field.
            newValue = IMLibElement.getValueFromIMNode(element);
            if (!confirm(INTERMediatorLib.getInsertedString(
                INTERMediatorOnPage.getMessages()[1001], [initialvalue, newValue, currentFieldVal]))) {
                window.setTimeout(function () {
                    element.focus();
                }, 0);

                return false;
            }
            INTERMediatorOnPage.retrieveAuthInfo(); // This is required. Why?
        }
        return true;
    },

    deleteNodes: function(removeNodes) {
        var removeNode, removingNodes, i, j, k, removeNodeId, nodeId, calcObject, referes, values, key;

        for (key in removeNodes) {
            removeNode = document.getElementById(removeNodes[key]);
            removingNodes = INTERMediatorLib.getElementsByIMManaged(removeNode);
            if (removingNodes) {
                for (i = 0; i < removingNodes.length; i++) {
                    removeNodeId = removingNodes[i].id;
                    if (removeNodeId in IMLibCalc.calculateRequiredObject) {
                        delete IMLibCalc.calculateRequiredObject[removeNodeId];
                    }
                }
                for (i = 0; i < removingNodes.length; i++) {
                    removeNodeId = removingNodes[i].id;
                    for (nodeId in IMLibCalc.calculateRequiredObject) {
                        calcObject = IMLibCalc.calculateRequiredObject[nodeId];
                        referes = {};
                        values = {};
                        for (j in calcObject.referes) {
                            referes[j] = [], values[j] = [];
                            for (k = 0; k < calcObject.referes[j].length; k++) {
                                if (removeNodeId != calcObject.referes[j][k]) {
                                    referes[j].push(calcObject.referes[j][k]);
                                    values[j].push(calcObject.values[j][k]);
                                }
                            }
                        }
                        calcObject.referes = referes;
                        calcObject.values = values;
                    }
                }
            }
            try {
                removeNode.parentNode.removeChild(removeNode);
            } catch
                (ex) {
                // Avoid an error for Safari
            }
        }
    }
}
/*
 * INTER-Mediator Ver.4.6 Released 2014-12-30
 *
 *   by Masayuki Nii  msyk@msyk.net Copyright (c) 2010-2014 Masayuki Nii, All rights reserved.
 *
 *   This project started at the end of 2009.
 *   INTER-Mediator is supplied under MIT License.
 */

IMLibEventResponder = {
    isSetup: false,

    setup: function()   {
        var body;

        if (IMLibEventResponder.isSetup)    {
            return;
        }

        IMLibEventResponder.isSetup = true;
        IMLibChangeEventDispatch = new IMLibEventDispatch();
        IMLibKeyEventDispatch = new IMLibEventDispatch();
        IMLibMouseEventDispatch = new IMLibEventDispatch();
        body = document.getElementsByTagName('BODY')[0];
        INTERMediatorLib.addEvent(body, "change", function (e) {
            //console.log("Event Dispatcher: change");
            var event = e ? e : window.event;
            if (!event) {
                return;
            }
            var target = event.target;
            if (!target) {
                target = event.srcElement;
                if (!target) {
                    return;
                }
            }
            var idValue = target.id;
            if (!idValue) {
                return;
            }
            var executable = IMLibChangeEventDispatch.dispatchTable[idValue];
            if (!executable) {
                return;
            }
            executable(idValue);
        });
        INTERMediatorLib.addEvent(body, "keydown", function (e) {
            //console.log("Event Dispatcher: keydown");
            var event, charCode, target, idValue;
            event = e ? e : window.event;
            if (event.charCode) {
                charCode = event.charCode;
            } else {
                charCode = event.keyCode;
            }
            if (!event) {
                return;
            }
            target = event.target;
            if (!target) {
                target = event.srcElement;
                if (!target) {
                    return;
                }
            }
            idValue = target.id;
            if (!idValue) {
                return;
            }
            if (!IMLibKeyEventDispatch.dispatchTable[idValue]) {
                return;
            }
            var executable = IMLibKeyEventDispatch.dispatchTable[idValue][charCode];
            if (!executable) {
                return;
            }
            executable(event);
        });
        INTERMediatorLib.addEvent(body, "click", function (e) {
            //console.log("Event Dispatcher: click");
            var event, target, idValue, executable, targetDefs, i, nodeInfo, value;
            event = e ? e : window.event;
            if (!event) {
                return;
            }
            target = event.target;
            if (!target) {
                target = event.srcElement;
                if (!target) {
                    return;
                }
            }
            idValue = target.id;
            if (!idValue) {
                return;
            }
            executable = IMLibMouseEventDispatch.dispatchTable[idValue];
            if (executable) {
                executable(event);
                return;
            }
            targetDefs = INTERMediatorLib.getLinkedElementInfo(target);
            for (i = 0; i < targetDefs.length; i++) {
                executable = IMLibMouseEventDispatch.dispatchTableTarget[targetDefs[i]];
                if (executable) {
                    nodeInfo = INTERMediatorLib.getNodeInfoArray(targetDefs[i]);
                    if (nodeInfo.target) {
                        value = target.getAttribute(nodeInfo.target);
                    } else {
                        value = IMLibElement.getValueFromIMNode(target);
                    }
                    executable(value, target);
                    return;
                }
            }
        });


    }
};

var IMLibChangeEventDispatch;
var IMLibKeyEventDispatch;
var IMLibMouseEventDispatch;

function IMLibEventDispatch() {
    this.dispatchTable={};
    this.dispatchTableTarget= {};

    this.clearAll= function () {
        this.dispatchTable = {};
        this.dispatchTableTarget = {};
    };

    this.setExecute= function (idValue, exec) {
        if (idValue && exec) {
            this.dispatchTable[idValue] = exec;
        }
    };

    this.setTargetExecute= function (targetValue, exec) {
        if (targetValue && exec) {
            this.dispatchTableTarget[targetValue] = exec;
        }
    };

    this.setExecuteByCode= function (idValue, charCode, exec) {
        if (idValue && charCode) {
            if (!this.dispatchTable[idValue]) {
                this.dispatchTable[idValue] = {};
            }
            this.dispatchTable[idValue][charCode] = exec;
        }
    };
}



/*
 * INTER-Mediator Ver.4.6 Released 2014-12-30
 * 
 *   by Masayuki Nii  msyk@msyk.net Copyright (c) 2010-2014 Masayuki Nii, All rights reserved.
 * 
 *   This project started at the end of 2009.
 *   INTER-Mediator is supplied under MIT License.
 */

IMLibContextPool = {
    poolingContexts: null,

    clearAll: function () {
        this.poolingContexts = null;
    },

    registerContext: function (context) {
        if (this.poolingContexts == null) {
            this.poolingContexts = [context];
        } else {
            this.poolingContexts.push(context);
        }
    },

    excludingNode: null,

    synchronize: function (context, recKey, key, value, target, portal) {
        var i, j, viewName, refNode, targetNodes, result = false;
        viewName = context.viewName;
        if (this.poolingContexts == null) {
            return null;
        }
        if (portal) {
            for (i = 0; i < this.poolingContexts.length; i++) {
                if (this.poolingContexts[i].viewName === viewName
                    && this.poolingContexts[i].binding[recKey] !== undefined
                    && this.poolingContexts[i].binding[recKey][key] !== undefined
                    && this.poolingContexts[i].binding[recKey][key][portal] !== undefined
                    && this.poolingContexts[i].store[recKey] !== undefined
                    && this.poolingContexts[i].store[recKey][key] !== undefined
                    && this.poolingContexts[i].store[recKey][key][portal] !== undefined) {

                    this.poolingContexts[i].store[recKey][key][portal] = value;
                    targetNodes = this.poolingContexts[i].binding[recKey][key][portal];
                    for (j = 0; j < targetNodes.length; j++) {
                        refNode = document.getElementById(targetNodes[j].id);
                        if (refNode) {
                            IMLibElement.setValueToIMNode(refNode, targetNodes[j].target, value, true);
                        }
                    }
                }
            }
        } else {
            for (i = 0; i < this.poolingContexts.length; i++) {
                if (this.poolingContexts[i].viewName === viewName
                    && this.poolingContexts[i].binding[recKey] !== undefined
                    && this.poolingContexts[i].binding[recKey][key] !== undefined
                    && this.poolingContexts[i].store[recKey] !== undefined
                    && this.poolingContexts[i].store[recKey][key] !== undefined) {

                    this.poolingContexts[i].store[recKey][key] = value;
                    targetNodes = this.poolingContexts[i].binding[recKey][key];
                    for (j = 0; j < targetNodes.length; j++) {
                        refNode = document.getElementById(targetNodes[j].id);
                        if (refNode) {
                            IMLibElement.setValueToIMNode(refNode, targetNodes[j].target, value, true);
                        }
                    }
                }
            }
        }
        return result;
    },

    getContextInfoFromId: function (idValue, target) {
        var i, targetContext, element, linkInfo, nodeInfo, targetName, result = null;
        if (!idValue) {
            return result;
        }

        element = document.getElementById(idValue);
        linkInfo = INTERMediatorLib.getLinkedElementInfo(element);
        if (!linkInfo && INTERMediatorLib.isWidgetElement(element.parentNode)) {
            linkInfo = INTERMediatorLib.getLinkedElementInfo(element.parentNode);
        }
        nodeInfo = INTERMediatorLib.getNodeInfoArray(linkInfo[0]);

        targetName = target === "" ? "_im_no_target" : target;
        for (i = 0; i < this.poolingContexts.length; i++) {
            targetContext = this.poolingContexts[i];
            if (targetContext.contextInfo[idValue] &&
                targetContext.contextInfo[idValue][targetName] &&
                targetContext.contextInfo[idValue][targetName].context.contextName == nodeInfo.table) {
                result = targetContext.contextInfo[idValue][targetName];
            }
        }
        return result;
    },

    getKeyFieldValueFromId: function (idValue, target) {
        var contextInfo = this.getContextInfoFromId(idValue, target);
        if (!contextInfo) {
            return null;
        }
        var contextName = contextInfo.context.contextName;
        var contextDef = IMLibContextPool.getContextDef(contextName);
        if (!contextDef) {
            return null;
        }
        var keyField = contextDef.key ? contextDef.key : "id";
        return contextInfo.record.substr(keyField.length + 1);
    },

    getContextDef: function (contextName) {
        return INTERMediatorLib.getNamedObject(INTERMediatorOnPage.getDataSources(), 'name', contextName);
    },

    updateContext: function (idValue, target) {
        var contextInfo, value;
        contextInfo = IMLibContextPool.getContextInfoFromId(idValue, target);
        value = IMLibElement.getValueFromIMNode(document.getElementById(idValue));
        if (contextInfo) {
            contextInfo.context.setValue(
                contextInfo['record'], contextInfo.field, value, false, target, contextInfo.portal);
        }
    },

    contextFromEnclosureId: function (idValue) {
        var i, enclosure;
        if (!idValue) {
            return false;
        }
        for (i = 0; i < this.poolingContexts.length; i++) {
            enclosure = this.poolingContexts[i].enclosureNode;
            if (enclosure.getAttribute('id') == idValue) {
                return this.poolingContexts[i];
            }
        }
        return null;
    },

    contextFromName: function (cName) {
        var i;
        if (!cName) {
            return false;
        }
        for (i = 0; i < this.poolingContexts.length; i++) {
            if (this.poolingContexts[i].contextName == cName) {
                return this.poolingContexts[i];
            }
        }
        return null;
    },

    getContextFromName: function (cName) {
        var i, result = [];
        if (!cName) {
            return false;
        }
        for (i = 0; i < this.poolingContexts.length; i++) {
            if (this.poolingContexts[i].contextName == cName) {
                result.push(this.poolingContexts[i]);
            }
        }
        return result;
    },

    getContextsFromNameAndForeignValue: function (cName, fValue, parentKeyField) {
        var i, j, result = [], parentKeyField;
        if (!cName) {
            return false;
        }
        //parentKeyField = "id";
        for (i = 0; i < this.poolingContexts.length; i++) {
            if (this.poolingContexts[i].contextName == cName
                && this.poolingContexts[i].foreignValue[parentKeyField] == fValue) {
                result.push(this.poolingContexts[i]);
            }
        }
        return result;
    },

    dependingObjects: function (idValue) {
        var i, j, result = [];
        if (!idValue) {
            return false;
        }
        for (i = 0; i < this.poolingContexts.length; i++) {
            for (j = 0; j < this.poolingContexts[i].dependingObject.length; j++) {
                if (this.poolingContexts[i].dependingObject[j] == idValue) {
                    result.push(this.poolingContexts[i]);
                }
            }
        }
        return result.length == 0 ? false : result;
    },

    getChildContexts: function (parentContext) {
        var i, childContexts = [];
        for (i = 0; i < this.poolingContexts.length; i++) {
            if (this.poolingContexts[i].parentContext == parentContext) {
                childContexts.push(this.poolingContexts[i]);
            }
        }
        return childContexts;
    },

    childContexts: null,

    removeContextsFromPool: function (contexts) {
        var i, regIds = [], delIds = [];
        for (i = 0; i < this.poolingContexts.length; i++) {
            if (contexts.indexOf(this.poolingContexts[i]) > -1) {
                regIds.push(this.poolingContexts[i].registeredId);
                delIds.push(i);
            }
        }
        for (i = delIds.length - 1; i > -1; i--) {
            this.poolingContexts.splice(delIds[i], 1);
        }
        return regIds;
    },

    removeRecordFromPool: function (repeaterIdValue) {
        var i, j, targetContext, keying, field, nodeIds = [], targetContextIndex = -1, targetKeying,
            targetKeyingObj = null, idValue;
        for (i = 0; i < this.poolingContexts.length; i++) {
            for (keying in this.poolingContexts[i].binding) {
                for (field in this.poolingContexts[i].binding[keying]) {
                    if (field == '_im_repeater') {
                        for (j = 0; j < this.poolingContexts[i].binding[keying][field].length; j++) {
                            if (repeaterIdValue == this.poolingContexts[i].binding[keying][field][j].id) {
                                targetKeyingObj = this.poolingContexts[i].binding[keying];
                                targetKeying = keying;
                                targetContextIndex = i;
                            }
                        }
                    }
                }
            }
        }

        for (field in targetKeyingObj) {
            for (j = 0; j < targetKeyingObj[field].length; j++) {
                nodeIds.push(targetKeyingObj[field][j].id);
            }
        }
        if (targetContextIndex > -1) {
            for (idValue in this.poolingContexts[targetContextIndex].contextInfo) {
                if (nodeIds.indexOf(idValue) >= 0) {
                    delete this.poolingContexts[targetContextIndex].contextInfo[idValue];
                }
            }
            delete this.poolingContexts[targetContextIndex].binding[targetKeying];
            delete this.poolingContexts[targetContextIndex].store[targetKeying];
        }
        this.poolingContexts = this.poolingContexts.filter(function (context) {
            return nodeIds.indexOf(context.enclosureNode.id) < 0;
        });
    },

    updateOnAnotherClient: function (eventName, info) {
        var i, j, k, entityName = info.entity, contextDef, contextView, keyField, recKey;

        if (eventName == 'update') {
            for (i = 0; i < this.poolingContexts.length; i++) {
                contextDef = this.getContextDef(this.poolingContexts[i].contextName);
                contextView = contextDef.view ? contextDef.view : contextDef.name;
                if (contextView == entityName) {
                    keyField = contextDef.key;
                    recKey = keyField + "=" + info.pkvalue;
                    this.poolingContexts[i].setValue(recKey, info.field[0], info.value[0]);

                    var bindingInfo = this.poolingContexts[i].binding[recKey][info.field[0]];
                    for (j = 0; j < bindingInfo.length; j++) {
                        var updateRequiredContext = IMLibContextPool.dependingObjects(bindingInfo[j].id);
                        for (k = 0; k < updateRequiredContext.length; k++) {
                            updateRequiredContext[k].foreignValue = {};
                            updateRequiredContext[k].foreignValue[info.field[0]] = info.value[0];
                            if (updateRequiredContext[k]) {
                                INTERMediator.constructMain(updateRequiredContext[k]);
                                //var associatedNode = updateRequiredContext[k].enclosureNode;
                                //if (INTERMediatorLib.isPopupMenu(associatedNode)) {
                                //    var currentValue = contextInfo.context.getContextValue(associatedNode.id, "");
                                //    IMLibElement.setValueToIMNode(associatedNode, "", currentValue, false);
                                //}
                            }
                        }
                    }
                }
            }
            IMLibCalc.recalculation();
        } else if (eventName == 'create') {
            for (i = 0; i < this.poolingContexts.length; i++) {
                contextDef = this.getContextDef(this.poolingContexts[i].contextName);
                contextView = contextDef.view ? contextDef.view : contextDef.name;
                if (contextView == entityName) {
                    if (this.poolingContexts[i].isContaining(info.value[0])) {
                        INTERMediator.constructMain(this.poolingContexts[i], info.value);
                    }
                }
            }
            IMLibCalc.recalculation();
        }
        else if (eventName == 'delete') {
            for (i = 0; i < this.poolingContexts.length; i++) {
                contextDef = this.getContextDef(this.poolingContexts[i].contextName);
                contextView = contextDef.view ? contextDef.view : contextDef.name;
                if (contextView == entityName) {
                    this.poolingContexts[i].removeEntry(info.pkvalue);
                }
            }
            IMLibCalc.recalculation();
        }
    },

    getMasterContext: function () {
        var i, contextDef;
        if (!this.poolingContexts) {
            return null;
        }
        for (i = 0; i < this.poolingContexts.length; i++) {
            contextDef = this.poolingContexts[i].getContextDef();
            if (contextDef['navi-control'] && contextDef['navi-control'].match(/master/)) {
                return this.poolingContexts[i];
            }
        }
        return null;
    },

    getDetailContext: function () {
        var i, contextDef;
        if (!this.poolingContexts) {
            return null;
        }
        for (i = 0; i < this.poolingContexts.length; i++) {
            contextDef = this.poolingContexts[i].getContextDef();
            if (contextDef['navi-control'] && contextDef['navi-control'].match(/detail/)) {
                return this.poolingContexts[i];
            }
        }
        return null;
    }
}

IMLibContext = function (contextName) {
    this.contextName = contextName;
    this.tableName = null;
    this.viewName = null;
    this.store = {};
    this.binding = {};
    this.contextInfo = {};
    this.modified = {};
    this.recordOrder = [];
    this.pendingOrder = [];
    IMLibContextPool.registerContext(this);

    this.foreignValue = {};
    this.enclosureNode = null;
    this.repeaterNodes = null;
    this.dependingObject = [];
    this.original = null;
    this.nullAcceptable = true;
    this.parentContext = null;
    this.registeredId = null;
    this.sequencing = false;
    this.dependingParentObjectInfo = null;

    this.getInsertOrder = function (record) {
        var cName, sortKeys = [], contextDef, i, sortFields = [], sortDirections = [];
        for (cName in INTERMediator.additionalSortKey) {
            if (cName == this.contextName) {
                sortKeys.push(INTERMediator.additionalSortKey[cName]);
            }
        }
        contextDef = this.getContextDef();
        if (contextDef.sort) {
            sortKeys.push(contextDef.sort);
        }
        for (i = 0; i < sortKeys.length; i++) {
            if (sortFields.indexOf(sortKeys[i].field) < 0) {
                sortFields.push(sortKeys[i].field);
                sortDirections.push(sortKeys[i].direction);
            }
        }
    }

    this.clearAll = function () {
        this.store = {};
        this.binding = {};
    };

    this.setContextName = function (name) {
        this.contextName = name;
    };

    this.setTableName = function (name) {
        this.tableName = name;
    };

    this.setViewName = function (name) {
        this.viewName = name;
    };

    this.addDependingObject = function (idNumber) {
        this.dependingObject.push(idNumber);
    };

    this.addForeignValue = function (field, value) {
        this.foreignValue[field] = value;
    };

    this.setOriginal = function (repeaters) {
        var i;
        this.original = [];
        for (i = 0; i < repeaters.length; i++) {
            this.original.push(repeaters[i].cloneNode(true));
        }
    };

    this.setTable = function (context) {
        // console.error(context);
        var contextDef;
        if (!context || !INTERMediatorOnPage.getDataSources) {
            this.tableName = this.contextName;
            this.viewName = this.contextName;
            // This is not a valid case, it just prevent the error in the unit test.
            return;
        }
        contextDef = this.getContextDef();
        if (contextDef) {
            this.viewName = contextDef['view'] ? contextDef['view'] : contextDef['name'];
            this.tableName = contextDef['table'] ? contextDef['table'] : contextDef['name'];
        }
    };

    this.removeContext = function () {
        var regIds = [], childContexts = [];
        seekRemovingContext(this);
        regIds = IMLibContextPool.removeContextsFromPool(childContexts);
        while (this.enclosureNode.firstChild) {
            this.enclosureNode.removeChild(this.enclosureNode.firstChild);
        }
        INTERMediator_DBAdapter.unregister(regIds);

        function seekRemovingContext(context) {
            var i, myChildren;
            childContexts.push(context);
            regIds.push(context.registeredId);
            myChildren = IMLibContextPool.getChildContexts(context);
            for (i = 0; i < myChildren.length; i++) {
                seekRemovingContext(myChildren[i]);
            }
        }
    };

    this.setModified = function (recKey, key, value) {
        if (this.modified[recKey] === undefined) {
            this.modified[recKey] = {};
        }
        this.modified[recKey][key] = value;
    };

    this.getModified = function () {
        return this.modified;
    };

    this.clearModified = function () {
        this.modified = {};
    };

    this.getContextDef = function () {
        var contextDef;
        contextDef = INTERMediatorLib.getNamedObject(
            INTERMediatorOnPage.getDataSources(), "name", this.contextName);
        return contextDef;
    };

    /*
     The isDebug parameter is for debugging and testing. Usually you should not specify it.
     */
    this.checkOrder = function (oneRecord, isDebug) {
        var i, fields = [], directions = [], oneSortKey, condtextDef, lower, upper, index, targetRecord,
            contextValue, checkingValue, stop;
        if (isDebug !== true) {
            if (INTERMediator && INTERMediator.additionalSortKey[this.contextName]) {
                for (i = 0; i < INTERMediator.additionalSortKey[this.contextName].length; i++) {
                    oneSortKey = INTERMediator.additionalSortKey[this.contextName][i];
                    if (!oneSortKey.field in fields) {
                        fields.push(oneSortKey.field);
                        directions.push(oneSortKey.direction);
                    }
                }
            }
            condtextDef = this.getContextDef();
            if (condtextDef && condtextDef.sort) {
                for (i = 0; i < condtextDef.sort.length; i++) {
                    oneSortKey = condtextDef.sort[i];
                    if (!oneSortKey.field in fields) {
                        fields.push(oneSortKey.field);
                        directions.push(oneSortKey.direction);
                    }
                }
            }
        } else {
            fields = ['field1', 'field2'];
        }
        lower = 0;
        upper = this.recordOrder.length;
        for (i = 0; i < fields.length; i++) {
            if (oneRecord[fields[i]]) {
                index = parseInt((upper + lower) / 2);
                do {
                    targetRecord = this.store[this.recordOrder[index]];
                    contextValue = targetRecord[fields[i]];
                    checkingValue = oneRecord[fields[i]];
                    if (contextValue < checkingValue) {
                        lower = index;
                    } else if (contextValue > checkingValue) {
                        upper = index;
                    } else {
                        lower = upper = index;
                    }
                    index = parseInt((upper + lower) / 2);
                } while (upper - lower > 1);
                targetRecord = this.store[this.recordOrder[index]];
                contextValue = targetRecord[fields[i]];
                if (contextValue == checkingValue) {
                    lower = upper = index;
                    stop = false;
                    do {
                        targetRecord = this.store[this.recordOrder[lower - 1]];
                        if (targetRecord && targetRecord[fields[i]] && targetRecord[fields[i]] == checkingValue) {
                            lower--;
                        } else {
                            stop = true;
                        }
                    } while (!stop);
                    stop = false;
                    do {
                        targetRecord = this.store[this.recordOrder[upper + 1]];
                        if (targetRecord && targetRecord[fields[i]] && targetRecord[fields[i]] == checkingValue) {
                            upper++;
                        } else {
                            stop = true;
                        }
                    } while (!stop);
                    if (lower == upper) {
                        // index is the valid order number.
                        break;
                    }
                    upper++;
                } else if (contextValue < checkingValue) {
                    // index is the valid order number.
                    break;
                } else if (contextValue > checkingValue) {
                    index--;
                    break;
                }
            }
        }
        if (isDebug === true) {
            console.log("#lower=" + lower + ",upper=" + upper + ",index=" + index
            + ",contextValue=" + contextValue + ",checkingValue=" + checkingValue);
        }
        return index;
    };

    /*
     The isDebug parameter is for debugging and testing. Usually you should not specify it.
     */
    this.rearrangePendingOrder = function (isDebug) {
        var i, index, targetRecord;
        for (i = 0; i < this.pendingOrder.length; i++) {
            targetRecord = this.store[this.pendingOrder[i]];
            index = this.checkOrder(targetRecord, isDebug);
            if (index >= -1) {
                this.recordOrder.splice(index + 1, 0, this.pendingOrder[i]);
            } else {
                // something wrong...
            }
        }
        this.pendingOrder = [];
    };

    this.getRepeaterEndNode = function (index) {
        var nodeId, field, repeaters = [], repeater, node, i, sibling, enclosure, children;

        var recKey = this.recordOrder[index];
        for (field in this.binding[recKey]) {
            nodeId = this.binding[recKey][field].nodeId;
            repeater = INTERMediatorLib.getParentRepeater(document.getElementById(nodeId));
            if (!repeater in repeaters) {
                repeaters.push(repeater);
            }
        }
        if (repeaters.length < 1) {
            return null;
        }
        node = repeaters[0];
        enclosure = INTERMediatorLib.getParentEnclosure(node);
        children = enclosure.childNodes;
        for (i = 0; i < children.length; i++) {
            if (children[i] in repeaters) {
                node = repeaters[i];
                break;
            }
        }
        return node;
    };

    // setData____ methods are for storing data both the model and the database.
    //
    this.setDataAtLastRecord = function (key, value) {
        var lastKey, keyAndValue;
        var storekeys = Object.keys(this.store);
        if (storekeys.length > 0) {
            lastKey = storekeys[storekeys.length - 1];
            this.setValue(lastKey, key, value);
            keyAndValue = lastKey.split("=");
            INTERMediator_DBAdapter.db_update({
                name: this.contextName,
                conditions: [{field: keyAndValue[0], operator: '=', value: keyAndValue[1]}],
                dataset: [{field: key, value: value}]
            });
            IMLibCalc.recalculation();
            INTERMediator.flushMessage();
        }
    };

    this.setDataWithKey = function (pkValue, key, value) {
        var targetKey, contextDef, keyAndValue, storeElements;
        var storekeys = Object.keys(this.store);
        contextDef = this.getContextDef();
        if (!contextDef) {
            return;
        }
        targetKey = contextDef.key + "=" + pkValue;
        storeElements = this.store[targetKey];
        if (storeElements) {
            this.setValue(targetKey, key, value);
            INTERMediator_DBAdapter.db_update({
                name: this.contextName,
                conditions: [{field: contextDef.key, operator: '=', value: pkValue}],
                dataset: [{field: key, value: value}]
            });
            INTERMediator.flushMessage();
        }
    };

    this.setValue = function (recKey, key, value, nodeId, target, portal) {
        //console.error(this.contextName, this.tableName, recKey, key, value, nodeId);
        if (recKey != undefined && recKey != null) {
            if (this.store[recKey] === undefined) {
                this.store[recKey] = {};
            }
            if (portal && this.store[recKey][key] === undefined) {
                this.store[recKey][key] = {};
            }
            if (this.binding[recKey] === undefined) {
                this.binding[recKey] = {};
                if (this.sequencing) {
                    this.recordOrder.push(recKey);
                } else {
                    this.pendingOrder.push(recKey);
                }
            }
            if (this.binding[recKey][key] === undefined) {
                this.binding[recKey][key] = [];
            }
            if (portal && this.binding[recKey][key][portal] === undefined) {
                if (this.binding[recKey][key].length < 1) {
                    this.binding[recKey][key] = {};
                }
                this.binding[recKey][key][portal] = [];
            }
            if (key != undefined && key != null) {
                if (portal) {
                    this.store[recKey][key][portal] = value;
                } else {
                    this.store[recKey][key] = value;
                }
                if (nodeId) {
                    if (portal) {
                        this.binding[recKey][key][portal].push({id: nodeId, target: target});
                    } else {
                        this.binding[recKey][key].push({id: nodeId, target: target});
                    }
                    if (this.contextInfo[nodeId] === undefined) {
                        this.contextInfo[nodeId] = {};
                    }
                    this.contextInfo[nodeId][target == "" ? "_im_no_target" : target]
                        = {context: this, record: recKey, field: key};
                    if (portal) {
                        this.contextInfo[nodeId][target == "" ? "_im_no_target" : target].portal = portal;
                    }
                } else {
                    IMLibContextPool.synchronize(this, recKey, key, value, target, portal);
                }
            }
        }
    };

    this.getValue = function (recKey, key, portal) {
        var value;
        try {
            if (portal) {
                value = this.store[recKey][key][portal];
            } else {
                value = this.store[recKey][key];
            }
            return value === undefined ? null : value;
        } catch (ex) {
            return null;
        }
    };

    this.getContextInfo = function (nodeId, target) {
        try {
            var info = this.contextInfo[nodeId][target == "" ? "_im_no_target" : target];
            return info === undefined ? null : info;
        } catch (ex) {
            return null;
        }
    };

    this.getContextValue = function (nodeId, target) {
        try {
            var info = this.contextInfo[nodeId][target == "" ? "_im_no_target" : target];
            var value = info.context.getValue(info.record, info.field);
            return value === undefined ? null : value;
        } catch (ex) {
            return null;
        }
    };

    this.removeEntry = function (pkvalue) {
        var keyField, keying, bindingInfo, contextDef, targetNode, repeaterNodes, i, parentNode,
            removingNodeIds = [];
        contextDef = this.getContextDef()
        keyField = contextDef.key;
        keying = keyField + "=" + pkvalue;
        bindingInfo = this.binding[keying];
        if (bindingInfo) {
            repeaterNodes = bindingInfo['_im_repeater'];
            if (repeaterNodes) {
                for (i = 0; i < repeaterNodes.length; i++) {
                    removingNodeIds.push(repeaterNodes[i].id);
                }
            }
        }
        if (removingNodeIds.length > 0) {
            for (i = 0; i < removingNodeIds.length; i++) {
                IMLibContextPool.removeRecordFromPool(removingNodeIds[i]);
            }
            for (i = 0; i < removingNodeIds.length; i++) {
                targetNode = document.getElementById(removingNodeIds[i]);
                if (targetNode) {
                    parentNode = INTERMediatorLib.getParentRepeater(targetNode);
                    if (parentNode) {
                        parentNode.parentNode.removeChild(targetNode);
                    }
                }
            }
        }
    };

    this.isContaining = function (value) {
        var contextDef, contextName, checkResult = [], i, fieldName, result, opePosition, leftHand, rightHand,
            leftResult, rightResult;

        contextDef = this.getContextDef();
        contextName = contextDef.name;
        if (contextDef.query) {
            for (i in contextDef.query) {
                checkResult.push(checkCondition(contextDef.query[i], value));
            }
        }
        if (INTERMediator.additionalCondition[contextName]) {
            for (i = 0; i < INTERMediator.additionalCondition[contextName].length; i++) {
                checkResult.push(checkCondition(INTERMediator.additionalCondition[contextName][i], value));
            }
        }

        result = true;
        if (checkResult.length != 0) {
            opePosition = checkResult.indexOf("D");
            if (opePosition > -1) {
                leftHand = checkResult.slice(0, opePosition);
                rightHand = opePosition.slice(opePosition + 1);
                if (rightHand.length == 0) {
                    result = (leftHand.indexOf(false) < 0);
                } else {
                    leftResult = (leftHand.indexOf(false) < 0);
                    rightResult = (rightHand.indexOf(false) < 0);
                    result = leftResult || rightResult;
                }
            } else {
                opePosition = checkResult.indexOf("EX");
                if (opePosition > -1) {
                    leftHand = checkResult.slice(0, opePosition);
                    rightHand = opePosition.slice(opePosition + 1);
                    if (rightHand.length == 0) {
                        result = (leftHand.indexOf(true) > -1);
                    } else {
                        leftResult = (leftHand.indexOf(true) > -1);
                        rightResult = (rightHand.indexOf(true) > -1);
                        result = leftResult && rightResult;
                    }
                } else {
                    opePosition = checkResult.indexOf(false);
                    if (opePosition > -1) {
                        result = (checkResult.indexOf(false) < 0);
                    }
                }
            }

            if (result == false) {
                return false;
            }
        }

        if (this.foreignValue) {
            for (fieldName in this.foreignValue) {
                if (contextDef.relation) {
                    for (i in contextDef.relation) {
                        if (contextDef.relation[i]['join-field'] == fieldName) {
                            result &= (checkCondition({
                                field: contextDef.relation[i]['foreign-key'],
                                operator: "=",
                                value: this.foreignValue[fieldName]
                            }, value));
                        }
                    }
                }
            }
        }

        return result;

        function checkCondition(conditionDef, oneRecord) {
            var realValue;

            if (conditionDef.field == '__operation__') {
                return conditionDef.operator == 'ex' ? "EX" : "D";
            }

            realValue = oneRecord[conditionDef.field];
            if (!realValue) {
                return false;
            }
            switch (conditionDef.operator) {
                case "=":
                case "eq":
                    return realValue == conditionDef.value;
                    break;
                case ">":
                case "gt":
                    return realValue > conditionDef.value;
                    break;
                case "<":
                case "lt":
                    return realValue < conditionDef.value;
                    break;
                case ">=":
                case "gte":
                    return realValue >= conditionDef.value;
                    break;
                case "<=":
                case "lte":
                    return realValue <= conditionDef.value;
                    break;
                case "!=":
                case "neq":
                    return realValue != conditionDef.value;
                    break;
                default:
                    return false;
            }
        }
    };

    this.insertEntry = function (pkvalue, fields, values) {
        var i, field, value;
        for (i = 0; i < fields.length; i++) {
            field = fields[i];
            value = values[i];
            this.setValue(pkvalue, field, value);
        }
    };

    /*
     Initialize this object
     */
    this.setTable(this);
};


IMLibLocalContext = {
    contextName: "_",
    store: {},
    binding: {},

    clearAll: function () {
        this.store = {};
    },

    setValue: function (key, value, withoutArchive) {
        var i, hasUpdated, refIds, node;

        hasUpdated = false;
        if (key != undefined && key != null) {
            if (value === undefined || value === null) {
                delete this.store[key];
            } else {
                this.store[key] = value;
                hasUpdated = true;
                refIds = this.binding[key];
                if (refIds) {
                    for (i = 0; i < refIds.length; i++) {
                        node = document.getElementById(refIds[i]);
                        IMLibElement.setValueToIMNode(node, "", value, true);
                    }
                }
            }
        }
        if (hasUpdated && !(withoutArchive === true)) {
            this.archive();
        }
    },

    getValue: function (key) {
        var value = this.store[key];
        return value === undefined ? null : value;
    },

    archive: function () {
        var jsonString;
        INTERMediatorOnPage.removeCookie('_im_localcontext');
        if (INTERMediator.isIE && INTERMediator.ieVersion < 9) {
            this.store._im_additionalCondition = INTERMediator.additionalCondition;
            this.store._im_additionalSortKey = INTERMediator.additionalSortKey;
            this.store._im_startFrom = INTERMediator.startFrom;
            this.store._im_pagedSize = INTERMediator.pagedSize;
            /*
             IE8 issue: "" string is modified as "null" on JSON stringify.
             http://blogs.msdn.com/b/jscript/archive/2009/06/23/serializing-the-value-of-empty-dom-elements-using-native-json-in-ie8.aspx
             */
            jsonString = JSON.stringify(this.store, function (k, v) {
                return v === "" ? "" : v;
            });
        } else {
            jsonString = JSON.stringify(this.store);
        }
        if (INTERMediator.useSessionStorage === true
            && typeof sessionStorage !== 'undefined'
            && sessionStorage !== null) {
            sessionStorage.setItem("_im_localcontext" + document.URL, jsonString);
        } else {
            INTERMediatorOnPage.setCookieWorker('_im_localcontext', jsonString, false, 0);
        }
    },

    unarchive: function () {
        var localContext = "";
        if (INTERMediator.useSessionStorage === true
            && typeof sessionStorage !== 'undefined'
            && sessionStorage !== null) {
            localContext = sessionStorage.getItem("_im_localcontext" + document.URL);
        } else {
            localContext = INTERMediatorOnPage.getCookie('_im_localcontext');
        }
        if (localContext && localContext.length > 0) {
            this.store = JSON.parse(localContext);
            if (INTERMediator.isIE && INTERMediator.ieVersion < 9) {
                if (this.store._im_additionalCondition) {
                    INTERMediator.additionalCondition = this.store._im_additionalCondition;
                }
                if (this.store._im_additionalSortKey) {
                    INTERMediator.additionalSortKey = this.store._im_additionalSortKey;
                }
                if (this.store._im_startFrom) {
                    INTERMediator.startFrom = this.store._im_startFrom;
                }
                if (this.store._im_pagedSize) {
                    INTERMediator.pagedSize = this.store._im_pagedSize;
                }
            }
            this.updateAll();
        }
    },

    binding: function (node) {
        var linkInfos, nodeInfo, idValue, i, value, params;
        if (node.nodeType != 1) {
            return;
        }
        linkInfos = INTERMediatorLib.getLinkedElementInfo(node);
        for (i = 0; i < linkInfos.length; i++) {
            nodeInfo = INTERMediatorLib.getNodeInfoArray(linkInfos[i]);
            if (nodeInfo.table == this.contextName) {
                if (!node.id) {
                    node.id = nextIdValue();
                }
                idValue = node.id;
                if (!this.binding[nodeInfo.field]) {
                    this.binding[nodeInfo.field] = [];
                }
                this.binding[nodeInfo.field].push(idValue);

                params = nodeInfo.field.split(":");
                switch (params[0]) {
                    case "addorder":
                        IMLibMouseEventDispatch.setExecute(idValue, IMLibUI.eventAddOrderHandler);
                        break;
                    case "update":
                        IMLibMouseEventDispatch.setExecute(idValue, (function () {
                            var contextName = params[1];
                            return function () {
                                IMLibUI.eventUpdateHandler(contextName);
                            };
                        })());
                        break;
                    case "condition":
                        IMLibKeyEventDispatch.setExecuteByCode(idValue, 13, (function () {
                            var contextName = params[1];
                            return function () {
                                INTERMediator.startFrom = 0;
                                IMLibUI.eventUpdateHandler(contextName);
                            };
                        })());
                        break;
                    case "limitnumber":
                        IMLibChangeEventDispatch.setExecute(idValue, (function () {
                            var contextName = params[1];
                            return function () {
                                INTERMediator.pagedSize = document.getElementById(idValue).value;
                                IMLibUI.eventUpdateHandler(contextName);
                            };
                        })());
                        break;
                    default:
                        IMLibChangeEventDispatch.setExecute(idValue, IMLibUI.valueChange);
                        break;
                }

                value = this.store[nodeInfo.field];
                IMLibElement.setValueToIMNode(node, nodeInfo.target, value, true);
            }
        }

        function nextIdValue() {
            INTERMediator.linkedElmCounter++;
            return currentIdValue();
        }

        function currentIdValue() {
            return 'IM' + INTERMediator.currentEncNumber + '-' + INTERMediator.linkedElmCounter;
        }

    },

    update: function (idValue) {
        var node, nodeValue, linkInfos, nodeInfo, i;
        node = document.getElementById(idValue);
        nodeValue = IMLibElement.getValueFromIMNode(node);
        linkInfos = INTERMediatorLib.getLinkedElementInfo(node);
        for (i = 0; i < linkInfos.length; i++) {
            nodeInfo = INTERMediatorLib.getNodeInfoArray(linkInfos[i]);
            if (nodeInfo.table == this.contextName) {
                this.setValue(nodeInfo.field, nodeValue);
            }
        }
    },

    updateAll: function () {
        var index, key, nodeIds, idValue, targetNode;
        for (key in this.binding) {
            nodeIds = this.binding[key];
            for (index = 0; index < nodeIds.length; index++) {
                idValue = nodeIds[index];
                targetNode = document.getElementById(idValue);
                if (targetNode &&
                    ( targetNode.tagName == "INPUT" || targetNode.tagName == "TEXTAREA" || targetNode.tagName == "SELECT")) {
                    IMLibLocalContext.update(idValue);
                    break;
                }
            }
        }
    },

    bindingDescendant: function (rootNode) {
        var self = this;
        seek(rootNode);

        function seek(node) {
            var children, i;
            if (node.nodeType === 1) { // Work for an element
                try {
                    self.binding(node);
                    children = node.childNodes; // Check all child nodes.
                    if (children) {
                        for (i = 0; i < children.length; i++) {
                            seek(children[i]);
                        }
                    }
                } catch (ex) {
                    if (ex == "_im_requath_request_") {
                        throw ex;
                    } else {
                        INTERMediator.setErrorMessage(ex, "EXCEPTION-31");
                    }
                }
            }
        }
    }
};

/*
 * INTER-Mediator Ver.4.6 Released 2014-12-30
 * 
 *   by Masayuki Nii  msyk@msyk.net Copyright (c) 2010-2014 Masayuki Nii, All rights reserved.
 * 
 *   This project started at the end of 2009.
 *   INTER-Mediator is supplied under MIT License.
 */

//"use strict"

var INTERMediatorLib = {

    ignoreEnclosureRepeaterClassName: "_im_ignore_enc_rep",
    ignoreEnclosureRepeaterControlName: "ignore_enc_rep",
    rollingRepeaterClassName: "_im_repeater",
    rollingEnclosureClassName: "_im_enclosure",
    rollingRepeaterDataControlName: "repeater",
    rollingEnclosureDataControlName: "enclosure",
    cachedDigitSeparator: null,

    initialize: function () {
        var num, str, decimal, separator, digits;

//            INTERMediator.startFrom = 0;
//            INTERMediator.pagedSize = 0;
//        INTERMediator.additionalCondition = {};
//        INTERMediator.additionalSortKey = {};

        // Initialize the cachedDigitSeparator property.
        try {
            num = new Number(1000.1);
            str = num.toLocaleString();
            decimal = str.substr(-2, 1);
            str = str.substring(0, str.length - 2);
            separator = str.match(/[^0-9]/)[0];
            digits = str.length - str.indexOf(separator) - 1;
            INTERMediatorLib.cachedDigitSeparator = [decimal, separator, digits];
        } catch (ex) {
            INTERMediatorLib.cachedDigitSeparator = [".", ",", 3];
        }

        IMLibLocalContext.unarchive();

        return null;
    },

    setup: function () {
        if (window.addEventListener) {
            window.addEventListener("load", this.initialize, false);
        } else if (window.attachEvent) { // for IE
            window.attachEvent("onload", this.initialize);
        } else {
            window.onload = this.initialize;
        }

        return null;
    },

    digitSeparator: function () {
        return this.cachedDigitSeparator;
    },

    generatePasswordHash: function (password) {
        var numToHex, salt, saltHex, code, lowCode, highCode;
        numToHex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
        salt = "";
        saltHex = "";
        for (i = 0; i < 4; i++) {
            code = Math.floor(Math.random() * (128 - 32) + 32);
            lowCode = code & 0xF;
            highCode = (code >> 4) & 0xF;
            salt += String.fromCharCode(code);
            saltHex += numToHex[highCode] + numToHex[lowCode];
        }
        return encodeURIComponent(SHA1(password + salt) + saltHex);

    },
    getParentRepeater: function (node) {
        var currentNode = node;
        while (currentNode != null) {
            if (INTERMediatorLib.isRepeater(currentNode, true)) {
                return currentNode;
            }
            currentNode = currentNode.parentNode;
        }
        return null;
    },

    getParentEnclosure: function (node) {
        var currentNode = node;
        while (currentNode != null) {
            if (INTERMediatorLib.isEnclosure(currentNode, true)) {
                return currentNode;
            }
            currentNode = currentNode.parentNode;
        }
        return null;
    },

    isEnclosure: function (node, nodeOnly) {
        var tagName, className, children, k, controlAttr;

        if (!node || node.nodeType !== 1) {
            return false;
        }
        className = INTERMediatorLib.getClassAttributeFromNode(node);
        if (className && className.indexOf(INTERMediatorLib.ignoreEnclosureRepeaterClassName) >= 0) {
            return false;
        }
        controlAttr = node.getAttribute("data-im-control");
        if (controlAttr && controlAttr.indexOf(INTERMediatorLib.ignoreEnclosureRepeaterControlName) >= 0) {
            return false;
        }
        tagName = node.tagName;
        if ((tagName === 'TBODY')
            || (tagName === 'UL')
            || (tagName === 'OL')
            || (tagName === 'SELECT')
            || ((tagName === 'DIV' || tagName === 'SPAN' )
            && className
            && className.indexOf(INTERMediatorLib.rollingEnclosureClassName) >= 0)
            || ((tagName === 'DIV' || tagName === 'SPAN' )
            && controlAttr
            && controlAttr.indexOf(INTERMediatorLib.rollingEnclosureDataControlName) >= 0)) {
            if (nodeOnly) {
                return true;
            } else {
                children = node.childNodes;
                for (k = 0; k < children.length; k++) {
//                    if (INTERMediatorLib.isEnclosure(children[k], true)) {
//
//                    } else
                    if (INTERMediatorLib.isRepeater(children[k], true)) {
                        return true;
                    }
                }
            }
        }
        return false;
    },

    isRepeater: function (node, nodeOnly) {
        var tagName, className, children, k, controlAttr;

        if (!node || node.nodeType !== 1) {
            return false;
        }
        className = INTERMediatorLib.getClassAttributeFromNode(node);
        if (className && className.indexOf(INTERMediatorLib.ignoreEnclosureRepeaterClassName) >= 0) {
            return false;
        }
        controlAttr = node.getAttribute("data-im-control");
        if (controlAttr && controlAttr.indexOf(INTERMediatorLib.ignoreEnclosureRepeaterControlName) >= 0) {
            return false;
        }
        tagName = node.tagName;
        if ((tagName === 'TR')
            || (tagName === 'LI')
            || (tagName === 'OPTION')
            || ((tagName === 'DIV' || tagName === 'SPAN' )
            && className
            && className.indexOf(INTERMediatorLib.rollingRepeaterClassName) >= 0)
            || ((tagName === 'DIV' || tagName === 'SPAN' )
            && controlAttr
            && controlAttr.indexOf(INTERMediatorLib.rollingRepeaterDataControlName) >= 0)) {
            if (nodeOnly) {
                return true;
            } else {
                return searchLinkedElement(node);
            }
        }
        return false;

        function searchLinkedElement(node) {
            if (INTERMediatorLib.isLinkedElement(node)) {
                return true;
            }
            children = node.childNodes;
            for (k = 0; k < children.length; k++) {
                if (children[k].nodeType === 1) { // Work for an element
                    if (INTERMediatorLib.isLinkedElement(children[k])) {
                        return true;
                    } else if (searchLinkedElement(children[k])) {
                        return true;
                    }
                }
            }
            return false;
        }
    },


    /**
     * Cheking the argument is the Linked Element or not.
     */

    isLinkedElement: function (node) {
        var classInfo, matched, attr;

        if (node != null) {
            attr = node.getAttribute("data-im")
            if (attr) {
                return true;
            }
            if (INTERMediator.titleAsLinkInfo) {
                if (node.getAttribute('TITLE') != null && node.getAttribute('TITLE').length > 0) {
                    // IE: If the node doesn't have a title attribute, getAttribute
                    // doesn't return null.
                    // So it requrired check if it's empty string.
                    return true;
                }
            }
            if (INTERMediator.classAsLinkInfo) {
                classInfo = INTERMediatorLib.getClassAttributeFromNode(node);
                if (classInfo != null) {
                    matched = classInfo.match(/IM\[.*\]/);
                    if (matched) {
                        return true;
                    }
                }
            }
        }
        return false;
    },

    isWidgetElement: function (node) {
        var classInfo, matched, attr, parentNode;

        if (!node) {
            return false;
        }
        if (INTERMediatorLib.getLinkedElementInfo(node)) {
            attr = node.getAttribute("data-im-widget")
            if (attr) {
                return true;
            }
            classInfo = INTERMediatorLib.getClassAttributeFromNode(node);
            if (classInfo != null) {
                matched = classInfo.match(/IM_WIDGET\[.*\]/);
                if (matched) {
                    return true;
                }
            }
        } else {
            parentNode = node.parentNode;
            if (!parentNode && INTERMediatorLib.getLinkedElementInfo(parentNode)) {
                attr = parentNode.getAttribute("data-im-widget")
                if (attr) {
                    return true;
                }
                classInfo = INTERMediatorLib.getClassAttributeFromNode(parentNode);
                if (classInfo != null) {
                    matched = classInfo.match(/IM_WIDGET\[.*\]/);
                    if (matched) {
                        return true;
                    }
                }
            }
        }
        return false;
    },

    isNamedElement: function (node) {
        var nameInfo, matched;

        if (node != null) {
            nameInfo = node.getAttribute('data-im-group');
            if (nameInfo) {
                return true;
            }
            nameInfo = node.getAttribute('name');
            if (nameInfo) {
                matched = nameInfo.match(/IM\[.*\]/);
                if (matched) {
                    return true;
                }
            }
        }
        return false;
    },

    getEnclosureSimple: function (node) {
        if (INTERMediatorLib.isEnclosure(node, true)) {
            return node;
        }
        return INTERMediatorLib.getEnclosureSimple(node.parentNode);
    },

    getEnclosure: function (node) {
        var currentNode, detectedRepeater;

        currentNode = node;
        while (currentNode != null) {
            if (INTERMediatorLib.isRepeater(currentNode, true)) {
                detectedRepeater = currentNode;
            } else if (isRepeaterOfEnclosure(detectedRepeater, currentNode)) {
                detectedRepeater = null;
                return currentNode;
            }
            currentNode = currentNode.parentNode;
        }
        return null;

        /**
         * Check the pair of nodes in argument is valid for repater/enclosure.
         */

        function isRepeaterOfEnclosure(repeater, enclosure) {
            var repeaterTag, enclosureTag, enclosureClass, repeaterClass, enclosureDataAttr,
                repeaterDataAttr, repeaterType;
            if (!repeater || !enclosure) {
                return false;
            }
            repeaterTag = repeater.tagName;
            enclosureTag = enclosure.tagName;
            if ((repeaterTag === 'TR' && enclosureTag === 'TBODY')
                || (repeaterTag === 'OPTION' && enclosureTag === 'SELECT')
                || (repeaterTag === 'LI' && enclosureTag === 'OL')
                || (repeaterTag === 'LI' && enclosureTag === 'UL')) {
                return true;
            }
            if ((enclosureTag === 'DIV' || enclosureTag === 'SPAN' )) {
                enclosureClass = INTERMediatorLib.getClassAttributeFromNode(enclosure);
                enclosureDataAttr = enclosure.getAttribute("data-im-control");
                if ((enclosureClass && enclosureClass.indexOf('_im_enclosure') >= 0)
                    || (enclosureDataAttr && enclosureDataAttr == "enclosure")) {
                    repeaterClass = INTERMediatorLib.getClassAttributeFromNode(repeater);
                    repeaterDataAttr = repeater.getAttribute("data-im-control");
                    if ((repeaterTag === 'DIV' || repeaterTag === 'SPAN')
                        && ((repeaterClass && repeaterClass.indexOf('_im_repeater') >= 0)
                        || (repeaterDataAttr && repeaterDataAttr == "repeater"))) {
                        return true;
                    } else if (repeaterTag === 'INPUT') {
                        repeaterType = repeater.getAttribute('type');
                        if (repeaterType
                            && ((repeaterType.indexOf('radio') >= 0 || repeaterType.indexOf('check') >= 0))) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
    },


    /**
     * Get the table name / field name information from node as the array of
     * definitions.
     */

    getLinkedElementInfo: function (node) {
        var defs = [], eachDefs, reg, i, attr, matched;
        if (INTERMediatorLib.isLinkedElement(node)) {
            attr = node.getAttribute("data-im");
            if (attr !== null && attr.length > 0) {
                reg = new RegExp("[\\s" + INTERMediator.defDivider + "]+");
                eachDefs = attr.split(reg);
                for (i = 0; i < eachDefs.length; i++) {
                    if (eachDefs[i] && eachDefs[i].length > 0) {
                        defs.push(resolveAlias(eachDefs[i]));
                    }
                }
                return defs;
            }
            if (INTERMediator.titleAsLinkInfo && node.getAttribute('TITLE') != null) {
                eachDefs = node.getAttribute('TITLE').split(INTERMediator.defDivider);
                for (i = 0; i < eachDefs.length; i++) {
                    defs.push(resolveAlias(eachDefs[i]));
                }
                return defs;
            }
            if (INTERMediator.classAsLinkInfo) {
                attr = INTERMediatorLib.getClassAttributeFromNode(node);
                if (attr !== null && attr.length > 0) {
                    matched = attr.match(/IM\[([^\]]*)\]/);
                    eachDefs = matched[1].split(INTERMediator.defDivider);
                    for (i = 0; i < eachDefs.length; i++) {
                        defs.push(resolveAlias(eachDefs[i]));
                    }
                }
                return defs;
            }
        }
        return false;

        function resolveAlias(def) {
            var aliases = INTERMediatorOnPage.getOptionsAliases();
            if (aliases != null && aliases[def] != null) {
                return aliases[def];
            }
            return def;
        }
    },

    getWidgetInfo: function (node) {
        var defs = [], eachDefs, i, classAttr, matched, reg;
        if (INTERMediatorLib.isWidgetElement(node)) {
            classAttr = node.getAttribute("data-im-widget");
            if (classAttr && classAttr.length > 0) {
                reg = new RegExp("[\\s" + INTERMediator.defDivider + "]+");
                eachDefs = classAttr.split(reg);
                for (i = 0; i < eachDefs.length; i++) {
                    if (eachDefs[i] && eachDefs[i].length > 0) {
                        defs.push(eachDefs[i]);
                    }
                }
                return defs;
            }
            classAttr = INTERMediatorLib.getClassAttributeFromNode(node);
            if (classAttr && classAttr.length > 0) {
                matched = classAttr.match(/IM_WIDGET\[([^\]]*)\]/);
                eachDefs = matched[1].split(INTERMediator.defDivider);
                for (i = 0; i < eachDefs.length; i++) {
                    defs.push(eachDefs[i]);
                }
                return defs;
            }
        }
        return false;
    },

    getNamedInfo: function (node) {
        var defs = [], eachDefs, i, nameAttr, matched, reg;
        if (INTERMediatorLib.isNamedElement(node)) {
            nameAttr = node.getAttribute('data-im-group');
            if (nameAttr && nameAttr.length > 0) {
                reg = new RegExp("[\\s" + INTERMediator.defDivider + "]+");
                eachDefs = nameAttr.split(reg);
                for (i = 0; i < eachDefs.length; i++) {
                    if (eachDefs[i] && eachDefs[i].length > 0) {
                        defs.push(eachDefs[i]);
                    }
                }
                return defs;
            }
            nameAttr = node.getAttribute('name');
            if (nameAttr && nameAttr.length > 0) {
                matched = nameAttr.match(/IM\[([^\]]*)\]/);
                eachDefs = matched[1].split(INTERMediator.defDivider);
                for (i = 0; i < eachDefs.length; i++) {
                    defs.push(eachDefs[i]);
                }
                return defs;
            }
        }
        return false;
    },

    /**
     * Get the repeater tag from the enclosure tag.
     */

    repeaterTagFromEncTag: function (tag) {
        if (tag == 'TBODY') return 'TR';
        else if (tag == 'SELECT') return 'OPTION';
        else if (tag == 'UL') return 'LI';
        else if (tag == 'OL') return 'LI';
        else if (tag == 'DIV') return 'DIV';
        else if (tag == 'SPAN') return 'SPAN';
        return null;
    },

    getNodeInfoArray: function (nodeInfo) {
        var comps, tableName, fieldName, targetName;

        if (!nodeInfo || !nodeInfo.split) {
            return {
                'table': null,
                'field': null,
                'target': null,
                'tableindex': null
            };
        }
        comps = nodeInfo.split(INTERMediator.separator);
        tableName = '', fieldName = '', targetName = '';
        if (comps.length == 3) {
            tableName = comps[0];
            fieldName = comps[1];
            targetName = comps[2];
        } else if (comps.length == 2) {
            tableName = comps[0];
            fieldName = comps[1];
        } else {
            fieldName = nodeInfo;
        }
        return {
            'table': tableName,
            'field': fieldName,
            'target': targetName,
            'tableindex': "_im_index_" + tableName
        };
    },

    getCalcNodeInfoArray: function (nodeInfo) {
        var comps, tableName, fieldName, targetName;

        if (!nodeInfo) {
            return null;
        }
        comps = nodeInfo.split(INTERMediator.separator);
        tableName = '', fieldName = '', targetName = '';
        if (comps.length == 3) {
            tableName = comps[0];
            fieldName = comps[1];
            targetName = comps[2];
        } else if (comps.length == 2) {
            fieldName = comps[0];
            targetName = comps[1];
        } else {
            fieldName = nodeInfo;
        }
        return {
            'table': tableName,
            'field': fieldName,
            'target': targetName,
            'tableindex': "_im_index_" + tableName
        };
    },

    /* As for IE7, DOM element can't have any prototype. */

    getClassAttributeFromNode: function (node) {
        var str = '';
        if (node === null) return '';
        if (INTERMediator.isIE && INTERMediator.ieVersion < 8) {
            str = node.getAttribute('className');
        } else {
            str = node.getAttribute('class');
        }
        return str;
    },

    setClassAttributeToNode: function (node, className) {
        if (node === null) return;
        if (INTERMediator.isIE && INTERMediator.ieVersion < 8) {
            node.setAttribute('className', className);
        } else {
            node.setAttribute('class', className);
        }
    },

    eventInfos: [],

    addEvent: function (node, evt, func) {
        if (node.addEventListener) {
            node.addEventListener(evt, func, false);
            this.eventInfos.push({"node": node, "event": evt, "function": func});
            return this.eventInfos.length - 1;
        } else if (node.attachEvent) {
            node.attachEvent('on' + evt, func);
            this.eventInfos.push({"node": node, "event": evt, "function": func});
            return this.eventInfos.length - 1;
        }
        return -1;
    },

    removeEvent: function (serialId) {
        if (eventInfos[serialId].node.removeEventListener) {
            eventInfos[serialId].node.removeEventListener(eventInfos[serialId].evt, eventInfos[serialId].func, false);
        } else if (eventInfos[serialId].node.detachEvent) {
            eventInfos[serialId].node.detachEvent('on' + eventInfos[serialId].evt, eventInfos[serialId].func);
        }
    },

    toNumber: function (str) {
        var s = '', i, c;
        str = (new String(str)).toString();
        for (i = 0; i < str.length; i++) {
            c = str.charAt(i);
            if ((c >= '0' && c <= '9') || c == '.' || c == '-' || c == this.cachedDigitSeparator[0]) {
                s += c;
            }
        }
        return parseFloat(s);
    },

    RoundHalfToEven: function (value, digit) {
        return value;
    },

    Round: function (value, digit) {
        var powers = Math.pow(10, digit);
        return Math.round(value * powers) / powers;
    },

    /*
     digit should be a positive value. negative value doesn't support so far.
     */
    numberFormat: function (str, digit) {
        var s, n, sign, power, underDot, underNumStr, pstr, roundedNum, underDecimalNum, integerNum;

        n = this.toNumber(str);
        sign = '';
        if (n < 0) {
            sign = '-';
            n = -n;
        }
        underDot = (digit === undefined) ? 0 : this.toNumber(digit);
        power = Math.pow(10, underDot);
        roundedNum = Math.round(n * power);
        underDecimalNum = (underDot > 0) ? roundedNum % power : 0;
        integerNum = (roundedNum - underDecimalNum) / power;
        underNumStr = (underDot > 0) ? new String(underDecimalNum) : '';
        while (underNumStr.length < underDot) {
            underNumStr = "0" + underNumStr;
        }
        n = integerNum;
        s = [];
        for (n = Math.floor(n); n > 0; n = Math.floor(n / 1000)) {
            if (n >= 1000) {
                pstr = '000' + (n % 1000).toString();
                s.push(pstr.substr(pstr.length - 3));
            } else {
                s.push(n);
            }
        }
        return sign + s.reverse().join(this.cachedDigitSeparator[1])
        + (underNumStr == '' ? '' : this.cachedDigitSeparator[0] + underNumStr);
    },

    objectToString: function (obj) {
        var str, i, key;

        if (obj === null) {
            return "null";
        }
        if (typeof obj == 'object') {
            str = '';
            if (obj.constractor === Array) {
                for (i = 0; i < obj.length; i++) {
                    str += INTERMediatorLib.objectToString(obj[i]) + ", ";
                }
                return "[" + str + "]";
            } else {
                for (key in obj) {
                    str += "'" + key + "':" + INTERMediatorLib.objectToString(obj[key]) + ", ";
                }
                return "{" + str + "}"
            }
        } else {
            return "'" + obj + "'";
        }
    },

    getTargetTableForRetrieve: function (element) {
        if (element['view'] != null) {
            return element['view'];
        }
        return element['name'];
    },

    getTargetTableForUpdate: function (element) {
        if (element['table'] != null) {
            return element['table'];
        }
        return element['name'];
    },

    getInsertedString: function (tmpStr, dataArray) {
        var resultStr, counter;

        resultStr = tmpStr;
        if (dataArray != null) {
            for (counter = 1; counter <= dataArray.length; counter++) {
                resultStr = resultStr.replace("@" + counter + "@", dataArray[counter - 1]);
            }
        }
        return resultStr;
    },

    getInsertedStringFromErrorNumber: function (errNum, dataArray) {
        var resultStr, counter;

        resultStr = INTERMediatorOnPage.getMessages()[errNum];
        if (dataArray != null) {
            for (counter = 1; counter <= dataArray.length; counter++) {
                resultStr = resultStr.replace("@" + counter + "@", dataArray[counter - 1]);
            }
        }
        return resultStr;
    },

    getNamedObject: function (obj, key, named) {
        var index;
        for (index in obj) {
            if (obj[index][key] == named) {
                return obj[index];
            }
        }
        return null;
    },

    getNamedObjectInObjectArray: function (ar, key, named) {
        var i;
        for (i = 0; i < ar.length; i++) {
            if (ar[i][key] == named) {
                return ar[i];
            }
        }
        return null;
    },

    getNamedValueInObject: function (ar, key, named, retrieveKey) {
        var result = [], index;
        for (index in ar) {
            if (ar[index][key] == named) {
                result.push(ar[index][retrieveKey]);
            }
        }
        if (result.length === 0) {
            return null;
        } else if (result.length === 1) {
            return result[0];
        } else {
            return result;
        }
    },

    is_array: function (target) {
        return target
        && typeof target === 'object'
        && typeof target.length === 'number'
        && typeof target.splice === 'function'
        && !(target.propertyIsEnumerable('length'));
    },

    getNamedValuesInObject: function (ar, key1, named1, key2, named2, retrieveKey) {
        var result = [], index;
        for (index in ar) {
            if (ar[index][key1] == named1 && ar[index][key2] == named2) {
                result.push(ar[index][retrieveKey]);
            }
        }
        if (result.length === 0) {
            return null;
        } else if (result.length === 1) {
            return result[0];
        } else {
            return result;
        }
    },

    getRecordsetFromFieldValueObject: function (obj) {
        var recordset = {}, index;
        for (index in obj) {
            recordset[obj[index]['field']] = obj[index]['value'];
        }
        return recordset;
    },

    getNodePath: function (node) {
        var path = '';
        if (node.tagName === null) {
            return '';
        } else {
            return INTERMediatorLib.getNodePath(node.parentNode) + "/" + node.tagName;
        }
    },

    isPopupMenu: function (element) {
        if (!element || !element.tagName) {
            return false;
        }
        if (element.tagName == "SELECT") {
            return true;
        }
        return false;
    },

    /*
     If the cNode parameter is like '_im_post', this function will search data-im-control="post" elements.
     */
    getElementsByClassNameOrDataAttr: function (node, cName) {
        var nodes = [];
        var attrValue = (cName.length > 5) ? cName.substr(4) : null;
        var reg = new RegExp(cName);
        checkNode(node);
        return nodes;

        function checkNode(target) {
            var className, attr;
            if (target.nodeType != 1) {
                return;
            }
            className = INTERMediatorLib.getClassAttributeFromNode(target);
            attr = target.getAttribute("data-im-control");
            if ((className && className.match(reg)) || (attr && attrValue && attr == attrValue)) {
                nodes.push(target);
            }
            for (var i = 0; i < target.children.length; i++) {
                checkNode(target.children[i]);
            }
        }
    },

    getElementsByClassName: function (node, cName) {
        var nodes = [];
        var reg = new RegExp(cName);
        checkNode(node);
        return nodes;

        function checkNode(target) {
            var className, i;
            if (target.nodeType != 1) {
                return;
            }
            className = INTERMediatorLib.getClassAttributeFromNode(target);
            if (className && className.match(reg)) {
                nodes.push(target);
            }
            for (var i = 0; i < target.children.length; i++) {
                checkNode(target.children[i]);
            }
        }
    },

    getElementsByIMManaged: function (node) {
        var nodes = [];
        var reg = new RegExp(/^IM/);
        checkNode(node);
        return nodes;

        function checkNode(target) {
            var nodeId, i;
            if (target.nodeType != 1) {
                return;
            }
            nodeId = target.getAttribute("id");
            if (nodeId && nodeId.match(reg)) {
                nodes.push(target);
            }
            for (var i = 0; i < target.children.length; i++) {
                checkNode(target.children[i]);
            }
        }
    },

    seekLinkedAndWidgetNodes: function (nodes, ignoreEnclosureCheck) {
        var linkedNodesCollection = []; // Collecting linked elements to this array.;
        var widgetNodesCollection = [];
        var i, doEncCheck = ignoreEnclosureCheck;

        if (ignoreEnclosureCheck === undefined || ignoreEnclosureCheck === null) {
            doEncCheck = false;
        }

        for (i = 0; i < nodes.length; i++) {
            seekLinkedElement(nodes[i]);
        }
        return {linkedNode: linkedNodesCollection, widgetNode: widgetNodesCollection};

        function seekLinkedElement(node) {
            var nType, currentEnclosure, children, detectedEnclosure, i;
            nType = node.nodeType;
            if (nType === 1) {
                if (INTERMediatorLib.isLinkedElement(node)) {
                    currentEnclosure = doEncCheck ? INTERMediatorLib.getEnclosure(node) : null;
                    if (currentEnclosure === null) {
                        linkedNodesCollection.push(node);
                    } else {
                        return currentEnclosure;
                    }
                }
                if (INTERMediatorLib.isWidgetElement(node)) {
                    currentEnclosure = doEncCheck ? INTERMediatorLib.getEnclosure(node) : null;
                    if (currentEnclosure === null) {
                        widgetNodesCollection.push(node);
                    } else {
                        return currentEnclosure;
                    }
                }
                children = node.childNodes;
                for (i = 0; i < children.length; i++) {
                    detectedEnclosure = seekLinkedElement(children[i]);
                }
            }
            return null;
        }
    },

    createErrorMessageNode: function (tag, message) {
        var messageNode;
        messageNode = document.createElement(tag);
        INTERMediatorLib.setClassAttributeToNode(messageNode, '_im_alertmessage');
        messageNode.appendChild(document.createTextNode(message));
        return messageNode;
    },

    clearErrorMessage: function (node) {
        var errorMsgs, j;
        errorMsgs = INTERMediatorLib.getElementsByClassName(node.parentNode, '_im_alertmessage');
        for (j = 0; j < errorMsgs.length; j++) {
            errorMsgs[j].parentNode.removeChild(errorMsgs[j]);
        }
    }
};

INTERMediatorLib.initialize();


/*

 IMLibNodeGraph object can handle the directed acyclic graph.
 The nodes property stores every node, i.e. the id attribute of each node.
 The edges property stores ever edge represented by the objet {from: node1, to: node2}.
 If the node1 or node2 aren't stored in the nodes array, they are going to add as nodes too.

 The following is the example to store the directed acyclic graph.

 a -> b -> c -> d
 |    -> f
 ------>
 -> e
 i -> j
 x

 IMLibNodeGraph.clear();
 IMLibNodeGraph.addEdge("a","b");
 IMLibNodeGraph.addEdge("b","c");
 IMLibNodeGraph.addEdge("c","d");
 IMLibNodeGraph.addEdge("a","e");
 IMLibNodeGraph.addEdge("b","f");
 IMLibNodeGraph.addEdge("a","f");
 IMLibNodeGraph.addEdge("i","j");
 IMLibNodeGraph.addNode("x");

 The first calling of the getLeafNodesWithRemoving method returns "d", "f", "e", "j", "x".
 The second calling does "c", "i". The third one does "b", the forth one does "a".
 You can get the nodes from leaves to root as above.

 If the getLeafNodesWithRemoving method returns [] (no elements array), and the nodes property has any elements,
 it shows the graph has circular reference.

 */
var IMLibNodeGraph = {
    nodes: [],
    edges: [],
    clear: function () {
        this.nodes = [];
        this.edges = [];
    },
    addNode: function (node) {
        if (this.nodes.indexOf(node) < 0) {
            this.nodes.push(node);
        }
    },
    addEdge: function (fromNode, toNode) {
        if (this.nodes.indexOf(fromNode) < 0) {
            this.addNode(fromNode);
        }
        if (this.nodes.indexOf(toNode) < 0) {
            this.addNode(toNode);
        }
        this.edges.push({from: fromNode, to: toNode});
    },
    getAllNodesInEdge: function () {
        var i, nodes = [];
        for (i = 0; i < this.edges.length; i++) {
            if (nodes.indexOf(this.edges[i].from) < 0) {
                nodes.push(this.edges[i].from);
            }
            if (nodes.indexOf(this.edges[i].to) < 0) {
                nodes.push(this.edges[i].to);
            }
        }
        return nodes;
    },
    getLeafNodes: function () {
        var i, srcs = [], dests = [], srcAndDests = this.getAllNodesInEdge();
        for (i = 0; i < this.edges.length; i++) {
            srcs.push(this.edges[i].from);
        }
        for (i = 0; i < this.edges.length; i++) {
            if (srcs.indexOf(this.edges[i].to) < 0 && dests.indexOf(this.edges[i].to) < 0) {
                dests.push(this.edges[i].to);
            }
        }
        for (i = 0; i < this.nodes.length; i++) {
            if (srcAndDests.indexOf(this.nodes[i]) < 0) {
                dests.push(this.nodes[i]);
            }
        }
        return dests;
    },
    getLeafNodesWithRemoving: function () {
        var i, newEdges = [], dests = this.getLeafNodes();
        for (i = 0; i < this.edges.length; i++) {
            if (dests.indexOf(this.edges[i].to) < 0) {
                newEdges.push(this.edges[i]);
            }
        }
        this.edges = newEdges;
        for (i = 0; i < dests.length; i++) {
            this.nodes.splice(this.nodes.indexOf(dests[i]), 1);
        }
        return dests;
    },
    applyToAllNodes: function (f) {
        var i;
        for (i = 0; i < this.nodes.length; i++) {
            f(this.nodes[i]);
        }

    }
};
/*
 * INTER-Mediator Ver.4.6 Released 2014-12-30
 *
 *   by Masayuki Nii  msyk@msyk.net Copyright (c) 2010-2014 Masayuki Nii, All rights reserved.
 *
 *   This project started at the end of 2009.
 *   INTER-Mediator is supplied under MIT License.
 */

var IMLibCalc = {
    calculateRequiredObject: null,
    /*
     key => {    // Key is the id attribute of the node which is defined as "calcuration"
     "field":
     "expression": exp.replace(/ /g, ""),   // expression
     "nodeInfo": nInfo,     // node if object i.e. {field:.., table:.., target:..., tableidnex:....}
     "values": {}   // key=target name in expression, value=real value.
     // if value=undefined, it shows the value is calculation field
     "refers": {}
     }
     */

    updateCalculationInfo: function (currentContext, nodeId, nInfo, currentRecord) {
        var calcDef, exp, field, elements, i, index, objectKey, calcFieldInfo, itemIndex, values, referes,
            calcDefField, atPos, fieldLength;

        calcDef = currentContext['calculation'];
        field = null;
        exp = null;
        for (index in calcDef) {
            atPos = calcDef[index]["field"].indexOf("@");
            fieldLength = calcDef[index]["field"].length;
            calcDefField = calcDef[index]["field"].substring(0, atPos >= 0 ? atPos : fieldLength);
            if (calcDefField == nInfo["field"]) {
                try {
                    exp = calcDef[index]["expression"];
                    field = calcDef[index]["field"];
                    elements = Parser.parse(exp).variables();
                    calcFieldInfo = INTERMediatorLib.getCalcNodeInfoArray(field);
                    objectKey = nodeId
                    + (calcFieldInfo.target.length > 0 ? (INTERMediator.separator + calcFieldInfo.target) : "");
                } catch (ex) {
                    INTERMediator.setErrorMessage(ex,
                        INTERMediatorLib.getInsertedString(
                            INTERMediatorOnPage.getMessages()[1036], [field, exp]));
                }
                if (elements) {
                    values = {};
                    referes = {};
                    for (i = 0; i < elements.length; i++) {
                        itemIndex = elements[i];
                        if (itemIndex) {
                            values[itemIndex] = [currentRecord[itemIndex]];
                            referes[itemIndex] = [undefined];
                        }
                    }
                    IMLibCalc.calculateRequiredObject[objectKey] = {
                        "field": field,
                        "expression": exp,
                        "nodeInfo": nInfo,
                        "values": values,
                        "referes": referes
                    };
                }
            }
        }
//                console.error(IMLibCalc.calculateRequiredObject);
    },


    updateCalculationFields: function () {
        var nodeId, exp, nInfo, valuesArray, leafNodes, calcObject, ix, refersArray, calcFieldInfo;
        var targetNode, targetExp, field, valueSeries, targetElement, targetIds, i, counter, hasReferes;

        IMLibCalc.setUndefinedToAllValues();
        IMLibNodeGraph.clear();
        for (nodeId in IMLibCalc.calculateRequiredObject) {
            calcObject = IMLibCalc.calculateRequiredObject[nodeId];
            if (calcObject) {
                calcFieldInfo = INTERMediatorLib.getCalcNodeInfoArray(nodeId);
                targetNode = document.getElementById(calcFieldInfo.field);
                hasReferes = false;
                for (field in calcObject.referes) {
                    for (ix = 0; ix < calcObject.referes[field].length; ix++) {
                        IMLibNodeGraph.addEdge(nodeId, calcObject.referes[field][ix]);
                        hasReferes = false;
                    }
                }
                if (!hasReferes) {
                    IMLibNodeGraph.addEdge(nodeId);
                }
            }
        }

        do {
            leafNodes = IMLibNodeGraph.getLeafNodesWithRemoving();
            for (i = 0; i < leafNodes.length; i++) {
                calcObject = IMLibCalc.calculateRequiredObject[leafNodes[i]];
                calcFieldInfo = INTERMediatorLib.getCalcNodeInfoArray(leafNodes[i]);
                if (calcObject) {
                    targetNode = document.getElementById(calcFieldInfo.field);
                    exp = calcObject.expression;
                    nInfo = calcObject.nodeInfo;
                    valuesArray = calcObject.values;
                    refersArray = calcObject.referes;
                    for (field in valuesArray) {
                        valueSeries = [];
                        for (ix = 0; ix < valuesArray[field].length; ix++) {
                            if (valuesArray[field][ix] == undefined) {
                                targetElement = document.getElementById(refersArray[field][ix]);
                                valueSeries.push(IMLibElement.getValueFromIMNode(targetElement));
                            } else {
                                valueSeries.push(valuesArray[field][ix]);
                            }
                        }
                        calcObject.values[field] = valueSeries;
                    }
                    IMLibElement.setValueToIMNode(
                        targetNode,
                        calcFieldInfo.target.length > 0 ? calcFieldInfo.target : calcObject.nodeInfo.target,
                        Parser.evaluate(exp, valuesArray),
                        true);
                } else {

                }
            }
        } while (leafNodes.length > 0);
        if (IMLibNodeGraph.nodes.length > 0) {
            INTERMediator.setErrorMessage(new Exception(),
                INTERMediatorLib.getInsertedString(
                    INTERMediatorOnPage.getMessages()[1037], []));
        }
    },
    /*
     On updating, the updatedNodeId should be set to the updating node id.
     On deleting, parameter doesn't required.
     */
    recalculation: function (updatedNodeId) {
        var nodeId, newValueAdded, leafNodes, calcObject, ix, calcFieldInfo, updatedValue, isRecalcAll = false;
        var targetNode, newValue, field, i, updatedNodeIds, updateNodeValues, cachedIndex, exp, nInfo, valuesArray;
        var refersArray, valueSeries, targetElement;

        if (updatedNodeId === undefined) {
            isRecalcAll = true;
            updatedNodeIds = [];
            updateNodeValues = [];
        } else {
            newValue = IMLibElement.getValueFromIMNode(document.getElementById(updatedNodeId));
            updatedNodeIds = [updatedNodeId];
            updateNodeValues = [newValue];
        }

        IMLibCalc.setUndefinedToAllValues();
        IMLibNodeGraph.clear();
        for (nodeId in IMLibCalc.calculateRequiredObject) {
            calcObject = IMLibCalc.calculateRequiredObject[nodeId];
            calcFieldInfo = INTERMediatorLib.getCalcNodeInfoArray(nodeId);
            targetNode = document.getElementById(calcFieldInfo.field);
            for (field in calcObject.referes) {
                for (ix = 0; ix < calcObject.referes[field].length; ix++) {
                    IMLibNodeGraph.addEdge(nodeId, calcObject.referes[field][ix]);
                }
            }
        }
        do {
            leafNodes = IMLibNodeGraph.getLeafNodesWithRemoving();
            for (i = 0; i < leafNodes.length; i++) {
                calcObject = IMLibCalc.calculateRequiredObject[leafNodes[i]];
                calcFieldInfo = INTERMediatorLib.getCalcNodeInfoArray(leafNodes[i]);
                if (calcObject) {
                    targetNode = document.getElementById(calcFieldInfo.field);
                    exp = calcObject.expression;
                    nInfo = calcObject.nodeInfo;
                    valuesArray = calcObject.values;
                    refersArray = calcObject.referes;
                    for (field in valuesArray) {
                        valueSeries = [];
                        for (ix = 0; ix < valuesArray[field].length; ix++) {
                            if (valuesArray[field][ix] == undefined) {
                                targetElement = document.getElementById(refersArray[field][ix]);
                                valueSeries.push(IMLibElement.getValueFromIMNode(targetElement));
                            } else {
                                valueSeries.push(valuesArray[field][ix]);
                            }
                        }
                        calcObject.values[field] = valueSeries;
                    }
                    if (isRecalcAll) {
                        newValueAdded = true;
                    } else {
                        newValueAdded = false;
                        for (field in calcObject.referes) {
                            for (ix = 0; ix < calcObject.referes[field].length; ix++) {
                                cachedIndex = updatedNodeIds.indexOf(calcObject.referes[field][ix]);
                                if (cachedIndex >= 0) {
                                    calcObject.values[field][ix] = updateNodeValues[cachedIndex];
                                    newValueAdded = true;
                                }
                            }
                        }
                    }
                    if (newValueAdded) {
                        updatedValue = Parser.evaluate(
                            calcObject.expression,
                            calcObject.values
                        );
                        IMLibElement.setValueToIMNode(
                            document.getElementById(calcFieldInfo.field),
                            calcFieldInfo.target,
                            updatedValue,
                            true);
                        updatedNodeIds.push(calcFieldInfo.field);
                        updateNodeValues.push(updatedValue);
                    }
                }
                else {

                }
            }
        } while (leafNodes.length > 0);
        if (IMLibNodeGraph.nodes.length > 0) {
            // Spanning Tree Detected.
        }

    },

    setUndefinedToAllValues: function () {
        var nodeId, calcObject, ix, calcFieldInfo, targetNode, field, targetExp, targetIds;

        for (nodeId in IMLibCalc.calculateRequiredObject) {
            calcObject = IMLibCalc.calculateRequiredObject[nodeId];
            calcFieldInfo = INTERMediatorLib.getCalcNodeInfoArray(nodeId);
            targetNode = document.getElementById(calcFieldInfo.field);
            for (field in calcObject.values) {
                if (field.indexOf(INTERMediator.separator) > -1) {
                    targetExp = field;
                } else {
                    targetExp = calcObject.nodeInfo.table + INTERMediator.separator + field;
                }
                do {
                    targetIds = INTERMediatorOnPage.getNodeIdsHavingTargetFromRepeater(targetNode, targetExp);
                    if (targetIds && targetIds.length > 0) {
                        break;
                    }
                    targetIds = INTERMediatorOnPage.getNodeIdsHavingTargetFromEnclosure(targetNode, targetExp);
                    if (targetIds && targetIds.length > 0) {
                        break;
                    }
                    targetNode = INTERMediatorLib.getParentRepeater(
                        INTERMediatorLib.getParentEnclosure(targetNode));
                } while (targetNode);
                if (INTERMediatorLib.is_array(targetIds)) {
                    calcObject.referes[field] = [];
                    calcObject.values[field] = [];
                    for (ix = 0; ix < targetIds.length; ix++) {
                        calcObject.referes[field].push(targetIds[ix]);
                        calcObject.values[field].push(undefined);
                    }
                }
            }
        }
    }
}
/*
 * INTER-Mediator Ver.4.6 Released 2014-12-30
 * 
 *   by Masayuki Nii  msyk@msyk.net Copyright (c) 2010-2014 Masayuki Nii, All rights reserved.
 * 
 *   This project started at the end of 2009.
 *   INTER-Mediator is supplied under MIT License.
 */

//"use strict"

var INTERMediatorOnPage;

INTERMediatorOnPage = {
    authCountLimit: 4,
    authCount: 0,
    authUser: '',
    authHashedPassword: '',
    authUserSalt: '',
    authUserHexSalt: '',
    authChallenge: '',
    requireAuthentication: false,
    clientId: null,
    authRequiredContext: null,
    authStoring: 'cookie',
    authExpired: 3600,
    isOnceAtStarting: true,
    publickey: null,
    isNativeAuth: false,
    httpuser: null,
    httppasswd: null,
    mediaToken: null,
    realm: '',
    dbCache: {},
    isEmailAsUsername: false,

    isShowChangePassword: true,
    isSetDefaultStyle: true,
    authPanelTitle: null,

    additionalExpandingEnclosureFinish: {},
    additionalExpandingRecordFinish: {},

    /*
     This method "getMessages" is going to be replaced valid one with the browser's language.
     Here is defined to prevent the warning of static check.
     */
    getMessages: function () {
        return null;
    },

    getURLParametersAsArray: function () {
        var i, params, eqPos, result, key, value;
        result = {};
        params = location.search.substring(1).split('&');
        for (i = 0; i < params.length; i++) {
            eqPos = params[i].indexOf("=");
            if (eqPos > 0) {
                key = params[i].substring(0, eqPos);
                value = params[i].substring(eqPos + 1)
                result[key] = decodeURIComponent(value);
            }
        }
        return result;
    },

    getContextInfo: function (contextName) {
        var dataSources, oneSource, index;
        dataSources = INTERMediatorOnPage.getDataSources();
        for (index in dataSources) {
            if (dataSources[index].name == contextName) {
                return dataSources[index];
            }
        }
        return null;
    },

    isComplementAuthData: function () {
        if (this.authUser != null && this.authUser.length > 0
            && this.authHashedPassword != null && this.authHashedPassword.length > 0
            && this.authUserSalt != null && this.authUserSalt.length > 0
            && this.authChallenge != null && this.authChallenge.length > 0) {
            return true;
        }
        return false;
    },

    retrieveAuthInfo: function () {
        if (this.requireAuthentication) {
            if (this.isOnceAtStarting) {
                switch (this.authStoring) {
                    case 'cookie':
                    case 'cookie-domainwide':
                        this.authUser = this.getCookie('_im_username');
                        this.authHashedPassword = this.getCookie('_im_credential');
                        this.mediaToken = this.getCookie('_im_mediatoken');
                        break;
                    default:
                        this.removeCookie('_im_username');
                        this.removeCookie('_im_credential');
                        this.removeCookie('_im_mediatoken');
                        break;
                }
                this.isOnceAtStarting = false;
            }
            if (this.authUser.length > 0) {
                if (!INTERMediator_DBAdapter.getChallenge()) {
                    INTERMediator.flushMessage();
                }
            }
        }
    },

    logout: function () {
        this.authUser = "";
        this.authHashedPassword = "";
        this.authUserSalt = "";
        this.authChallenge = "";
        this.clientId = "";
        this.removeCookie("_im_username");
        this.removeCookie("_im_credential");
        this.removeCookie("_im_mediatoken");
        if (INTERMediator.useSessionStorage === true && typeof sessionStorage !== 'undefined' && sessionStorage !== null) {
            sessionStorage.removeItem("_im_localcontext");
        } else {
            this.removeCookie("_im_localcontext");
        }
    },

    storeCredencialsToCookie: function () {
        switch (INTERMediatorOnPage.authStoring) {
            case 'cookie':
                if (INTERMediatorOnPage.authUser) {
                    INTERMediatorOnPage.setCookie("_im_username", INTERMediatorOnPage.authUser);
                }
                if (INTERMediatorOnPage.authHashedPassword) {
                    INTERMediatorOnPage.setCookie("_im_credential", INTERMediatorOnPage.authHashedPassword);
                }
                if (INTERMediatorOnPage.mediaToken) {
                    INTERMediatorOnPage.setCookie("_im_mediatoken", INTERMediatorOnPage.mediaToken);
                }
                break;
            case 'cookie-domainwide':
                if (INTERMediatorOnPage.authUser) {
                    INTERMediatorOnPage.setCookieDomainWide("_im_username", INTERMediatorOnPage.authUser);
                }
                if (INTERMediatorOnPage.authHashedPassword) {
                    INTERMediatorOnPage.setCookieDomainWide("_im_credential", INTERMediatorOnPage.authHashedPassword);
                }
                if (INTERMediatorOnPage.mediaToken) {
                    INTERMediatorOnPage.setCookieDomainWide("_im_mediatoken", INTERMediatorOnPage.mediaToken);
                }
                break;
        }
    },

    defaultBackgroundImage: "url(data:image/png;base64,"
        + "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAA"
        + "ACF0RVh0U29mdHdhcmUAR3JhcGhpY0NvbnZlcnRlciAoSW50ZWwpd4f6GQAAAHRJ"
        + "REFUeJzs0bENAEAMAjHWzBC/f5sxkPIurkcmSV65KQcAAAAAAAAAAAAAAAAAAAAA"
        + "AAAAAAAAAAAAAAAAAAAAAL4AaA9oHwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
        + "AAAAAAAAAAAAOA6wAAAA//8DAF3pMFsPzhYWAAAAAElFTkSuQmCC)",

    defaultBackgroundColor: null,
    loginPanelHTML: null,

    authenticating: function (doAfterAuth) {
        var bodyNode, backBox, frontPanel, labelWidth, userLabel, userSpan, userBox, msgNumber,
            passwordLabel, passwordSpan, passwordBox, breakLine, chgpwButton, authButton, panelTitle,
            newPasswordLabel, newPasswordSpan, newPasswordBox, newPasswordMessage, realmBox, keyCode;

        if (this.authCount > this.authCountLimit) {
            this.authenticationError();
            this.logout();
            INTERMediator.flushMessage();
            return;
        }

        bodyNode = document.getElementsByTagName('BODY')[0];
        backBox = document.createElement('div');
        bodyNode.insertBefore(backBox, bodyNode.childNodes[0]);
        backBox.style.height = "100%";
        backBox.style.width = "100%";
        if (INTERMediatorOnPage.defaultBackgroundImage) {
            backBox.style.backgroundImage = INTERMediatorOnPage.defaultBackgroundImage;
        }
        if (INTERMediatorOnPage.defaultBackgroundColor) {
            backBox.style.backgroundColor = INTERMediatorOnPage.defaultBackgroundColor;
        }
        backBox.style.position = "absolute";
        backBox.style.padding = " 50px 0 0 0";
        backBox.style.top = "0";
        backBox.style.left = "0";
        backBox.style.zIndex = "999998";

        if (INTERMediatorOnPage.loginPanelHTML) {
            backBox.innerHTML = INTERMediatorOnPage.loginPanelHTML;
            passwordBox = document.getElementById('_im_password');
            userBox = document.getElementById('_im_username');
            authButton = document.getElementById('_im_authbutton');
            chgpwButton = document.getElementById('_im_changebutton');
        } else {
            frontPanel = document.createElement('div');
            if (INTERMediatorOnPage.isSetDefaultStyle) {
                frontPanel.style.width = "450px";
                frontPanel.style.backgroundColor = "#333333";
                frontPanel.style.color = "#DDDDAA";
                frontPanel.style.margin = "50px auto 0 auto";
                frontPanel.style.padding = "20px";
                frontPanel.style.borderRadius = "10px";
                frontPanel.style.position = "relative";
            }
            frontPanel.id = "_im_authpanel";
            backBox.appendChild(frontPanel);

            panelTitle = '';
            if (INTERMediatorOnPage.authPanelTitle && INTERMediatorOnPage.authPanelTitle.length > 0) {
                panelTitle = INTERMediatorOnPage.authPanelTitle;
            } else if (INTERMediatorOnPage.realm && INTERMediatorOnPage.realm.length > 0) {
                panelTitle = INTERMediatorOnPage.realm;
            }
            if (panelTitle && panelTitle.length > 0) {
                realmBox = document.createElement('DIV');
                realmBox.appendChild(document.createTextNode(panelTitle));
                realmBox.style.textAlign = "left";
                frontPanel.appendChild(realmBox);
                breakLine = document.createElement('HR');
                frontPanel.appendChild(breakLine);
            }

            labelWidth = "200px";
            userLabel = document.createElement('LABEL');
            frontPanel.appendChild(userLabel);
            userSpan = document.createElement('span');
            if (INTERMediatorOnPage.isSetDefaultStyle) {
                userSpan.style.width = labelWidth;
                userSpan.style.textAlign = "right";
                userSpan.style.cssFloat = "left";
            }
            INTERMediatorLib.setClassAttributeToNode(userSpan, "_im_authlabel");
            userLabel.appendChild(userSpan);
            msgNumber = INTERMediatorOnPage.isEmailAsUsername ? 2011 : 2002;
            userSpan.appendChild(document.createTextNode(INTERMediatorLib.getInsertedStringFromErrorNumber(msgNumber)));
            userBox = document.createElement('INPUT');
            userBox.type = "text";
            userBox.id = "_im_username";
            userBox.size = "24";
            userBox.setAttribute("autocapitalize", "off");
            userLabel.appendChild(userBox);

            breakLine = document.createElement('BR');
            breakLine.clear = "all";
            frontPanel.appendChild(breakLine);

            passwordLabel = document.createElement('LABEL');
            frontPanel.appendChild(passwordLabel);
            passwordSpan = document.createElement('SPAN');
            if (INTERMediatorOnPage.isSetDefaultStyle) {
                passwordSpan.style.minWidth = labelWidth;
                passwordSpan.style.textAlign = "right";
                passwordSpan.style.cssFloat = "left";
            }
            INTERMediatorLib.setClassAttributeToNode(passwordSpan, "_im_authlabel");
            passwordLabel.appendChild(passwordSpan);
            passwordSpan.appendChild(document.createTextNode(INTERMediatorLib.getInsertedStringFromErrorNumber(2003)));
            passwordBox = document.createElement('INPUT');
            passwordBox.type = "password";
            passwordBox.id = "_im_password";
            passwordBox.size = "24";
            passwordLabel.appendChild(passwordBox);

            authButton = document.createElement('BUTTON');
            authButton.appendChild(document.createTextNode(INTERMediatorLib.getInsertedStringFromErrorNumber(2004)));
            frontPanel.appendChild(authButton);

            breakLine = document.createElement('BR');
            breakLine.clear = "all";
            frontPanel.appendChild(breakLine);

            if (this.isShowChangePassword && !INTERMediatorOnPage.isNativeAuth) {

                breakLine = document.createElement('HR');
                frontPanel.appendChild(breakLine);

                newPasswordLabel = document.createElement('LABEL');
                frontPanel.appendChild(newPasswordLabel);
                newPasswordSpan = document.createElement('SPAN');
                if (INTERMediatorOnPage.isSetDefaultStyle) {
                    newPasswordSpan.style.minWidth = labelWidth;
                    newPasswordSpan.style.textAlign = "right";
                    newPasswordSpan.style.cssFloat = "left";
                    newPasswordSpan.style.fontSize = "0.7em";
                    newPasswordSpan.style.paddingTop = "4px";
                }
                INTERMediatorLib.setClassAttributeToNode(newPasswordSpan, "_im_authlabel");
                newPasswordLabel.appendChild(newPasswordSpan);
                newPasswordSpan.appendChild(
                    document.createTextNode(INTERMediatorLib.getInsertedStringFromErrorNumber(2006)));
                newPasswordBox = document.createElement('INPUT');
                newPasswordBox.type = "password";
                newPasswordBox.id = "_im_newpassword";
                newPasswordBox.size = "12";
                newPasswordLabel.appendChild(newPasswordBox);
                chgpwButton = document.createElement('BUTTON');
                chgpwButton.appendChild(document.createTextNode(INTERMediatorLib.getInsertedStringFromErrorNumber(2005)));
                frontPanel.appendChild(chgpwButton);

                newPasswordMessage = document.createElement('DIV');
                newPasswordMessage.style.textAlign = "center";
                newPasswordMessage.style.textSize = "10pt";
                newPasswordMessage.style.color = "#994433";
                frontPanel.appendChild(newPasswordMessage);
            }
        }
        passwordBox.onkeydown = function (event) {
            keyCode = (window.event) ? window.event.which : event.keyCode;
            if (keyCode == 13) {
                authButton.onclick();
            }
        };
        userBox.value = INTERMediatorOnPage.authUser;
        userBox.onkeydown = function (event) {
            keyCode = (window.event) ? window.event.which : event.keyCode;
            if (keyCode == 13) {
                passwordBox.focus();
            }
        };
        authButton.onclick = function () {
            var inputUsername, inputPassword, challengeResult;

            inputUsername = document.getElementById('_im_username').value;
            inputPassword = document.getElementById('_im_password').value;
            INTERMediatorOnPage.authUser = inputUsername;
            bodyNode.removeChild(backBox);
            if (inputUsername != ''    // No usename and no challenge, get a challenge.
                && (INTERMediatorOnPage.authChallenge === null || INTERMediatorOnPage.authChallenge.length < 24 )) {
                INTERMediatorOnPage.authHashedPassword = "need-hash-pls";   // Dummy Hash for getting a challenge
                challengeResult = INTERMediator_DBAdapter.getChallenge();
                if (!challengeResult) {
                    INTERMediator.flushMessage();
                    return; // If it's failed to get a challenge, finish everything.
                }
            }
            if (INTERMediatorOnPage.isNativeAuth) {
                INTERMediatorOnPage.authHashedPassword = INTERMediatorOnPage.publickey.biEncryptedString(inputPassword);
            } else {
                INTERMediatorOnPage.authHashedPassword
                    = SHA1(inputPassword + INTERMediatorOnPage.authUserSalt)
                    + INTERMediatorOnPage.authUserHexSalt;
            }

            if (INTERMediatorOnPage.authUser.length > 0) {   // Authentication succeed, Store coockies.
                INTERMediatorOnPage.storeCredencialsToCookie();
            }

            doAfterAuth();  // Retry.
            INTERMediator.flushMessage();
        };
        if (chgpwButton) {
            chgpwButton.onclick = function () {
                var inputUsername, inputPassword, inputNewPassword, challengeResult, params, result;

                inputUsername = document.getElementById('_im_username').value;
                inputPassword = document.getElementById('_im_password').value;
                inputNewPassword = document.getElementById('_im_newpassword').value;
                if (inputUsername === '' || inputPassword === '' || inputNewPassword === '') {
                    newPasswordMessage.appendChild(
                        document.createTextNode(
                            INTERMediatorLib.getInsertedStringFromErrorNumber(2007)));
                    return;
                }
                INTERMediatorOnPage.authUser = inputUsername;
                if (inputUsername != ''    // No usename and no challenge, get a challenge.
                    && (INTERMediatorOnPage.authChallenge === null || INTERMediatorOnPage.authChallenge.length < 24 )) {
                    INTERMediatorOnPage.authHashedPassword = "need-hash-pls";   // Dummy Hash for getting a challenge
                    challengeResult = INTERMediator_DBAdapter.getChallenge();
                    if (!challengeResult) {
                        newPasswordMessageappendChild(
                            document.createTextNode(
                                INTERMediatorLib.getInsertedStringFromErrorNumber(2008)));
                        INTERMediator.flushMessage();
                        return; // If it's failed to get a challenge, finish everything.
                    }
                }
                INTERMediatorOnPage.authHashedPassword
                    = SHA1(inputPassword + INTERMediatorOnPage.authUserSalt)
                    + INTERMediatorOnPage.authUserHexSalt;
                params = "access=changepassword&newpass=" + INTERMediatorLib.generatePasswordHash(inputNewPassword);
                try {
                    result = INTERMediator_DBAdapter.server_access(params, 1029, 1030);
                } catch (e) {
                    result = {newPasswordResult: false};
                }
                newPasswordMessage.appendChild(
                    document.createTextNode(
                        INTERMediatorLib.getInsertedStringFromErrorNumber(
                            result.newPasswordResult === true ? 2009 : 2010)));

                INTERMediator.flushMessage();
            }
        }

        window.scroll(0, 0);
        userBox.focus();
        INTERMediatorOnPage.authCount++;
    },

    authenticationError: function () {
        var bodyNode, backBox, frontPanel;

        INTERMediatorOnPage.hideProgress();

        bodyNode = document.getElementsByTagName('BODY')[0];
        backBox = document.createElement('div');
        bodyNode.insertBefore(backBox, bodyNode.childNodes[0]);
        backBox.style.height = "100%";
        backBox.style.width = "100%";
        //backBox.style.backgroundColor = "#BBBBBB";
        backBox.style.backgroundImage = "url(data:image/png;base64,"
            + "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAA"
            + "ACF0RVh0U29mdHdhcmUAR3JhcGhpY0NvbnZlcnRlciAoSW50ZWwpd4f6GQAAAHlJ"
            + "REFUeJzs0UENACAQA8EzdAl2EIEg3CKjyTGP/TfTur1OuJ2sAAAAAAAAAAAAAAAA"
            + "AAAAAAAAAAAAAAAAAAAAAAAAAADAJwDRAekDAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
            + "AAAAAAAAAAAAAAAAAADzAR4AAAD//wMAkUKRPI/rh/AAAAAASUVORK5CYII=)";
        backBox.style.position = "absolute";
        backBox.style.padding = " 50px 0 0 0";
        backBox.style.top = "0";
        backBox.style.left = "0";
        backBox.style.zIndex = "999999";

        frontPanel = document.createElement('div');
        frontPanel.style.width = "240px";
        frontPanel.style.backgroundColor = "#333333";
        frontPanel.style.color = "#DD6666";
        frontPanel.style.fontSize = "16pt";
        frontPanel.style.margin = "50px auto 0 auto";
        frontPanel.style.padding = "20px 4px 20px 4px";
        frontPanel.style.borderRadius = "10px";
        frontPanel.style.position = "relatvie";
        frontPanel.style.textAlign = "Center";
        frontPanel.onclick = function () {
            bodyNode.removeChild(backBox);
        };
        backBox.appendChild(frontPanel);
        frontPanel.appendChild(document.createTextNode(INTERMediatorLib.getInsertedStringFromErrorNumber(2001)));
    },

    INTERMediatorCheckBrowser: function (deleteNode) {
        var positiveList, matchAgent, matchOS, versionStr, agent, os, judge, specifiedVersion, versionNum,
            msieMark, dotPos, bodyNode, elm, childElm, grandChildElm, i;

        positiveList = INTERMediatorOnPage.browserCompatibility();
        matchAgent = false;
        matchOS = false;
        versionStr;
        for (agent in  positiveList) {
            if (navigator.userAgent.toUpperCase().indexOf(agent.toUpperCase()) > -1) {
                matchAgent = true;
                if (positiveList[agent] instanceof Object) {
                    for (os in positiveList[agent]) {
                        if (navigator.platform.toUpperCase().indexOf(os.toUpperCase()) > -1) {
                            matchOS = true;
                            versionStr = positiveList[agent][os];
                            break;
                        }
                    }
                } else {
                    matchOS = true;
                    versionStr = positiveList[agent];
                    break;
                }
            }
        }
        judge = false;
        if (matchAgent && matchOS) {
            specifiedVersion = parseInt(versionStr);
            if (navigator.appVersion.indexOf('MSIE') > -1) {
                msieMark = navigator.appVersion.indexOf('MSIE');
                dotPos = navigator.appVersion.indexOf('.', msieMark);
                versionNum = parseInt(navigator.appVersion.substring(msieMark + 4, dotPos));
                /*
                 As for the appVersion property of IE, refer http://msdn.microsoft.com/en-us/library/aa478988.aspx
                 */
            } else {
                dotPos = navigator.appVersion.indexOf('.');
                versionNum = parseInt(navigator.appVersion.substring(0, dotPos));
            }
            if (versionStr.indexOf('-') > -1) {
                judge = (specifiedVersion >= versionNum);
            } else if (versionStr.indexOf('+') > -1) {
                judge = (specifiedVersion <= versionNum);
            } else {
                judge = (specifiedVersion == versionNum);
            }
            if (document.documentMode) {
                judge = (specifiedVersion <= document.documentMode);
            }
        }
        if (judge) {
            if (deleteNode != null) {
                deleteNode.parentNode.removeChild(deleteNode);
            }
        } else {
            bodyNode = document.getElementsByTagName('BODY')[0];
            elm = document.createElement("div");
            elm.setAttribute("align", "center");
            childElm = document.createElement("font");
            childElm.setAttribute("color", "gray");
            grandChildElm = document.createElement("font");
            grandChildElm.setAttribute("size", "+2");
            grandChildElm.appendChild(document.createTextNode(INTERMediatorOnPage.getMessages()[1022]));
            childElm.appendChild(grandChildElm);
            childElm.appendChild(document.createElement("br"));
            childElm.appendChild(document.createTextNode(INTERMediatorOnPage.getMessages()[1023]));
            childElm.appendChild(document.createElement("br"));
            childElm.appendChild(document.createTextNode(navigator.userAgent));
            elm.appendChild(childElm);
            for (i = bodyNode.childNodes.length - 1; i >= 0; i--) {
                bodyNode.removeChild(bodyNode.childNodes[i]);
            }
            bodyNode.appendChild(elm);
        }
        return judge;
    },

    /*
     Seek nodes from the repeater of "fromNode" parameter.
     */
    getNodeIdFromIMDefinition: function (imDefinition, fromNode, justFromNode) {
        var repeaterNode;
        if (justFromNode) {
            repeaterNode = fromNode;
        } else {
            repeaterNode = INTERMediatorLib.getParentRepeater(fromNode);
        }
        return seekNode(repeaterNode, imDefinition);

        function seekNode(node, imDefinition) {
            var children, i, nodeDefs, returnValue;
            if (node.nodeType != 1) {
                return null;
            }
            children = node.childNodes;
            if (children) {
                for (i = 0; i < children.length; i++) {
                    if (children[i].nodeType == 1) {
                        if (INTERMediatorLib.isLinkedElement(children[i])) {
                            nodeDefs = INTERMediatorLib.getLinkedElementInfo(children[i]);
                            if (nodeDefs.indexOf(imDefinition) > -1) {
                                returnValue = children[i].getAttribute('id');
                                return returnValue;
                            }
                        }
                        returnValue = seekNode(children[i], imDefinition);
                        if (returnValue !== null) {
                            return returnValue;
                        }
                    }
                }
            }
            return null;
        }
    },

    getNodeIdFromIMDefinitionOnEnclosure: function (imDefinition, fromNode) {
        var repeaterNode;
        repeaterNode = INTERMediatorLib.getParentEnclosure(fromNode);
        return seekNode(repeaterNode, imDefinition);

        function seekNode(node, imDefinition) {
            var children, i, nodeDefs, returnValue;
            if (node.nodeType != 1) {
                return null;
            }
            children = node.childNodes;
            if (children) {
                for (i = 0; i < children.length; i++) {
                    if (children[i].nodeType == 1) {
                        if (INTERMediatorLib.isLinkedElement(children[i])) {
                            nodeDefs = INTERMediatorLib.getLinkedElementInfo(children[i]);
                            if (nodeDefs.indexOf(imDefinition) > -1 && children[i].getAttribute) {
                                returnValue = children[i].getAttribute('id');
                                return returnValue;
                            }
                        }
                        returnValue = seekNode(children[i], imDefinition);
                        if (returnValue !== null) {
                            return returnValue;
                        }
                    }
                }
            }
            return null;
        }
    },

    getNodeIdsFromIMDefinition: function (imDefinition, fromNode, justFromNode) {
        var enclosureNode, nodeIds, nodeDefs;

        if (justFromNode === true) {
            enclosureNode = fromNode;
        } else if (justFromNode === false) {
            enclosureNode = INTERMediatorLib.getParentEnclosure(fromNode);
        } else {
            enclosureNode = INTERMediatorLib.getParentRepeater(fromNode);
        }
        if (enclosureNode != null) {
            nodeIds = [];
            seekNode(enclosureNode, imDefinition);
        }
        return nodeIds;

        function seekNode(node, imDefinition) {
            var children, i, nodeDefs;
            if (node.nodeType != 1) {
                return;
            }
            children = node.childNodes;
            if (children) {
                for (i = 0; i < children.length; i++) {
                    if (children[i].nodeType == 1) {
                        nodeDefs = INTERMediatorLib.getLinkedElementInfo(children[i]);
                        if (nodeDefs && nodeDefs.indexOf(imDefinition) > -1) {
                            nodeIds.push(children[i].getAttribute('id'));
                        }
                    }
                    seekNode(children[i], imDefinition);
                }
            }
        }
    },

    getNodeIdsHavingTargetFromNode: function (fromNode, imDefinition) {
        return INTERMediatorOnPage.getNodeIdsFromIMDefinition(imDefinition, fromNode, true);
    },

    getNodeIdsHavingTargetFromRepeater: function (fromNode, imDefinition) {
        return INTERMediatorOnPage.getNodeIdsFromIMDefinition(imDefinition, fromNode, "");
    },

    getNodeIdsHavingTargetFromEnclosure: function (fromNode, imDefinition) {
        return INTERMediatorOnPage.getNodeIdsFromIMDefinition(imDefinition, fromNode, false);
    },

    /* Cookies support */
    getKeyWithRealm: function (str) {
        if (INTERMediatorOnPage.realm.length > 0) {
            return str + "_" + INTERMediatorOnPage.realm;
        }
        return str;
    },

    getCookie: function (key) {
        var s, i, targetKey;
        s = document.cookie.split('; ');
        targetKey = this.getKeyWithRealm(key);
        for (i = 0; i < s.length; i++) {
            if (s[i].indexOf(targetKey + '=') == 0) {
                return decodeURIComponent(s[i].substring(s[i].indexOf('=') + 1));
            }
        }
        return '';
    },
    removeCookie: function (key) {
        document.cookie = this.getKeyWithRealm(key) + "=; path=/; max-age=0; expires=Thu, 1-Jan-1900 00:00:00 GMT;";
        document.cookie = this.getKeyWithRealm(key) + "=; max-age=0;  expires=Thu, 1-Jan-1900 00:00:00 GMT;";
    },

    setCookie: function (key, val) {
        this.setCookieWorker(this.getKeyWithRealm(key), val, false, INTERMediatorOnPage.authExpired);
    },

    setCookieDomainWide: function (key, val) {
        this.setCookieWorker(this.getKeyWithRealm(key), val, true, INTERMediatorOnPage.authExpired);
    },

    setCookieWorker: function (key, val, isDomain, expired) {
        var cookieString;
        var d = new Date();
        d.setTime(d.getTime() + expired * 1000);
        cookieString = key + "=" + encodeURIComponent(val) + ( isDomain ? ";path=/" : "" ) + ";";
        if (expired > 0) {
           cookieString += "max-age=" + expired + ";expires=" + d.toGMTString() + ";";
        }
        if (document.URL.substring(0, 8) == "https://") {
            cookieString += "secure;";
        }
        document.cookie = cookieString;
    },

    hideProgress: function () {
        var frontPanel;
        frontPanel = document.getElementById('_im_progress');
        if (frontPanel) {
            frontPanel.parentNode.removeChild(frontPanel);
        }
    },

    showProgress: function () {
        var bodyNode, frontPanel, imageProgress, imageIM;

        frontPanel = document.getElementById('_im_progress');
        if (!frontPanel) {
            bodyNode = document.getElementsByTagName('BODY')[0];
            frontPanel = document.createElement('div');
            frontPanel.setAttribute('id', '_im_progress');
            frontPanel.style.backgroundColor = "#000000";
            frontPanel.style.textAlign = "center";
            frontPanel.style.width = "130px";
            frontPanel.style.height = "55px";
            frontPanel.style.left = "0";
            frontPanel.style.top = "0";
            frontPanel.style.color = "#DDDDAA";
            frontPanel.style.fontSize = "6px";
            frontPanel.style.position = "absolute";
            frontPanel.style.padding = "6px";
            frontPanel.style.borderRadius = "0 0 10px 0";
            frontPanel.style.borderRight = frontPanel.style.borderBottom = "solid 4px #779933"
            frontPanel.style.zIndex = "999999";
            if (bodyNode.firstChild) {
                bodyNode.insertBefore(frontPanel, bodyNode.firstChild);
            } else {
                bodyNode.appendChild(frontPanel);
            }

            /*  GIF animation image was generated on
             But they describe no copyright or kind of message doesn't required.
             */
            imageIM = document.createElement('img');
            imageIM.setAttribute('src', "data:image/gif;base64," +
                "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");
            imageIM.style.marginRight = "12px";
            frontPanel.appendChild(imageIM);
            imageProgress = document.createElement('img');
            imageProgress.setAttribute('src', "data:image/gif;base64," +
                "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");
            frontPanel.appendChild(imageProgress);
            frontPanel.appendChild(document.createElement("BR"));
            frontPanel.appendChild(document.createTextNode("INTER-Mediator working"));
        }
    }
};

/*
 * INTER-Mediator Ver.4.6 Released 2014-12-30
 *
 *   by Masayuki Nii  msyk@msyk.net Copyright (c) 2011 Masayuki Nii, All rights reserved.
 *
 *   This project started at the end of 2009.
 *   INTER-Mediator is supplied under MIT License.
 */

/**
 * TinyMCE bridgeObject
 * @type {{instanciate: Function, ids: Array, finish: Function}}
 */

//"use strict"

var IMParts_Catalog = {};
/*********
 *
 * File Uploader
 * @type {{html5DDSuported: boolean, instanciate: Function, ids: Array, finish: Function}}
 */
IMParts_Catalog["fileupload"] = {
    html5DDSuported: false,
    progressSupported: false,   // see http://www.johnboyproductions.com/php-upload-progress-bar/
    forceOldStyleForm: false,
    uploadId: "sign" + Math.random(),
    instanciate: function (parentNode) {
        var inputNode, formNode, buttonNode;
        var newId = parentNode.getAttribute('id') + '-e';
        var newNode = document.createElement('DIV');
        INTERMediatorLib.setClassAttributeToNode(newNode, '_im_fileupload');
        newNode.setAttribute('id', newId);
        this.ids.push(newId);
        if (this.forceOldStyleForm) {
            this.html5DDSuported = false;
        } else {
            this.html5DDSuported = true;
            try {
                var x = new FileReader();
                var y = new FormData();
            } catch (ex) {
                this.html5DDSuported = false;
            }
        }
        if (this.html5DDSuported) {
            newNode.dropzone = "copy";
            newNode.style.width = "200px";
            newNode.style.height = "100px";
            newNode.style.paddingTop = "20px";
            newNode.style.backgroundColor = "#AAAAAA";
            newNode.style.border = "3px dotted #808080";
            newNode.style.textAlign = "center";
            newNode.style.fontSize = "75%";
            var eachLine = INTERMediatorOnPage.getMessages()[3101].split(/\n/);
            for (var i = 0; i < eachLine.length; i++) {
                if (i > 0) {
                    newNode.appendChild(document.createElement("BR"));
                }
                newNode.appendChild(document.createTextNode(eachLine[i]));
            }
        } else {
            formNode = document.createElement('FORM');
            formNode.setAttribute('method', 'post');
            formNode.setAttribute('action', INTERMediatorOnPage.getEntryPath() + "?access=uploadfile");
            formNode.setAttribute('enctype', 'multipart/form-data');
            newNode.appendChild(formNode);

            if (this.progressSupported) {
                inputNode = document.createElement('INPUT');
                inputNode.setAttribute('type', 'hidden');
                inputNode.setAttribute('name', 'APC_UPLOAD_PROGRESS');
                inputNode.setAttribute('id', 'progress_key');
                inputNode.setAttribute('value',
                    this.uploadId + (this.ids.length - 1));
                formNode.appendChild(inputNode);
            }

            inputNode = document.createElement('INPUT');
            inputNode.setAttribute('type', 'hidden');
            inputNode.setAttribute('name', '_im_redirect');
            inputNode.setAttribute('value', location.href);
            formNode.appendChild(inputNode);

            inputNode = document.createElement('INPUT');
            inputNode.setAttribute('type', 'hidden');
            inputNode.setAttribute('name', '_im_contextnewrecord');
            inputNode.setAttribute('value', 'uploadfile');
            formNode.appendChild(inputNode);

            inputNode = document.createElement('INPUT');
            inputNode.setAttribute('type', 'hidden');
            inputNode.setAttribute('name', 'access');
            inputNode.setAttribute('value', 'uploadfile');
            formNode.appendChild(inputNode);

            inputNode = document.createElement('INPUT');
            inputNode.setAttribute('type', 'file');
            inputNode.setAttribute('accept', '*/*');
            inputNode.setAttribute('name', '_im_uploadfile');
            formNode.appendChild(inputNode);

            buttonNode = document.createElement('BUTTON');
            buttonNode.setAttribute('type', 'submit');
            buttonNode.appendChild(document.createTextNode('送信'));
            formNode.appendChild(buttonNode);
            this.formFromId[newId] = formNode;
        }
        parentNode.appendChild(newNode);

        newNode._im_getValue = function () {
            var targetNode = newNode;
            return targetNode.value;
        };
        parentNode._im_getValue = function () {
            var targetNode = newNode;
            return targetNode.value;
        };
        parentNode._im_getComponentId = function () {
            var theId = newId;
            return theId;
        };

        parentNode._im_setValue = function (str) {
            var targetNode = newNode;
            if (this.html5DDSuported) {
                //    targetNode.innerHTML = str;
            } else {

            }
        };
    },
    ids: [],
    formFromId: {},
    finish: function () {
        var shaObj, hmacValue;

        if (this.html5DDSuported) {
            for (var i = 0; i < this.ids.length; i++) {
                var tagetIdLocal = this.ids[i];
                var targetNode = document.getElementById(tagetIdLocal);
                var contextInfo = IMLibContextPool.getContextInfoFromId(tagetIdLocal);
                if (targetNode) {
                    INTERMediatorLib.addEvent(targetNode, "dragleave", function (event) {
                        event.preventDefault();
                        event.target.style.backgroundColor = "#AAAAAA";
                    });
                    INTERMediatorLib.addEvent(targetNode, "dragover", function (event) {
                        event.preventDefault();
                        event.target.style.backgroundColor = "#AADDFF";
                    });
                    var isProgressingLocal = this.progressSupported;
                    var serialIdLocal = this.ids.length;
                    var uploadIdLocal = this.uploadId;
                    INTERMediatorLib.addEvent(targetNode, "drop", (function () {
                        var iframeId = i;
                        var isProgressing = isProgressingLocal;
                        var serialId = serialIdLocal;
                        var uploadId = uploadIdLocal;
                        var tagetId = tagetIdLocal;
                        return function (event) {
                            var file, fileNameNode;
                            event.preventDefault();
                            var eventTarget = event.currentTarget;
                            if (isProgressing) {
                                var infoFrame = document.createElement('iframe');
                                infoFrame.setAttribute('id', 'upload_frame' + serialId);
                                infoFrame.setAttribute('name', 'upload_frame');
                                infoFrame.setAttribute('frameborder', '0');
                                infoFrame.setAttribute('border', '0');
                                infoFrame.setAttribute('scrolling', 'no');
                                infoFrame.setAttribute('scrollbar', 'no');
                                infoFrame.style.width = "100%";
                                infoFrame.style.height = "24px";
                                eventTarget.appendChild(infoFrame);
                            }
                            for (var i = 0; i < event.dataTransfer.files.length; i++) {
                                file = event.dataTransfer.files[i];
                                fileNameNode = document.createElement("DIV");
                                fileNameNode.appendChild(document.createTextNode(
                                    INTERMediatorOnPage.getMessages()[3102] + file.name));
                                fileNameNode.style.marginTop = "20px";
                                fileNameNode.style.backgroundColor = "#FFFFFF";
                                fileNameNode.style.textAlign = "center";
                                event.target.appendChild(fileNameNode);
                            }
                            var updateInfo = IMLibContextPool.getContextInfoFromId(eventTarget.getAttribute('id'), "");
                            //INTERMediator.updateRequiredObject[eventTarget.getAttribute('id')];

                            if (isProgressing) {
                                infoFrame.style.display = "block";
                                setTimeout(function () {
                                    infoFrame.setAttribute('src',
                                        'upload_frame.php?up_id=' + uploadId + iframeId);
                                });
                            }

                            INTERMediator_DBAdapter.uploadFile(
                                '&_im_contextname=' + encodeURIComponent(updateInfo.context.contextName)
                                    + '&_im_field=' + encodeURIComponent(updateInfo.field)
                                    + '&_im_keyfield=' + encodeURIComponent(updateInfo.record.split("=")[0])
                                    + '&_im_keyvalue=' + encodeURIComponent(updateInfo.record.split("=")[1])
                                    + '&_im_contextnewrecord=' + encodeURIComponent('uploadfile')
                                    + (isProgressing ?
                                    ('&APC_UPLOAD_PROGRESS=' + encodeURIComponent(uploadId + iframeId)) : ""),
                                {
                                    fileName: file.name,
                                    content: file
                                },
                                function (dbresult) {
                                    var contextObj, contextInfo, contextObjects = null, fvalue, i, context;
                                    context = IMLibContextPool.getContextDef(updateInfo.context.contextName);
                                    if (context['file-upload']) {
                                        var relatedContextName = '';
                                        for (var index in context['file-upload']) {
                                            if (context['file-upload'][index]['field'] == updateInfo.field) {
                                                relatedContextName = context['file-upload'][index]['context'];
                                                break;
                                            }
                                        }
                                        fvalue = IMLibContextPool.getKeyFieldValueFromId(tagetId, "")
                                        contextObjects = IMLibContextPool.getContextsFromNameAndForeignValue(
                                            relatedContextName, fvalue, context.key);
                                    } else {
                                        contextObjects = IMLibContextPool.getContextFromName(updateInfo.context.contextName);
                                    }
                                    contextInfo = IMLibContextPool.getContextInfoFromId(tagetId, "");
                                    contextInfo.context.setValue(contextInfo.record, contextInfo.field, dbresult);
                                    if (contextObjects) {
                                        for (i = 0; i < contextObjects.length; i++) {
                                            contextObj = contextObjects[i];
                                            INTERMediator.construct(contextObj);
                                        }
                                    }
                                    INTERMediator.flushMessage();
                                });
                        }
                    })());
                }
            }

        } else {
            for (var i = 0; i < this.ids.length; i++) {
                var targetNode = document.getElementById(this.ids[i]);
                if (targetNode) {
                    var updateInfo = IMLibContextPool.getContextInfoFromId(this.ids[i], "");
                    //= INTERMediator.updateRequiredObject[IMParts_im_fileupload.ids[i]];
                    var formNode = targetNode.getElementsByTagName('FORM')[0];
                    var inputNode = document.createElement('INPUT');
                    inputNode.setAttribute('type', 'hidden');
                    inputNode.setAttribute('name', '_im_contextname');
                    inputNode.setAttribute('value', updateInfo.context.contextName);
                    formNode.appendChild(inputNode);

                    inputNode = document.createElement('INPUT');
                    inputNode.setAttribute('type', 'hidden');
                    inputNode.setAttribute('name', '_im_field');
                    inputNode.setAttribute('value', updateInfo.field);
                    formNode.appendChild(inputNode);

                    inputNode = document.createElement('INPUT');
                    inputNode.setAttribute('type', 'hidden');
                    inputNode.setAttribute('name', '_im_keyfield');
                    inputNode.setAttribute('value', updateInfo.record.split("=")[0]);
                    formNode.appendChild(inputNode);

                    inputNode = document.createElement('INPUT');
                    inputNode.setAttribute('type', 'hidden');
                    inputNode.setAttribute('name', '_im_keyvalue');
                    inputNode.setAttribute('value', updateInfo.record.split("=")[1]);
                    formNode.appendChild(inputNode);

                    inputNode = document.createElement('INPUT');
                    inputNode.setAttribute('type', 'hidden');
                    inputNode.setAttribute('name', 'clientid');
                    if (INTERMediatorOnPage.authUser.length > 0) {
                        inputNode.value = INTERMediatorOnPage.clientId;
                    }
                    formNode.appendChild(inputNode);
                    inputNode = document.createElement('INPUT');
                    inputNode.setAttribute('type', 'hidden');
                    inputNode.setAttribute('name', 'authuser');
                    if (INTERMediatorOnPage.authUser.length > 0) {
                        inputNode.value = INTERMediatorOnPage.authUser;
                    }
                    formNode.appendChild(inputNode);
                    inputNode = document.createElement('INPUT');
                    inputNode.setAttribute('type', 'hidden');
                    inputNode.setAttribute('name', 'response');
                    if (INTERMediatorOnPage.authUser.length > 0) {
                        if (INTERMediatorOnPage.isNativeAuth) {
                            thisForm.elements["response"].value = INTERMediatorOnPage.publickey.biEncryptedString(
                                INTERMediatorOnPage.authHashedPassword + "\n" + INTERMediatorOnPage.authChallenge);
                        } else {
                            if (INTERMediatorOnPage.authHashedPassword && INTERMediatorOnPage.authChallenge) {
                                shaObj = new jsSHA(INTERMediatorOnPage.authHashedPassword, "ASCII");
                                hmacValue = shaObj.getHMAC(INTERMediatorOnPage.authChallenge,
                                    "ASCII", "SHA-256", "HEX");
                                inputNode.value = hmacValue;
                            } else {
                                inputNode.value = "dummy";
                            }
                        }
                    }
                    formNode.appendChild(inputNode);
                    if (this.progressSupported) {

                        inputNode = document.createElement('iframe');
                        inputNode.setAttribute('id', 'upload_frame' + i);
                        inputNode.setAttribute('name', 'upload_frame');
                        inputNode.setAttribute('frameborder', '0');
                        inputNode.setAttribute('border', '0');
                        inputNode.setAttribute('scrolling', 'no');
                        inputNode.setAttribute('scrollbar', 'no');
                        formNode.appendChild(inputNode);

                        INTERMediatorLib.addEvent(formNode, "submit", (function () {
                            var iframeId = i;
                            return function (event) {

                                var iframeNode = document.getElementById('upload_frame' + iframeId);
                                iframeNode.style.display = "block";
                                setTimeout(function () {
                                    var infoURL = selfURL() + '?uploadprocess='
                                        + this.uploadId + iframeId;
                                    iframeNode.setAttribute('src', infoURL);
                                });
                                return true;
                            }
                        })());
                    }
                }
            }
        }
        this.ids = [];
        this.formFromId = {};

        function selfURL() {
            var nodes = document.getElementsByTagName("SCRIPT");
            for (var i = 0; i < nodes.length; i++) {
                var srcAttr = nodes[i].getAttribute("src");
                if (srcAttr.match(/\.php/)) {
                    return srcAttr;
                }
            }
            return null;
        }
    }
};
/*
 * INTER-Mediator Ver.4.6 Released 2014-12-30
 *
 *   by Masayuki Nii  msyk@msyk.net Copyright (c) 2010-2014 Masayuki Nii, All rights reserved.
 *
 *   This project started at the end of 2009.
 *   INTER-Mediator is supplied under MIT License.
 */

IMLibPageNavigation = {
    deleteInsertOnNavi: [],
    /**
     * Create Navigation Bar to move previous/next page
     */

    navigationSetup: function () {
        var navigation, i, insideNav, navLabel, node, start, pageSize, allCount, disableClass, c_node,
            prevPageCount, nextPageCount, endPageCount, onNaviInsertFunction, onNaviDeleteFunction;

        navigation = document.getElementById('IM_NAVIGATOR');
        if (navigation != null) {
            insideNav = navigation.childNodes;
            for (i = 0; i < insideNav.length; i++) {
                navigation.removeChild(insideNav[i]);
            }
            navigation.innerHTML = '';
            navigation.setAttribute('class', 'IM_NAV_panel');
            navLabel = INTERMediator.navigationLabel;

            if (navLabel === null || navLabel[8] !== false) {
                node = document.createElement('SPAN');
                navigation.appendChild(node);
                node.appendChild(document.createTextNode(
                    ((navLabel === null || navLabel[8] === null) ? INTERMediatorOnPage.getMessages()[2] : navLabel[8])));
                node.setAttribute('class', 'IM_NAV_button');
                INTERMediatorLib.addEvent(node, 'click', function () {
                    INTERMediator.initialize();
                    IMLibLocalContext.archive();
                    location.reload();
                });
            }

            if (navLabel === null || navLabel[4] !== false) {
                start = Number(INTERMediator.startFrom);
                pageSize = Number(INTERMediator.pagedSize);
                allCount = Number(INTERMediator.pagedAllCount);
                disableClass = " IM_NAV_disabled";
                node = document.createElement('SPAN');
                navigation.appendChild(node);
                node.appendChild(document.createTextNode(
                    ((navLabel === null || navLabel[4] === null) ?
                        INTERMediatorOnPage.getMessages()[1] : navLabel[4]) + (start + 1)
                        + ((Math.min(start + pageSize, allCount) - start > 1) ?
                        (((navLabel === null || navLabel[5] === null) ? "-" : navLabel[5])
                            + Math.min(start + pageSize, allCount)) : '')
                        + ((navLabel === null || navLabel[6] === null) ? " / " : navLabel[6]) + (allCount)
                        + ((navLabel === null || navLabel[7] === null) ? "" : navLabel[7])));
                node.setAttribute('class', 'IM_NAV_info');
            }

            if (navLabel === null || navLabel[0] !== false) {
                node = document.createElement('SPAN');
                navigation.appendChild(node);
                node.appendChild(document.createTextNode(
                    (navLabel === null || navLabel[0] === null) ? '<<' : navLabel[0]));
                node.setAttribute('class', 'IM_NAV_button' + (start == 0 ? disableClass : ""));
                INTERMediatorLib.addEvent(node, 'click', function () {
                    INTERMediator_DBAdapter.unregister();
                    INTERMediator.startFrom = 0;
                    INTERMediator.constructMain(true);
                });

                node = document.createElement('SPAN');
                navigation.appendChild(node);
                node.appendChild(document.createTextNode(
                    (navLabel === null || navLabel[1] === null) ? '<' : navLabel[1]));
                node.setAttribute('class', 'IM_NAV_button' + (start == 0 ? disableClass : ""));
                prevPageCount = (start - pageSize > 0) ? start - pageSize : 0;
                INTERMediatorLib.addEvent(node, 'click', function () {
                    INTERMediator_DBAdapter.unregister();
                    INTERMediator.startFrom = prevPageCount;
                    INTERMediator.constructMain(true);
                });

                node = document.createElement('SPAN');
                navigation.appendChild(node);
                node.appendChild(document.createTextNode(
                    (navLabel === null || navLabel[2] === null) ? '>' : navLabel[2]));
                node.setAttribute('class', 'IM_NAV_button' + (start + pageSize >= allCount ? disableClass : ""));
                nextPageCount
                    = (start + pageSize < allCount) ? start + pageSize : ((allCount - pageSize > 0) ? start : 0);
                INTERMediatorLib.addEvent(node, 'click', function () {
                    INTERMediator_DBAdapter.unregister();
                    INTERMediator.startFrom = nextPageCount;
                    INTERMediator.constructMain(true);
                });

                node = document.createElement('SPAN');
                navigation.appendChild(node);
                node.appendChild(document.createTextNode(
                    (navLabel === null || navLabel[3] === null) ? '>>' : navLabel[3]));
                node.setAttribute('class', 'IM_NAV_button' + (start + pageSize >= allCount ? disableClass : ""));
                if (allCount % pageSize == 0) {
                    endPageCount = allCount - (allCount % pageSize) - pageSize;
                } else {
                    endPageCount = allCount - (allCount % pageSize);
                }
                INTERMediatorLib.addEvent(node, 'click', function () {
                    INTERMediator_DBAdapter.unregister();
                    INTERMediator.startFrom = (endPageCount > 0) ? endPageCount : 0;
                    INTERMediator.constructMain(true);
                });

                // Get from http://agilmente.com/blog/2013/08/04/inter-mediator_pagenation_1/
                node = document.createElement("SPAN");
                navigation.appendChild(node);
                node.appendChild(document.createTextNode(INTERMediatorOnPage.getMessages()[10]));
                c_node = document.createElement("INPUT");
                c_node.setAttribute("class", 'IM_NAV_JUMP');
                c_node.setAttribute("type", 'text');
                c_node.setAttribute("value", Math.ceil(INTERMediator.startFrom / pageSize + 1));
                node.appendChild(c_node);
                node.appendChild(document.createTextNode(INTERMediatorOnPage.getMessages()[11]));
                INTERMediatorLib.addEvent(
                    c_node,
                    "change",
                    function () {
                        if (this.value < 1) {
                            this.value = 1;
                        }
                        var max_page = Math.ceil(allCount / pageSize);
                        if (max_page < this.value) {
                            this.value = max_page;
                        }
                        INTERMediator.startFrom = ( ~~this.value - 1 ) * pageSize;
                        INTERMediator.construct(true);
                    }
                )
                // ---------
            }

            if (navLabel === null || navLabel[9] !== false) {
                for (i = 0; i < IMLibPageNavigation.deleteInsertOnNavi.length; i++) {
                    switch (IMLibPageNavigation.deleteInsertOnNavi[i]['kind']) {
                        case 'INSERT':
                            node = document.createElement('SPAN');
                            navigation.appendChild(node);
                            node.appendChild(
                                document.createTextNode(
                                    INTERMediatorOnPage.getMessages()[3] + ': '
                                        + IMLibPageNavigation.deleteInsertOnNavi[i]['name']));
                            node.setAttribute('class', 'IM_NAV_button');
                            onNaviInsertFunction = function (a, b, c) {
                                var contextName = a, keyValue = b, confirming = c;
                                return function () {
                                    IMLibPageNavigation.insertRecordFromNavi(contextName, keyValue, confirming);
                                };
                            };
                            INTERMediatorLib.addEvent(
                                node,
                                'click',
                                onNaviInsertFunction(
                                    IMLibPageNavigation.deleteInsertOnNavi[i]['name'],
                                    IMLibPageNavigation.deleteInsertOnNavi[i]['key'],
                                    IMLibPageNavigation.deleteInsertOnNavi[i]['confirm'] ? true : false)
                            );
                            break;
                        case 'DELETE':
                            node = document.createElement('SPAN');
                            navigation.appendChild(node);
                            node.appendChild(
                                document.createTextNode(
                                    INTERMediatorOnPage.getMessages()[4] + ': '
                                        + IMLibPageNavigation.deleteInsertOnNavi[i]['name']));
                            node.setAttribute('class', 'IM_NAV_button');
                            onNaviDeleteFunction = function (a, b, c, d) {
                                var contextName = a, keyName = b, keyValue = c, confirming = d;
                                return function () {
                                    IMLibPageNavigation.deleteRecordFromNavi(contextName, keyName, keyValue, confirming);
                                };
                            }
                            INTERMediatorLib.addEvent(
                                node,
                                'click',
                                onNaviDeleteFunction(
                                    IMLibPageNavigation.deleteInsertOnNavi[i]['name'],
                                    IMLibPageNavigation.deleteInsertOnNavi[i]['key'],
                                    IMLibPageNavigation.deleteInsertOnNavi[i]['value'],
                                    IMLibPageNavigation.deleteInsertOnNavi[i]['confirm'] ? true : false));
                            break;
                    }
                }
            }
            if (navLabel === null || navLabel[10] !== false) {
                if (INTERMediatorOnPage.getOptionsTransaction() == 'none') {
                    node = document.createElement('SPAN');
                    navigation.appendChild(node);
                    node.appendChild(document.createTextNode(
                        (navLabel === null || navLabel[10] === null) ?
                            INTERMediatorOnPage.getMessages()[7] : navLabel[10]));
                    node.setAttribute('class', 'IM_NAV_button');
                    INTERMediatorLib.addEvent(node, 'click', IMLibPageNavigation.saveRecordFromNavi);
                }
            }
            if (navLabel === null || navLabel[11] !== false) {
                if (INTERMediatorOnPage.requireAuthentication) {
                    node = document.createElement('SPAN');
                    navigation.appendChild(node);
                    node.appendChild(document.createTextNode(
                        INTERMediatorOnPage.getMessages()[8] + INTERMediatorOnPage.authUser));
                    node.setAttribute('class', 'IM_NAV_info');

                    node = document.createElement('SPAN');
                    navigation.appendChild(node);
                    node.appendChild(document.createTextNode(
                        (navLabel === null || navLabel[11] === null) ?
                            INTERMediatorOnPage.getMessages()[9] : navLabel[11]));
                    node.setAttribute('class', 'IM_NAV_button');
                    INTERMediatorLib.addEvent(node, 'click',
                        function () {
                            INTERMediatorOnPage.logout();
                            location.reload();
                        });
                }
            }
        }
    },

    insertRecordFromNavi: function (targetName, keyField, isConfirm) {
        var newId, conditions, fieldObj, contextDef, responseCreateRecord;

        if (isConfirm) {
            if (!confirm(INTERMediatorOnPage.getMessages()[1026])) {
                return;
            }
        }
        INTERMediatorOnPage.showProgress();
        contextDef = INTERMediatorLib.getNamedObject(INTERMediatorOnPage.getDataSources(), "name", targetName);
        if (contextDef === null) {
            alert("no targetname :" + targetName);
            INTERMediatorOnPage.hideProgress();
            return;
        }

        try {
            INTERMediatorOnPage.retrieveAuthInfo();
            responseCreateRecord = INTERMediator_DBAdapter.db_createRecord({name: targetName, dataset: []});
            newId = responseCreateRecord.newKeyValue
        } catch (ex) {
            if (ex == "_im_requath_request_") {
                if (INTERMediatorOnPage.requireAuthentication) {
                    if (!INTERMediatorOnPage.isComplementAuthData()) {
                        INTERMediatorOnPage.authChallenge = null;
                        INTERMediatorOnPage.authHashedPassword = null;
                        INTERMediatorOnPage.authenticating(function () {
                            IMLibPageNavigation.insertRecordFromNavi(targetName, keyField, isConfirm);
                        });
                        INTERMediator.flushMessage();
                        return;
                    }
                }
            } else {
                INTERMediator.setErrorMessage(ex, "EXCEPTION-5");
            }
        }

        if (newId > -1) {
            restore = INTERMediator.additionalCondition;
            INTERMediator.startFrom = 0;
            if (contextDef.records <= 1) {
                conditions = INTERMediator.additionalCondition;
                conditions[targetName] = {field: keyField, value: newId};
                INTERMediator.additionalCondition = conditions;
                IMLibLocalContext.archive();
            }
            INTERMediator_DBAdapter.unregister();
            INTERMediator.constructMain(true);
            INTERMediator.additionalCondition = restore;
        }
        IMLibCalc.recalculation();
        INTERMediatorOnPage.hideProgress();
        INTERMediator.flushMessage();
    },

    deleteRecordFromNavi: function (targetName, keyField, keyValue, isConfirm) {
        if (isConfirm) {
            if (!confirm(INTERMediatorOnPage.getMessages()[1025])) {
                return;
            }
        }
        INTERMediatorOnPage.showProgress();
        try {
            INTERMediatorOnPage.retrieveAuthInfo();
            INTERMediator_DBAdapter.db_delete({
                name: targetName,
                conditions: [
                    {field: keyField, operator: '=', value: keyValue}
                ]
            });
        } catch (ex) {
            if (ex == "_im_requath_request_") {
                INTERMediatorOnPage.authChallenge = null;
                INTERMediatorOnPage.authHashedPassword = null;
                INTERMediatorOnPage.authenticating(
                    function () {
                        IMLibPageNavigation.deleteRecordFromNavi(targetName, keyField, keyValue, isConfirm);
                    }
                );
                INTERMediator.flushMessage();
                return;
            } else {
                INTERMediator.setErrorMessage(ex, "EXCEPTION-6");
            }
        }

        if (INTERMediator.pagedAllCount - INTERMediator.startFrom < 2) {
            INTERMediator.startFrom--;
            if (INTERMediator.startFrom < 0) {
                INTERMediator.startFrom = 0;
            }
        }
        INTERMediator.constructMain(true);
        INTERMediatorOnPage.hideProgress();
        INTERMediator.flushMessage();
    },

    saveRecordFromNavi: function (dontUpdate) {
        var contextName, keying, field, keyingComp, keyingField, keyingValue, checkQueryParameter, i, initialValue,
            currentVal, fieldArray, valueArray, diffrence, needUpdate = true, context, updateData;

        INTERMediatorOnPage.showProgress();
        INTERMediatorOnPage.retrieveAuthInfo();
        for (i = 0; i < IMLibContextPool.poolingContexts.length; i++) {
            context = IMLibContextPool.poolingContexts[i];
            updateData = context.getModified();
            for (keying in updateData) {
                fieldArray = [];
                valueArray = [];
                for (field in updateData[keying]) {
                    fieldArray.push(field);
                    valueArray.push({field: field, value: updateData[keying][field]});
                }
                if (!INTERMediator.ignoreOptimisticLocking) {
                    keyingComp = keying.split('=');
                    keyingField = keyingComp[0];
                    keyingComp.shift();
                    keyingValue = keyingComp.join('=');
                    checkQueryParameter = {
                        name: context.contextName,
                        records: 1,
                        paging: false,
                        fields: fieldArray,
                        parentkeyvalue: null,
                        conditions: [
                            {field: keyingField, operator: '=', value: keyingValue}
                        ],
                        useoffset: false,
                        primaryKeyOnly: true
                    };
                    try {
                        currentVal = INTERMediator_DBAdapter.db_query(checkQueryParameter);
                    } catch (ex) {
                        if (ex == "_im_requath_request_") {
                            if (INTERMediatorOnPage.requireAuthentication
                                && !INTERMediatorOnPage.isComplementAuthData()) {
                                INTERMediatorOnPage.authChallenge = null;
                                INTERMediatorOnPage.authHashedPassword = null;
                                INTERMediatorOnPage.authenticating(
                                    function () {
                                        INTERMediator.db_query(checkQueryParameter);
                                    }
                                );
                                return;
                            }
                        } else {
                            INTERMediator.setErrorMessage(ex, "EXCEPTION-28");
                        }
                    }

                    if (currentVal.recordset == null
                        || currentVal.recordset[0] === null) {
                        alert(INTERMediatorLib.getInsertedString(
                            INTERMediatorOnPage.getMessages()[1003], [fieldArray.join(',')]));
                        return;
                    }
                    if (currentVal.count > 1) {
                        response = confirm(INTERMediatorOnPage.getMessages()[1024]);
                        if (!response) {
                            return;
                        }
                    }

                    diffrence = false;
                    for (field in updateData[keying]) {
                        initialValue = context.getValue(keying, field);
                        if (initialValue != currentVal.recordset[0][field]) {
                            diffrence += INTERMediatorLib.getInsertedString(
                                INTERMediatorOnPage.getMessages()[1035], [
                                    field,
                                    currentVal.recordset[0][field],
                                    updateData[keying][field]
                                ]);
                        }
                    }
                    if (diffrence !== false) {
                        if (!confirm(INTERMediatorLib.getInsertedString(
                            INTERMediatorOnPage.getMessages()[1034], [diffrence]))) {
                            return;
                        }
                        INTERMediatorOnPage.retrieveAuthInfo(); // This is required. Why?
                    }
                }

                try {
                    INTERMediator_DBAdapter.db_update({
                        name: context.contextName,
                        conditions: [
                            {field: keyingField, operator: '=', value: keyingValue}
                        ],
                        dataset: valueArray
                    });

                } catch (ex) {
                    if (ex == "_im_requath_request_") {
                        if (INTERMediatorOnPage.requireAuthentication
                            && !INTERMediatorOnPage.isComplementAuthData()) {
                            INTERMediatorOnPage.authChallenge = null;
                            INTERMediatorOnPage.authHashedPassword = null;
                            INTERMediatorOnPage.authenticating(
                                function () {
                                    IMLibPageNavigation.deleteRecordFromNavi(targetName, keyField, keyValue, isConfirm);
                                }
                            );
                            return;
                        }
                    } else {
                        INTERMediator.setErrorMessage(ex, "EXCEPTION-29");
                    }
                }
                context.clearModified();
            }
        }
        if (needUpdate && (dontUpdate !== true)) {
            INTERMediator.constructMain(true);
        }
        INTERMediatorOnPage.hideProgress();
        INTERMediator.flushMessage();
    }
}/*
 * INTER-Mediator Ver.4.6 Released 2014-12-30
 *
 *   by Masayuki Nii  msyk@msyk.net Copyright (c) 2010-2014 Masayuki Nii, All rights reserved.
 *
 *   This project started at the end of 2009.
 *   INTER-Mediator is supplied under MIT License.
 */

var IMLibUI = {

    isShiftKeyDown: false,
    isControlKeyDown: false,

    keyDown: function (evt) {
        var keyCode = (window.event) ? evt.which : evt.keyCode;
        if (keyCode == 16) {
            IMLibUI.isShiftKeyDown = true;
        }
        if (keyCode == 17) {
            IMLibUI.isControlKeyDown = true;
        }
    },

    keyUp: function (evt) {
        var keyCode = (window.event) ? evt.which : evt.keyCode;
        if (keyCode == 16) {
            IMLibUI.isShiftKeyDown = false;
        }
        if (keyCode == 17) {
            IMLibUI.isControlKeyDown = false;
        }
    },
    /*
     valueChange
     Parameters:
     */
    valueChange: function (idValue) {
        var changedObj, objType, contextInfo, i, updateRequiredContext, associatedNode, currentValue, newValue,
            linkInfo, nodeInfo;

        if (IMLibUI.isShiftKeyDown && IMLibUI.isControlKeyDown) {
            INTERMediator.setDebugMessage("Canceled to update the value with shift+control keys.");
            INTERMediator.flushMessage();
            IMLibUI.isShiftKeyDown = false;
            IMLibUI.isControlKeyDown = false;
            return;
        }
        IMLibUI.isShiftKeyDown = false;
        IMLibUI.isControlKeyDown = false;

        changedObj = document.getElementById(idValue);
        if (changedObj != null) {
            if (changedObj.readOnly) {  // for Internet Explorer
                return;
            }
            if (!validation(changedObj)) {   // Validation error.
                return;
            }
            objType = changedObj.getAttribute('type');
            if (objType == 'radio' && !changedObj.checked) {
                INTERMediatorOnPage.hideProgress();
                return;
            }
            linkInfo = INTERMediatorLib.getLinkedElementInfo(changedObj);
            // for js-widget support
            if (!linkInfo && INTERMediatorLib.isWidgetElement(changedObj.parentNode)) {
                linkInfo = INTERMediatorLib.getLinkedElementInfo(changedObj.parentNode);
            }

            nodeInfo = INTERMediatorLib.getNodeInfoArray(linkInfo[0]);  // Suppose to be the first definition.
            contextInfo = IMLibContextPool.getContextInfoFromId(idValue, nodeInfo.target);
            if (contextInfo) {
                newValue = IMLibElement.getValueFromIMNode(changedObj);
                if (INTERMediatorOnPage.getOptionsTransaction() == 'none') {
                    // Just supporting NON-target info.
//                contextInfo.context.setValue(
//                    contextInfo.record, contextInfo.field, newValue);
                    contextInfo.context.setModified(contextInfo.record, contextInfo.field, newValue);
                } else {
                    INTERMediatorOnPage.showProgress();
                    if (!IMLibElement.checkOptimisticLock(changedObj, nodeInfo.target)) {
                        INTERMediatorOnPage.hideProgress();
                    } else {
                        IMLibContextPool.updateContext(idValue, nodeInfo.target);
                        updateDB(changedObj, idValue, nodeInfo.target);

                        updateRequiredContext = IMLibContextPool.dependingObjects(idValue);
                        for (i = 0; i < updateRequiredContext.length; i++) {
                            updateRequiredContext[i].foreignValue = {};
                            updateRequiredContext[i].foreignValue[contextInfo.field] = newValue;
                            if (updateRequiredContext[i]) {
                                INTERMediator.constructMain(updateRequiredContext[i]);
                                associatedNode = updateRequiredContext[i].enclosureNode;
                                if (INTERMediatorLib.isPopupMenu(associatedNode)) {
                                    currentValue = contextInfo.context.getContextValue(associatedNode.id, "");
                                    IMLibElement.setValueToIMNode(associatedNode, "", currentValue, false);
                                }
                            }
                        }
                    }
                }
            }
            IMLibCalc.recalculation(idValue);
            INTERMediator.flushMessage();
        }

        function validation(changedObj) {
            var linkInfo, matched, context, i, index, didValidate, contextInfo, result, messageNode, errorMsgs;
            try {
                linkInfo = INTERMediatorLib.getLinkedElementInfo(changedObj);
                didValidate = false;
                result = true;
                if (linkInfo.length > 0) {
                    matched = linkInfo[0].match(/([^@]+)/);
                    if (matched[1] != IMLibLocalContext.contextName) {
                        context = INTERMediatorLib.getNamedObject(INTERMediatorOnPage.getDataSources(), 'name', matched[1]);
                        if (context["validation"] != null) {
                            for (i = 0; i < linkInfo.length; i++) {
                                matched = linkInfo[i].match(/([^@]+)@([^@]+)/);
                                for (index in context["validation"]) {
                                    if (context["validation"][index]["field"] == matched[2]) {
                                        didValidate = true;
                                        result = Parser.evaluate(
                                            context["validation"][index]["rule"],
                                            {"value": changedObj.value, "target": changedObj});
                                        if (!result) {
                                            switch (context["validation"][index]["notify"]) {
                                                case "inline":
                                                    INTERMediatorLib.clearErrorMessage(changedObj);
                                                    messageNode = INTERMediatorLib.createErrorMessageNode(
                                                        "SPAN", context["validation"][index].message);
                                                    changedObj.parentNode.insertBefore(
                                                        messageNode, changedObj.nextSibling);
                                                    break;
                                                case "end-of-sibling":
                                                    INTERMediatorLib.clearErrorMessage(changedObj);
                                                    messageNode = INTERMediatorLib.createErrorMessageNode(
                                                        "DIV", context["validation"][index].message);
                                                    changedObj.parentNode.appendChild(messageNode);
                                                    break;
                                                default:
                                                    alert(context["validation"][index]["message"]);
                                            }
                                            contextInfo = IMLibContextPool.getContextInfoFromId(idValue, "");
                                            // Just supporting NON-target info.
                                            changedObj.value = contextInfo.context.getValue(
                                                contextInfo.record, contextInfo.field);
                                            window.setTimeout(function () {
                                                changedObj.focus();
                                            }, 0);
                                            if (INTERMediatorOnPage.doAfterValidationFailure != null) {
                                                INTERMediatorOnPage.doAfterValidationFailure(changedObj, linkInfo[i]);
                                            }
                                            return result;
                                        } else {
                                            switch (context["validation"][index]["notify"]) {
                                                case "inline":
                                                case "end-of-sibling":
                                                    INTERMediatorLib.clearErrorMessage(changedObj);
                                                    break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (didValidate) {
                        if (INTERMediatorOnPage.doAfterValidationSucceed != null) {
                            INTERMediatorOnPage.doAfterValidationSucceed(changedObj, linkInfo[i]);
                        }
                    }
                }
                return result;
            } catch (ex) {
                if (ex == "_im_requath_request_") {
                    throw ex;
                } else {
                    INTERMediator.setErrorMessage(ex, "EXCEPTION-32: on the validation process.");
                }
                return false;
            }
        }

        function updateDB(changedObj, idValue, target) {
            var newValue, contextInfo, criteria;

            INTERMediatorOnPage.retrieveAuthInfo();
            contextInfo = IMLibContextPool.getContextInfoFromId(idValue, target);   // Just supporting NON-target info.
            newValue = IMLibElement.getValueFromIMNode(changedObj);

            if (newValue != null) {
                criteria = contextInfo.record.split('=');
                try {
                    INTERMediator_DBAdapter.db_update({
                        name: contextInfo.context.contextName,
                        conditions: [
                            {
                                field: criteria[0],
                                operator: '=',
                                value: criteria[1]
                            }
                        ],
                        dataset: [
                            {
                                field: contextInfo.field + (contextInfo.portal ? ("." + contextInfo.portal) : ""),
                                value: newValue
                            }
                        ]
                    });
                } catch (ex) {
                    if (ex == "_im_requath_request_") {
                        if (INTERMediatorOnPage.requireAuthentication
                            && !INTERMediatorOnPage.isComplementAuthData()) {
                            INTERMediatorOnPage.authChallenge = null;
                            INTERMediatorOnPage.authHashedPassword = null;
                            INTERMediatorOnPage.authenticating(function () {
                                updateDB(changedObj, idValue);
                            });
                            return;
                        }
                    } else {
                        INTERMediator.setErrorMessage(ex, "EXCEPTION-2");
                    }
                }
            }
            INTERMediatorOnPage.hideProgress();
        }
    },

    deleteButton: function (targetName, keyField, keyValue, foreignField, foreignValue, removeNodes, isConfirm) {
        var i;

        if (isConfirm) {
            if (!confirm(INTERMediatorOnPage.getMessages()[1025])) {
                return;
            }
        }
        INTERMediatorOnPage.showProgress();
        try {
            INTERMediatorOnPage.retrieveAuthInfo();
            if (foreignField != "") {
                INTERMediator_DBAdapter.db_update({
                    name: targetName,
                    conditions: [
                        {field: keyField, operator: "=", value: keyValue}
                    ],
                    dataset: [
                        {
                            field: "-delete.related",
                            operator: "=",
                            value: foreignField.replace("\:\:-recid", "") + "." + foreignValue
                        }
                    ]
                });
            } else {
                INTERMediator_DBAdapter.db_delete({
                    name: targetName,
                    conditions: [
                        {field: keyField, operator: '=', value: keyValue}
                    ]
                });
            }
        } catch (ex) {
            if (ex == "_im_requath_request_") {
                if (INTERMediatorOnPage.requireAuthentication && !INTERMediatorOnPage.isComplementAuthData()) {
                    INTERMediatorOnPage.authChallenge = null;
                    INTERMediatorOnPage.authHashedPassword = null;
                    INTERMediatorOnPage.authenticating(
                        function () {
                            IMLibUI.deleteButton(
                                targetName, keyField, keyValue, foreignField, foreignValue, removeNodes, false);
                        }
                    );
                    return;
                }
            } else {
                INTERMediator.setErrorMessage(ex, "EXCEPTION-3");
            }
        }
        for (i = 0; i < removeNodes.length; i++) {
            IMLibContextPool.removeRecordFromPool(removeNodes[i]);
        }
        IMLibElement.deleteNodes(removeNodes);
        IMLibCalc.recalculation();
        INTERMediatorOnPage.hideProgress();
        INTERMediator.flushMessage();
    },

    insertButton: function (targetName, keyValue, foreignValues, updateNodes, removeNodes, isConfirm) {
        var currentContext, recordSet, index, key, conditions, i, relationDef, targetRecord, portalField,
            targetPortalField, targetPortalValue, existRelated = false, relatedRecordSet, newRecordId,
            keyField, associatedContext, createdRecord, newRecord;

        if (isConfirm) {
            if (!confirm(INTERMediatorOnPage.getMessages()[1026])) {
                return;
            }
        }
        INTERMediatorOnPage.showProgress();
        currentContext = INTERMediatorLib.getNamedObject(INTERMediatorOnPage.getDataSources(), 'name', targetName);
        recordSet = [], relatedRecordSet = [];
        if (foreignValues != null) {
            for (index in currentContext['relation']) {
                recordSet.push({
                    field: currentContext['relation'][index]["foreign-key"],
                    value: foreignValues[currentContext['relation'][index]["join-field"]]
                });
            }
        }
        try {
            INTERMediatorOnPage.retrieveAuthInfo();

            relationDef = currentContext["relation"];
            if (relationDef) {
                for (index in relationDef) {
                    if (relationDef[index]["portal"] == true) {
                        currentContext["portal"] = true;
                    }
                }
            }
            if (currentContext["portal"] == true) {
                relatedRecordSet = [];
                for (index in currentContext["default-values"]) {
                    relatedRecordSet.push({
                        field: targetName + "::" + currentContext["default-values"][index]["field"] + ".0",
                        value: currentContext["default-values"][index]["value"]
                    });
                }

                if (relatedRecordSet.length == 0) {
                    targetPortalValue = "";

                    targetRecord = INTERMediator_DBAdapter.db_query({
                            name: targetName,
                            records: 1,
                            conditions: [
                                {
                                    field: currentContext["key"] ? currentContext["key"] : "-recid",
                                    operator: "=",
                                    value: keyValue
                                }
                            ]
                        }
                    );
                    for (portalField in targetRecord["recordset"][0][0]) {
                        if (portalField.indexOf(targetName + "::") > -1) {
                            existRelated = true;
                            targetPortalField = portalField;
                            if (portalField == targetName + "::" + recordSet[0]['field']) {
                                targetPortalValue = recordSet[0]['value'];
                                break;
                            }
                            if (portalField != targetName + "::id"
                                && portalField != targetName + "::" + recordSet[0]['field']) {
                                break;
                            }
                        }
                    }

                    if (existRelated == false) {
                        targetRecord = INTERMediator_DBAdapter.db_query({
                                name: targetName,
                                records: 0,
                                conditions: [
                                    {
                                        field: currentContext["key"] ? currentContext["key"] : "-recid",
                                        operator: "=",
                                        value: keyValue
                                    }
                                ]
                            }
                        );
                        for (portalField in targetRecord["recordset"]) {
                            if (portalField.indexOf(targetName + "::") > -1) {
                                targetPortalField = portalField;
                                if (portalField == targetName + "::" + recordSet[0]['field']) {
                                    targetPortalValue = recordSet[0]['value'];
                                    break;
                                }
                                if (portalField != targetName + "::id"
                                    && portalField != targetName + "::" + recordSet[0]['field']) {
                                    break;
                                }
                            }
                        }
                    }
                    relatedRecordSet.push({field: targetPortalField + ".0", value: targetPortalValue});
                }

                INTERMediator_DBAdapter.db_update({
                    name: targetName,
                    conditions: [
                        {
                            field: currentContext["key"] ? currentContext["key"] : "-recid",
                            operator: "=",
                            value: keyValue
                        }
                    ],
                    dataset: relatedRecordSet
                });
            } else {
                newRecord = INTERMediator_DBAdapter.db_createRecord({name: targetName, dataset: recordSet});
                newRecordId = newRecord.newKeyValue;
            }
        } catch (ex) {
            if (ex == "_im_requath_request_") {
                INTERMediatorOnPage.authChallenge = null;
                INTERMediatorOnPage.authHashedPassword = null;
                INTERMediatorOnPage.authenticating(
                    function () {
                        IMLibUI.insertButton(
                            targetName, keyValue, foreignValues, updateNodes, removeNodes, false);
                    }
                );
                INTERMediator.flushMessage();
                return;
            } else {
                INTERMediator.setErrorMessage(ex, "EXCEPTION-4");
            }
        }

//        for (key in removeNodes) {
//            removeNode = document.getElementById(removeNodes[key]);
//            try {
//                removeNode.parentNode.removeChild(removeNode);
//            } catch (ex) {
//                // Avoid an error for Safari
//            }
//        }

        keyField = currentContext["key"] ? currentContext["key"] : "-recid";
        associatedContext = IMLibContextPool.contextFromEnclosureId(updateNodes);
        if (associatedContext) {
            associatedContext.foreignValue = foreignValues;
            if (currentContext["portal"] == true && existRelated == false) {
                conditions = INTERMediator.additionalCondition;
                conditions[targetName] = {
                    field: keyField,
                    operator: "=",
                    value: keyValue
                };
                INTERMediator.additionalCondition = conditions;
            }
            createdRecord = [{}];
            createdRecord[0][keyField] = newRecordId;
            INTERMediator.constructMain(associatedContext, newRecord.recordset);
        }

        IMLibCalc.recalculation();
        INTERMediatorOnPage.hideProgress();
        INTERMediator.flushMessage();
    },

    clickPostOnlyButton: function (node) {
        var i, j, fieldData, elementInfo, comp, contextCount, selectedContext, contextInfo, validationInfo;
        var mergedValues, inputNodes, typeAttr, k, messageNode, result, alertmessage;
        var linkedNodes, namedNodes, index, hasInvalid;
        var targetNode = node.parentNode;
        while (!INTERMediatorLib.isEnclosure(targetNode, true)) {
            targetNode = targetNode.parentNode;
            if (!targetNode) {
                return;
            }
        }
        linkedNodes = []; // Collecting linked elements to this array.
        namedNodes = [];
        for (i = 0; i < targetNode.childNodes.length; i++) {
            seekLinkedElement(targetNode.childNodes[i]);
        }
        contextCount = {};
        for (i = 0; i < linkedNodes.length; i++) {
            elementInfo = INTERMediatorLib.getLinkedElementInfo(linkedNodes[i]);
            for (j = 0; j < elementInfo.length; j++) {
                comp = elementInfo[j].split(INTERMediator.separator);
                if (!contextCount[comp[j]]) {
                    contextCount[comp[j]] = 0;
                }
                contextCount[comp[j]]++;
            }
        }
        if (contextCount.length < 1) {
            return;
        }
        var maxCount = -100;
        for (var contextName in contextCount) {
            if (maxCount < contextCount[contextName]) {
                maxCount = contextCount[contextName];
                selectedContext = contextName;
                contextInfo = INTERMediatorOnPage.getContextInfo(contextName);
            }
        }

        alertmessage = '';
        fieldData = [];
        hasInvalid = false;
        for (i = 0; i < linkedNodes.length; i++) {
            elementInfo = INTERMediatorLib.getLinkedElementInfo(linkedNodes[i]);
            for (j = 0; j < elementInfo.length; j++) {
                comp = elementInfo[j].split(INTERMediator.separator);
                if (comp[0] == selectedContext) {
                    if (contextInfo.validation) {
                        for (index in contextInfo.validation) {
                            validationInfo = contextInfo.validation[index];
                            if (validationInfo && validationInfo.field == comp[1]) {
                                switch (validationInfo.notify) {
                                    case "inline":
                                    case "end-of-sibling":
                                        INTERMediatorLib.clearErrorMessage(linkedNodes[i]);
                                        break;
                                }
                            }
                        }
                        for (index in contextInfo.validation) {
                            validationInfo = contextInfo.validation[index];
                            if (validationInfo.field == comp[1]) {
                                if (validationInfo) {
                                    result = Parser.evaluate(
                                        validationInfo.rule,
                                        {"value": linkedNodes[i].value, "target": linkedNodes[i]}
                                    );
                                    if (!result) {
                                        hasInvalid = true;
                                        switch (validationInfo.notify) {
                                            case "inline":
                                                INTERMediatorLib.clearErrorMessage(linkedNodes[i]);
                                                messageNode = INTERMediatorLib.createErrorMessageNode(
                                                    "SPAN", validationInfo.message);
                                                linkedNodes[i].parentNode.insertBefore(
                                                    messageNode, linkedNodes[i].nextSibling);
                                                break;
                                            case "end-of-sibling":
                                                INTERMediatorLib.clearErrorMessage(linkedNodes[i]);
                                                messageNode = INTERMediatorLib.createErrorMessageNode(
                                                    "DIV", validationInfo.message);
                                                linkedNodes[i].parentNode.appendChild(messageNode);
                                                break;
                                            default:
                                                alertmessage += validationInfo.message + "\n";
                                        }
                                        if (INTERMediatorOnPage.doAfterValidationFailure != null) {
                                            INTERMediatorOnPage.doAfterValidationFailure(linkedNodes[i]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (INTERMediatorLib.isWidgetElement(linkedNodes[i])) {
                        fieldData.push({field: comp[1], value: linkedNodes[i]._im_getValue()});
                    } else if (linkedNodes[i].tagName == 'SELECT') {
                        fieldData.push({field: comp[1], value: linkedNodes[i].value});
                    } else if (linkedNodes[i].tagName == 'TEXTAREA') {
                        fieldData.push({field: comp[1], value: linkedNodes[i].value});
                    } else if (linkedNodes[i].tagName == 'INPUT') {
                        if (( linkedNodes[i].getAttribute('type') == 'radio' )
                            || ( linkedNodes[i].getAttribute('type') == 'checkbox' )) {
                            if (linkedNodes[i].checked) {
                                fieldData.push({field: comp[1], value: linkedNodes[i].value});
                            }
                        } else {
                            fieldData.push({field: comp[1], value: linkedNodes[i].value});
                        }
                    }
                }
            }
        }
        for (i = 0; i < namedNodes.length; i++) {
            elementInfo = INTERMediatorLib.getNamedInfo(namedNodes[i]);
            for (j = 0; j < elementInfo.length; j++) {
                comp = elementInfo[j].split(INTERMediator.separator);
                if (comp[0] == selectedContext) {
                    mergedValues = [];
                    inputNodes = namedNodes[i].getElementsByTagName('INPUT');
                    for (k = 0; k < inputNodes.length; k++) {
                        typeAttr = inputNodes[k].getAttribute('type');
                        if (typeAttr == 'radio' || typeAttr == 'checkbox') {
                            if (inputNodes[k].checked) {
                                mergedValues.push(inputNodes[k].value);
                            }
                        } else {
                            mergedValues.push(inputNodes[k].value);
                        }
                    }
                    fieldData.push({
                        field: comp[1],
                        value: mergedValues.join("\n") + "\n"
                    });
                }
            }
        }

        if (alertmessage.length > 0) {
            window.alert(alertmessage);
            return;
        }
        if (hasInvalid) {
            return;
        }

        if (INTERMediatorOnPage.processingBeforePostOnlyContext) {
            if (!INTERMediatorOnPage.processingBeforePostOnlyContext(targetNode)) {
                return;
            }
        }

        contextInfo = INTERMediatorLib.getNamedObject(INTERMediatorOnPage.getDataSources(), 'name', selectedContext);
        INTERMediator_DBAdapter.db_createRecordWithAuth(
            {name: selectedContext, dataset: fieldData},
            function (returnValue) {
                var newNode, parentOfTarget, targetNode = node, thisContext = contextInfo, isSetMsg = false;
                INTERMediator.flushMessage();
                if (INTERMediatorOnPage.processingAfterPostOnlyContext) {
                    INTERMediatorOnPage.processingAfterPostOnlyContext(targetNode, returnValue);
                }
                if (thisContext['post-dismiss-message']) {
                    parentOfTarget = targetNode.parentNode;
                    parentOfTarget.removeChild(targetNode);
                    newNode = document.createElement('SPAN');
                    INTERMediatorLib.setClassAttributeToNode(newNode, 'IM_POSTMESSAGE');
                    newNode.appendChild(document.createTextNode(thisContext['post-dismiss-message']));
                    parentOfTarget.appendChild(newNode);
                    isSetMsg = true;
                }
                if (thisContext['post-reconstruct']) {
                    setTimeout(function () {
                        INTERMediator.construct(true);
                    }, isSetMsg ? INTERMediator.waitSecondsAfterPostMessage * 1000 : 0);
                }
                if (thisContext['post-move-url']) {
                    setTimeout(function () {
                        location.href = thisContext['post-move-url'];
                    }, isSetMsg ? INTERMediator.waitSecondsAfterPostMessage * 1000 : 0);
                }
            });

        function seekLinkedElement(node) {
            var children, i;
            if (node.nodeType === 1) {
                if (INTERMediatorLib.isLinkedElement(node)) {
                    linkedNodes.push(node);
                } else if (INTERMediatorLib.isWidgetElement(node)) {
                    linkedNodes.push(node);
                } else if (INTERMediatorLib.isNamedElement(node)) {
                    namedNodes.push(node);
                } else {
                    children = node.childNodes;
                    for (i = 0; i < children.length; i++) {
                        seekLinkedElement(children[i]);
                    }
                }
            }
        }
    },

    eventUpdateHandler: function (contextName) {
        IMLibLocalContext.updateAll();
        var context = IMLibContextPool.getContextFromName(contextName);
        INTERMediator.constructMain(context[0]);
    },

    eventAddOrderHandler: function (e) {    // e is mouse event
        var targetKey, targetSplit, key, itemSplit, extValue;
        if (e.target) {
            targetKey = e.target.getAttribute("data-im");
        } else {
            targetKey = e.srcElement.getAttribute("data-im");
        }
        targetSplit = targetKey.split(":");
        if (targetSplit[0] != "_@addorder" || targetSplit.length < 3) {
            return;
        }
        for (key in IMLibLocalContext.store) {
            itemSplit = key.split(":");
            if (itemSplit.length > 3 && itemSplit[0] == "valueofaddorder" && itemSplit[1] == targetSplit[1]) {
                extValue = IMLibLocalContext.getValue(key);
                if (extValue) {
                    IMLibLocalContext.store[key]++;
                }
            }
        }
        IMLibLocalContext.setValue("valueof" + targetKey.substring(2), 1);
        IMLibUI.eventUpdateHandler(targetSplit[1]);
    }
}/*
 http://www.webtoolkit.info/javascript-sha1.html on Feb 5, 2012
 */
/**
 *
 *  Secure Hash Algorithm (SHA1)
 *  http://www.webtoolkit.info/
 *
 **/

function SHA1(msg) {

    function rotate_left(n, s) {
        var t4 = ( n << s ) | (n >>> (32 - s));
        return t4;
    }

    ;

    function lsb_hex(val) {
        var str = "";
        var i;
        var vh;
        var vl;

        for (i = 0; i <= 6; i += 2) {
            vh = (val >>> (i * 4 + 4)) & 0x0f;
            vl = (val >>> (i * 4)) & 0x0f;
            str += vh.toString(16) + vl.toString(16);
        }
        return str;
    }

    ;

    function cvt_hex(val) {
        var str = "";
        var i;
        var v;

        for (i = 7; i >= 0; i--) {
            v = (val >>> (i * 4)) & 0x0f;
            str += v.toString(16);
        }
        return str;
    }

    ;


    function Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    }

    ;

    var blockstart;
    var i, j;
    var W = new Array(80);
    var H0 = 0x67452301;
    var H1 = 0xEFCDAB89;
    var H2 = 0x98BADCFE;
    var H3 = 0x10325476;
    var H4 = 0xC3D2E1F0;
    var A, B, C, D, E;
    var temp;

    msg = Utf8Encode(msg);

    var msg_len = msg.length;

    var word_array = new Array();
    for (i = 0; i < msg_len - 3; i += 4) {
        j = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 |
            msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3);
        word_array.push(j);
    }

    switch (msg_len % 4) {
        case 0:
            i = 0x080000000;
            break;
        case 1:
            i = msg.charCodeAt(msg_len - 1) << 24 | 0x0800000;
            break;

        case 2:
            i = msg.charCodeAt(msg_len - 2) << 24 | msg.charCodeAt(msg_len - 1) << 16 | 0x08000;
            break;

        case 3:
            i = msg.charCodeAt(msg_len - 3) << 24 | msg.charCodeAt(msg_len - 2) << 16 | msg.charCodeAt(msg_len - 1) << 8 | 0x80;
            break;
    }

    word_array.push(i);

    while ((word_array.length % 16) != 14) word_array.push(0);

    word_array.push(msg_len >>> 29);
    word_array.push((msg_len << 3) & 0x0ffffffff);


    for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {

        for (i = 0; i < 16; i++) W[i] = word_array[blockstart + i];
        for (i = 16; i <= 79; i++) W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

        A = H0;
        B = H1;
        C = H2;
        D = H3;
        E = H4;

        for (i = 0; i <= 19; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        for (i = 20; i <= 39; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        for (i = 40; i <= 59; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        for (i = 60; i <= 79; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        H0 = (H0 + A) & 0x0ffffffff;
        H1 = (H1 + B) & 0x0ffffffff;
        H2 = (H2 + C) & 0x0ffffffff;
        H3 = (H3 + D) & 0x0ffffffff;
        H4 = (H4 + E) & 0x0ffffffff;

    }

    var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

    return temp.toLowerCase();

}
/* A JavaScript implementation of the SHA family of hashes, as defined in FIPS
 * PUB 180-2 as well as the corresponding HMAC implementation as defined in
 * FIPS PUB 198a
 *
 * Version 1.31 Copyright Brian Turek 2008-2012
 * Distributed under the BSD License
 * See http://caligatio.github.com/jsSHA/ for more information
 *
 * Several functions taken from Paul Johnson
 */
(function(){var charSize=8,b64pad="",hexCase=0,str2binb=function(a){var b=[],mask=(1<<charSize)-1,length=a.length*charSize,i;for(i=0;i<length;i+=charSize){b[i>>5]|=(a.charCodeAt(i/charSize)&mask)<<(32-charSize-(i%32))}return b},hex2binb=function(a){var b=[],length=a.length,i,num;for(i=0;i<length;i+=2){num=parseInt(a.substr(i,2),16);if(!isNaN(num)){b[i>>3]|=num<<(24-(4*(i%8)))}else{return"INVALID HEX STRING"}}return b},binb2hex=function(a){var b=(hexCase)?"0123456789ABCDEF":"0123456789abcdef",str="",length=a.length*4,i,srcByte;for(i=0;i<length;i+=1){srcByte=a[i>>2]>>((3-(i%4))*8);str+=b.charAt((srcByte>>4)&0xF)+b.charAt(srcByte&0xF)}return str},binb2b64=function(a){var b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"+"0123456789+/",str="",length=a.length*4,i,j,triplet;for(i=0;i<length;i+=3){triplet=(((a[i>>2]>>8*(3-i%4))&0xFF)<<16)|(((a[i+1>>2]>>8*(3-(i+1)%4))&0xFF)<<8)|((a[i+2>>2]>>8*(3-(i+2)%4))&0xFF);for(j=0;j<4;j+=1){if(i*8+j*6<=a.length*32){str+=b.charAt((triplet>>6*(3-j))&0x3F)}else{str+=b64pad}}}return str},rotr=function(x,n){return(x>>>n)|(x<<(32-n))},shr=function(x,n){return x>>>n},ch=function(x,y,z){return(x&y)^(~x&z)},maj=function(x,y,z){return(x&y)^(x&z)^(y&z)},sigma0=function(x){return rotr(x,2)^rotr(x,13)^rotr(x,22)},sigma1=function(x){return rotr(x,6)^rotr(x,11)^rotr(x,25)},gamma0=function(x){return rotr(x,7)^rotr(x,18)^shr(x,3)},gamma1=function(x){return rotr(x,17)^rotr(x,19)^shr(x,10)},safeAdd_2=function(x,y){var a=(x&0xFFFF)+(y&0xFFFF),msw=(x>>>16)+(y>>>16)+(a>>>16);return((msw&0xFFFF)<<16)|(a&0xFFFF)},safeAdd_4=function(a,b,c,d){var e=(a&0xFFFF)+(b&0xFFFF)+(c&0xFFFF)+(d&0xFFFF),msw=(a>>>16)+(b>>>16)+(c>>>16)+(d>>>16)+(e>>>16);return((msw&0xFFFF)<<16)|(e&0xFFFF)},safeAdd_5=function(a,b,c,d,e){var f=(a&0xFFFF)+(b&0xFFFF)+(c&0xFFFF)+(d&0xFFFF)+(e&0xFFFF),msw=(a>>>16)+(b>>>16)+(c>>>16)+(d>>>16)+(e>>>16)+(f>>>16);return((msw&0xFFFF)<<16)|(f&0xFFFF)},coreSHA2=function(j,k,l){var a,b,c,d,e,f,g,h,T1,T2,H,lengthPosition,i,t,K,W=[],appendedMessageLength;if(l==="SHA-224"||l==="SHA-256"){lengthPosition=(((k+65)>>9)<<4)+15;K=[0x428A2F98,0x71374491,0xB5C0FBCF,0xE9B5DBA5,0x3956C25B,0x59F111F1,0x923F82A4,0xAB1C5ED5,0xD807AA98,0x12835B01,0x243185BE,0x550C7DC3,0x72BE5D74,0x80DEB1FE,0x9BDC06A7,0xC19BF174,0xE49B69C1,0xEFBE4786,0x0FC19DC6,0x240CA1CC,0x2DE92C6F,0x4A7484AA,0x5CB0A9DC,0x76F988DA,0x983E5152,0xA831C66D,0xB00327C8,0xBF597FC7,0xC6E00BF3,0xD5A79147,0x06CA6351,0x14292967,0x27B70A85,0x2E1B2138,0x4D2C6DFC,0x53380D13,0x650A7354,0x766A0ABB,0x81C2C92E,0x92722C85,0xA2BFE8A1,0xA81A664B,0xC24B8B70,0xC76C51A3,0xD192E819,0xD6990624,0xF40E3585,0x106AA070,0x19A4C116,0x1E376C08,0x2748774C,0x34B0BCB5,0x391C0CB3,0x4ED8AA4A,0x5B9CCA4F,0x682E6FF3,0x748F82EE,0x78A5636F,0x84C87814,0x8CC70208,0x90BEFFFA,0xA4506CEB,0xBEF9A3F7,0xC67178F2];if(l==="SHA-224"){H=[0xc1059ed8,0x367cd507,0x3070dd17,0xf70e5939,0xffc00b31,0x68581511,0x64f98fa7,0xbefa4fa4]}else{H=[0x6A09E667,0xBB67AE85,0x3C6EF372,0xA54FF53A,0x510E527F,0x9B05688C,0x1F83D9AB,0x5BE0CD19]}}j[k>>5]|=0x80<<(24-k%32);j[lengthPosition]=k;appendedMessageLength=j.length;for(i=0;i<appendedMessageLength;i+=16){a=H[0];b=H[1];c=H[2];d=H[3];e=H[4];f=H[5];g=H[6];h=H[7];for(t=0;t<64;t+=1){if(t<16){W[t]=j[t+i]}else{W[t]=safeAdd_4(gamma1(W[t-2]),W[t-7],gamma0(W[t-15]),W[t-16])}T1=safeAdd_5(h,sigma1(e),ch(e,f,g),K[t],W[t]);T2=safeAdd_2(sigma0(a),maj(a,b,c));h=g;g=f;f=e;e=safeAdd_2(d,T1);d=c;c=b;b=a;a=safeAdd_2(T1,T2)}H[0]=safeAdd_2(a,H[0]);H[1]=safeAdd_2(b,H[1]);H[2]=safeAdd_2(c,H[2]);H[3]=safeAdd_2(d,H[3]);H[4]=safeAdd_2(e,H[4]);H[5]=safeAdd_2(f,H[5]);H[6]=safeAdd_2(g,H[6]);H[7]=safeAdd_2(h,H[7])}switch(l){case"SHA-224":return[H[0],H[1],H[2],H[3],H[4],H[5],H[6]];case"SHA-256":return H;default:return[]}},jsSHA=function(a,b){this.sha224=null;this.sha256=null;this.strBinLen=null;this.strToHash=null;if("HEX"===b){if(0!==(a.length%2)){return"TEXT MUST BE IN BYTE INCREMENTS"}this.strBinLen=a.length*4;this.strToHash=hex2binb(a)}else if(("ASCII"===b)||('undefined'===typeof(b))){this.strBinLen=a.length*charSize;this.strToHash=str2binb(a)}else{return"UNKNOWN TEXT INPUT TYPE"}};jsSHA.prototype={getHash:function(a,b){var c=null,message=this.strToHash.slice();switch(b){case"HEX":c=binb2hex;break;case"B64":c=binb2b64;break;default:return"FORMAT NOT RECOGNIZED"}switch(a){case"SHA-224":if(null===this.sha224){this.sha224=coreSHA2(message,this.strBinLen,a)}return c(this.sha224);case"SHA-256":if(null===this.sha256){this.sha256=coreSHA2(message,this.strBinLen,a)}return c(this.sha256);default:return"HASH NOT RECOGNIZED"}},getHMAC:function(a,b,c,d){var e,keyToUse,i,retVal,keyBinLen,hashBitSize,keyWithIPad=[],keyWithOPad=[];switch(d){case"HEX":e=binb2hex;break;case"B64":e=binb2b64;break;default:return"FORMAT NOT RECOGNIZED"}switch(c){case"SHA-224":hashBitSize=224;break;case"SHA-256":hashBitSize=256;break;default:return"HASH NOT RECOGNIZED"}if("HEX"===b){if(0!==(a.length%2)){return"KEY MUST BE IN BYTE INCREMENTS"}keyToUse=hex2binb(a);keyBinLen=a.length*4}else if("ASCII"===b){keyToUse=str2binb(a);keyBinLen=a.length*charSize}else{return"UNKNOWN KEY INPUT TYPE"}if(64<(keyBinLen/8)){keyToUse=coreSHA2(keyToUse,keyBinLen,c);keyToUse[15]&=0xFFFFFF00}else if(64>(keyBinLen/8)){keyToUse[15]&=0xFFFFFF00}for(i=0;i<=15;i+=1){keyWithIPad[i]=keyToUse[i]^0x36363636;keyWithOPad[i]=keyToUse[i]^0x5C5C5C5C}retVal=coreSHA2(keyWithIPad.concat(this.strToHash),512+this.strBinLen,c);retVal=coreSHA2(keyWithOPad.concat(retVal),512+hashBitSize,c);return(e(retVal))}};window.jsSHA=jsSHA}());
/*
 The MIT License

 Copyright (c)2009 Андрій Овчаренко (Andrey Ovcharenko)

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */
// bi2php v0.1.113.alfa from http://code.google.com/p/bi2php/
// Base on dave@ohdave.com


// BigInt, a suite of routines for performing multiple-precision arithmetic in
// JavaScript.
//
// Copyright 1998-2005 David Shapiro.
//
// You may use, re-use, abuse,
// copy, and modify this code to your liking, but please keep this header.
// Thanks!
//
// Dave Shapiro
// dave@ohdave.com

// IMPORTANT THING: Be sure to set maxDigits according to your precision
// needs. Use the setMaxDigits() function to do this. See comments below.
//
// Tweaked by Ian Bunning
// Alterations:
// Fix bug in function biFromHex(s) to allow
// parsing of strings of length != 0 (mod 4)

// Changes made by Dave Shapiro as of 12/30/2004:
//
// The BigInt() constructor doesn't take a string anymore. If you want to
// create a BigInt from a string, use biFromDecimal() for base-10
// representations, biFromHex() for base-16 representations, or
// biFromString() for base-2-to-36 representations.
//
// biFromArray() has been removed. Use biCopy() instead, passing a BigInt
// instead of an array.
//
// The BigInt() constructor now only constructs a zeroed-out array.
// Alternatively, if you pass <true>, it won't construct any array. See the
// biCopy() method for an example of this.
//
// Be sure to set maxDigits depending on your precision needs. The default
// zeroed-out array ZERO_ARRAY is constructed inside the setMaxDigits()
// function. So use this function to set the variable. DON'T JUST SET THE
// VALUE. USE THE FUNCTION.
//
// ZERO_ARRAY exists to hopefully speed up construction of BigInts(). By
// precalculating the zero array, we can just use slice(0) to make copies of
// it. Presumably this calls faster native code, as opposed to setting the
// elements one at a time. I have not done any timing tests to verify this
// claim.

var biRadixBase = 2;
var biRadixBits = 16;
biRadixBits = biRadixBits - biRadixBits % 4;
var bitsPerDigit = biRadixBits;
var biRadix = 1 << biRadixBits; // = 2^16 = 65536
var biHalfRadix = biRadix >>> 1;
var biRadixSquared = biRadix * biRadix;
var maxDigitVal = biRadix - 1;
var maxInteger = 4294967295;
var biHexPerDigit = biRadixBits / 4;
var bigZero = biFromNumber(0);
var bigOne = biFromNumber(1);

// The maximum number of digits in base 10 you can convert to an
// integer without JavaScript throwing up on you.
var dpl10 = 9;
// lr10 = 10 ^ dpl10
var lr10 = biFromNumber(1000000000);

function BigInt(i) {
    this.isNeg = false;
    if (i == -1)
        return;
    if (i) {
        this.digits = new Array(i);
        while (i)
            this.digits[--i] = 0;
    } else
        this.digits = [0];
}

BigInt.prototype.isZero = function () {
    return this.digits[0] == 0 && biNormalize(this).digits.length == 1;
}
BigInt.prototype.isOne = function () {
    return this.digits[0] == 1 && !this.isNeg && biNormalize(this).digits.length == 1;
}
BigInt.prototype.isEqual = function (bis) {
    if (this.isNeg != bis.isNeg)
        return false;
    if (this.digits.length != bis.digits.length)
        return false;
    for (var i = this.digits.length - 1; i > -1; i--)
        if (this.digits[i] != bis.digits[i])
            return false;
    return true;
}
BigInt.prototype.blankZero = function () {
    this.digits.length = 1;
    this.digits[0] = 0;
}
BigInt.prototype.blankOne = function () {
    this.digits.length = 1;
    this.digits[0] = 1;
}
BigInt.prototype.blankEmpty = function () {
    this.digits.length = 0;
}

function biCopy(bi) {
    var result = new BigInt(-1);
    result.digits = bi.digits.slice(0);
    result.isNeg = bi.isNeg;
    return result;
}

function biAbs(bi) {
    var result = new BigInt(-1);
    result.digits = bi.digits.slice(0);
    result.isNeg = false;
    return result;
}

function biMinus(bi) {
    var result = new BigInt(-1);
    result.digits = bi.digits.slice(0);
    result.isNeg = !bi.isNeg;
    return result;
}

function biFromNumber(i) {
    if (Math.abs(i) > maxInteger)
        return (biFromFloat(i));
    var result = new BigInt();
    if (result.isNeg = i < 0)
        i = -i;
    var j = 0;
    while (i > 0) {
        result.digits[j++] = i & maxDigitVal;
        i >>>= biRadixBits;
    }
    return result;
}

function biFromFloat(i) {
    var result = new BigInt();
    if (result.isNeg = i < 0)
        i = -i;
    var j = 0;
    while (i > 0) {
        var c = Math.floor(i / biRadix);
        result.digits[j++] = i - c * biRadix;
        i = c;
    }
    return result;
}

function biFromString(s, radix) {
    if (radix == 16)
        return biFromHex(s);
    var isNeg = s.charAt(0) == '-';
    var first = (isNeg ? 1 : 0) - 1;
    var result = new BigInt();
    var place = biCopy(bigOne);
    for (var i = s.length - 1; i > first; i--) {
        var c = s.charCodeAt(i);
        var digit = charToHex(c);
        var biDigit = biMultiplyDigit(place, digit);
        result = biAdd(result, biDigit);
        place = biMultiplyDigit(place, radix);
    }
    result.isNeg = isNeg;
    return biNormalize(result);
}

function biFromDecimal(s) {
    return biFromString(s, 10);
}

function biFromHex(s) {
    var result = new BigInt();
    if (s.charAt(0) == '-') {
        result.isNeg = true;
        s = substr(s, 1);
    } else {
        result.isNeg = false;
    }
    var sl = s.length;
    for (var i = sl, j = 0; i > 0; i -= biHexPerDigit, j++)
        result.digits[j] = hexToDigit(s.substr(Math.max(i - biHexPerDigit, 0), Math.min(i, biHexPerDigit)));
    return biNormalize(result);
}

function reverseStr(s) {
    var result = "";
    for (var i = s.length - 1; i > -1; i--)
        result += s.charAt(i);
    return result;
}

var hexatrigesimalToChar = new Array(
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z'
);

function biToString(x, radix) {
    // 2 <= radix <= 36
    if (radix == 16)
        return biToHex(x);
    var b = biFromNumber(radix);
    var qr = biDivideModulo(biAbs(x), b);
    var result = hexatrigesimalToChar[qr[1].digits[0]];
    while (!qr[0].isZero()) {
        qr = biDivideModulo(qr[0], b);
        result += hexatrigesimalToChar[qr[1].digits[0]];
    }
    return (x.isNeg ? "-" : "") + reverseStr(result);
}

function biToDecimal(x) {
    return biToString(x, 10);
}

var hexToChar = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'a', 'b', 'c', 'd', 'e', 'f');

function digitToHex(n) {
    var mask = 0xf;
    var result = "";
    for (var i = 0; i < biHexPerDigit; i++) {
        result += hexToChar[n & mask];
        n >>>= 4;
    }
    return reverseStr(result);
}

function digitToHexTrunk(n) {
    if (n == 0)
        return "0";
    var mask = 0xf;
    var result = "";
    for (var i = 0; i < biHexPerDigit && n > 0; i++) {
        result += hexToChar[n & mask];
        n >>>= 4;
    }
    return reverseStr(result);
}

function biToHex(x) {
    var result = x.isNeg ? "-" : "";
    var i = biHighIndex(x);
    result += digitToHexTrunk(x.digits[i--]);
    while (i > -1)
        result += digitToHex(x.digits[i--]);
    return result;
}

function biToNumber(x) {
    var result = 0;
    var faktor = 1;
    var k = biHighIndex(x) + 1;
    for (var i = 0; i < k; i++) {
        result += x.digits[i] * faktor;
        faktor *= biRadix;
    }
    return x.isNeg ? -result : result;
}

function charToHex(c) {
    var ZERO = 48;
    var NINE = ZERO + 9;
    var littleA = 97;
    var littleZ = littleA + 25;
    var bigA = 65;
    var bigZ = 65 + 25;
    var result;
    if (c >= ZERO && c <= NINE)
        result = c - ZERO;
    else if (c >= bigA && c <= bigZ)
        result = 10 + c - bigA;
    else if (c >= littleA && c <= littleZ)
        result = 10 + c - littleA;
    else
        result = 0;
    return result;
}

function hexToDigit(s) {
    var result = 0;
    var sl = Math.min(s.length, biHexPerDigit);
    for (var i = 0; i < sl; i++) {
        result <<= 4;
        result |= charToHex(s.charCodeAt(i))
    }
    return result;
}

function biDump(b) {
    return (b.isNeg ? "minus " : "plus ") + b.digits.join(" ");
}

function biNormalize(x) {
    var k = x.digits.length;
    if (x.digits[k - 1] != 0 && !isNaN(x.digits[k - 1]))
        return x;
    for (var i = k - 1; i > 0; i--)
        if (x.digits[i] == 0 || isNaN(x.digits[i])) // todo
            x.digits.pop();
        else
            return x;
    if (x.digits.length == 1 && x.digits[0] == 0)
        x.isNeg = false;
    if (isNaN(x.digits[0]))
        throw new Error("Undefined BigInt: " + biDump(x));
    return x;
}

function biHighIndex(x) {
    biNormalize(x);
    return x.digits.length - 1;
}

function biNumBits(x) {
    var n = biHighIndex(x);
    var d = x.digits[n];
    var m = (n + 1) * bitsPerDigit;
    var result;
    for (result = m; result > m - bitsPerDigit; result--) {
        if ((d & biHalfRadix) != 0)
            break;
        d <<= 1;
    }
    return result;
}

function biCompareAbs(x, y) {
    var nx = biHighIndex(x);
    var ny = biHighIndex(y);
    if (nx != ny)
        return 1 - 2 * ((nx < ny) ? 1 : 0);
    for (var i = x.digits.length - 1; i > -1; i--)
        if (x.digits[i] != y.digits[i])
            return 1 - 2 * ((x.digits[i] < y.digits[i]) ? 1 : 0);
    return 0;
}

function biCompare(x, y) {
    if (x.isNeg != y.isNeg)
        return 1 - 2 * (x.isNeg ? 1 : 0);
    return x.isNeg ? -biCompareAbs(x, y) : biCompareAbs(x, y);
}

function biAddNatural(x, y) {
    var nx = biHighIndex(x) + 1;
    var ny = biHighIndex(y) + 1;
    var i = 0;
    var c = 0;
    if (nx > ny) {
        var result = biAbs(x);
        var source = y;
        var k = ny;
    } else {
        var result = biAbs(y);
        var source = x;
        var k = nx;
    }
    while (i < k) {
        result.digits[i] += source.digits[i] + c;
        if (result.digits[i] < biRadix) {
            c = 0;
        } else {
            result.digits[i] &= maxDigitVal;
            c = 1;
        }
        i++;
    }
    while (c > 0) {
        result.digits[i] = (result.digits[i] || 0) + c;
        if (result.digits[i] < biRadix) {
            c = 0;
        } else {
            result.digits[i] &= maxDigitVal;
            c = 1;
        }
        i++;
    }
    return result;
}

function biSubtractNatural(x, y) {
// require x >= y
    var nx = biHighIndex(x) + 1;
    var ny = biHighIndex(y) + 1;
    var result = biAbs(x);
    var resultdigits = result.digits;
    var xdigits = x.digits;
    var ydigits = y.digits;
    var c = 0;
    for (var i = 0; i < ny; i++) {
        if (xdigits[i] >= ydigits[i] - c) {
            resultdigits[i] = xdigits[i] - ydigits[i] + c;
            c = 0;
        } else {
            resultdigits[i] = biRadix + xdigits[i] - ydigits[i] + c;
            c = -1;
        }
    }
    while (c < 0 && i < nx) {
        if (xdigits[i] >= -c) {
            resultdigits[i] = xdigits[i] + c;
            c = 0;
        } else {
            resultdigits[i] = biRadix + xdigits[i] + c;
            c = -1;
        }
        i++;
    }
    return biNormalize(result);
}

function biAdd(x, y) {
    var result;
    if (!x.isNeg && !y.isNeg)
        return biAddNatural(x, y);
    if (x.isNeg && y.isNeg) {
        result = biAddNatural(x, y);
        result.isNeg = true;
        return result;
    }
    var x_y = biCompareAbs(x, y);
    if (x_y == 0)
        return biFromNumber(0);
    if (x_y > 0) {
        result = biSubtractNatural(x, y);
        result.isNeg = x.isNeg;
    }
    if (x_y < 0) {
        result = biSubtractNatural(y, x);
        result.isNeg = y.isNeg;
    }
    return result;
}

function biSubtract(x, y) {
    var result;
    if (!x.isNeg && y.isNeg)
        return biAddNatural(x, y);
    if (x.isNeg && !y.isNeg) {
        result = biAddNatural(x, y);
        result.isNeg = true;
        return result;
    }
    var x_y = biCompareAbs(x, y);
    if (x_y == 0)
        return biCopy(bigZero);
    if (x_y > 0) {
        result = biSubtractNatural(x, y);
        result.isNeg = x.isNeg;
    }
    if (x_y < 0) {
        result = biSubtractNatural(y, x);
        result.isNeg = !x.isNeg;
    }
    return result;
}

function biMultiply(x, y) {
    var c, u, uv, k;
    var n = biHighIndex(x) + 1;
    var t = biHighIndex(y) + 1;
    if (n == 1 && x.digits[0] == 0 || t == 1 && y.digits[0] == 0)
        return new BigInt();
    var result = new BigInt(n + t);
    var resultdigits = result.digits;
    var xdigits = x.digits;
    var ydigits = y.digits;
    for (var i = 0; i < t; i++) {
        c = 0;
        k = i;
        for (var j = 0; j < n; j++, k++) {
            uv = resultdigits[k] + xdigits[j] * ydigits[i] + c;
            resultdigits[k] = uv & maxDigitVal;
            c = uv >>> biRadixBits;
        }
        resultdigits[i + n] = c;
    }
    result.isNeg = x.isNeg != y.isNeg;
    return biNormalize(result);
}

function biMultiplyDigit(x, y) {
    var n = biHighIndex(x) + 1;
    var result = new BigInt(n);
    var c = 0;
    for (var j = 0; j < n; j++) {
        var uv = result.digits[j] + x.digits[j] * y + c;
        result.digits[j] = uv & maxDigitVal;
        c = uv >>> biRadixBits;
    }
    result.digits[n] = c;
    return result;
}

function arrayCopy(src, srcStart, dest, destStart, count) {
    if (srcStart >= src.length) {
        if (dest.length == 0)
            dest[0] = 0;
        return;
    }
    for (var i = 0; i < destStart; i++)
        // if !dest[i] ???//todo
        dest[i] = 0;
    var m = Math.min(srcStart + count, src.length);
    for (var i = srcStart, j = destStart; i < m; i++, j++)
        dest[j] = src[i];
}

function biShiftLeft(x, n) {
    var digitCount = Math.floor(n / bitsPerDigit);
    var result = new BigInt();
    arrayCopy(x.digits, 0, result.digits, digitCount, x.digits.length);
    var bits = n % bitsPerDigit;
    var rightBits = bitsPerDigit - bits;
    result.digits[result.digits.length] = result.digits[result.digits.length] >>> rightBits;
    for (var i = result.digits.length - 1; i > 0; i--)
        result.digits[i] = ((result.digits[i] << bits) & maxDigitVal) | (result.digits[i - 1] >>> rightBits);
    result.digits[0] = (result.digits[0] << bits) & maxDigitVal;
    result.isNeg = x.isNeg;
    return biNormalize(result);
}

function biShiftRight(x, n) {
    var digitCount = Math.floor(n / bitsPerDigit);
    var result = new BigInt();
    arrayCopy(x.digits, digitCount, result.digits, 0, x.digits.length - digitCount);
    var bits = n % bitsPerDigit;
    var leftBits = bitsPerDigit - bits;
    for (var i = 0; i < result.digits.length - 1; i++)
        result.digits[i] = (result.digits[i] >>> bits) | ((result.digits[i + 1] << leftBits) & maxDigitVal);
    result.digits[result.digits.length - 1] >>>= bits;
    result.isNeg = x.isNeg;
    return biNormalize(result);
}

function biMultiplyByRadixPower(x, n) {
    var result = new BigInt();
    arrayCopy(x.digits, 0, result.digits, n, x.digits.length);
    return result;
}

function biDivideByRadixPower(x, n) {
    var result = new BigInt();
    arrayCopy(x.digits, n, result.digits, 0, x.digits.length - n);
    return result;
}

function biModuloByRadixPower(x, n) {
    var result = new BigInt();
    arrayCopy(x.digits, 0, result.digits, 0, n);
    return result;
}

function biMultiplyModByRadixPower(x, y, p) {
    var c, u, uv, k;
    var n = biHighIndex(x) + 1;
    var t = biHighIndex(y) + 1;
    if (n == 1 && x.digits[0] == 0 || t == 1 && y.digits[0] == 0)
        return new BigInt();
    var result = new BigInt(p);
    var resultdigits = result.digits;
    var xdigits = x.digits;
    var ydigits = y.digits;
    for (var i = 0; i < t && i < p; i++) {
        c = 0;
        k = i;
        for (j = 0; j < n && k < p; j++, k++) {
            uv = resultdigits[k] + xdigits[j] * ydigits[i] + c;
            resultdigits[k] = uv & maxDigitVal;
            c = uv >>> biRadixBits;
        }
        resultdigits[i + n] = c;
    }
    result = biModuloByRadixPower(result, p)
    result.isNeg = x.isNeg != y.isNeg;
    return biNormalize(result);
}

function biDivideModuloNatural(x, y) {
    var j0, j1, jm, qm, flag;
    var nx = biHighIndex(x);
    var ny = biHighIndex(y);
    var q = new BigInt(-1);
    q.digits = [];
    var r = new BigInt();
    //r.digits = [0]
    for (var i = nx; i > -1; i--) {
        r.digits.unshift(x.digits[i])
        flag = biCompareAbs(y, r);
        if (flag > 0) {
            q.digits.unshift(0);
            continue;
        }
        if (flag == 0) {
            q.digits.unshift(1);
            r.blankZero();
            continue;
        }
        var nr = biHighIndex(r);
        if (nr == ny)
            jm = Math.floor((r.digits[nr] * biRadix + (r.digits[nr - 1] || 0)) /
                (y.digits[ny] * biRadix + (y.digits[ny - 1] || 0) + 1));
        else
            jm = Math.floor((r.digits[nr] * biRadixSquared + (r.digits[nr - 1] || 0) * biRadix + (r.digits[nr - 2] || 0)) /
                (y.digits[ny] * biRadix + (y.digits[ny - 1] || 0) + 1));
        jm = Math.max(0, Math.min(jm, maxDigitVal))
        qm = biMultiplyDigit(y, jm);
        r = biSubtract(r, qm);
        if (r.isNeg)
            while (r.isNeg) {
                r = biAdd(r, y);
                jm--
            }
        else
            while (biCompare(r, y) >= 0) {
                r = biSubtract(r, y);
                jm++;
            }
        q.digits.unshift(jm);
    }
    return [biNormalize(q), biNormalize(r)];
}

function biDivideModulo(x, y) {
    var q, r;
    if (biCompareAbs(x, y) < 0) {
        // |x| < |y|
        if ((x.isNeg && y.isNeg) || (!x.isNeg && !y.isNeg)) {
            q = biFromNumber(0);
            r = biCopy(x);
        } else {
            q = biFromNumber(-1);
            r = biAdd(y, x);
        }
        return [q, r];
    }
    var origXIsNeg = x.isNeg;
    var origYIsNeg = y.isNeg;
    var result = biDivideModuloNatural(biAbs(x), biAbs(y));
    q = result[0];
    r = result[1];
    if (!origXIsNeg && !origYIsNeg) {
        return [q, r];
    } else if (origXIsNeg && origYIsNeg) {
        r.isNeg = true;
        return [q, r];
    } else {
        q.isNeg = true;
        q = biSubtract(q, bigOne);
        r.isNeg = origXIsNeg;
        r = biAdd(r, y);
    }
    if (r.digits[0] == 0 && biHighIndex(r) == 0)
        r.isNeg = false;
    return [q, r];
}

function biDivide(x, y) {
    return biDivideModulo(x, y)[0];
}

function biModulo(x, y) {
    return biDivideModulo(x, y)[1];
}

function biMultiplyMod(x, y, m) {
    return biModulo(biMultiply(x, y), m);
}

function biPow(x, y) {
    var result = biCopy(bigOne);
    var a = x;
    while (true) {
        if ((y & 1) != 0)
            result = biMultiply(result, a);
        y >>>= 1;
        if (y == 0)
            break;
        a = biMultiply(a, a);
    }
    return result;
}

function biPowMod(x, y, m) {
    var result = biCopy(bigOne);
    var a = x;
    var k = y;
    while (true) {
        if ((k.digits[0] & 1) != 0)
            result = biMultiplyMod(result, a, m);
        k = biShiftRight(k, 1);
        if (k.digits[0] == 0 && biHighIndex(k) == 0)
            break;
        a = biMultiplyMod(a, a, m);
    }
    return result;
}

function biRandom(n) {
    var result = new BigInt();
    while (n--)
        result.digits[n] = Math.floor(Math.random() * maxDigitVal);
    return result;
}
/*
 The MIT License

 Copyright (c)2009 Андрій Овчаренко (Andrey Ovcharenko)

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */
// bi2php v0.1.113.alfa from http://code.google.com/p/bi2php/

function biModularInverse(e, m) {
    e = biModulo(e, m);
    var result = biExtendedEuclid(m, e);
    if (!result[2].isOne())
        return null;
    return biModulo(result[1], m);
}

function biExtendedEuclid(a, b) {
    if (biCompare(a, b) >= 0)
        return biExtendedEuclidNatural(a, b);
    var result = biExtendedEuclidNatural(b, a);
    return [ result[1], result[0], result[2] ];
}

function biExtendedEuclidNatural(a, b) {
// calculates a * x + b * y = gcd(a, b) 
// require a >= b
    var qr, q, r, x1, x2, y1, y2, x, y;
    if (b.isZero())
        return [biFromNumber(1), biFromNumber(0), a];
    x1 = biFromNumber(0);
    x2 = biFromNumber(1);
    y1 = biFromNumber(1);
    y2 = biFromNumber(0);
    while (!b.isZero()) {
        qr = biDivideModulo(a, b);
        q = qr[0];
        r = qr[1];
        x = biSubtract(x2, biMultiply(q, x1));
        y = biSubtract(y2, biMultiply(q, y1));
        a = b;
        b = r;
        x2 = x1;
        x1 = x;
        y2 = y1;
        y1 = y;
    }
    return [x2, y2, a];
}

function biMontgomeryPowMod(T, EXP, N) {
    var result = biFromNumber(1);
    var m = biModulo(biMultiply(T, N.R), N);
    for (var i = EXP.bin.length - 1; i > -1; i--) {
        if (EXP.bin.charAt(i) == "1") {
            result = biMultiply(result, m);
            result = biMontgomeryModulo(result, N)
        }
        m = biMultiply(m, m);
        m = biMontgomeryModulo(m, N)
    }
    return result;
}

function biMontgomeryModulo(T, N) {
    var m = biModuloByRadixPower(T, N.nN);
    //m = biMultiply(m, N.Ninv);
    //m = biModuloByRadixPower(m, N.nN);
    m = biMultiplyModByRadixPower(m, N.Ninv, N.nN)
    m = biMultiply(m, N);
    m = biAdd(T, m);
    m = biDivideByRadixPower(m, N.nN);
    while (biCompare(m, N) >= 0) {
        m = biSubtract(m, N);
    }
    return m;
}

/*
 The MIT License

 Copyright (c)2009 Андрій Овчаренко (Andrey Ovcharenko)

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */
// bi2php v0.1.113.alfa from http://code.google.com/p/bi2php/
// Base on dave@ohdave.com
// Now requires BigInt.js and Montgomery.js

// RSA, a suite of routines for performing RSA public-key computations in
// JavaScript.
//
// Requires BigInt.js and Barrett.js.
//
// Copyright 1998-2005 David Shapiro.
//
// You may use, re-use, abuse, copy, and modify this code to your liking, but
// please keep this header.
//
// Thanks!
// 
// Dave Shapiro
// dave@ohdave.com 

function biRSAKeyPair(encryptionExponent, decryptionExponent, modulus) {
    this.e = biFromHex(encryptionExponent);
    this.d = biFromHex(decryptionExponent);
    this.m = biFromHex(modulus);
    this.chunkSize = 2 * biHighIndex(this.m);
    this.radix = 16;
    // for Montgomery algorythm
    this.m.nN = biHighIndex(this.m) + 1;
    this.m.R = biMultiplyByRadixPower(biFromNumber(1), this.m.nN);
    this.m.EGCD = biExtendedEuclid(this.m.R, this.m);
    this.m.Ri = this.m.EGCD[0];
    this.m.Rinv = biModulo(this.m.EGCD[0], this.m);
    this.m.Ni = biMinus(this.m.EGCD[1]);
    this.m.Ninv = biModulo(biMinus(this.m.EGCD[1]), this.m.R);
    //this.m.Ni = biModulo(this.m.Ni, this.m.R);
    //this.m.Ni = biModuloByRadixPower(this.m.Ni, this.m.nN);
    this.e.bin = biToString(this.e, 2);
    this.d.bin = biToString(this.d, 2);
}

biRSAKeyPair.prototype.biEncryptedString = biEncryptedString;
biRSAKeyPair.prototype.biDecryptedString = biDecryptedString;

function biEncryptedString(s) {
// UTF-8 encode added. So some symbol is non-UTF-8 - #254, #255.
// Terminate symbol #254 to prevent nonvalue zerro (0000xxx)
// Left padding with random string to prevent from siple decrypt shon message.
// Split by space is change to split by comma to prevent url encoding space to +
//
// Altered by Rob Saunders (rob@robsaunders.net). New routine pads the
// string after it has been converted to an array. This fixes an
// incompatibility with Flash MX's ActionScript.
    s = biUTF8Encode(s);
    s = s.replace(/[\x00]/gm, String.fromCharCode(255)); //not UTF-8 zero replace
    s = s + String.fromCharCode(254); //not UTF-8 terminal sybol
    var sl = s.length;
    s = s + biRandomPadding(this.chunkSize - sl % this.chunkSize);
    var sl = s.length;
    var result = "";
    var i, j, k, block;
    block = new BigInt();
    for (var i = 0; i < sl; i += this.chunkSize) {
        block.blankZero();
        j = 0;
        for (k = i; k < i + this.chunkSize && k < sl; ++j) {
            block.digits[j] = s.charCodeAt(k++);
            block.digits[j] += (s.charCodeAt(k++) || 0) << 8;
        }
        var crypt = biMontgomeryPowMod(block, this.e, this.m);
        var text = biToHex(crypt);
        result += text + ",";
    }
    return result.substring(0, result.length - 1); // Remove last space.
}

function biDecryptedString(s) {
    var blocks = s.split(",");
    var result = "";
    var i, j, block;
    for (i = 0; i < blocks.length; ++i) {
        var bi;
        bi = biFromHex(blocks[i], 10);
        block = biMontgomeryPowMod(bi, this.d, this.m);
        for (j = 0; j <= biHighIndex(block); ++j) {
            result += String.fromCharCode(block.digits[j] & 255,
                block.digits[j] >> 8);
        }
    }
    result = result.replace(/\xff/gm, String.fromCharCode(0));
    result = result.substr(0, result.lastIndexOf(String.fromCharCode(254)));
    return biUTF8Decode(result);
}

function biUTF8Encode(string) {
// Base on:
    /*
     * jCryption JavaScript data encryption v1.0.1
     * http://www.jcryption.org/
     *
     * Copyright (c) 2009 Daniel Griesser
     * Dual licensed under the MIT and GPL licenses.
     * http://www.opensource.org/licenses/mit-license.php
     * http://www.opensource.org/licenses/gpl-2.0.php
     *
     * If you need any further information about this plugin please
     * visit my homepage or contact me under daniel.griesser@jcryption.org
     */
    //string = string.replace(/\r\n/g,"\n");
    var utftext = "";
    var sl = string.length;
    for (var n = 0; n < sl; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) {
            utftext += String.fromCharCode(c);
        } else if ((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        } else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }
    }
    return utftext;
}

function biUTF8Decode(s) {
    var utftext = "";
    var sl = s.length;
    var charCode;
    for (var n = 0; n < sl; n++) {
        var c = s.charCodeAt(n);
        if (c < 128) {
            utftext += String.fromCharCode(c);
            charCode = 0;
        } else if ((c > 191) && (c < 224)) {
            charCode = ((c & 0x1f) << 6);
            c = s.charCodeAt(++n);
            charCode += (c & 0x3f);
            utftext += String.fromCharCode(charCode);
        } else {
            charCode = ((c & 0xf) << 12);
            c = s.charCodeAt(++n);
            charCode += ((c & 0x3f) << 6);
            c = s.charCodeAt(++n);
            charCode += (c & 0x3f);
            utftext += String.fromCharCode(charCode);
        }
    }
    return utftext;
}

function biRandomPadding(n) {
    var result = "";
    for (var i = 0; i < n; i++)
        result = result + String.fromCharCode(Math.floor(Math.random() * 126) + 1);
    return result;
}
/*
 * INTER-Mediator Ver.4.6 Released 2014-12-30
 * 
 *   by Masayuki Nii  msyk@msyk.net Copyright (c) 2010-2014 Masayuki Nii, All rights reserved.
 * 
 *   This project started at the end of 2009.
 *   INTER-Mediator is supplied under MIT License.
 */
/*==================================================
 Database Access Object for Server-based Database
 ==================================================*/

//"use strict"

var INTERMediator_DBAdapter;

INTERMediator_DBAdapter = {

    generate_authParams: function () {
        var authParams = '', shaObj, hmacValue;
        if (INTERMediatorOnPage.authUser.length > 0) {
            authParams = "&clientid=" + encodeURIComponent(INTERMediatorOnPage.clientId);
            authParams += "&authuser=" + encodeURIComponent(INTERMediatorOnPage.authUser);
            if (INTERMediatorOnPage.isNativeAuth) {
                authParams += "&response=" + encodeURIComponent(
                    INTERMediatorOnPage.publickey.biEncryptedString(INTERMediatorOnPage.authHashedPassword
                    + "\n" + INTERMediatorOnPage.authChallenge));
            } else {
                if (INTERMediatorOnPage.authHashedPassword && INTERMediatorOnPage.authChallenge) {
                    shaObj = new jsSHA(INTERMediatorOnPage.authHashedPassword, "ASCII");
                    hmacValue = shaObj.getHMAC(INTERMediatorOnPage.authChallenge, "ASCII", "SHA-256", "HEX");
                    authParams += "&response=" + encodeURIComponent(hmacValue);
                } else {
                    authParams += "&response=dummy";
                }
            }
        }

        authParams += "&notifyid=";
        authParams += encodeURIComponent(INTERMediatorOnPage.clientNotificationIdentifier());
        authParams += ("&pusher=" + (INTERMediator.pusherAvailable ? "yes" : ""));
        return authParams;
    },

    store_challenge: function (challenge) {
        if (challenge !== null) {
            INTERMediatorOnPage.authChallenge = challenge.substr(0, 24);
            INTERMediatorOnPage.authUserHexSalt = challenge.substr(24, 32);
            INTERMediatorOnPage.authUserSalt = String.fromCharCode(
                parseInt(challenge.substr(24, 2), 16),
                parseInt(challenge.substr(26, 2), 16),
                parseInt(challenge.substr(28, 2), 16),
                parseInt(challenge.substr(30, 2), 16));
        }
    },

    logging_comAction: function (debugMessageNumber, appPath, accessURL, authParams) {
        INTERMediator.setDebugMessage(
            INTERMediatorOnPage.getMessages()[debugMessageNumber]
            + "Accessing:" + decodeURI(appPath) + ", Parameters:" + decodeURI(accessURL + authParams));
    },

    logging_comResult: function (myRequest, resultCount, dbresult, requireAuth, challenge, clientid, newRecordKeyValue, changePasswordResult, mediatoken) {
        var responseTextTrancated;
        if (INTERMediator.debugMode > 1) {
            if (myRequest.responseText.length > 1000) {
                responseTextTrancated = myRequest.responseText.substr(0, 1000) + " ...[trancated]";
            } else {
                responseTextTrancated = myRequest.responseText;
            }
            INTERMediator.setDebugMessage("myRequest.responseText=" + responseTextTrancated);
            INTERMediator.setDebugMessage("Return: resultCount=" + resultCount
                + ", dbresult=" + INTERMediatorLib.objectToString(dbresult) + "\n"
                + "Return: requireAuth=" + requireAuth
                + ", challenge=" + challenge + ", clientid=" + clientid + "\n"
                + "Return: newRecordKeyValue=" + newRecordKeyValue
                + ", changePasswordResult=" + changePasswordResult + ", mediatoken=" + mediatoken
            );
        }
    },
    server_access: function (accessURL, debugMessageNumber, errorMessageNumber) {
        var newRecordKeyValue = '', dbresult = '', resultCount = 0, totalCount = null, challenge = null,
            clientid = null, requireAuth = false, myRequest = null, changePasswordResult = null,
            mediatoken = null, appPath, authParams, jsonObject, i, notifySupport = false, useNull = false,
            registeredID = "";
        appPath = INTERMediatorOnPage.getEntryPath();
        authParams = INTERMediator_DBAdapter.generate_authParams();
        INTERMediator_DBAdapter.logging_comAction(debugMessageNumber, appPath, accessURL, authParams);
        INTERMediatorOnPage.notifySupport = notifySupport;
        try {
            myRequest = new XMLHttpRequest();
            myRequest.open('POST', appPath, false, INTERMediatorOnPage.httpuser, INTERMediatorOnPage.httppasswd);
            myRequest.setRequestHeader("charset", "utf-8");
            myRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            myRequest.send(accessURL + authParams);
            jsonObject = JSON.parse(myRequest.responseText);
            resultCount = jsonObject.resultCount ? jsonObject.resultCount : 0;
            totalCount = jsonObject.totalCount ? jsonObject.totalCount : null;
            dbresult = jsonObject.dbresult ? jsonObject.dbresult : null;
            requireAuth = jsonObject.requireAuth ? jsonObject.requireAuth : false;
            challenge = jsonObject.challenge ? jsonObject.challenge : null;
            clientid = jsonObject.clientid ? jsonObject.clientid : null;
            newRecordKeyValue = jsonObject.newRecordKeyValue ? jsonObject.newRecordKeyValue : '';
            changePasswordResult = jsonObject.changePasswordResult ? jsonObject.changePasswordResult : null;
            mediatoken = jsonObject.mediatoken ? jsonObject.mediatoken : null;
            notifySupport = jsonObject.notifySupport;
            for (i = 0; i < jsonObject.errorMessages.length; i++) {
                INTERMediator.setErrorMessage(jsonObject.errorMessages[i]);
            }
            for (i = 0; i < jsonObject.debugMessages.length; i++) {
                INTERMediator.setDebugMessage(jsonObject.debugMessages[i]);
            }
            useNull = jsonObject.usenull;
            registeredID = jsonObject.hasOwnProperty('registeredid') ? jsonObject.registeredid : "";

            INTERMediator_DBAdapter.logging_comResult(myRequest, resultCount, dbresult, requireAuth,
                challenge, clientid, newRecordKeyValue, changePasswordResult, mediatoken);
            INTERMediator_DBAdapter.store_challenge(challenge);
            if (clientid !== null) {
                INTERMediatorOnPage.clientId = clientid;
            }
            if (mediatoken !== null) {
                INTERMediatorOnPage.mediaToken = mediatoken
            }
        } catch (e) {

            INTERMediator.setErrorMessage(e,
                INTERMediatorLib.getInsertedString(
                    INTERMediatorOnPage.getMessages()[errorMessageNumber], [e, myRequest.responseText]));

        }
        if (requireAuth) {
            INTERMediator.setDebugMessage("Authentication Required, user/password panel should be show.");
            INTERMediatorOnPage.authHashedPassword = null;
            throw "_im_requath_request_"
        }
        if (!accessURL.match(/access=challenge/)) {
            INTERMediatorOnPage.authCount = 0;
        }
        INTERMediatorOnPage.storeCredencialsToCookie();
        INTERMediatorOnPage.notifySupport = notifySupport;
        return {
            dbresult: dbresult,
            resultCount: resultCount,
            totalCount: totalCount,
            newRecordKeyValue: newRecordKeyValue,
            newPasswordResult: changePasswordResult,
            registeredId: registeredID,
            nullAcceptable: useNull
        };
    },

    changePassowrd: function (username, oldpassword, newpassword) {
        var challengeResult, params, result;

        if (username && oldpassword) {
            INTERMediatorOnPage.authUser = username;
            if (username != ''    // No usename and no challenge, get a challenge.
                && (INTERMediatorOnPage.authChallenge === null || INTERMediatorOnPage.authChallenge.length < 24 )) {
                INTERMediatorOnPage.authHashedPassword = "need-hash-pls";   // Dummy Hash for getting a challenge
                challengeResult = INTERMediator_DBAdapter.getChallenge();
                if (!challengeResult) {
                    INTERMediator.flushMessage();
                    return false; // If it's failed to get a challenge, finish everything.
                }
            }
            INTERMediatorOnPage.authHashedPassword
                = SHA1(oldpassword + INTERMediatorOnPage.authUserSalt)
            + INTERMediatorOnPage.authUserHexSalt;
        } else {
            INTERMediatorOnPage.retrieveAuthInfo();
        }
        params = "access=changepassword&newpass=" + INTERMediatorLib.generatePasswordHash(newpassword);
        try {
            result = INTERMediator_DBAdapter.server_access(params, 1029, 1030);
            if (result.newPasswordResult && result.newPasswordResult === true) {
                if (INTERMediatorOnPage.isNativeAuth) {
                    INTERMediatorOnPage.authHashedPassword = INTERMediatorOnPage.publickey.biEncryptedString(newpassword);
                } else {
                    INTERMediatorOnPage.authHashedPassword
                        = SHA1(newpassword + INTERMediatorOnPage.authUserSalt)
                    + INTERMediatorOnPage.authUserHexSalt;
                }
                INTERMediatorOnPage.storeCredencialsToCookie();
            }
        } catch (e) {
            return false;
        }
        return (result.newPasswordResult && result.newPasswordResult === true);
    },

    getChallenge: function () {
        try {
            this.server_access("access=challenge", 1027, 1028);
        } catch (ex) {
            if (ex == "_im_requath_request_") {
                throw ex;
            } else {
                INTERMediator.setErrorMessage(ex, "EXCEPTION-19");
            }
        }
        if (INTERMediatorOnPage.authChallenge === null) {
            return false;
        }
        return true;
    },

    uploadFile: function (parameters, uploadingFile, doItOnFinish) {
        var newRecordKeyValue = '', dbresult = '', resultCount = 0, challenge = null,
            clientid = null, requireAuth = false, myRequest = null, changePasswordResult = null,
            mediatoken = null, appPath, authParams, accessURL, jsonObject, i;
        //           var result = this.server_access("access=uploadfile" + parameters, 1031, 1032, uploadingFile);
        appPath = INTERMediatorOnPage.getEntryPath();
        authParams = INTERMediator_DBAdapter.generate_authParams();
        accessURL = "access=uploadfile" + parameters;
        INTERMediator_DBAdapter.logging_comAction(1031, appPath, accessURL, authParams);
        try {
            myRequest = new XMLHttpRequest();
            myRequest.open('POST', appPath, true, INTERMediatorOnPage.httpuser, INTERMediatorOnPage.httppasswd);
            myRequest.setRequestHeader("charset", "utf-8");
            var params = (accessURL + authParams).split('&');
            var fd = new FormData();
            for (var i = 0; i < params.length; i++) {
                var valueset = params[i].split('=');
                fd.append(valueset[0], decodeURIComponent(valueset[1]));
            }
            fd.append("_im_uploadfile", uploadingFile['content']);
            myRequest.onreadystatechange = function () {
                switch (myRequest.readyState) {
                    case 3:
                        break;
                    case 4:
                        jsonObject = JSON.parse(myRequest.responseText);
                        resultCount = jsonObject.resultCount ? jsonObject.resultCount : 0;
                        dbresult = jsonObject.dbresult ? jsonObject.dbresult : null;
                        requireAuth = jsonObject.requireAuth ? jsonObject.requireAuth : false;
                        challenge = jsonObject.challenge ? jsonObject.challenge : null;
                        clientid = jsonObject.clientid ? jsonObject.clientid : null;
                        newRecordKeyValue = jsonObject.newRecordKeyValue ? jsonObject.newRecordKeyValue : '';
                        changePasswordResult = jsonObject.changePasswordResult ? jsonObject.changePasswordResult : null;
                        mediatoken = jsonObject.mediatoken ? jsonObject.mediatoken : null;
                        for (i = 0; i < jsonObject.errorMessages.length; i++) {
                            INTERMediator.setErrorMessage(jsonObject.errorMessages[i]);
                        }
                        for (i = 0; i < jsonObject.debugMessages.length; i++) {
                            INTERMediator.setDebugMessage(jsonObject.debugMessages[i]);
                        }

                        INTERMediator_DBAdapter.logging_comResult(myRequest, resultCount, dbresult, requireAuth,
                            challenge, clientid, newRecordKeyValue, changePasswordResult, mediatoken);
                        INTERMediator_DBAdapter.store_challenge(challenge);
                        if (clientid !== null) {
                            INTERMediatorOnPage.clientId = clientid;
                        }
                        if (mediatoken !== null) {
                            INTERMediatorOnPage.mediaToken = mediatoken
                        }
                        if (requireAuth) {
                            INTERMediator.setDebugMessage("Authentication Required, user/password panel should be show.");
                            INTERMediatorOnPage.authHashedPassword = null;
                            throw "_im_requath_request_"
                        }
                        INTERMediatorOnPage.authCount = 0;
                        INTERMediatorOnPage.storeCredencialsToCookie();
                        doItOnFinish(dbresult);
                        break;
                }
            }
            myRequest.send(fd);
        } catch (e) {
            INTERMediator.setErrorMessage(e,
                INTERMediatorLib.getInsertedString(
                    INTERMediatorOnPage.getMessages()[1032], [e, myRequest.responseText]));
        }
    },

    /*
     db_query
     Querying from database. The parameter of this function should be the object as below:

     {
     name:<name of the context>
     records:<the number of retrieving records, could be null>
     fields:<the array of fields to retrieve, but this parameter is ignored so far.
     parentkeyvalue:<the value of foreign key field, could be null>
     conditions:<the array of the object {field:xx,operator:xx,value:xx} to search records, could be null>
     useoffset:<true/false whether the offset parameter is set on the query.>
     uselimit:<true/false whether the limit parameter is set on the query.>
     primaryKeyOnly: true/false
     }

     This function returns recordset of retrieved.
     */
    db_query: function (args) {
        var noError = true, i, index, params, counter, extCount, criteriaObject, sortkeyObject,
            returnValue, result, ix, extCountSort, recordLimit = 10000000;

        if (args.name === null || args.name === "") {
            INTERMediator.setErrorMessage(INTERMediatorLib.getInsertedStringFromErrorNumber(1005));
            noError = false;
        }
        if (!noError) {
            return;
        }

        if (args['records'] == null) {
            params = "access=select&name=" + encodeURIComponent(args['name']);
        } else {
            if (Number(args.records) === 0) {
                params = "access=describe&name=" + encodeURIComponent(args['name']);
            } else {
                params = "access=select&name=" + encodeURIComponent(args['name']);
            }
            if (args['uselimit'] === true
                && Number(args.records) >= INTERMediator.pagedSize
                && Number(INTERMediator.pagedSize) > 0) {
                recordLimit = INTERMediator.pagedSize;
            } else {
                recordLimit = args['records'];
            }
        }

        if (args['primaryKeyOnly']) {
            params += "&pkeyonly=true";
        }

        if (args['fields']) {
            for (i = 0; i < args['fields'].length; i++) {
                params += "&field_" + i + "=" + encodeURIComponent(args['fields'][i]);
            }
        }
        counter = 0;
        if (args['parentkeyvalue']) {
            //noinspection JSDuplicatedDeclaration
            for (index in args['parentkeyvalue']) {
                if (args['parentkeyvalue'].hasOwnProperty(index)) {
                    params += "&foreign" + counter
                    + "field=" + encodeURIComponent(index);
                    params += "&foreign" + counter
                    + "value=" + encodeURIComponent(args['parentkeyvalue'][index]);
                    counter++;
                }
            }
        }
        if (args['useoffset'] && INTERMediator.startFrom != null) {
            params += "&start=" + encodeURIComponent(INTERMediator.startFrom);
        }
        extCount = 0;
        while (args['conditions'] && args['conditions'][extCount]) {
            params += "&condition" + extCount;
            params += "field=" + encodeURIComponent(args['conditions'][extCount]['field']);
            params += "&condition" + extCount;
            params += "operator=" + encodeURIComponent(args['conditions'][extCount]['operator']);
            params += "&condition" + extCount;
            params += "value=" + encodeURIComponent(args['conditions'][extCount]['value']);
            extCount++;
        }
        criteriaObject = INTERMediator.additionalCondition[args['name']];
        if (criteriaObject) {
            if (criteriaObject["field"]) {
                criteriaObject = [criteriaObject];
            }
            for (index = 0; index < criteriaObject.length; index++) {
                if (criteriaObject[index] && criteriaObject[index]["field"]) {
                    if (criteriaObject[index]["value"] || criteriaObject[index]["field"] == "__operation__") {
                        params += "&condition" + extCount;
                        params += "field=" + encodeURIComponent(criteriaObject[index]["field"]);
                        if (criteriaObject[index]["operator"] !== undefined) {
                            params += "&condition" + extCount;
                            params += "operator=" + encodeURIComponent(criteriaObject[index]["operator"]);
                        }
                        if (criteriaObject[index]["value"] !== undefined) {
                            params += "&condition" + extCount;
                            params += "value=" + encodeURIComponent(criteriaObject[index]["value"]);
                        }
                        extCount++;
                    }
                }

            }
        }

        extCountSort = 0;
        sortkeyObject = INTERMediator.additionalSortKey[args['name']];
        if (sortkeyObject) {
            if (sortkeyObject["field"]) {
                sortkeyObject = [sortkeyObject];
            }
            for (index = 0; index < sortkeyObject.length; index++) {
                params += "&sortkey" + extCountSort;
                params += "field=" + encodeURIComponent(sortkeyObject[index]["field"]);
                params += "&sortkey" + extCountSort;
                params += "direction=" + encodeURIComponent(sortkeyObject[index]["direction"]);
                extCountSort++;
            }

        }

        var orderFields = {};
        for (var key in IMLibLocalContext.store) {
            var value = new String(IMLibLocalContext.store[key]);
            var keyParams = key.split(":");
            if (keyParams && keyParams.length > 1 && keyParams[1].trim() == args['name'] && value.length > 0) {
                if (keyParams[0].trim() == "condition" && keyParams.length >= 4) {
                    var fields = keyParams[2].split(",");
                    var operator = keyParams[3].trim();
                    if (fields.length > 1) {
                        params += "&condition" + extCount + "field=__operation__";
                        params += "&condition" + extCount + "operator=ex";
                        extCount++;
                    }
                    for (var index = 0; index < fields.length; index++) {
                        params += "&condition" + extCount + "field=" + encodeURIComponent(fields[index].trim());
                        params += "&condition" + extCount + "operator=" + encodeURIComponent(operator);
                        params += "&condition" + extCount + "value=" + encodeURIComponent(value);
                        extCount++;
                    }
                } else if (keyParams[0].trim() == "valueofaddorder" && keyParams.length >= 4) {
                    orderFields[parseInt(value)] = [keyParams[2].trim(), keyParams[3].trim()];
                } else if (keyParams[0].trim() == "limitnumber" && keyParams.length >= 4) {
                    recordLimit = parseInt(value);
                }
            }
        }
        params += "&records=" + encodeURIComponent(recordLimit);
        var orderedKeys = Object.keys(orderFields);
        for (var i = 0; i < orderedKeys.length; i++) {
            params += "&sortkey" + extCountSort + "field=" + encodeURIComponent(orderFields[orderedKeys[i]][0]);
            params += "&sortkey" + extCountSort + "direction=" + encodeURIComponent(orderFields[orderedKeys[i]][1]);
            extCountSort++;
        }
// params += "&randkey" + Math.random();    // For ie...
// IE uses caches as the result in spite of several headers. So URL should be randomly.
//
// This is not requred because the Notification feature adds the client Identifier for each communication.
// msyk June 1, 2014
        returnValue = {};
        try {
            result = this.server_access(params, 1012, 1004);
            returnValue.recordset = result.dbresult;
            returnValue.totalCount = result.resultCount;
            returnValue.count = 0;
            returnValue.registeredId = result.registeredId;
            returnValue.nullAcceptable = result.nullAcceptable;
            for (ix in result.dbresult) {
                returnValue.count++;
            }
            if (( args['paging'] != null) && ( args['paging'] == true )) {
                if (!(Number(args['records']) >= Number(INTERMediator.pagedSize)
                    && Number(INTERMediator.pagedSize) > 0)) {
                    INTERMediator.pagedSize = Number(args['records']);
                }
                INTERMediator.pagedAllCount = Number(result.resultCount);
                if (result.totalCount) {
                    INTERMediator.totalRecordCount = parseInt(result.totalCount, 10);
                }
            }
        } catch (ex) {
            if (ex == "_im_requath_request_") {
                throw ex;
            } else {
                INTERMediator.setErrorMessage(ex, "EXCEPTION-17");
            }
            returnValue.recordset = null;
            returnValue.totalCount = 0;
            returnValue.count = 0;
            returnValue.registeredid = null;
            returnValue.nullAcceptable = null;
        }
        return returnValue;
    },

    db_queryWithAuth: function (args, completion) {
        var returnValue = false;
        INTERMediatorOnPage.retrieveAuthInfo();
        try {
            returnValue = INTERMediator_DBAdapter.db_query(args);
        } catch (ex) {
            if (ex == "_im_requath_request_") {
                if (INTERMediatorOnPage.requireAuthentication) {
                    if (!INTERMediatorOnPage.isComplementAuthData()) {
                        INTERMediatorOnPage.authChallenge = null;
                        INTERMediatorOnPage.authHashedPassword = null;
                        INTERMediatorOnPage.authenticating(
                            function () {
                                returnValue = INTERMediator_DBAdapter.db_queryWithAuth(arg, completion);
                            });
                        return;
                    }
                }
            } else {
                INTERMediator.setErrorMessage(ex, "EXCEPTION-16");
            }
        }
        completion(returnValue);
    },

    /*
     db_update
     Update the database. The parameter of this function should be the object as below:

     {   name:<Name of the Context>
     conditions:<the array of the object {field:xx,operator:xx,value:xx} to search records>
     dataset:<the array of the object {field:xx,value:xx}. each value will be set to the field.> }
     */
    db_update: function (args) {
        var noError = true, params, extCount, result, counter, index, addedObject;

        if (args['name'] === null) {
            INTERMediator.setErrorMessage(INTERMediatorLib.getInsertedStringFromErrorNumber(1007));
            noError = false;
        }
//        if (args['conditions'] == null) {
//            INTERMediator.errorMessages.push(INTERMediatorLib.getInsertedStringFromErrorNumber(1008));
//            noError = false;
//        }
        if (args['dataset'] === null) {
            INTERMediator.setErrorMessage(INTERMediatorLib.getInsertedStringFromErrorNumber(1011));
            noError = false;
        }
        if (!noError) {
            return;
        }

        params = "access=update&name=" + encodeURIComponent(args['name']);

        counter = 0;
        if (INTERMediator.additionalFieldValueOnUpdate
            && INTERMediator.additionalFieldValueOnUpdate[args['name']]) {
            addedObject = INTERMediator.additionalFieldValueOnUpdate[args['name']];
            if (addedObject["field"]) {
                addedObject = [addedObject];
            }
            for (index in addedObject) {
                var oneDefinition = addedObject[index];
                params += "&field_" + counter + "=" + encodeURIComponent(oneDefinition['field']);
                params += "&value_" + counter + "=" + encodeURIComponent(oneDefinition['value']);
                counter++;
            }
        }

        if (args['conditions'] != null) {
            for (extCount = 0; extCount < args['conditions'].length; extCount++) {
                params += "&condition" + extCount + "field=";
                params += encodeURIComponent(args['conditions'][extCount]['field']);
                params += "&condition" + extCount + "operator=";
                params += encodeURIComponent(args['conditions'][extCount]['operator']);
                if (args['conditions'][extCount]['value']) {
                    params += "&condition" + extCount + "value=";
                    params += encodeURIComponent(args['conditions'][extCount]['value']);
                }
            }
        }
        for (extCount = 0; extCount < args['dataset'].length; extCount++) {
            params += "&field_" + (counter + extCount) + "=" + encodeURIComponent(args['dataset'][extCount]['field']);
            if (INTERMediator.isTrident && INTERMediator.ieVersion == 8) {
                params += "&value_" + (counter + extCount) + "=" + encodeURIComponent(args['dataset'][extCount]['value'].replace(/\n/g, ""));
            } else {
                params += "&value_" + (counter + extCount) + "=" + encodeURIComponent(args['dataset'][extCount]['value']);
            }
        }
        result = this.server_access(params, 1013, 1014);
        return result.dbresult;
    },

    db_updateWithAuth: function (args, completion) {
        var returnValue = false;
        INTERMediatorOnPage.retrieveAuthInfo();
        try {
            returnValue = INTERMediator_DBAdapter.db_update(args);
        } catch (ex) {
            if (ex == "_im_requath_request_") {
                if (INTERMediatorOnPage.requireAuthentication) {
                    if (!INTERMediatorOnPage.isComplementAuthData()) {
                        INTERMediatorOnPage.authChallenge = null;
                        INTERMediatorOnPage.authHashedPassword = null;
                        INTERMediatorOnPage.authenticating(
                            function () {
                                returnValue = INTERMediator_DBAdapter.db_updateWithAuth(arg, completion);
                            });
                        return;
                    }
                }
            } else {
                INTERMediator.setErrorMessage(ex, "EXCEPTION-15");
            }
        }
        completion(returnValue);
    },

    /*
     db_delete
     Delete the record. The parameter of this function should be the object as below:

     {   name:<Name of the Context>
     conditions:<the array of the object {field:xx,operator:xx,value:xx} to search records, could be null>}
     */
    db_delete: function (args) {
        var noError = true, params, i, result, counter, index, addedObject;

        if (args['name'] === null) {
            INTERMediator.setErrorMessage(INTERMediatorLib.getInsertedStringFromErrorNumber(1019));
            noError = false;
        }
        if (args['conditions'] === null) {
            INTERMediator.setErrorMessage(INTERMediatorLib.getInsertedStringFromErrorNumber(1020));
            noError = false;
        }
        if (!noError) {
            return;
        }

        params = "access=delete&name=" + encodeURIComponent(args['name']);
        counter = 0;
        if (INTERMediator.additionalFieldValueOnDelete
            && INTERMediator.additionalFieldValueOnDelete[args['name']]) {
            addedObject = INTERMediator.additionalFieldValueOnDelete[args['name']];
            if (addedObject["field"]) {
                addedObject = [addedObject];
            }
            for (index in addedObject) {
                var oneDefinition = addedObject[index];
                params += "&field_" + counter + "=" + encodeURIComponent(oneDefinition['field']);
                params += "&value_" + counter + "=" + encodeURIComponent(oneDefinition['value']);
                counter++;
            }
        }

        for (i = 0; i < args['conditions'].length; i++) {
            params += "&condition" + i + "field=" + encodeURIComponent(args['conditions'][i]['field']);
            params += "&condition" + i + "operator=" + encodeURIComponent(args['conditions'][i]['operator']);
            params += "&condition" + i + "value=" + encodeURIComponent(args['conditions'][i]['value']);
        }
        result = this.server_access(params, 1017, 1015);
        INTERMediator.flushMessage();
        return result;
    },

    db_deleteWithAuth: function (args, completion) {
        var returnValue = false;
        INTERMediatorOnPage.retrieveAuthInfo();
        try {
            returnValue = INTERMediator_DBAdapter.db_delete(args);
        } catch (ex) {
            if (ex == "_im_requath_request_") {
                if (INTERMediatorOnPage.requireAuthentication) {
                    if (!INTERMediatorOnPage.isComplementAuthData()) {
                        INTERMediatorOnPage.authChallenge = null;
                        INTERMediatorOnPage.authHashedPassword = null;
                        INTERMediatorOnPage.authenticating(
                            function () {
                                returnValue = INTERMediator_DBAdapter.db_deleteWithAuth(arg, completion);
                            });
                        return;
                    }
                }
            } else {
                INTERMediator.setErrorMessage(ex, "EXCEPTION-14");
            }
        }
        completion(returnValue);
    },
    /*
     db_createRecord
     Create a record. The parameter of this function should be the object as below:

     {   name:<Name of the Context>
     dataset:<the array of the object {field:xx,value:xx}. Initial value for each field> }

     This function returns the value of the key field of the new record.
     */
    db_createRecord: function (args) {
        var params, i, result, index, addedObject, counter, targetKey, ds, key;

        if (args['name'] === null) {
            INTERMediator.setErrorMessage(INTERMediatorLib.getInsertedStringFromErrorNumber(1021));
            return;
        }

        ds = INTERMediatorOnPage.getDataSources(); // Get DataSource parameters
        targetKey = null;
        for (key in ds) { // Search this table from DataSource
            if (ds[key]['name'] == args['name']) {
                targetKey = key;
                break;
            }
        }
        if (targetKey === null) {
            alert("no targetname :" + args['name']);
            return;
        }

        params = "access=new&name=" + encodeURIComponent(args['name']);

        counter = 0;
        if (INTERMediator.additionalFieldValueOnNewRecord
            && INTERMediator.additionalFieldValueOnNewRecord[args['name']]) {
            addedObject = INTERMediator.additionalFieldValueOnNewRecord[args['name']];
            if (addedObject["field"]) {
                addedObject = [addedObject];
            }
            for (index in addedObject) {
                var oneDefinition = addedObject[index];
                params += "&field_" + counter + "=" + encodeURIComponent(oneDefinition['field']);
                params += "&value_" + counter + "=" + encodeURIComponent(oneDefinition['value']);
                counter++;
            }
        }

        for (i = 0; i < args['dataset'].length; i++) {
            params += "&field_" + counter + "=" + encodeURIComponent(args['dataset'][i]['field']);
            params += "&value_" + counter + "=" + encodeURIComponent(args['dataset'][i]['value']);
            counter++;
        }
        result = this.server_access(params, 1018, 1016);
        INTERMediator.flushMessage();
        return {
            newKeyValue: result.newRecordKeyValue,
            recordset: result.dbresult
        };
    },

    db_createRecordWithAuth: function (args, completion) {
        var returnValue = false;
        INTERMediatorOnPage.retrieveAuthInfo();
        try {
            returnValue = INTERMediator_DBAdapter.db_createRecord(args);
        } catch (ex) {
            if (ex == "_im_requath_request_") {
                if (INTERMediatorOnPage.requireAuthentication) {
                    if (!INTERMediatorOnPage.isComplementAuthData()) {
                        INTERMediatorOnPage.authChallenge = null;
                        INTERMediatorOnPage.authHashedPassword = null;
                        INTERMediatorOnPage.authenticating(
                            function () {
                                returnValue = INTERMediator_DBAdapter.db_createRecordWithAuth(arg, completion);
                            });
                        return;
                    }
                }
            } else {
                INTERMediator.setErrorMessage(ex, "EXCEPTION-13");
            }
        }
        if (completion) {
            completion(returnValue.newKeyValue);
        }
    },

    unregister: function (entityPkInfo) {
        //console.log(entityPkInfo);
        var result = null, params;
        if (INTERMediatorOnPage.clientNotificationKey) {
            var appKey = INTERMediatorOnPage.clientNotificationKey();
            if (appKey && appKey != "_im_key_isnt_supplied") {
                params = "access=unregister";
                if (entityPkInfo) {
                    params += "&pks=" + encodeURIComponent(JSON.stringify(entityPkInfo));
                }
                result = this.server_access(params, 1018, 1016);
                return result;
            }
        }
    }
}
;
/*
 Based on ndef.parser, by Raphael Graf(r@undefined.ch)
 http://www.undefined.ch/mparser/index.html

 Ported to JavaScript and modified by Matthew Crumley (email@matthewcrumley.com, http://silentmatt.com/)

 You are free to use and modify this code in anyway you find useful. Please leave this comment in the code
 to acknowledge its original source. If you feel like it, I enjoy hearing about projects that use my code,
 but don't feel like you have to let me know or ask permission.
 */
/*
 * INTER-Mediator Ver.4.6 Released 2014-12-30
 *
 *   by Masayuki Nii  msyk@msyk.net Copyright (c) 2014 Masayuki Nii, All rights reserved.
 *
 *   Masayuki Nii is modifying the 'JS Expression Eval' for INTER-Mediator
 *   from March 2, 2014
 *
 *   This project started at the end of 2009.
 *   INTER-Mediator is supplied under MIT License.
 */

var Parser = (function (scope) {
    var TNUMBER = 0;
    var TOP1 = 1;
    var TOP2 = 2;
    var TOP3 = 5;
    var SEP = 65;
    var TVAR = 3;
    var TFUNCALL = 4;

    Parser.regFirstVarChar = new RegExp("[\u00A0-\u1FFF\u2C00-\uDFFFa-zA-Z@_]");
    Parser.regRestVarChar = new RegExp("[\u00A0-\u1FFF\u2C00-\uDFFFa-zA-Z@_0-9]");

    function Token(type_, index_, prio_, number_) {
        this.type_ = type_;
        this.index_ = index_ || 0;
        this.prio_ = prio_ || 0;
        this.number_ = (number_ !== undefined && number_ !== null) ? number_ : 0;
        this.toString = function () {
            switch (this.type_) {
                case TNUMBER:
                    return this.number_;
                case TOP1:
                case TOP2:
                case TOP3:
                case TVAR:
                    return this.index_;
                case TFUNCALL:
                    return "CALL";
                case SEP:
                    return "SEPARATOR";
                default:
                    return "Invalid Token";
            }
        };
    }

    function Expression(tokens, ops1, ops2, functions, ops3, ops3Trail) {
        this.tokens = tokens;
    }

    // Based on http://www.json.org/json2.js
//    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var escapable = /[\\\'\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var meta = {    // table of character substitutions
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        "'": "\\'",
        '\\': '\\\\'
    };

    function escapeValue(v) {
        if (typeof v === "string") {
            escapable.lastIndex = 0;
            return escapable.test(v) ?
            "'" + v.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + "'" :
            "'" + v + "'";
        }
        return v;
    }

    Expression.prototype = {
        simplify: function (values) {
            values = values || {};
            var nstack = [];
            var newexpression = [];
            var n1;
            var n2;
            var n3;
            var f;
            var L = this.tokens.length;
            var item;
            var i = 0;
            for (i = 0; i < L; i++) {
                item = this.tokens[i];
                var type_ = item.type_;
                if (type_ === TNUMBER) {
                    nstack.push(item);
                }
                else if (type_ === TVAR && (item.index_ in values)) {
                    item = new Token(TNUMBER, 0, 0, values[item.index_]);
                    nstack.push(item);
                }
                else if (type_ === TOP3 && nstack.length > 2) {
                    n3 = nstack.pop();
                    n2 = nstack.pop();
                    n1 = nstack.pop();
                    f = Parser.ops3[item.index_];
                    item = new Token(TNUMBER, 0, 0, f(n1.number_, n2.number_, n3.number_));
                    nstack.push(item);
                }
                else if (type_ === TOP2 && nstack.length > 1) {
                    n2 = nstack.pop();
                    n1 = nstack.pop();
                    f = Parser.ops2[item.index_];
                    item = new Token(TNUMBER, 0, 0, f(n1.number_, n2.number_));
                    nstack.push(item);
                }
                else if (type_ === TOP1 && nstack.length > 0) {
                    n1 = nstack.pop();
                    f = Parser.ops1[item.index_];
                    item = new Token(TNUMBER, 0, 0, f(n1.number_));
                    nstack.push(item);
                }
                else {
                    while (nstack.length > 0) {
                        newexpression.push(nstack.shift());
                    }
                    newexpression.push(item);
                }
            }
            while (nstack.length > 0) {
                newexpression.push(nstack.shift());
            }

            return new Expression(newexpression);
        },

        substitute: function (variable, expr) {
            if (!(expr instanceof Expression)) {
                expr = new Parser().parse(String(expr));
            }
            var newexpression = [];
            var L = this.tokens.length;
            var item;
            var i = 0;
            for (i = 0; i < L; i++) {
                item = this.tokens[i];
                var type_ = item.type_;
                if (type_ === TVAR && item.index_ === variable) {
                    for (var j = 0; j < expr.tokens.length; j++) {
                        var expritem = expr.tokens[j];
                        var replitem = new Token(expritem.type_, expritem.index_, expritem.prio_, expritem.number_);
                        newexpression.push(replitem);
                    }
                }
                else {
                    newexpression.push(item);
                }
            }

            var ret = new Expression(newexpression);
            return ret;
        },

        evaluate: function (values) {
            values = values || {};
            var nstack = [];
            var n1;
            var n2;
            var n3;
            var f;
            var L = this.tokens.length;
            var item;
            var i = 0;
            for (i = 0; i < L; i++) {
                item = this.tokens[i];
                var type_ = item.type_;
                if (type_ === TNUMBER) {
                    nstack.push(item.number_);
                }
                else if (type_ === TOP3) {
                    n3 = nstack.pop();
                    n2 = nstack.pop();
                    n1 = nstack.pop();
                    f = Parser.ops3Trail[item.index_];
                    nstack.push(f(n1, n2, n3));
                }
                else if (type_ === TOP2) {
                    n2 = nstack.pop();
                    n1 = nstack.pop();
                    f = Parser.ops2[item.index_];
                    nstack.push(f(n1, n2));
                }
                else if (type_ === TVAR) {
                    if (item.index_ in values) {
                        nstack.push(values[item.index_]);
                    }
                    else if (item.index_ in Parser.functions) {
                        nstack.push(Parser.functions[item.index_]);
                    }
                    else {
                        throw new Error("undefined variable: " + item.index_);
                    }
                }
                else if (type_ === TOP1) {
                    n1 = nstack.pop();
                    f = Parser.ops1[item.index_];
                    nstack.push(f(n1));
                }
                else if (type_ === SEP) {
                    n2 = nstack.pop();
                    n1 = nstack.pop();
                    nstack.push([n1, n2]);
                }
                else if (type_ === TFUNCALL) {
                    n1 = nstack.pop();
                    f = nstack.pop();

                    if (f.apply && f.call) {
                        if (Object.prototype.toString.call(n1) == "[object Array]") {
                            nstack.push(f.apply(undefined, n1));
                        } else {
                            nstack.push(f.call(undefined, n1));
                        }
                    }
                    else {
                        throw new Error(f + " is not a function");
                    }
                }
                else {
                    throw new Error("invalid Expression");
                }
            }
            if (nstack.length > 1) {
                throw new Error("invalid Expression (parity)");
            }
            return nstack[0];
        },

        variables: function () {
            var L = this.tokens.length;
            var vars = [];
            for (var i = 0; i < L; i++) {
                var item = this.tokens[i];
                if (item.type_ === TVAR && (vars.indexOf(item.index_) == -1)
                    && !(item.index_ in Parser.functions)) {
                    vars.push(item.index_);
                }
            }
            return vars;
        }
    };

    function iff(a, b, c) {
        var vala, valb, valc;
        vala = (a instanceof Array) ? arguments[0].join() : arguments[0];
        valb = (b instanceof Array) ? arguments[1].join() : arguments[1];
        valc = (b instanceof Array) ? arguments[2].join() : arguments[2];
        return vala ? valb : valc;
    }

    function greaterthan(a, b) {
        var vala, valb, numa, numb;
        vala = (a instanceof Array) ? a.join() : a;
        valb = (b instanceof Array) ? b.join() : b;
        numa = toNumber(vala);
        numb = toNumber(valb);
        if (!isNaN(numa) && !isNaN(numa)) {
            return Number(numa) > Number(numb);
        }
        return a > b;
    }

    function lessthan(a, b) {
        var vala, valb, numa, numb;
        vala = (a instanceof Array) ? a.join() : a;
        valb = (b instanceof Array) ? b.join() : b;
        numa = toNumber(vala);
        numb = toNumber(valb);
        if (!isNaN(numa) && !isNaN(numa)) {
            return Number(numa) < Number(numb);
        }
        return a < b;
    }

    function greaterequal(a, b) {
        var vala, valb, numa, numb;
        vala = (a instanceof Array) ? a.join() : a;
        valb = (b instanceof Array) ? b.join() : b;
        numa = toNumber(vala);
        numb = toNumber(valb);
        if (!isNaN(numa) && !isNaN(numa)) {
            return Number(numa) >= Number(numb);
        }
        return a >= b;
    }

    function lessequal(a, b) {
        var vala, valb, numa, numb;
        vala = (a instanceof Array) ? a.join() : a;
        valb = (b instanceof Array) ? b.join() : b;
        numa = toNumber(vala);
        numb = toNumber(valb);
        if (!isNaN(numa) && !isNaN(numa)) {
            return Number(numa) <= Number(numb);
        }
        return a <= b;
    }

    function equal(a, b) {
        var vala, valb, numa, numb;
        vala = (a instanceof Array) ? a.join() : a;
        valb = (b instanceof Array) ? b.join() : b;
        numa = toNumber(vala);
        numb = toNumber(valb);
        if (!isNaN(numa) && !isNaN(numa)) {
            return Number(numa) == Number(numb);
        }
        return a == b;
    }

    function notequal(a, b) {
        var vala, valb, numa, numb;
        vala = (a instanceof Array) ? a.join() : a;
        valb = (b instanceof Array) ? b.join() : b;
        numa = toNumber(vala);
        numb = toNumber(valb);
        if (!isNaN(numa) && !isNaN(numa)) {
            return Number(numa) != Number(numb);
        }
        return a != b;
    }

    // http://qiita.com/south37/items/e400a3a698957ab4aa7a
    // NaN === NaN returns false.
    function isReallyNaN(x) {
        return x !== x;    // if x is NaN returns true, otherwise false.
    }

    function add(a, b) {
        var vala, valb, numa, numb;
        if (isReallyNaN(a) || isReallyNaN(b)) {
            return NaN;
        }
        vala = (a instanceof Array) ? a.join() : a;
        valb = (b instanceof Array) ? b.join() : b;
        numa = toNumber(vala);
        numb = toNumber(valb);
        if (! isNaN(numa) && ! isNaN(numb)) {
            return Number(numa) + Number(numb);
        }
        return vala + valb;
    }

    function sub(a, b) {
        var vala, valb, numa, numb, str, pos;
        if (isReallyNaN(a) || isReallyNaN(b)) {
            return NaN;
        }
        vala = (a instanceof Array) ? a.join() : a;
        valb = (b instanceof Array) ? b.join() : b;
        numa = toNumber(vala);
        numb = toNumber(valb);

        if (! isNaN(numa) && ! isNaN(numb)) {
            return numa - numb;   // Numeric substruct
        }
        str = vala;
        do {  // String substruct
            pos = str.indexOf(valb);
            if (pos > -1) {
                str = str.substr(0, pos) + str.substr(pos + valb.length);
            }
        } while (pos > -1);
        return str;
    }

    function mul(a, b) {
        if (isReallyNaN(a) || isReallyNaN(b)) {
            return NaN;
        }
        a = toNumber(a);
        b = toNumber(b);
        return a * b;
    }

    function div(a, b) {
        if (isReallyNaN(a) || isReallyNaN(b)) {
            return NaN;
        }
        a = toNumber(a);
        b = toNumber(b);
        return a / b;
    }

    function mod(a, b) {
        if (isReallyNaN(a) || isReallyNaN(b)) {
            return NaN;
        }
        a = toNumber(a);
        b = toNumber(b);
        return a % b;
    }

    function neg(a) {
        if (isReallyNaN(a)) {
            return NaN;
        }
        a = toNumber(a);
        return -a;
    }

    function random(a) {
        a = toNumber(a);
        return Math.random() * (a || 1);
    }

    function fac(a) { //a!
        if (isReallyNaN(a)) {
            return NaN;
        }
        a = toNumber(a);
        a = Math.floor(a);
        var b = a;
        while (a > 1) {
            b = b * (--a);
        }
        return b;
    }

    function logicalnot(a) {
        a = (a instanceof Array) ? a.join() : a;
        b = (b instanceof Array) ? b.join() : b;
        return !a;
    }

    function logicaland(a, b) {
        a = (a instanceof Array) ? a.join() : a;
        b = (b instanceof Array) ? b.join() : b;
        return a && b;
    }

    function logicalor(a, b) {
        a = (a instanceof Array) ? a.join() : a;
        b = (b instanceof Array) ? b.join() : b;
        return a || b;
    }

    function sumfunc(a, b, c, d, e) {
        var result = 0, i;

        for (i = 0; i < arguments.length; i++) {
            result += toNumber(arguments[i]);
        }
        return result;
    }

    function averagefunc(a, b, c, d, e) {
        var result = 0, i, count = 0;

        for (i = 0; i < arguments.length; i++) {
            result += toNumber(arguments[i]);
            count++;
        }
        return result / count;
    }

    function roundfunc(a, b) {
        if (b == undefined) {
            return Math.round(a);
        } else {
            a = (a instanceof Array) ? a.join() : a;
            b = (b instanceof Array) ? b.join() : b;
            return INTERMediatorLib.Round(a, b);
        }
    }

    function length(a) {
        if (a == undefined || a == null) {
            return 0;
        } else {
            a = (a instanceof Array) ? a.join() : a;
            return (new String(a)).length;
        }
    }

    /* ===== private ===== */
    Parser.regExDigitSeparator = new RegExp(INTERMediatorLib.digitSeparator()[1]);

    function toNumber(str) {
        var value;

        if (str === undefined) {
            return NaN;
        }
        if (str == "") {
            return 0;
        }
        if (str.replace) {
            value = str.replace(Parser.regExDigitSeparator, '');
        } else {
            value = str;
        }
        value = parseFloat(value);
        if (isNaN(value)) {
            return NaN;
        }
        return value;
    }

    /* ===== private ===== */

    // TODO: use hypot that doesn't overflow
    function pyt(a, b) {
        return Math.sqrt(a * a + b * b);
    }

    function append(a, b) {
        if (Object.prototype.toString.call(a) != "[object Array]") {
            return [a, b];
        }
        a = a.slice();
        a.push(b);
        return a;
    }

    function charsetand(a, b) {
        var stra, strb, i, result = '';
        stra = (a instanceof Array) ? a.join() : a;
        strb = (b instanceof Array) ? b.join() : b;
        for (i = 0; i < stra.length; i++) {
            if (strb.indexOf(stra.substr(i, 1)) > -1) {
                result += stra.substr(i, 1);
            }
        }
        return result;
    }

    function charsetor(a, b) {
        var stra, strb, i, result = '';
        stra = (a instanceof Array) ? a.join() : a;
        strb = (b instanceof Array) ? b.join() : b;
        for (i = 0; i < strb.length; i++) {
            if (stra.indexOf(strb.substr(i, 1)) < 0) {
                result += strb.substr(i, 1);
            }
        }
        return stra + result;
    }

    function charsetnoother(a, b) {
        var stra, strb, i, result = '';
        stra = (a instanceof Array) ? a.join() : a;
        strb = (b instanceof Array) ? b.join() : b;
        for (i = 0; i < stra.length; i++) {
            if (strb.indexOf(stra.substr(i, 1)) < 0) {
                result += stra.substr(i, 1);
            }
        }
        return result;
    }

    /* ===== private ===== */
    function parametersOfMultiline(a, b) {
        var stra, strb, arraya, arrayb, i, nls, nl = "\n";
        stra = (a instanceof Array) ? a.join() : a;
        nls = [stra.indexOf("\r\n"), stra.indexOf("\r"), stra.indexOf("\n")];
        for (i = 0; i < nls.length; i++) {
            nls[i] = (nls[i] < 0) ? stra.length : nls[i];
        }
        if (nls[0] < stra.length && nls[0] <= nls[1] && nls[0] < nls[2]) {
            nl = "\r\n";
        } else if (nls[1] < stra.length && nls[1] < nls[0] && nls[1] < nls[2]) {
            nl = "\r";
        }
        arraya = stra.replace("\r\n", "\n").replace("\r", "\n").split("\n");
        strb = (b instanceof Array) ? b.join() : b;
        arrayb = strb.replace("\r\n", "\n").replace("\r", "\n").split("\n");
        return [arraya, arrayb, nl];
    }

    /* ===== private ===== */

    function itemsetand(a, b) {
        var params, arraya, arrayb, nl, i, result = '';
        params = parametersOfMultiline(a, b);
        arraya = params[0];
        arrayb = params[1];
        nl = params[2];
        for (i = 0; i < arraya.length; i++) {
            if (arrayb.indexOf(arraya[i]) > -1 && arraya[i].length > 0) {
                result += arraya[i] + nl;
            }
        }
        return result;
    }

    function itemsetor(a, b) {
        var params, arraya, arrayb, nl, i, result = '';
        params = parametersOfMultiline(a, b);
        arraya = params[0];
        arrayb = params[1];
        nl = params[2];
        for (i = 0; i < arraya.length; i++) {
            if (arraya[i].length > 0) {
                result += arraya[i] + nl;
            }
        }
        for (i = 0; i < arrayb.length; i++) {
            if (arraya.indexOf(arrayb[i]) < 0 && arrayb[i].length > 0) {
                result += arrayb[i] + nl;
            }
        }
        return result;
    }

    function itemsetnoother(a, b) {
        var params, arraya, arrayb, nl, i, result = '';
        params = parametersOfMultiline(a, b);
        arraya = params[0];
        arrayb = params[1];
        nl = params[2];
        for (i = 0; i < arraya.length; i++) {
            if (arrayb.indexOf(arraya[i]) < 0 && arraya[i].length > 0) {
                result += arraya[i] + nl;
            }
        }
        return result;
    }

    function itematindex(a, start, end) {
        var params, arraya, nl, i, result = '';
        params = parametersOfMultiline(a, '');
        arraya = params[0];
        nl = params[2];
        end = (end == undefined) ? arraya.length : end;
        for (i = start; (i < start + end ) && (i < arraya.length); i++) {
            result += arraya[i] + nl;
        }
        return result;
    }

    function numberformat(val, digit) {
        var stra, strb;
        stra = (val instanceof Array) ? val.join() : val;
        strb = (digit instanceof Array) ? digit.join() : digit;
        return INTERMediatorLib.numberFormat(stra, strb);
    }

    function substr(str, pos, len) {
        var stra, p, l;
        stra = (str instanceof Array) ? str.join() : str;
        p = (pos instanceof Array) ? pos.join() : pos;
        l = (len instanceof Array) ? len.join() : len;

        return stra.substr(p, l);
    }

    function substring(str, start, end) {
        var stra, s, e;
        stra = (str instanceof Array) ? str.join() : str;
        s = (start instanceof Array) ? start.join() : start;
        e = (end instanceof Array) ? end.join() : end;

        return stra.substring(s, e);
    }

    function indexof(str, search) {
        var stra, s;
        stra = (str instanceof Array) ? str.join() : str;
        s = (search instanceof Array) ? search.join() : search;
        return stra.indexOf(s);
    }

    function replace(str, start, end, rep) {
        var stra, s, e, r;
        stra = (str instanceof Array) ? str.join() : str;
        s = (start instanceof Array) ? start.join() : start;
        e = (end instanceof Array) ? end.join() : end;
        r = (rep instanceof Array) ? rep.join() : rep;
        return stra.substr(0, s) + r + stra.substr(e);
    }

    function substitute(str, search, rep) {
        var stra, s, r, reg;
        stra = (str instanceof Array) ? str.join() : str;
        s = (search instanceof Array) ? search.join() : search;
        r = (rep instanceof Array) ? rep.join() : rep;
        reg = new RegExp(s, 'g');
        return stra.replace(reg, r);
    }

    Parser.timeOffset = (new Date()).getTimezoneOffset();

    function DateInt(str) {
        var theDate;
        if (str === undefined)  {
            theDate = Date.now();
        } else {
            theDate = Date.parse(str.replace(/-/g, "/"));
            theDate -= Parser.timeOffset * 60000;
        }
        return parseInt(theDate / 86400000);
    }

    function SecondInt(str) {
        var theDate;
        if (str === undefined)  {
            theDate = Date.now();
        } else {
            theDate = Date.parse(str.replace(/-/g, "/"));
            //theDate -= Parser.timeOffset * 60000;
        }
        return parseInt(theDate / 1000);
    }

    /* Internal use for date time functions */
    function dvalue(s) {
        if (parseInt(s).length == s.length) {
            return s;
        } else {
            return DateInt(s);
        }
    }
    function dtvalue(s) {
        if (parseInt(s).length == s.length) {
            return s;
        } else {
            return SecondInt(s);
        }
    }
    function calcDateComponent(d, a, index) {
        var dtComp = [];
        dtComp.push(yeard(d));
        dtComp.push(monthd(d));
        dtComp.push(dayd(d));
        dtComp[index] += a;
        return datecomponents(dtComp[0], dtComp[1], dtComp[2]);
    }
    function calcDateTimeComponent(dt, a, index) {
        var dtComp = [];
        dtComp.push(yeardt(dt));
        dtComp.push(monthdt(dt));
        dtComp.push(daydt(dt));
        dtComp.push(hourdt(dt));
        dtComp.push(minutedt(dt));
        dtComp.push(seconddt(dt));
        dtComp[index] += a;
        return datetimecomponents(dtComp[0], dtComp[1], dtComp[2], dtComp[3], dtComp[4], dtComp[5]);
    }
    /* - - - - - - - - - - - - - - - - - - - */

    function datecomponents(y, m, d)   {
        var m0 = m - 1;
        if (m0 < 0 || m0 > 11)  {
            y += parseInt(m0 / 12);
            m = m0 % 12 + 1;
        }
        //var str = parseInt(y) + "/" + ("0" + parseInt(m)).substr(-2, 2) + "/01";
        var dt = parseInt(Date.UTC(y, m-1, d, 0, 0, 0) / 86400000);
        //dt += (d - 1);
        return dt;
    }
    function datetimecomponents(y, m, d, h, i, s)   {
        if (s < 0 || s > 59)  {
            i += parseInt(s / 60);
            s = s % 60;
        }
        if (i < 0 || i > 59)  {
            h += parseInt(i / 60);
            i = i % 60;
        }
        if (h < 0 || h > 23)  {
            d += parseInt(h / 24);
            h = h % 24;
        }
        var m0 = m - 1;
        if (m0 < 0 || m0 > 11)  {
            y += parseInt(m0 / 12);
            m = m0 % 12 + 1;
        }
        //var str = parseInt(y) + "/" + ("0" + parseInt(m)).substr(-2, 2) + "/01 " +
        //    ("0" + parseInt(h)).substr(-2, 2) + ":" + ("0" + parseInt(i)).substr(-2, 2) + ":" +
        //    ("0" + parseInt(s)).substr(-2, 2);
        var dt = Date.UTC(y, m-1, d, h, i, s) / 1000;
        //dt += ((d - 1) * 86400);
        return dt;
    }
    function yearAlt(d)   {
        return INTERMediator.dateTimeFunction ? yeardt(d) : yeard(d);
    }
    function monthAlt(d)   {
        return INTERMediator.dateTimeFunction ? monthdt(d) : monthd(d);
    }
    function dayAlt(d)   {
        return INTERMediator.dateTimeFunction ? daydt(d) : dayd(d);
    }
    function weekdayAlt(d)   {
        return INTERMediator.dateTimeFunction ? weekdaydt(d) : weekdayd(d);
    }
    function hourAlt(d)   {
        return INTERMediator.dateTimeFunction ? hourdt(d) : 0;
    }
    function minuteAlt(d)   {
        return INTERMediator.dateTimeFunction ? minutedt(d) : 0;
    }
    function secondAlt(d)   {
        return INTERMediator.dateTimeFunction ? seconddt(d) : 0;
    }
    function yeard(d)   {
        return new Date(dvalue(d) * 86400000).getFullYear();
    }
    function monthd(d)   {
        return new Date(dvalue(d) * 86400000).getMonth() + 1;
    }
    function dayd(d)   {
        return new Date(dvalue(d) * 86400000).getDate();
    }
    function weekdayd(d)   {
        return new Date(dvalue(d) * 86400000).getDay();
    }
    function yeardt(dt)   {
        return new Date(dtvalue(dt) * 1000).getFullYear();
    }
    function monthdt(dt)   {
        return new Date(dtvalue(dt) * 1000).getMonth() + 1;
    }
    function daydt(dt)   {
        return new Date(dtvalue(dt) * 1000).getDate();
    }
    function weekdaydt(dt)   {
        return new Date(dtvalue(dt) * 1000).getDay();
    }
    function hourdt(dt)   {
        return new Date(dtvalue(dt) * 1000).getHours();
    }
    function minutedt(dt)   {
        return new Date(dtvalue(dt) * 1000).getMinutes();
    }
    function seconddt(dt)   {
        return new Date(dtvalue(dt) * 1000).getSeconds();
    }
    function addyear(d, a)   {
        return INTERMediator.dateTimeFunction ? addyeardt(d, a) : addyeard(d, a);
    }
    function addmonth(d, a)   {
        return INTERMediator.dateTimeFunction ? addmonthdt(d, a) : addmonthd(d, a);
    }
    function addday(d, a)   {
        return INTERMediator.dateTimeFunction ? adddaydt(d, a) : adddayd(d, a);
    }
    function addhour(d, a)   {
        return INTERMediator.dateTimeFunction ? addhourdt(d, a) : NaN;
    }
    function addminute(d, a)   {
        return INTERMediator.dateTimeFunction ? addminutedt(d, a) : NaN;
    }
    function addsecond(d, a)   {
        return INTERMediator.dateTimeFunction ? addseconddt(d, a) : NaN;
    }
    function addyeard(d, a)   {
        return calcDateComponent(d, a, 0);
    }
    function addmonthd(d, a)   {
        return calcDateComponent(d, a, 1);
    }
    function adddayd(d, a)   {
        return calcDateComponent(d, a, 2);
    }
    function addyeardt(dt, a)   {
        return calcDateTimeComponent(dt, a, 0);
    }
    function addmonthdt(dt, a)   {
        return calcDateTimeComponent(dt, a, 1);
    }
    function adddaydt(dt, a)   {
        return calcDateTimeComponent(dt, a, 2);
    }
    function addhourdt(dt, a)   {
        return calcDateTimeComponent(dt, a, 3);
    }
    function addminutedt(dt, a)   {
        return calcDateTimeComponent(dt, a, 4);
    }
    function addseconddt(dt, a)   {
        return calcDateTimeComponent(dt, a, 5);
    }
    function endofmonth(d)   {
        return INTERMediator.dateTimeFunction ? endofmonthdt(d) : endofmonthd(d);
    }
    function endofmonthd(d)   {
        return adddayd(addmonthd(startofmonthd(d), 1), -1);
    }
    function endofmonthdt(dt)   {
        return addseconddt(addmonthdt(startofmonthdt(dt), 1), -1);
    }
    function startofmonth(d)   {
        return INTERMediator.dateTimeFunction ? startofmonthdt(d) : startofmonthd(d);
    }
    function startofmonthd(d)   {
        var str = yeard(d) + "/" + ("0" + monthd(d)).substr(-2, 2) + "/01";
        var dt = DateInt(str);
        return dt;
    }
    function startofmonthdt(dt)   {
        var str = yeardt(dt) + "/" + ("0" + monthdt(dt)).substr(-2, 2) + "/01 00:00:00";
        console.log(str);
        return SecondInt(str);
    }
    function today()   {
        return parseInt(Date.now() / 86400);
    }
    function nowFunction()   {
        return parseInt(Date.now() / 1000);
    }

    function Parser() {
        this.success = false;
        this.errormsg = "";
        this.expression = "";

        this.pos = 0;

        this.tokennumber = 0;
        this.tokenprio = 0;
        this.tokenindex = 0;
        this.tmpprio = 0;

        Parser.functions = {
            "random": random,
            "fac": fac,
            "min": Math.min,
            "max": Math.max,
            "pyt": pyt,
            "pow": Math.pow,
            "atan2": Math.atan2,
            "if": iff,
            "sum": sumfunc,
            "average": averagefunc,
            "format": numberformat,
            "substr": substr,
            "substring": substring,
            "indexof": indexof,
            "replace": replace,
            "substitute": substitute,
            "sin": Math.sin,
            "cos": Math.cos,
            "tan": Math.tan,
            "asin": Math.asin,
            "acos": Math.acos,
            "atan": Math.atan,
            "sqrt": Math.sqrt,
            "log": Math.log,
            "abs": Math.abs,
            "ceil": Math.ceil,
            "floor": Math.floor,
            "round": roundfunc,
            "exp": Math.exp,
            "items": itematindex,
            "length": length,
            "datetime": SecondInt,
            "date": DateInt,
            "datecomponents": datecomponents,
            "datetimecomponents": datetimecomponents,
            "year": yearAlt,
            "month": monthAlt,
            "day": dayAlt,
            "weekday": weekdayAlt,
            "hour": hourAlt,
            "minute": minuteAlt,
            "second": secondAlt,
            "yeard": yeard,
            "monthd": monthd,
            "dayd": dayd,
            "weekdayd": weekdayd,
            "yeardt": yeardt,
            "monthdt": monthdt,
            "daydt": daydt,
            "weekdaydt": weekdaydt,
            "hourdt": hourdt,
            "minutedt": minutedt,
            "seconddt": seconddt,
            "addyear": addyear,
            "addmonth": addmonth,
            "addday": addday,
            "addhour": addhour,
            "addminute": addminute,
            "addsecond": addsecond,
            "addyeard": addyeard,
            "addmonthd": addmonthd,
            "adddayd": adddayd,
            "addyeardt": addyeardt,
            "addmonthdt": addmonthdt,
            "adddaydt": adddaydt,
            "addhourdt": addhourdt,
            "addminutedt": addminutedt,
            "addseconddt": addseconddt,
            "endofmonth": endofmonth,
            "startofmonth": startofmonth,
            "endofmonthd": endofmonthd,
            "startofmonthd": startofmonthd,
            "endofmonthdt": endofmonthdt,
            "startofmonthdt": startofmonthdt,
            "today": today,
            "now": nowFunction
        };

        this.consts = {
            "E": Math.E,
            "PI": Math.PI
        };

        Parser.operators = {
            //    "-": [1, neg, 2], The minus operatior should be specially handled.
            "!": [1, logicalnot, 2],
            "+": [2, add, 4],
            "-": [2, sub, 4],
            "*": [2, mul, 3],
            "/": [2, div, 3],
            "%": [2, mod, 3],
            "^": [2, Math.pow, 1],
            ",": [2, append, 15],
            ">": [2, greaterthan, 6],
            "<": [2, lessthan, 6],
            ">=": [2, greaterequal, 6],
            "<=": [2, lessequal, 6],
            "==": [2, equal, 7],
            "=": [2, equal, 7],
            "!=": [2, notequal, 7],
            "<>": [2, notequal, 7],
            "&&": [2, logicaland, 11],
            "||": [2, logicalor, 12],
            "∩": [2, charsetand, 3],
            "∪": [2, charsetor, 4],
            "⊁": [2, charsetnoother, 4],
            "⋀": [2, itemsetand, 3],
            "⋁": [2, itemsetor, 4],
            "⊬": [2, itemsetnoother, 4],
            "?": [2, iff, 13],
            ":": [4, iff, 13]
        };

        Parser.ops1 = {
            "-": neg//,   // The minus operatior should be specially handled.
        };
        Parser.ops2 = {};
        Parser.ops3 = {};
        Parser.ops3Trail = {};

        for (var op in Parser.operators) {
            switch (Parser.operators[op][0]) {
                case 1:
                    Parser.ops1[op] = Parser.operators[op][1];
                    break;
                case 2:
                    Parser.ops2[op] = Parser.operators[op][1];
                    break;
                case 3:
                    Parser.ops3[op] = Parser.operators[op][1];
                    break;
                case 4:
                    Parser.ops3Trail[op] = Parser.operators[op][1];
                    break;
            }
        }

    }

    Parser.parse = function (expr) {
        return new Parser().parse(expr);
    };

    Parser.evaluate = function (expr, variables) {
        return Parser.parse(expr).evaluate(variables);
    };

    Parser.Expression = Expression;

    var PRIMARY = 1 << 0;
    var OPERATOR = 1 << 1;
    var FUNCTION = 1 << 2;
    var LPAREN = 1 << 3;
    var RPAREN = 1 << 4;
    var COMMA = 1 << 5;
    var SIGN = 1 << 6;
    var CALL = 1 << 7;
    var NULLARY_CALL = 1 << 8;

    Parser.prototype = {
        parse: function (expr) {
            this.errormsg = "";
            this.success = true;
            var operstack = [];
            var tokenstack = [];
            this.tmpprio = 0;
            var expected = (PRIMARY | LPAREN | FUNCTION | SIGN);
            var noperators = 0;
            this.expression = expr;
            this.pos = 0;
            var funcstack = [];

            while (this.pos < this.expression.length) {
                if (this.isOperator()) {
                    if (this.isSign() && (expected & SIGN)) {
                        if (this.isNegativeSign()) {
                            this.tokenprio = 2;
                            this.tokenindex = "-";
                            noperators++;
                            this.addfunc(tokenstack, operstack, TOP1);
                        }
                        expected = (PRIMARY | LPAREN | FUNCTION | SIGN);
                    }
                    else if (this.isComment()) {

                    }
                    else {
                        if ((expected & OPERATOR) === 0) {
                            this.error_parsing(this.pos, "unexpected operator");
                        }
                        if (this.tokenindex == "?") {
                            this.tmpprio -= 40;
                            this.tokenindex = "if";
                            this.addfunc(tokenstack, operstack, TOP2);
                            this.tmpprio += 40;
                            this.tokenindex = ",";
                            noperators += 3;
                            this.addfunc(tokenstack, operstack, TOP2);
                        } else if (this.tokenindex == ":") {
                            this.tokenindex = ",";
                            noperators += 2;
                            this.addfunc(tokenstack, operstack, TOP2);
                        } else /* if (this.tokenindex != ",") */ {
                            noperators += 2;
                            this.addfunc(tokenstack, operstack, TOP2);
                        }
                        expected = (PRIMARY | LPAREN | FUNCTION | SIGN);
                    }
                }
                else if (this.isNumber()) {
                    if ((expected & PRIMARY) === 0) {
                        this.error_parsing(this.pos, "unexpected number");
                    }
                    var token = new Token(TNUMBER, 0, 0, this.tokennumber);
                    tokenstack.push(token);

                    expected = (OPERATOR | RPAREN | COMMA);
                }
                else if (this.isString()) {
                    if ((expected & PRIMARY) === 0) {
                        this.error_parsing(this.pos, "unexpected string");
                    }
                    var token = new Token(TNUMBER, 0, 0, this.tokennumber);
                    tokenstack.push(token);

                    expected = (OPERATOR | RPAREN | COMMA);
                }
                else if (this.isLeftParenth()) {
                    if ((expected & LPAREN) === 0) {
                        this.error_parsing(this.pos, "unexpected \"(\"");
                    }

                    if (expected & CALL) {
                        funcstack.push(true);
                    } else {
                        funcstack.push(false);
                    }
                    expected = (PRIMARY | LPAREN | FUNCTION | SIGN | NULLARY_CALL);
                }
                else if (this.isRightParenth()) {
                    var isFunc = funcstack.pop();
                    if (isFunc) {
                        noperators += 2;
                        this.tokenprio = -2;
                        this.tokenindex = -1;
                        this.addfunc(tokenstack, operstack, TFUNCALL);
                    }

                    if (expected & NULLARY_CALL) {
                        var token = new Token(TNUMBER, 0, 0, []);
                        tokenstack.push(token);
                    }
                    else if ((expected & RPAREN) === 0) {
                        this.error_parsing(this.pos, "unexpected \")\"");
                    }

                    expected = (OPERATOR | RPAREN | COMMA | LPAREN | CALL);
                }
                else if (this.isConst()) {
                    if ((expected & PRIMARY) === 0) {
                        this.error_parsing(this.pos, "unexpected constant");
                    }
                    var consttoken = new Token(TNUMBER, 0, 0, this.tokennumber);
                    tokenstack.push(consttoken);
                    expected = (OPERATOR | RPAREN | COMMA);
                }
                else if (this.isVar()) {
                    if ((expected & PRIMARY) === 0) {
                        this.error_parsing(this.pos, "unexpected variable");
                    }
                    var vartoken = new Token(TVAR, this.tokenindex, 0, 0);
                    tokenstack.push(vartoken);
                    expected = (OPERATOR | RPAREN | COMMA | LPAREN | CALL);
                }
                else if (this.isWhite()) {
                }
                else {
                    if (this.errormsg === "") {
                        this.error_parsing(this.pos, "unknown character");
                    }
                    else {
                        this.error_parsing(this.pos, this.errormsg);
                    }
                }
            }
            if (this.tmpprio < 0 || this.tmpprio >= 10) {
                this.error_parsing(this.pos, "unmatched \"()\"");
            }
            while (operstack.length > 0) {
                var tmp = operstack.pop();
                tokenstack.push(tmp);
            }
//            if (noperators + 1 !== tokenstack.length) {
//                this.error_parsing(this.pos, "parity");
//            }

            return new Expression(tokenstack);
        },

        evaluate: function (expr, variables) {
            return this.parse(expr).evaluate(variables);
        },

        error_parsing: function (column, msg) {
            this.success = false;
            this.errormsg = "parse error [column " + (column) + "]: " + msg;
            throw new Error(this.errormsg);
        },

//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\

        addfunc: function (tokenstack, operstack, type_) {
            var operator = new Token(type_, this.tokenindex, this.tokenprio + this.tmpprio, 0);
            while (operstack.length > 0) {
                if (operator.prio_ >= operstack[operstack.length - 1].prio_) {
                    tokenstack.push(operstack.pop());
                }
                else {
                    break;
                }
            }
            operstack.push(operator);
        },

        isNumber: function () {
            var r = false;
            var str = "";
            while (this.pos < this.expression.length) {
                var code = this.expression.charCodeAt(this.pos);
                if ((code >= 48 && code <= 57) || code === 46) {
                    str += this.expression.charAt(this.pos);
                    this.pos++;
                    this.tokennumber = parseFloat(str);
                    r = true;
                }
                else {
                    break;
                }
            }
            return r;
        },

        // Ported from the yajjl JSON parser at http://code.google.com/p/yajjl/
        unescape: function (v, pos) {
            var buffer = [];
            var escaping = false;

            for (var i = 0; i < v.length; i++) {
                var c = v.charAt(i);

                if (escaping) {
                    switch (c) {
                        case "'":
                            buffer.push("'");
                            break;
                        case '\\':
                            buffer.push('\\');
                            break;
                        case '/':
                            buffer.push('/');
                            break;
                        case 'b':
                            buffer.push('\b');
                            break;
                        case 'f':
                            buffer.push('\f');
                            break;
                        case 'n':
                            buffer.push('\n');
                            break;
                        case 'r':
                            buffer.push('\r');
                            break;
                        case 't':
                            buffer.push('\t');
                            break;
                        case 'u':
                            // interpret the following 4 characters as the hex of the unicode code point
                            var codePoint = parseInt(v.substring(i + 1, i + 5), 16);
                            buffer.push(String.fromCharCode(codePoint));
                            i += 4;
                            break;
                        default:
                            throw this.error_parsing(pos + i, "Illegal escape sequence: '\\" + c + "'");
                    }
                    escaping = false;
                } else {
                    if (c == '\\') {
                        escaping = true;
                    } else {
                        buffer.push(c);
                    }
                }
            }

            return buffer.join('');
        },

        isString: function () {
            var r = false;
            var str = "";
            var startpos = this.pos;
            if (this.pos < this.expression.length && this.expression.charAt(this.pos) == "'") {
                this.pos++;
                while (this.pos < this.expression.length) {
                    var code = this.expression.charAt(this.pos);
                    if (code != "'" || str.slice(-1) == "\\") {
                        str += this.expression.charAt(this.pos);
                        this.pos++;
                    }
                    else {
                        this.pos++;
                        this.tokennumber = this.unescape(str, startpos);
                        r = true;
                        break;
                    }
                }
            }
            return r;
        },

        isConst: function () {
            var str;
            for (var i in this.consts) {
                if (true) {
                    var L = i.length;
                    str = this.expression.substr(this.pos, L);
                    if (i === str) {
                        this.tokennumber = this.consts[i];
                        this.pos += L;
                        return true;
                    }
                }
            }
            return false;
        },

        isOperator: function () {
            var code;
            if (this.pos + 1 < this.expression.length) {
                code = this.expression.substr(this.pos, 2);
                if (Parser.operators[code]) {
                    this.tokenprio = Parser.operators[code][2];
                    this.tokenindex = code;
                    this.pos += 2;
                    return true;
                }
            }
            code = this.expression.substr(this.pos, 1);
            if (Parser.operators[code]) {
                this.tokenprio = Parser.operators[code][2];
                this.tokenindex = code;
                this.pos++;
                return true;
            }
            return false;
        },

        isSign: function () {
            var code = this.expression.charCodeAt(this.pos - 1);
            if (code === 45 || code === 43) { // -
                return true;
            }
            return false;
        },

        isPositiveSign: function () {
            var code = this.expression.charCodeAt(this.pos - 1);
            if (code === 43) { // -
                return true;
            }
            return false;
        },

        isNegativeSign: function () {
            var code = this.expression.charCodeAt(this.pos - 1);
            if (code === 45) { // -
                return true;
            }
            return false;
        },

        isLeftParenth: function () {
            var code = this.expression.charCodeAt(this.pos);
            if (code === 40) { // (
                this.pos++;
                this.tmpprio -= 20;
                return true;
            }
            return false;
        },

        isRightParenth: function () {
            var code = this.expression.charCodeAt(this.pos);
            if (code === 41) { // )
                this.pos++;
                this.tmpprio += 20;
                return true;
            }
            return false;
        },

        isComma: function () {
            var code = this.expression.charCodeAt(this.pos);
            if (code === 44) { // ,
                this.pos++;
                this.tokenprio = 15;
                this.tokenindex = ",";
                return true;
            }
            return false;
        },

        isWhite: function () {
            var code = this.expression.charCodeAt(this.pos);
            if (code === 32 || code === 9 || code === 10 || code === 13) {
                this.pos++;
                return true;
            }
            return false;
        },

        isVar: function () {
            var str = "";
            for (var i = this.pos; i < this.expression.length; i++) {
                var c = this.expression.charAt(i);
                if (i === this.pos) {
                    if (!c.match(Parser.regFirstVarChar)) {
                        break;
                    }
                } else {
                    if (!c.match(Parser.regRestVarChar)) {
                        break;
                    }
                }
                str += c;
            }
            if (str.length > 0) {
                this.tokenindex = str;
                this.tokenprio = 0;
                this.pos += str.length;
                return true;
            }
            return false;
        },

        isComment: function () {
            var code = this.expression.charCodeAt(this.pos - 1);
            if (code === 47 && this.expression.charCodeAt(this.pos) === 42) {
                this.pos = this.expression.indexOf("*/", this.pos) + 2;
                if (this.pos === 1) {
                    this.pos = this.expression.length;
                }
                return true;
            }
            return false;
        }
    };

    scope.Parser = Parser;
    return Parser
})(typeof exports === 'undefined' ? {} : exports);
/*
 * INTER-Mediator Ver.4.6 Released 2014-12-30
 *
 *   by Masayuki Nii  msyk@msyk.net Copyright (c) 2010-2014 Masayuki Nii, All rights reserved.
 *
 *   This project started at the end of 2009.
 *   INTER-Mediator is supplied under MIT License.
 */
/*
  This source file should be described statements to execute on the loading time of header's script tag.
 */

INTERMediator.propertyIETridentSetup();

if (INTERMediator.isIE && INTERMediator.ieVersion < 9) {
    INTERMediator.startFrom = 0;
    INTERMediator.pagedSize = 0;
    INTERMediator.additionalCondition = {};
    INTERMediator.additionalSortKey = {};
} else {
    Object.defineProperty(INTERMediator, 'startFrom', {
        get: function () {
            return INTERMediator.getLocalProperty("_im_startFrom", 0);
        },
        set: function (value) {
            INTERMediator.setLocalProperty("_im_startFrom", value);
        }
    });
    Object.defineProperty(INTERMediator, 'pagedSize', {
        get: function () {
            return INTERMediator.getLocalProperty("_im_pagedSize", 0);
        },
        set: function (value) {
            INTERMediator.setLocalProperty("_im_pagedSize", value);
        }
    });
    Object.defineProperty(INTERMediator, 'additionalCondition', {
        get: function () {
            return INTERMediator.getLocalProperty("_im_additionalCondition", {});
        },
        set: function (value) {
            INTERMediator.setLocalProperty("_im_additionalCondition", value);
        }
    });
    Object.defineProperty(INTERMediator, 'additionalSortKey', {
        get: function () {
            return INTERMediator.getLocalProperty("_im_additionalSortKey", {});
        },
        set: function (value) {
            INTERMediator.setLocalProperty("_im_additionalSortKey", value);
        }
    });
}

if (!INTERMediator.additionalCondition) {
    INTERMediator.additionalCondition = {};
}

if (!INTERMediator.additionalSortKey) {
    INTERMediator.additionalSortKey = {};
}


INTERMediatorLib.addEvent(window, "beforeunload", function (e) {
    var confirmationMessage = "";

//    (e || window.event).returnValue = confirmationMessage;     //Gecko + IE
//    return confirmationMessage;                                //Webkit, Safari, Chrome etc.

});

INTERMediatorLib.addEvent(window, "unload", function (e) {
    INTERMediator_DBAdapter.unregister();
});

// ****** This file should terminate on the new line. INTER-Mediator adds some codes before here. ****


