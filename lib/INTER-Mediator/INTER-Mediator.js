/*
 * INTER-Mediator
 * Copyright (c) INTER-Mediator Directive Committee (http://inter-mediator.org)
 * This project started at the end of 2009 by Masayuki Nii msyk@msyk.net.
 *
 * INTER-Mediator is supplied under MIT License.
 * Please see the full license for details:
 * https://github.com/INTER-Mediator/INTER-Mediator/blob/master/dist-docs/License.txt
 */

//'use strict';

var INTERMediator = {
    /*
     Properties
     */
    debugMode: false,
    // Show the debug messages at the top of the page.
    separator: '@',
    // This must be referred as 'INTERMediator.separator'. Don't use 'this.separator'
    defDivider: '|',
    // Same as the 'separator'.
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
    isEdge: false,
    ieVersion: -1,
    titleAsLinkInfo: true,
    classAsLinkInfo: true,
    isDBDataPreferable: false,
    noRecordClassName: '_im_for_noresult_',
    //   nullAcceptable: true,

    rootEnclosure: null,
    // Storing to retrieve the page to initial condition.
    // {node:xxx, parent:xxx, currentRoot:xxx, currentAfter:xxxx}

    useSessionStorage: true,
    // Use sessionStorage for the Local Context instead of Cookie.

    errorMessages: [],
    debugMessages: [],

    partialConstructing: true,
    linkedElmCounter: 0,
    pusherObject: null,
    buttonIdNum: 0,
    masterNodeOriginalDisplay: 'block',
    detailNodeOriginalDisplay: 'none',
    pusherAvailable: false,

    dateTimeFunction: false,
    postOnlyNodes: null,
    postOnlyNumber: 1,

    errorMessageByAlert: false,
    errorMessageOnAlert: null,

    isTablet: false,
    isMobile: false,

    crossTableStage: 0, // 0: not cross table, 1: column label, 2: row label, 3 interchange cells

    /* These following properties moved to the setter/getter architecture, and defined out side of this object.
     startFrom: 0,pagedSize: 0,additionalCondition: {},additionalSortKey: {},
     */

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
                console.log('INTER-Mediator[DEBUG:%s]: %s', new Date(), message);
            }
        }
    },

    setErrorMessage: function (ex, moreMessage) {
        moreMessage = moreMessage === undefined ? '' : (' - ' + moreMessage);

        if (INTERMediator.errorMessageByAlert) {
            alert(INTERMediator.errorMessageOnAlert === null ?
                (ex + moreMessage) : INTERMediator.errorMessageOnAlert);
        }

        if ((typeof ex == 'string' || ex instanceof String)) {
            INTERMediator.errorMessages.push(ex + moreMessage);
            if (typeof console != 'undefined') {
                console.error('INTER-Mediator[ERROR]: %s', ex + moreMessage);
            }
        } else {
            if (ex.message) {
                INTERMediator.errorMessages.push(ex.message + moreMessage);
                if (typeof console != 'undefined') {
                    console.error('INTER-Mediator[ERROR]: %s', ex.message + moreMessage);
                }
            }
            if (ex.stack && typeof console != 'undefined') {
                console.error(ex.stack);
            }
        }
    },

    flushMessage: function () {
        var debugNode, title, body, i, j, lines, clearButton, tNode, target;

        if (INTERMediator.errorMessageByAlert) {
            INTERMediator.supressErrorMessageOnPage = true;
        }
        if (!INTERMediator.supressErrorMessageOnPage &&
            INTERMediator.errorMessages.length > 0) {
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
                '============ERROR MESSAGE on ' + new Date() + '============'));
            debugNode.appendChild(document.createElement('hr'));
            for (i = 0; i < INTERMediator.errorMessages.length; i++) {
                lines = INTERMediator.errorMessages[i].split(IMLib.nl_char);
                for (j = 0; j < lines.length; j++) {
                    if (j > 0) {
                        debugNode.appendChild(document.createElement('br'));
                    }
                    debugNode.appendChild(document.createTextNode(lines[j]));
                }
                debugNode.appendChild(document.createElement('hr'));
            }
        }
        if (!INTERMediator.supressDebugMessageOnPage &&
            INTERMediator.debugMode &&
            INTERMediator.debugMessages.length > 0) {
            debugNode = document.getElementById('_im_debug_panel_4873643897897');
            if (debugNode === null) {
                debugNode = document.createElement('div');
                debugNode.setAttribute('id', '_im_debug_panel_4873643897897');
                debugNode.style.backgroundColor = '#DDDDDD';
                clearButton = document.createElement('button');
                clearButton.setAttribute('title', 'clear');
                INTERMediatorLib.addEvent(clearButton, 'click', function (e) {
                    target = document.getElementById('_im_debug_panel_4873643897897');
                    target.parentNode.removeChild(target);
                    e.preventDefault();
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
                '============DEBUG INFO on ' + new Date() + '============ '));
            if (INTERMediatorOnPage.getEditorPath()) {
                var aLink = document.createElement('a');
                aLink.setAttribute('href', INTERMediatorOnPage.getEditorPath());
                aLink.appendChild(document.createTextNode('Definition File Editor'));
                debugNode.appendChild(aLink);
            }
            debugNode.appendChild(document.createElement('hr'));
            for (i = 0; i < INTERMediator.debugMessages.length; i++) {
                lines = INTERMediator.debugMessages[i].split(IMLib.nl_char);
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
        var ua, position, c, i;
        ua = navigator.userAgent;
        position = ua.toLocaleUpperCase().indexOf('MSIE');
        if (position >= 0) {
            INTERMediator.isIE = true;
            for (i = position + 4; i < ua.length; i++) {
                c = ua.charAt(i);
                if (!(c == ' ' || c == '.' || (c >= '0' && c <= '9'))) {
                    INTERMediator.ieVersion = INTERMediatorLib.toNumber(ua.substring(position + 4, i));
                    break;
                }
            }
        }
        position = ua.indexOf('; Trident/');
        if (position >= 0) {
            INTERMediator.isTrident = true;
            for (i = position + 10; i < ua.length; i++) {
                c = ua.charAt(i);
                if (!(c == ' ' || c == '.' || (c >= '0' && c <= '9'))) {
                    INTERMediator.ieVersion = INTERMediatorLib.toNumber(ua.substring(position + 10, i)) + 4;
                    break;
                }
            }
        }
        position = ua.indexOf(' Edge/');
        if (position >= 0) {
            INTERMediator.isEdge = true;
            for (i = position + 6; i < ua.length; i++) {
                c = ua.charAt(i);
                if (!(c == ' ' || c == '.' || (c >= '0' && c <= '9')) || i === ua.length - 1) {
                    INTERMediator.ieVersion = INTERMediatorLib.toNumber(ua.substring(position + 6, i));
                    break;
                }
            }
        }
    },

    // Referred from https://w3g.jp/blog/js_browser_sniffing2015
    propertyW3CUserAgentSetup: function () {
        var u = window.navigator.userAgent.toLowerCase();
        INTERMediator.isTablet =
            (u.indexOf('windows') != -1 && u.indexOf('touch') != -1 && u.indexOf('tablet pc') == -1)
            || u.indexOf('ipad') != -1
            || (u.indexOf('android') != -1 && u.indexOf('mobile') == -1)
            || (u.indexOf('firefox') != -1 && u.indexOf('tablet') != -1)
            || u.indexOf('kindle') != -1
            || u.indexOf('silk') != -1
            || u.indexOf('playbook') != -1;
        INTERMediator.isMobile =
            (u.indexOf('windows') != -1 && u.indexOf('phone') != -1)
            || u.indexOf('iphone') != -1
            || u.indexOf('ipod') != -1
            || (u.indexOf('android') != -1 && u.indexOf('mobile') != -1)
            || (u.indexOf('firefox') != -1 && u.indexOf('mobile') != -1)
            || u.indexOf('blackberry') != -1;
    },

    initialize: function () {
        INTERMediatorOnPage.removeCookie('_im_localcontext');
        //INTERMediatorOnPage.removeCookie('_im_username');
        //INTERMediatorOnPage.removeCookie('_im_credential');
        //INTERMediatorOnPage.removeCookie('_im_mediatoken');

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
            if (INTERMediatorOnPage.isFinishToConstruct) {
                return;
            }
            INTERMediatorOnPage.isFinishToConstruct = true;

            timerTask = function () {
                INTERMediator.constructMain(true);
            };
        } else {
            timerTask = function () {
                INTERMediator.constructMain(indexOfKeyFieldObject);
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
        var i, theNode, postSetFields = [],
            eventListenerPostAdding = [], isInsidePostOnly, nameAttrCounter = 1, imPartsShouldFinished = [],
            isAcceptNotify = false, originalNodes, appendingNodesAtLast, parentNode, sybilingNode;

        INTERMediator.crossTableStage = 0;
        appendingNodesAtLast = [];
        IMLibEventResponder.setup();
        INTERMediatorOnPage.retrieveAuthInfo();
        try {
            if (Pusher.VERSION) {
                INTERMediator.pusherAvailable = true;
                if (!INTERMediatorOnPage.clientNotificationKey) {
                    INTERMediator.setErrorMessage(
                        Error('Pusher Configuration Error'), INTERMediatorOnPage.getMessages()[1039]);
                    INTERMediator.pusherAvailable = false;
                }
            }
        } catch (ex) {
            INTERMediator.pusherAvailable = false;
            if (INTERMediatorOnPage.clientNotificationKey) {
                INTERMediator.setErrorMessage(
                    Error('Pusher Configuration Error'), INTERMediatorOnPage.getMessages()[1038]);
            }
        }

        try {
            if (updateRequiredContext === true || updateRequiredContext === undefined) {
                IMLibPageNavigation.deleteInsertOnNavi = [];
                INTERMediator.partialConstructing = false;
                INTERMediator.buttonIdNum = 1;
                IMLibContextPool.clearAll();
                pageConstruct();
                INTERMediator.partialConstructing = true;
            } else {
                IMLibPageNavigation.deleteInsertOnNavi = [];
                INTERMediator.partialConstructing = true;
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
                    if (ex == '_im_requath_request_') {
                        throw ex;
                    } else {
                        INTERMediator.setErrorMessage(ex, 'EXCEPTION-8');
                    }
                }

                for (i = 0; i < postSetFields.length; i++) {
                    if (postSetFields[i]['id'] && document.getElementById(postSetFields[i]['id'])) {
                        document.getElementById(postSetFields[i]['id']).value = postSetFields[i]['value'];
                    }
                }
                IMLibCalc.updateCalculationFields();
                //IMLibPageNavigation.navigationSetup();
                /*
                 If the pagination control should be setup, the property IMLibPageNavigation.deleteInsertOnNavi
                 to maintain to be a valid data.
                 */
            }
        } catch (ex) {
            if (ex == '_im_requath_request_') {
                if (INTERMediatorOnPage.requireAuthentication) {
                    if (!INTERMediatorOnPage.isComplementAuthData()) {
                        INTERMediatorOnPage.clearCredentials();
                        INTERMediatorOnPage.authenticating(
                            function () {
                                INTERMediator.constructMain(updateRequiredContext);
                            }
                        );
                        return;
                    }
                }
            } else {
                INTERMediator.setErrorMessage(ex, 'EXCEPTION-7');
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
        INTERMediatorOnPage.isFinishToConstruct = false;

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
                if (ex == '_im_requath_request_') {
                    throw ex;
                } else {
                    INTERMediator.setErrorMessage(ex, 'EXCEPTION-9');
                }
            }


            // After work to set up popup menus.
            for (i = 0; i < postSetFields.length; i++) {
                if (postSetFields[i]['value'] === '' &&
                    document.getElementById(postSetFields[i]['id']).tagName == 'SELECT') {
                    // for compatibility with Firefox when the value of select tag is empty.
                    emptyElement = document.createElement('option');
                    emptyElement.setAttribute('id', nextIdValue());
                    emptyElement.setAttribute('value', '');
                    emptyElement.setAttribute('data-im-element', 'auto-generated');
                    document.getElementById(postSetFields[i]['id']).insertBefore(
                        emptyElement, document.getElementById(postSetFields[i]['id']).firstChild);
                }
                document.getElementById(postSetFields[i]['id']).value = postSetFields[i]['value'];
            }
            IMLibLocalContext.bindingDescendant(document.documentElement);
            IMLibCalc.updateCalculationFields();
            IMLibPageNavigation.navigationSetup();

            if (isAcceptNotify && INTERMediator.pusherAvailable) {
                var channelName = INTERMediatorOnPage.clientNotificationIdentifier();
                var appKey = INTERMediatorOnPage.clientNotificationKey();
                if (appKey && appKey != '_im_key_isnt_supplied' && !INTERMediator.pusherObject) {
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
                        INTERMediator.setErrorMessage(ex, 'EXCEPTION-47');
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
                        attr = node.getAttribute('data-im-control');
                        if ((className && className.match(/_im_post/)) ||
                            (attr && attr.indexOf('post') >= 0)) {
                            setupPostOnlyEnclosure(node);
                        } else {
                            if (INTERMediator.isIE) {
                                try {
                                    expandEnclosure(node, currentRecord, parentObjectInfo, currentContextObj);
                                } catch (ex) {
                                    if (ex == '_im_requath_request_') {
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
                    if (ex == '_im_requath_request_') {
                        throw ex;
                    } else {
                        INTERMediator.setErrorMessage(ex, 'EXCEPTION-10');
                    }
                }

            }
        }

        /* --------------------------------------------------------------------
         Post only mode.
         */
        function setupPostOnlyEnclosure(node) {
            var nodes, postNodes;
            postNodes = INTERMediatorLib.getElementsByClassNameOrDataAttr(node, '_im_post');
            for (i = 0; i < postNodes.length; i++) {
                if (postNodes[i].tagName === 'BUTTON' ||
                    (postNodes[i].tagName === 'INPUT' &&
                    (postNodes[i].getAttribute('type').toLowerCase() === 'button' ||
                    postNodes[i].getAttribute('type').toLowerCase() === 'submit'))) {
                    INTERMediatorLib.addEvent(postNodes[i], 'click',
                        (function () {
                            var targetNode = postNodes[i];
                            return function () {
                                IMLibUI.clickPostOnlyButton(targetNode);
                            };
                        })());
                }
            }
            nodes = node.childNodes;

            isInsidePostOnly = true;
            for (i = 0; i < nodes.length; i++) {
                seekEnclosureInPostOnly(nodes[i]);
            }
            isInsidePostOnly = false;
            // -------------------------------------------
            function seekEnclosureInPostOnly(node) {
                var children, wInfo, i;
                if (node.nodeType === 1) { // Work for an element
                    try {
                        if (node.getAttribute('data-im')) { // Linked element
                            if (!node.id) {
                                node.id = 'IMPOST-' + INTERMediator.postOnlyNumber;
                                INTERMediator.postOnlyNumber++;
                            }
                            INTERMediatorLib.addEvent(node, 'blur', function (e) {
                                var idValue = node.id;
                                IMLibUI.valueChange(idValue, true);
                            });
                        }

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
                        if (ex == '_im_requath_request_') {
                            throw ex;
                        } else {
                            INTERMediator.setErrorMessage(ex, 'EXCEPTION-11');
                        }
                    }
                }
            }
        }

        /** --------------------------------------------------------------------
         * Expanding an enclosure.
         */

        function expandEnclosure(node, currentRecord, parentObjectInfo, currentContextObj) {
            var recId, repNodeTag, repeatersOriginal;
            var imControl = node.getAttribute('data-im-control');
            if (currentContextObj &&
                currentContextObj.contextName &&
                currentRecord &&
                currentRecord[currentContextObj.contextName] &&
                currentRecord[currentContextObj.contextName][currentContextObj.contextName + '::-recid']) {
                // for FileMaker portal access mode
                recId = currentRecord[currentContextObj.contextName][currentContextObj.contextName + '::-recid'];
                currentRecord = currentRecord[currentContextObj.contextName][recId];
            }

            if (imControl && imControl.match(/cross-table/)) {   // Cross Table
                expandCrossTableEnclosure(node, currentRecord, parentObjectInfo, currentContextObj);
            } else {    // Enclosure Processing as usual.
                repNodeTag = INTERMediatorLib.repeaterTagFromEncTag(node.tagName);
                repeatersOriginal = collectRepeatersOriginal(node, repNodeTag); // Collecting repeaters to this array.
                enclosureProcessing(node, repeatersOriginal, currentRecord, parentObjectInfo, currentContextObj);
            }
            /** --------------------------------------------------------------------
             * Expanding enclosure as usual (means not 'cross tabole').
             */
            function enclosureProcessing(enclosureNode,
                                         repeatersOriginal,
                                         currentRecord,
                                         parentObjectInfo,
                                         currentContextObj,
                                         procBeforeRetrieve,
                                         customExpandRepeater) {
                var linkedNodes, repeaters, linkDefs, voteResult, currentContextDef, fieldList, i, targetRecords,
                    newNode, keyValue, selectedNode, calcDef, calcFields, contextObj = null;

                repeaters = collectRepeaters(repeatersOriginal);  // Collecting repeaters to this array.
                linkedNodes = INTERMediatorLib.seekLinkedAndWidgetNodes(repeaters, true).linkedNode;
                linkDefs = collectLinkDefinitions(linkedNodes);
                voteResult = tableVoting(linkDefs);
                currentContextDef = voteResult.targettable;
                INTERMediator.currentEncNumber++;

                if (!enclosureNode.getAttribute('id')) {
                    enclosureNode.setAttribute('id', nextIdValue());
                }

                if (!currentContextDef) {
                    for (i = 0; i < repeatersOriginal.length; i++) {
                        newNode = enclosureNode.appendChild(repeatersOriginal[i]);

                        // for compatibility with Firefox
                        if (repeatersOriginal[i].getAttribute('selected') !== null) {
                            selectedNode = newNode;
                        }
                        if (selectedNode !== undefined) {
                            selectedNode.selected = true;
                        }

                        seekEnclosureNode(newNode, null, enclosureNode, currentContextObj);
                    }
                } else {
                    contextObj = IMLibContextPool.generateContextObject(
                        currentContextDef, enclosureNode, repeaters, repeatersOriginal);
                    calcFields = contextObj.getCalculationFields();
                    fieldList = voteResult.fieldlist.map(function (elm) {
                        if (!calcFields[elm]) {
                            calcFields.push(elm);
                        }
                        return elm;
                    });
                    contextObj.setRelationWithParent(currentRecord, parentObjectInfo, currentContextObj);
                    if (currentContextDef.relation && currentContextDef.relation[0] &&
                        Boolean(currentContextDef.relation[0].portal) === true) {
                        currentContextDef['currentrecord'] = currentRecord;
                        keyValue = currentRecord['-recid'];
                    }
                    if (procBeforeRetrieve) {
                        procBeforeRetrieve(contextObj);
                    }
                    targetRecords = retrieveDataForEnclosure(contextObj, fieldList, contextObj.foreignValue);
                    contextObj.storeRecords(targetRecords);
                    callbackForAfterQueryStored(currentContextDef, contextObj);
                    if (customExpandRepeater == undefined) {
                        contextObj.registeredId = targetRecords.registeredId;
                        contextObj.nullAcceptable = targetRecords.nullAcceptable;
                        isAcceptNotify |= !(INTERMediatorOnPage.notifySupport === false);
                        expandRepeaters(contextObj, enclosureNode, targetRecords);
                        setupInsertButton(contextObj, keyValue, enclosureNode, contextObj.foreignValue);
                        setupBackNaviButton(contextObj, enclosureNode);
                        callbackForEnclosure(currentContextDef, enclosureNode);
                    } else {
                        customExpandRepeater(contextObj, targetRecords);
                    }
                    contextObj.sequencing = false;
                }
                return contextObj;
            }

            /** --------------------------------------------------------------------
             * expanding enclosure for cross table
             */
            function expandCrossTableEnclosure(node, currentRecord, parentObjectInfo, currentContextObj) {
                var i, j, colArray, rowArray, nodeForKeyValues, record, targetRepeater, lineNode, colContext,
                    rowContext, appendingNode, trNodes, repeaters, linkedNodes, linkDefs,
                    crossCellContext, labelKeyColumn, labelKeyRow;

                // Collecting 4 parts of cross table.
                var ctComponentNodes = crossTableComponents(node);
                if (ctComponentNodes.length != 4) {
                    throw 'Exception-xx: Cross Table Components aren\'t prepared.';
                }

                // Remove all nodes under the TBODY tagged node.
                while (node.childNodes.length > 0) {
                    node.removeChild(node.childNodes[0]);
                }

                // Decide the context for cross point cell
                repeaters = collectRepeaters([ctComponentNodes[3].cloneNode(true)]);
                linkedNodes = INTERMediatorLib.seekLinkedAndWidgetNodes(repeaters, true).linkedNode;
                linkDefs = collectLinkDefinitions(linkedNodes);
                crossCellContext = tableVoting(linkDefs).targettable;
                labelKeyColumn = crossCellContext['relation'][0]['join-field'];
                labelKeyRow = crossCellContext['relation'][1]['join-field'];

                // Create the first row
                INTERMediator.crossTableStage = 1;
                lineNode = document.createElement('TR');
                targetRepeater = ctComponentNodes[0].cloneNode(true);
                lineNode.appendChild(targetRepeater);
                node.appendChild(lineNode);

                // Append the column context in the first row
                targetRepeater = ctComponentNodes[1].cloneNode(true);
                colContext = enclosureProcessing(
                    lineNode, [targetRepeater], null, parentObjectInfo, currentContextObj);
                colArray = colContext.indexingArray(labelKeyColumn);

                // Create second and following rows, and the first columns are appended row context
                INTERMediator.crossTableStage = 2;
                targetRepeater = ctComponentNodes[2].cloneNode(true);
                lineNode = document.createElement('TR');
                lineNode.appendChild(targetRepeater);
                rowContext = enclosureProcessing(
                    node, [lineNode], null, parentObjectInfo, currentContextObj);
                rowArray = rowContext.indexingArray(labelKeyRow);

                // Create all cross point cell
                INTERMediator.crossTableStage = 3;
                targetRepeater = ctComponentNodes[3].cloneNode(true);
                nodeForKeyValues = {};
                trNodes = node.getElementsByTagName('TR');
                for (i = 1; i < trNodes.length; i += 1) {
                    for (j = 0; j < colArray.length; j += 1) {
                        appendingNode = targetRepeater.cloneNode(true);
                        trNodes[i].appendChild(appendingNode);
                        setIdValue(appendingNode);
                        if (!nodeForKeyValues[colArray[j]]) {
                            nodeForKeyValues[colArray[j]] = {};
                        }
                        nodeForKeyValues[colArray[j]][rowArray[i - 1]] = appendingNode;
                    }
                }
                setIdValue(node);
                enclosureProcessing(
                    node, [targetRepeater], null, parentObjectInfo, currentContextObj,
                    function (context) {
                        var currentContextDef = context.getContextDef();
                        INTERMediator.addCondition(currentContextDef.name, {
                            field: currentContextDef['relation'][0]['foreign-key'],
                            operator: 'IN',
                            value: colArray,
                            onetime: true
                        });
                        INTERMediator.addCondition(currentContextDef.name, {
                            field: currentContextDef['relation'][1]['foreign-key'],
                            operator: 'IN',
                            value: rowArray,
                            onetime: true
                        });
                    },
                    function (contextObj, targetRecords) {
                        var dataKeyColumn, dataKeyRow, currentContextDef, ix,
                            linkedElements, targetNode, setupResult, keyField, keyValue, keyingValue;
                        currentContextDef = contextObj.getContextDef();
                        keyField = contextObj.getKeyField();
                        dataKeyColumn = currentContextDef['relation'][0]['foreign-key'];
                        dataKeyRow = currentContextDef['relation'][1]['foreign-key'];
                        if (targetRecords.recordset) {
                            for (ix = 0; ix < targetRecords.recordset.length; ix++) { // for each record
                                record = targetRecords.recordset[ix];
                                if (nodeForKeyValues[record[dataKeyColumn]]
                                    && nodeForKeyValues[record[dataKeyColumn]][record[dataKeyRow]]) {
                                    targetNode = nodeForKeyValues[record[dataKeyColumn]][record[dataKeyRow]];
                                    if (targetNode) {
                                        linkedElements = INTERMediatorLib.seekLinkedAndWidgetNodes(
                                            [targetNode], false);
                                        keyValue = record[keyField];
                                        if (keyField && !keyValue && keyValue !== 0) {
                                            keyValue = ix;
                                        }
                                        keyingValue = keyField + '=' + keyValue;
                                    }
                                    setupResult = setupLinkedNode(
                                        linkedElements, contextObj, targetRecords.recordset, ix, keyingValue);
                                }
                            }
                        }
                    }
                );
            } // The end of function expandCrossTableEnclosure().

// Detect cross table components in a tbody enclosure.
            function crossTableComponents(node) {
                var components = [], count = 0;
                repeatCTComponents(node.childNodes);
                return components;

                function repeatCTComponents(nodes) {
                    var childNodes, i;
                    for (i = 0; i < nodes.length; i++) {
                        if (nodes[i].nodeType == 1 && (nodes[i].tagName == 'TH' || nodes[i].tagName == 'TD')) {
                            components[count] = nodes[i];
                            count += 1;
                        } else {
                            childNodes = nodes[i].childNodes;
                            if (childNodes) {
                                repeatCTComponents(childNodes);
                            }
                        }
                    }
                }
            }
        }

        /** --------------------------------------------------------------------
         * Set the value to node and context.
         */
        function setupLinkedNode(linkedElements, contextObj, targetRecordset, ix, keyingValue) {
            var currentWidgetNodes, currentLinkedNodes, nInfo, currentContextDef, j, keyField, k, nodeId,
                curVal, replacedNode, typeAttr, children, wInfo, nameTable, idValuesForFieldName = {},
                nodeTag, linkInfoArray, nameTableKey, nameNumber, nameAttr, isContext = false, curTarget,
                delNodes = [], targetFirstChar;

            currentContextDef = contextObj.getContextDef();
            try {
                currentWidgetNodes = linkedElements.widgetNode;
                currentLinkedNodes = linkedElements.linkedNode;
                keyField = contextObj.getKeyField();
                if (targetRecordset[ix] && (targetRecordset[ix][keyField] || targetRecordset[ix][keyField] === 0)) {
                    for (k = 0; k < currentLinkedNodes.length; k++) {
                        // for each linked element
                        nodeId = currentLinkedNodes[k].getAttribute('id');
                        replacedNode = setIdValue(currentLinkedNodes[k]);
                        typeAttr = replacedNode.getAttribute('type');
                        if (typeAttr == 'checkbox' || typeAttr == 'radio') {
                            children = replacedNode.parentNode.childNodes;
                            for (i = 0; i < children.length; i++) {
                                if (children[i].nodeType === 1 && children[i].tagName == 'LABEL' &&
                                    nodeId == children[i].getAttribute('for')) {
                                    children[i].setAttribute('for', replacedNode.getAttribute('id'));
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
                }
            } catch (ex) {
                if (ex == '_im_requath_request_') {
                    throw ex;
                } else {
                    INTERMediator.setErrorMessage(ex, 'EXCEPTION-101');
                }
            }

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
                            nameAttrCounter++;
                        }
                        nameNumber = nameTable[nameTableKey];
                        nameAttr = currentLinkedNodes[k].getAttribute('name');
                        if (nameAttr) {
                            currentLinkedNodes[k].setAttribute('name', nameAttr + '-' + nameNumber);
                        } else {
                            currentLinkedNodes[k].setAttribute('name', 'IM-R-' + nameNumber);
                        }
                    }
                    for (j = 0; j < linkInfoArray.length; j++) {
                        nInfo = INTERMediatorLib.getNodeInfoArray(linkInfoArray[j]);
                        curVal = targetRecordset[ix][nInfo['field']];
                        if (!INTERMediator.isDBDataPreferable || curVal !== null) {
                            IMLibCalc.updateCalculationInfo(
                                contextObj, keyingValue, currentContextDef, nodeId, nInfo, targetRecordset[ix]);
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
                                    if (IMLibElement.setValueToIMNode(currentLinkedNodes[k], curTarget, curVal[0])) {
                                        postSetFields.push({'id': nodeId, 'value': curVal[0]});
                                    }
                                } else {
                                    if (currentLinkedNodes[k].tagName === 'SELECT') {
                                        postSetFields.push({'id': nodeId, 'value': ''});
                                    }
                                }
                            } else {
                                if (IMLibElement.setValueToIMNode(currentLinkedNodes[k], curTarget, curVal)) {
                                    postSetFields.push({'id': nodeId, 'value': curVal});
                                }
                            }
                            contextObj.setValue(keyingValue, nInfo['field'], curVal, nodeId, curTarget);
                            //console.log("setValue(", keyingValue, nInfo['field'], curVal, nodeId, curTarget);
                            if (idValuesForFieldName[nInfo['field']] === undefined) {
                                idValuesForFieldName[nInfo['field']] = [];
                            }
                            idValuesForFieldName[nInfo['field']].push(nodeId);
                        }
                    }

                    targetFirstChar = curTarget.charAt(0);
                    if (isContext && !isInsidePostOnly && targetFirstChar != '#' && targetFirstChar != '$' &&
                        (nodeTag == 'INPUT' || nodeTag == 'SELECT' || nodeTag == 'TEXTAREA')) {
                        //IMLibChangeEventDispatch.setExecute(nodeId, IMLibUI.valueChange);
                        var changeFunction = function (id, evt) {
                            return function () {
                                if (evt === 'change' ||
                                    (evt === 'input' && document.getElementById(id).textContent === '')) {
                                    if (IMLibUI.valueChange(id)) {
                                        if (document.getElementById(id).tagName == 'SELECT') {
                                            children = document.getElementById(id).childNodes;
                                            for (i = 0; i < children.length; i++) {
                                                if (children[i].nodeType === 1) {
                                                    if (children[i].tagName === 'OPTION' &&
                                                        children[i].getAttribute('data-im-element') === 'auto-generated') {
                                                        delNodes.push(children[i].getAttribute('id'));
                                                        IMLibElement.deleteNodes(delNodes);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            };
                        };
                        eventListenerPostAdding.push({
                            'id': nodeId,
                            'event': 'change',
                            'todo': changeFunction(nodeId, 'change')
                        });
                        if (INTERMediator.isTrident || INTERMediator.isEdge) {
                            eventListenerPostAdding.push({
                                'id': nodeId,
                                'event': 'input',
                                'todo': changeFunction(nodeId, 'input')
                            });
                        }
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
                    if (ex == '_im_requath_request_') {
                        throw ex;
                    } else {
                        INTERMediator.setErrorMessage(ex, 'EXCEPTION-27');
                    }
                }
            }
            return idValuesForFieldName;
        }

        /** --------------------------------------------------------------------
         * Expanding an repeater.
         */
        function expandRepeaters(contextObj, node, targetRecords) {
            var newNode, nodeClass, dataAttr, repeatersOneRec, newlyAddedNodes, encNodeTag, repNodeTag, ix,
                repeatersOriginal, targetRecordset, targetTotalCount, i, currentContextDef, indexContext,
                insertNode, countRecord, setupResult, linkedElements, keyingValue, keyField, keyValue,
                idValuesForFieldName;

            encNodeTag = node.tagName;
            repNodeTag = INTERMediatorLib.repeaterTagFromEncTag(encNodeTag);

            repeatersOriginal = contextObj.original;
            currentContextDef = contextObj.getContextDef();
            targetRecordset = targetRecords.recordset;
            targetTotalCount = targetRecords.totalCount;

            repeatersOneRec = cloneEveryNodes(repeatersOriginal);
            for (i = 0; i < repeatersOneRec.length; i++) {
                newNode = repeatersOneRec[i];
                dataAttr = newNode.getAttribute('data-im-control');
                if (dataAttr && dataAttr.indexOf(INTERMediatorLib.roleAsHeaderDataControlName) >= 0) {
                    if (!insertNode) {
                        node.appendChild(newNode);
                    }
                }
            }

            if (targetRecords.count === 0) {
                for (i = 0; i < repeatersOriginal.length; i++) {
                    newNode = repeatersOriginal[i].cloneNode(true);
                    nodeClass = INTERMediatorLib.getClassAttributeFromNode(newNode);
                    dataAttr = newNode.getAttribute('data-im-control');
                    if ((nodeClass && nodeClass.indexOf(INTERMediator.noRecordClassName) > -1)
                        || (dataAttr && dataAttr.indexOf(INTERMediatorLib.roleAsNoResultDataControlName) > -1)) {
                        node.appendChild(newNode);
                        setIdValue(newNode);
                    }
                }
            }

            countRecord = targetRecordset ? targetRecordset.length : 0;
            for (ix = 0; ix < countRecord; ix++) { // for each record
                repeatersOneRec = cloneEveryNodes(repeatersOriginal);
                linkedElements = INTERMediatorLib.seekLinkedAndWidgetNodes(repeatersOneRec, true);
                keyField = contextObj.getKeyField();
                for (i = 0; i < repeatersOneRec.length; i++) {
                    setIdValue(repeatersOneRec[i]);
                }
                if (targetRecordset[ix] && (targetRecordset[ix][keyField] || targetRecordset[ix][keyField] === 0)) {
                    keyValue = targetRecordset[ix][keyField];
                    if (keyField && !keyValue && keyValue !== 0) {
                        INTERMediator.setErrorMessage('The value of the key field is null.',
                            'This No.[' + ix + '] record should be ignored.');
                        keyValue = ix;
                    }
                    keyingValue = keyField + '=' + keyValue;
                }
                idValuesForFieldName = setupLinkedNode(linkedElements, contextObj, targetRecordset, ix, keyingValue);
                setupDeleteButton(encNodeTag, repeatersOneRec, contextObj, keyField, keyValue);
                setupNavigationButton(encNodeTag, repeatersOneRec, currentContextDef, keyField, keyValue);
                setupCopyButton(encNodeTag, repNodeTag, repeatersOneRec, contextObj, targetRecordset[ix]);

                if (Boolean(currentContextDef.portal) !== true ||
                    (Boolean(currentContextDef.portal) === true && targetTotalCount > 0)) {
                    newlyAddedNodes = [];
                    insertNode = null;
                    if (!contextObj.sequencing) {
                        indexContext = contextObj.checkOrder(targetRecordset[ix]);
                        insertNode = contextObj.getRepeaterEndNode(indexContext + 1);
                    }
                    for (i = 0; i < repeatersOneRec.length; i++) {
                        newNode = repeatersOneRec[i];
                        nodeClass = INTERMediatorLib.getClassAttributeFromNode(newNode);
                        dataAttr = newNode.getAttribute('data-im-control');
                        if (!(nodeClass && nodeClass.indexOf(INTERMediator.noRecordClassName) >= 0)
                            && !(dataAttr && dataAttr.indexOf(INTERMediatorLib.roleAsNoResultDataControlName) >= 0)
                            && !(dataAttr && dataAttr.indexOf(INTERMediatorLib.roleAsSeparatorDataControlName) >= 0)
                            && !(dataAttr && dataAttr.indexOf(INTERMediatorLib.roleAsFooterDataControlName) >= 0)
                            && !(dataAttr && dataAttr.indexOf(INTERMediatorLib.roleAsHeaderDataControlName) >= 0)
                        ) {
                            if (!insertNode) {
                                node.appendChild(newNode);
                            } else {
                                insertNode.parentNode.insertBefore(newNode, insertNode);
                            }
                            newlyAddedNodes.push(newNode);
                            if (!newNode.id) {
                                setIdValue(newNode);
                            }
                            contextObj.setValue(keyingValue, '_im_repeater', '', newNode.id, '', currentContextDef.portal);
                            seekEnclosureNode(newNode, targetRecordset[ix], idValuesForFieldName, contextObj);
                        }
                    }
                    if (ix + 1 != countRecord) {
                        for (i = 0; i < repeatersOneRec.length; i++) {
                            newNode = repeatersOneRec[i];
                            dataAttr = newNode.getAttribute('data-im-control');
                            if (dataAttr && dataAttr.indexOf(INTERMediatorLib.roleAsSeparatorDataControlName) >= 0) {
                                if (!insertNode) {
                                    node.appendChild(newNode);
                                } else {
                                    insertNode.parentNode.insertBefore(newNode, insertNode);
                                }
                            }
                        }
                    }
                    callbackForRepeaters(currentContextDef, node, newlyAddedNodes);
                }
                contextObj.rearrangePendingOrder();
            }
            repeatersOneRec = cloneEveryNodes(repeatersOriginal);
            for (i = 0; i < repeatersOneRec.length; i++) {
                newNode = repeatersOneRec[i];
                dataAttr = newNode.getAttribute('data-im-control');
                if (dataAttr && dataAttr.indexOf(INTERMediatorLib.roleAsFooterDataControlName) >= 0) {
                    if (!insertNode) {
                        node.appendChild(newNode);
                    }
                }
            }
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
                        if (comp[2] == '#id') {
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
        function retrieveDataForEnclosure(contextObj, fieldList, relationValue) {
            var targetRecords, recordNumber, useLimit;

            if (Boolean(contextObj.contextDefinition.cache) === true) {
                targetRecords = retrieveDataFromCache(contextObj.contextDefinition, relationValue);
            } else {   // cache is not active.
                try {
                    targetRecords = contextObj.getPortalRecords();
                    if (!targetRecords) {
                        useLimit = contextObj.isUseLimit();
                        recordNumber = contextObj.getRecordNumber();
                        targetRecords = INTERMediator_DBAdapter.db_query({
                            'name': contextObj.contextDefinition['name'],
                            'records': isNaN(recordNumber) ? 100000000 : recordNumber,
                            'paging': contextObj.contextDefinition['paging'],
                            'fields': fieldList,
                            'parentkeyvalue': relationValue,
                            'conditions': null,
                            'useoffset': true,
                            'uselimit': useLimit
                        });
                    }
                } catch (ex) {
                    if (ex == '_im_requath_request_') {
                        throw ex;
                    } else {
                        INTERMediator.setErrorMessage(ex, 'EXCEPTION-12');
                    }
                }
            }
            return targetRecords;
        }

        /* --------------------------------------------------------------------
         This implementation for cache is quite limited.
         */
        function retrieveDataFromCache(currentContextDef, relationValue) {
            var targetRecords = null, pagingValue, counter, ix, oneRecord, isMatch, index, keyField, fieldName,
                recordsValue;

            try {
                if (!INTERMediatorOnPage.dbCache[currentContextDef['name']]) {
                    INTERMediatorOnPage.dbCache[currentContextDef['name']] =
                        INTERMediator_DBAdapter.db_query({
                            name: currentContextDef['name'],
                            records: null,
                            paging: null,
                            fields: null,
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
                    return targetRecords;
                }
            } catch (ex) {
                if (ex == '_im_requath_request_') {
                    throw ex;
                } else {
                    INTERMediator.setErrorMessage(ex, 'EXCEPTION-24');
                }
            }
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
                if (ex == '_im_requath_request_') {
                    throw ex;
                } else {
                    INTERMediator.setErrorMessage(ex,
                        'EXCEPTION-33: hint: post-repeater of ' + currentContextDef.name);
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
                if (ex == '_im_requath_request_') {
                    throw ex;
                } else {
                    INTERMediator.setErrorMessage(ex, 'EXCEPTION-23');
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
                if (ex == '_im_requath_request_') {
                    throw ex;
                } else {
                    INTERMediator.setErrorMessage(ex,
                        'EXCEPTION-32: hint: post-enclosure of ' + currentContextDef.name);
                }
            }
            try {
                if (INTERMediatorOnPage.expandingEnclosureFinish != null) {
                    INTERMediatorOnPage.expandingEnclosureFinish(currentContextDef['name'], node);
                    INTERMediator.setDebugMessage(
                        'Call INTERMediatorOnPage.expandingEnclosureFinish with the context: '
                        + currentContextDef['name'], 2);
                }
            } catch (ex) {
                if (ex == '_im_requath_request_') {
                    throw ex;
                } else {
                    INTERMediator.setErrorMessage(ex, 'EXCEPTION-21');
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
                if (ex == '_im_requath_request_') {
                    throw ex;
                } else {
                    INTERMediator.setErrorMessage(ex,
                        'EXCEPTION-22: hint: post-enclosure of ' + currentContextDef.name);
                }
            }
        }

        /* --------------------------------------------------------------------

         */
        function callbackForAfterQueryStored(currentContextDef, context) {
            try {
                if (currentContextDef['post-query-stored']) {
                    INTERMediatorOnPage[currentContextDef['post-query-stored']](context);
                    INTERMediator.setDebugMessage(
                        "Call the post query stored method 'INTERMediatorOnPage." + currentContextDef['post-enclosure']
                        + "' with the context: " + currentContextDef['name'], 2);
                }
            } catch (ex) {
                if (ex == '_im_requath_request_') {
                    throw ex;
                } else {
                    INTERMediator.setErrorMessage(ex,
                        'EXCEPTION-41: hint: post-query-stored of ' + currentContextDef.name);
                }
            }
        }

        /* --------------------------------------------------------------------

         */
        function collectRepeatersOriginal(node, repNodeTag) {
            var i, repeatersOriginal = [], children, imControl;

            children = node.childNodes; // Check all child node of the enclosure.
            for (i = 0; i < children.length; i++) {
                if (children[i].nodeType === 1) {
                    if (children[i].tagName == repNodeTag) {
                        // If the element is a repeater.
                        repeatersOriginal.push(children[i]); // Record it to the array.
                    } else if (repNodeTag == null && (children[i].getAttribute('data-im-control'))) {
                        imControl = children[i].getAttribute('data-im-control');
                        if (imControl.indexOf(INTERMediatorLib.roleAsRepeaterDataControlName) > -1
                            || imControl.indexOf(INTERMediatorLib.roleAsSeparatorDataControlName) > -1
                            || imControl.indexOf(INTERMediatorLib.roleAsFooterDataControlName) > -1
                            || imControl.indexOf(INTERMediatorLib.roleAsHeaderDataControlName) > -1
                            || imControl.indexOf(INTERMediatorLib.roleAsNoResultDataControlName) > -1
                        ) {
                            repeatersOriginal.push(children[i]);
                        }
                    } else if (repNodeTag == null && INTERMediatorLib.getClassAttributeFromNode(children[i]) &&
                        INTERMediatorLib.getClassAttributeFromNode(children[i]).match(/_im_repeater/)) {
                        imControl = INTERMediatorLib.getClassAttributeFromNode(children[i]);
                        if (imControl.indexOf(INTERMediatorLib.roleAsRepeaterClassName) > -1) {
                            repeatersOriginal.push(children[i]);
                        }
                    }
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
                if (parentOfRep) {
                    parentOfRep.removeChild(inDocNode);
                }
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
                nodeInfoTableIndex = nodeInfoArray['tableindex'];   // Table name added '_im_index_' as the prefix.
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
            return {targettable: context, fieldlist: fieldList['_im_index_' + maxTableName]};
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
        function setupCopyButton(encNodeTag, repNodeTag, repeaters, currentContext, currentRecord) {
            // Handling Copy buttons
            var buttonNode, thisId, copyJSFunction, tdNodes, tdNode, buttonName, currentContextDef;

            currentContextDef = currentContext.getContextDef();
            if (!currentContextDef['repeat-control']
                || !currentContextDef['repeat-control'].match(/copy/i)) {
                return;
            }
            if (currentContextDef['paging'] == true) {
                buttonName = currentContextDef['name'];
                if (currentContextDef['button-names'] && currentContextDef['button-names']['copy']) {
                    buttonName = currentContextDef['button-names']['copy'];
                }
                IMLibPageNavigation.deleteInsertOnNavi.push({
                    kind: 'COPY',
                    name: buttonName,
                    contextDef: currentContextDef,
                    keyValue: currentRecord[currentContextDef['key']]
                });
            } else {
                buttonNode = document.createElement('BUTTON');
                INTERMediatorLib.setClassAttributeToNode(buttonNode, 'IM_Button_Copy');
                buttonName = INTERMediatorOnPage.getMessages()[14];
                if (currentContextDef['button-names'] && currentContextDef['button-names']['copy']) {
                    buttonName = currentContextDef['button-names']['copy'];
                }
                buttonNode.appendChild(document.createTextNode(buttonName));
                thisId = 'IM_Button_' + INTERMediator.buttonIdNum;
                buttonNode.setAttribute('id', thisId);
                INTERMediator.buttonIdNum++;
                copyJSFunction = function (a, b) {
                    var currentContext = a, currentRecord = b;
                    return function () {
                        IMLibUI.copyButton(currentContext, currentRecord);
                    };
                };
                eventListenerPostAdding.push({
                    'id': thisId,
                    'event': 'click',
                    'todo': copyJSFunction(currentContext, currentRecord[currentContextDef['key']])
                });
                switch (encNodeTag) {
                case 'TBODY':
                    tdNodes = repeaters[repeaters.length - 1].getElementsByTagName('TD');
                    tdNode = tdNodes[tdNodes.length - 1];
                    tdNode.appendChild(buttonNode);
                    break;
                case 'SELECT':
                    break;
                default:
                    if (repeaters[0] && repeaters[0].childNodes) {
                        repeaters[repeaters.length - 1].appendChild(buttonNode);
                    } else {
                        repeaters.push(buttonNode);
                    }
                    break;
                }
            }
        }

        /* --------------------------------------------------------------------

         */
        function setupDeleteButton(encNodeTag, repeaters, currentContext, keyField, keyValue) {
            // Handling Delete buttons
            var buttonNode, thisId, deleteJSFunction, tdNodes, tdNode, buttonName, currentContextDef;

            currentContextDef = currentContext.contextDefinition;
            if (!currentContextDef['repeat-control']
                || !currentContextDef['repeat-control'].match(/delete/i)) {
                return;
            }
            if (currentContextDef['relation']
                || currentContextDef['records'] === undefined
                || (currentContextDef['records'] > 1 && Number(INTERMediator.pagedSize) != 1)) {

                buttonNode = document.createElement('BUTTON');
                INTERMediatorLib.setClassAttributeToNode(buttonNode, 'IM_Button_Delete');
                buttonName = INTERMediatorOnPage.getMessages()[6];
                if (currentContextDef['button-names'] && currentContextDef['button-names']['delete']) {
                    buttonName = currentContextDef['button-names']['delete'];
                }
                buttonNode.appendChild(document.createTextNode(buttonName));
                thisId = 'IM_Button_' + INTERMediator.buttonIdNum;
                buttonNode.setAttribute('id', thisId);
                INTERMediator.buttonIdNum++;
                deleteJSFunction = function (a, b, c, d) {
                    var currentContext = a, keyField = b, keyValue = c, confirming = d;
                    return function () {
                        IMLibUI.deleteButton(currentContext, keyField, keyValue, confirming);
                    };
                };
                eventListenerPostAdding.push({
                    'id': thisId,
                    'event': 'click',
                    'todo': deleteJSFunction(
                        currentContext,
                        keyField,
                        keyValue,
                        currentContextDef['repeat-control'].match(/confirm-delete/i))
                });
                switch (encNodeTag) {
                case 'TBODY':
                    tdNodes = repeaters[repeaters.length - 1].getElementsByTagName('TD');
                    tdNode = tdNodes[tdNodes.length - 1];
                    tdNode.appendChild(buttonNode);
                    break;
                case 'SELECT':
                    // OPTION tag can't contain any other tags.
                    break;
                default:
                    if (repeaters[0] && repeaters[0].childNodes) {
                        repeaters[repeaters.length - 1].appendChild(buttonNode);
                    } else {
                        repeaters.push(buttonNode);
                    }
                    break;
                }
            } else {
                buttonName = currentContextDef['name'];
                if (currentContextDef['button-names'] && currentContextDef['button-names']['delete']) {
                    buttonName = currentContextDef['button-names']['delete'];
                }
                IMLibPageNavigation.deleteInsertOnNavi.push({
                    kind: 'DELETE',
                    name: buttonName,
                    key: keyField,
                    value: keyValue,
                    confirm: currentContextDef['repeat-control'].match(/confirm-delete/i)
                });
            }
        }

        /* --------------------------------------------------------------------

         */
        function setupInsertButton(currentContext, keyValue, node, relationValue) {
            var buttonNode, shouldRemove, enclosedNode, footNode, trNode, tdNode, liNode, divNode, insertJSFunction, i,
                firstLevelNodes, targetNodeTag, existingButtons, keyField, thisId, encNodeTag,
                buttonName, setTop, currentContextDef;

            encNodeTag = node.tagName;
            currentContextDef = currentContext.getContextDef();
            if (currentContextDef['repeat-control'] && currentContextDef['repeat-control'].match(/insert/i)) {
                if (relationValue.length > 0 || !currentContextDef['paging'] || currentContextDef['paging'] === false) {
                    buttonNode = document.createElement('BUTTON');
                    INTERMediatorLib.setClassAttributeToNode(buttonNode, 'IM_Button_Insert');
                    buttonName = INTERMediatorOnPage.getMessages()[5];
                    if (currentContextDef['button-names'] && currentContextDef['button-names']['insert']) {
                        buttonName = currentContextDef['button-names']['insert'];
                    }
                    buttonNode.appendChild(document.createTextNode(buttonName));
                    thisId = 'IM_Button_' + INTERMediator.buttonIdNum;
                    buttonNode.setAttribute('id', thisId);
                    INTERMediator.buttonIdNum++;
                    shouldRemove = [];
                    switch (encNodeTag) {
                    case 'TBODY':
                        setTop = false;
                        targetNodeTag = 'TFOOT';
                        if (currentContextDef['repeat-control'].match(/top/i)) {
                            targetNodeTag = 'THEAD';
                            setTop = true;
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
                            INTERMediatorLib.setClassAttributeToNode(trNode, 'IM_Insert_TR');
                            tdNode = document.createElement('TD');
                            INTERMediatorLib.setClassAttributeToNode(tdNode, 'IM_Insert_TD');
                            setIdValue(trNode);
                            if (setTop && footNode.childNodes) {
                                footNode.insertBefore(trNode, footNode.childNodes[0]);
                            } else {
                                footNode.appendChild(trNode);
                            }
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
                    case 'SELECT':
                        // Select enclosure can't include Insert button.
                        break;
                    default:
                        divNode = document.createElement('DIV');
                        existingButtons = INTERMediatorLib.getElementsByClassName(divNode, 'IM_Button_Insert');
                        if (existingButtons.length == 0) {
                            divNode.appendChild(buttonNode);
                            if (currentContextDef['repeat-control'].match(/top/i)) {
                                node.insertBefore(divNode, node.firstChild);
                            } else {
                                node.appendChild(divNode);
                            }
                        }
                        break;
                    }
                    insertJSFunction = function (a, b, c, d, e) {
                        var contextName = a, relationValue = b, nodeId = c, removeNodes = d, confirming = e;
                        return function () {
                            IMLibUI.insertButton(
                                currentContext,
                                keyValue,
                                relationValue,
                                nodeId,
                                confirming
                            );
                        };
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
                    if (INTERMediatorOnPage.dbClassName === 'DB_FileMaker_FX') {
                        keyField = currentContextDef['key'] ? currentContextDef['key'] : '-recid';
                    } else {
                        keyField = currentContextDef['key'] ? currentContextDef['key'] : 'id';
                    }
                    buttonName = currentContextDef['name'];
                    if (currentContextDef['button-names'] && currentContextDef['button-names']['insert']) {
                        buttonName = currentContextDef['button-names']['insert'];
                    }
                    IMLibPageNavigation.deleteInsertOnNavi.push({
                        kind: 'INSERT',
                        name: buttonName,
                        key: keyField,
                        confirm: currentContextDef['repeat-control'].match(/confirm-insert/i)
                    });
                }
            }
        }

        /* --------------------------------------------------------------------

         */
        function setupNavigationButton(encNodeTag, repeaters, currentContextDef, keyField, keyValue, foreignField, foreignValue) {
            // Handling Detail buttons
            var buttonNode, thisId, tdNodes, tdNode, firstInNode, contextDef,
                isHide, masterContext, detailContext, showingNode, isHidePageNavi, buttonName, i,
                isTouchRepeater, moveToDetailFunc;

            if (!currentContextDef['navi-control']
                || !currentContextDef['navi-control'].match(/master/i)
                || encNodeTag == 'SELECT') {
                return;
            }

            isTouchRepeater = INTERMediator.isMobile || INTERMediator.isTablet;
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
            INTERMediatorLib.setClassAttributeToNode(buttonNode, 'IM_Button_Master');
            buttonName = INTERMediatorOnPage.getMessages()[12];
            if (currentContextDef['button-names'] && currentContextDef['button-names']['navi-detail']) {
                buttonName = currentContextDef['button-names']['navi-detail'];
            }
            buttonNode.appendChild(document.createTextNode(buttonName));
            thisId = 'IM_Button_' + INTERMediator.buttonIdNum;
            buttonNode.setAttribute('id', thisId);
            INTERMediator.buttonIdNum++;
            masterContext = IMLibContextPool.getMasterContext();
            masterContext.setValue(keyField + '=' + keyValue, '_im_button_master_id', thisId, thisId);

            if (isTouchRepeater) {
                moveToDetailFunc = moveToDetail(encNodeTag, keyField, keyValue, foreignField, foreignValue, isHide, isHidePageNavi);
                for (i = 0; i < repeaters.length; i++) {
                    var originalColor = repeaters[i].style.backgroundColor;
                    eventListenerPostAdding.push({
                        'id': repeaters[i].id,
                        'event': 'touchstart',
                        'todo': (function () {
                            var targetNode = repeaters[i];
                            return function () {
                                IMLibEventResponder.touchEventCancel = false;
                                targetNode.style.backgroundColor = IMLibUI.mobileSelectionColor;
                            };
                        })()
                    });
                    eventListenerPostAdding.push({
                        'id': repeaters[i].id,
                        'event': 'touchend',
                        'todo': (function () {
                            var targetNode = repeaters[i];
                            var orgColor = originalColor;
                            return function () {
                                targetNode.style.backgroundColor = orgColor;
                                if (!IMLibEventResponder.touchEventCancel) {
                                    IMLibEventResponder.touchEventCancel = false;
                                    moveToDetailFunc();
                                }
                            };
                        })()
                    });
                    eventListenerPostAdding.push({
                        'id': repeaters[i].id,
                        'event': 'touchmove',
                        'todo': (function () {
                            return function () {
                                IMLibEventResponder.touchEventCancel = true;
                            };
                        })()
                    });
                    eventListenerPostAdding.push({
                        'id': repeaters[i].id,
                        'event': 'touchcancel',
                        'todo': (function () {
                            return function () {
                                IMLibEventResponder.touchEventCancel = true;
                            };
                        })()
                    });
                }
            } else {
                eventListenerPostAdding.push({
                    'id': thisId,
                    'event': 'click',
                    'todo': moveToDetail(encNodeTag, keyField, keyValue, foreignField, foreignValue, isHide, isHidePageNavi)
                });

                switch (encNodeTag) {
                case 'TBODY':
                    tdNodes = repeaters[repeaters.length - 1].getElementsByTagName('TD');
                    tdNode = tdNodes[0];
                    firstInNode = tdNode.childNodes[0];
                    if (firstInNode) {
                        tdNode.insertBefore(buttonNode, firstInNode);
                    } else {
                        tdNode.appendChild(buttonNode);
                    }
                    break;
                case 'SELECT':
                    break;
                default:
                    firstInNode = repeaters[repeaters.length - 1].childNodes[0];
                    if (firstInNode) {
                        repeaters[repeaters.length - 1].insertBefore(buttonNode, firstInNode);
                    } else {
                        repeaters[repeaters.length - 1].appendChild(buttonNode);
                    }
                    break;
                }
            }

            function moveToDetail(encNodeTag, keyField, keyValue, foreignField, foreignValue, isHide, isHidePageNavi) {
                var f = keyField, v = keyValue, ff = foreignField, fv = foreignValue;
                var fvalue = {}, etag = encNodeTag, isMasterHide = isHide, isPageHide = isHidePageNavi;
                fvalue[ff] = fv;

                return function () {
                    var masterContext, detailContext, contextName, masterEnclosure, detailEnclosure, conditions,
                        node;

                    masterContext = IMLibContextPool.getMasterContext();
                    detailContext = IMLibContextPool.getDetailContext();
                    if (detailContext) {
                        if (INTERMediatorOnPage.naviBeforeMoveToDetail) {
                            INTERMediatorOnPage.naviBeforeMoveToDetail(masterContext, detailContext);
                        }
                        contextDef = detailContext.getContextDef();
                        contextName = contextDef.name;
                        conditions = INTERMediator.additionalCondition;
                        conditions[contextName] = {field: f, operator: '=', value: v};
                        INTERMediator.additionalCondition = conditions;
                        INTERMediator.constructMain(detailContext);
                        if (isMasterHide) {
                            INTERMediatorOnPage.masterScrollPosition = {x: window.scrollX, y: window.scrollY};
                            window.scrollTo(0, 0);
                            masterEnclosure = masterContext.enclosureNode;
                            if (etag == 'TBODY') {
                                masterEnclosure = masterEnclosure.parentNode;
                            }
                            INTERMediator.masterNodeOriginalDisplay = masterEnclosure.style.display;
                            masterEnclosure.style.display = 'none';

                            detailEnclosure = detailContext.enclosureNode;
                            if (detailEnclosure.tagName == 'TBODY') {
                                detailEnclosure = detailEnclosure.parentNode;
                            }
                            detailEnclosure.style.display = INTERMediator.detailNodeOriginalDisplay;
                        }
                        if (isPageHide) {
                            document.getElementById('IM_NAVIGATOR').style.display = 'none';
                        }
                        if (IMLibUI.mobileNaviBackButtonId) {
                            node = document.getElementById(IMLibUI.mobileNaviBackButtonId);
                            node.style.display = 'inline-block';
                        }
                        if (INTERMediatorOnPage.naviAfterMoveToDetail) {
                            masterContext = IMLibContextPool.getMasterContext();
                            detailContext = IMLibContextPool.getDetailContext();
                            INTERMediatorOnPage.naviAfterMoveToDetail(masterContext, detailContext);
                        }
                    }
                };
            }
        }

        /* --------------------------------------------------------------------

         */
        function setupBackNaviButton(currentContext, node) {
            var buttonNode, divNode, i, masterContext, naviControlValue, currentContextDef, showingNode,
                isHidePageNavi, isUpdateMaster, isTouchRepeater, aNode, nodes, isTop;

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
            isUpdateMaster = currentContextDef['navi-control'].match(/update/i);
            isTouchRepeater = INTERMediator.isMobile || INTERMediator.isTablet;
            isTop = !(currentContextDef['navi-control'].match(/bottom/i));

            showingNode = currentContext.enclosureNode;
            if (showingNode.tagName == 'TBODY') {
                showingNode = showingNode.parentNode;
            }
            if (INTERMediator.detailNodeOriginalDisplay) {
                INTERMediator.detailNodeOriginalDisplay = showingNode.style.display;
            }
            showingNode.style.display = 'none';

            if (isTouchRepeater) {
                nodes = document.getElementsByClassName('IM_Button_BackNavi');
                if (!nodes || nodes.length == 0) {
                    aNode = createBackButton('DIV', currentContextDef);
                    IMLibUI.mobileNaviBackButtonId = aNode.id;
                    aNode.style.display = 'none';
                    nodes = INTERMediatorLib.getElementsByAttributeValue(   // Check jQuery Mobile
                        document.getElementsByTagName('BODY')[0], 'data-role', isTop ? 'header' : 'footer');
                    if (nodes && nodes[0]) {
                        if (nodes[0].firstChild) {
                            nodes[0].insertBefore(aNode, nodes[0].firstChild);
                        } else {
                            nodes[0].appendChild(aNode);
                        }
                    } else {   // If the page doesn't use JQuery Mobile
                        switch (node.tagName) {
                        case 'TBODY':
                            tbodyTargetNode(node, isTop, aNode);
                            break;
                        case 'UL':
                        case 'OL':
                            genericTargetNode(node, isTop, 'LI', aNode);
                            break;
                        case 'SELECT':
                            break;
                        default:
                            genericTargetNode(node, isTop, 'DIV', aNode);
                            break;
                        }
                    }
                    INTERMediatorLib.addEvent(
                        aNode,
                        'click',
                        moveToMaster(masterContext, currentContext, isHidePageNavi, isUpdateMaster)
                    );
                }
            } else {
                buttonNode = createBackButton('BUTTON', currentContextDef);
                switch (node.tagName) {
                case 'TBODY':
                    tbodyTargetNode(node, isTop, buttonNode);
                    break;
                case 'UL':
                case 'OL':
                    genericTargetNode(node, isTop, 'LI', buttonNode);
                    break;
                case 'SELECT':
                    break;
                default:
                    genericTargetNode(node, isTop, 'DIV', buttonNode);
                    break;
                }
                INTERMediatorLib.addEvent(
                    buttonNode,
                    'click',
                    moveToMaster(masterContext, currentContext, isHidePageNavi, isUpdateMaster)
                );
            }

            function createBackButton(tagName, currentContextDef) {
                var buttonNode, buttonName;
                buttonNode = document.createElement(tagName);
                INTERMediatorLib.setClassAttributeToNode(buttonNode, 'IM_Button_BackNavi');
                buttonName = INTERMediatorOnPage.getMessages()[13];
                if (currentContextDef['button-names'] && currentContextDef['button-names']['navi-back']) {
                    buttonName = currentContextDef['button-names']['navi-back'];
                }
                buttonNode.appendChild(document.createTextNode(buttonName));
                setIdForIMButtons(buttonNode);
                return buttonNode;
            }

            function tbodyTargetNode(node, isTop, buttonNode) {
                var targetNodeTag, enclosedNode, firstLevelNodes, targetNode, existingButtons, trNode, tdNode;

                targetNodeTag = isTop ? 'THEAD' : 'TFOOT';
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
                    appendingNodesAtLast.push({
                        targetNode: targetNode,
                        parentNode: enclosedNode,
                        siblingNode: (targetNodeTag == 'THEAD') ? enclosedNode.firstChild : null
                    });
                }
                existingButtons = INTERMediatorLib.getElementsByClassName(targetNode, 'IM_Button_BackNavi');
                if (existingButtons.length == 0) {
                    trNode = document.createElement('TR');
                    INTERMediatorLib.setClassAttributeToNode(trNode, 'IM_NaviBack_TR');
                    tdNode = document.createElement('TD');
                    INTERMediatorLib.setClassAttributeToNode(tdNode, 'IM_NaviBack_TD');
                    setIdValue(trNode);
                    targetNode.appendChild(trNode);
                    trNode.appendChild(tdNode);
                    tdNode.appendChild(buttonNode);
                }
            }

            function genericTargetNode(node, isTop, naviEncTag, buttonNode) {
                var newNode, existingButtons;
                newNode = document.createElement(naviEncTag);
                existingButtons = INTERMediatorLib.getElementsByClassName(divNode, 'IM_Button_BackNavi');
                if (existingButtons.length == 0) {
                    newNode.appendChild(buttonNode);
                    if (!isTop) {
                        node.appendChild(newNode);
                    } else {
                        node.insertBefore(newNode, node.firstChild);
                    }
                }
            }

            function moveToMaster(a, b, c, d) {
                var masterContextCL = a, detailContextCL = b, pageNaviShow = c, masterUpdate = d, node;
                return function () {
                    var showingNode;
                    if (INTERMediatorOnPage.naviBeforeMoveToMaster) {
                        INTERMediatorOnPage.naviBeforeMoveToMaster(masterContextCL, detailContextCL);
                    }
                    showingNode = detailContextCL.enclosureNode;
                    if (showingNode.tagName == 'TBODY') {
                        showingNode = showingNode.parentNode;
                    }
                    showingNode.style.display = 'none';

                    showingNode = masterContextCL.enclosureNode;
                    if (showingNode.tagName == 'TBODY') {
                        showingNode = showingNode.parentNode;
                    }
                    showingNode.style.display = INTERMediator.masterNodeOriginalDisplay;

                    if (pageNaviShow) {
                        document.getElementById('IM_NAVIGATOR').style.display = 'block';
                    }
                    if (masterUpdate) {
                        INTERMediator.constructMain(masterContextCL);
                    }
                    if (IMLibUI.mobileNaviBackButtonId) {
                        node = document.getElementById(IMLibUI.mobileNaviBackButtonId);
                        node.style.display = 'none';
                    }
                    if (INTERMediatorOnPage.naviAfterMoveToMaster) {
                        masterContextCL = IMLibContextPool.getMasterContext();
                        detailContextCL = IMLibContextPool.getDetailContext();
                        INTERMediatorOnPage.naviAfterMoveToMaster(masterContextCL, detailContextCL);
                    }
                    if (INTERMediatorOnPage.masterScrollPosition) {
                        window.scrollTo(
                            INTERMediatorOnPage.masterScrollPosition.x,
                            INTERMediatorOnPage.masterScrollPosition.y);
                    }
                };
            }
        }

        function setIdForIMButtons(node) {
            var thisId;
            thisId = 'IM_Button_' + INTERMediator.buttonIdNum;
            node.setAttribute('id', thisId);
            INTERMediator.buttonIdNum++;
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
            var bodyNode, creditNode, cNode, spNode, aNode, versionStrng;

            if (document.getElementById('IM_CREDIT') === null) {
                if (INTERMediatorOnPage.creditIncluding) {
                    bodyNode = document.getElementById(INTERMediatorOnPage.creditIncluding);
                }
                if (!bodyNode) {
                    bodyNode = document.getElementsByTagName('BODY')[0];
                }

                creditNode = document.createElement('div');
                bodyNode.appendChild(creditNode);
                creditNode.setAttribute('id', 'IM_CREDIT');
                creditNode.setAttribute('class', 'IM_CREDIT');

                cNode = document.createElement('div');
                creditNode.appendChild(cNode);
                cNode.style.backgroundColor = '#F6F7FF';
                cNode.style.height = '2px';
                cNode.style.margin = '0';
                cNode.style.padding = '0';

                cNode = document.createElement('div');
                creditNode.appendChild(cNode);
                cNode.style.backgroundColor = '#EBF1FF';
                cNode.style.height = '2px';
                cNode.style.margin = '0';
                cNode.style.padding = '0';

                cNode = document.createElement('div');
                creditNode.appendChild(cNode);
                cNode.style.backgroundColor = '#E1EAFF';
                cNode.style.height = '2px';
                cNode.style.margin = '0';
                cNode.style.padding = '0';

                cNode = document.createElement('div');
                creditNode.appendChild(cNode);
                cNode.setAttribute('align', 'right');
                cNode.style.backgroundColor = '#D7E4FF';
                cNode.style.padding = '2px';
                cNode.style.margin = '0';
                cNode.style.padding = '0';
                spNode = document.createElement('span');
                cNode.appendChild(spNode);
                cNode.style.color = '#666666';
                cNode.style.fontSize = '7pt';
                aNode = document.createElement('a');
                aNode.appendChild(document.createTextNode('INTER-Mediator'));
                aNode.setAttribute('href', 'http://inter-mediator.com/');
                aNode.setAttribute('target', '_href');
                spNode.appendChild(document.createTextNode('Generated by '));
                spNode.appendChild(aNode);
                if (INTERMediatorOnPage.metadata) {
                    versionStrng = ' Ver.' + INTERMediatorOnPage.metadata.version
                        + '(' + INTERMediatorOnPage.metadata.releasedate + ')';
                } else {
                    versionStrng = ' Ver. Development Now!';
                }
                spNode.appendChild(document.createTextNode(versionStrng));
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

    addCondition: function (contextName, condition, notMatching) {
        var value, i, hasIdentical;
        if (notMatching != undefined) {
            condition['matching'] = !notMatching;
        } else {
            condition['matching'] = INTERMediator_DBAdapter.eliminateDuplicatedConditions;
        }
        if (INTERMediator.additionalCondition) {
            value = INTERMediator.additionalCondition;
            if (condition) {
                if (!value[contextName]) {
                    value[contextName] = [];
                }
                if (!condition.matching) {
                    value[contextName].push(condition);
                } else {
                    hasIdentical = false;
                    for (i = 0; i < value[contextName].length; i++) {
                        if (value[contextName][i].field == condition.field
                            && value[contextName][i].operator == condition.operator) {
                            hasIdentical = true;
                            value[contextName][i].value = condition.value;
                            break;
                        }
                    }
                    if (!hasIdentical) {
                        value[contextName].push(condition);
                    }
                }
            }
            INTERMediator.additionalCondition = value;
        }
        IMLibLocalContext.archive();
    },

    clearCondition: function (contextName) {
        var value = INTERMediator.additionalCondition;
        if (value[contextName]) {
            delete value[contextName];
            INTERMediator.additionalCondition = value;
            IMLibLocalContext.archive();
        } else {
            INTERMediator.additionalCondition = {};
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
        var results = [], prop;
        if (obj !== Object(obj)) {
            throw new TypeError('Object.keys called on a non-object');
        }
        for (prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                results.push(prop);
            }
        }
        return results;
    };
}

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
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    };
}
/*
 * INTER-Mediator
 * Copyright (c) INTER-Mediator Directive Committee (http://inter-mediator.org)
 * This project started at the end of 2009 by Masayuki Nii msyk@msyk.net.
 *
 * INTER-Mediator is supplied under MIT License.
 * Please see the full license for details:
 * https://github.com/INTER-Mediator/INTER-Mediator/blob/master/dist-docs/License.txt
 */

var IMLibElement = {
    setValueToIMNode: function (element, curTarget, curVal, clearField) {
        var styleName, currentValue, scriptNode, typeAttr, valueAttr, textNode,
            needPostValueSet = false, nodeTag, curValues, i, isReplaceOrAppned = false;
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

        if (clearField === true && curTarget == '') {
            switch (nodeTag) {
            case 'INPUT':
                switch (element.getAttribute('type')) {
                case 'text':
                    element.value = '';
                    break;
                default:
                    break;
                }
                break;
            case 'SELECT':
                break;
            default:
                while (element.childNodes.length > 0) {
                    if (element.parentNode.getAttribute('data-im-element') === 'processed' ||
                        INTERMediatorLib.isWidgetElement(element.parentNode)) {
                        // for data-im-widget
                        return false;
                    }
                    element.removeChild(element.childNodes[0]);
                }
                break;
            }
        }

        if (curTarget != null && curTarget.length > 0) { //target is specified
            if (curTarget.charAt(0) == '#') { // Appending
                //if (element.getAttribute('data-im-element') !== 'processed') {
                curTarget = curTarget.substring(1);
                if (curTarget == 'innerHTML') {
                    if (INTERMediator.isIE && nodeTag == 'TEXTAREA') {
                        curVal = curVal.replace(/\r\n/g, "\r").replace(/\n/g, "\r").replace(/\r/g, "<br>");
                    }
                    element.innerHTML += curVal;
                } else if (curTarget == 'textNode' || curTarget == 'script') {
                    textNode = document.createTextNode(curVal);
                    if (nodeTag == 'TEXTAREA') {
                        curVal = curVal.replace(/\r\n/g, "\r").replace(/\n/g, "\r");
                    }
                    element.appendChild(textNode);
                } else if (curTarget.indexOf('style.') == 0) {
                    styleName = curTarget.substring(6, curTarget.length);
                    element.style[styleName] = curVal;
                } else {
                    currentValue = element.getAttribute(curTarget);
                    if (curVal.indexOf('/fmi/xml/cnt/') === 0 && currentValue.indexOf('?media=') === -1) {
                        curVal = INTERMediatorOnPage.getEntryPath() + '?media=' + curVal;
                    }
                    element.setAttribute(curTarget, currentValue + curVal);
                }
                isReplaceOrAppned = true;
                //}
            } else if (curTarget.charAt(0) == '$') { // Replacing
                curTarget = curTarget.substring(1);
                if (curTarget == 'innerHTML') {
                    if (INTERMediator.isIE && nodeTag == 'TEXTAREA') {
                        curVal = curVal.replace(/\r\n/g, "\r").replace(/\n/g, "\r").replace(/\r/g, "<br>");
                    }
                    element.innerHTML = element.innerHTML.replace('$', curVal);
                } else if (curTarget == 'textNode' || curTarget == 'script') {
                    if (nodeTag == 'TEXTAREA') {
                        curVal = curVal.replace(/\r\n/g, "\r").replace(/\n/g, "\r");
                    }
                    element.innerHTML = element.innerHTML.replace('$', curVal);
                } else if (curTarget.indexOf('style.') == 0) {
                    styleName = curTarget.substring(6, curTarget.length);
                    element.style[styleName] = curVal;
                } else {
                    currentValue = element.getAttribute(curTarget);
                    curVal = String(curVal);
                    if (curVal.indexOf('/fmi/xml/cnt/') === 0 && currentValue.indexOf('?media=') === -1) {
                        curVal = INTERMediatorOnPage.getEntryPath() + '?media=' + curVal;
                    }
                    element.setAttribute(curTarget, currentValue.replace('$', curVal));
                }
                isReplaceOrAppned = true;
            } else { // Setting
                if (INTERMediatorLib.isWidgetElement(element)) {
                    element._im_setValue(curVal);
                } else if (curTarget == 'innerHTML') { // Setting
                    if (INTERMediator.isIE && nodeTag == 'TEXTAREA') {
                        curVal = curVal.replace(/\r\n/g, "\r").replace(/\n/g, "\r").replace(/\r/g, "<br>");
                    }
                    element.innerHTML = curVal;
                } else if (curTarget == 'textNode') {
                    if (nodeTag == 'TEXTAREA') {
                        curVal = curVal.replace(/\r\n/g, "\r").replace(/\n/g, "\r");
                    }
                    textNode = document.createTextNode(curVal);
                    element.appendChild(textNode);
                } else if (curTarget == 'script') {
                    textNode = document.createTextNode(curVal);
                    if (nodeTag == 'SCRIPT') {
                        element.appendChild(textNode);
                    } else {
                        scriptNode = document.createElement('script');
                        scriptNode.type = 'text/javascript';
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
            } else if (nodeTag == 'INPUT') {
                typeAttr = element.getAttribute('type');
                if (typeAttr == 'checkbox' || typeAttr == 'radio') { // set the value
                    valueAttr = element.value;
                    curValues = curVal.toString().split(IMLib.nl_char);
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
            } else if (nodeTag == 'SELECT') {
                needPostValueSet = true;
                element.value = curVal;
            } else if (nodeTag == 'TEXTAREA') {
                if (INTERMediator.defaultTargetInnerHTML) {
                    if (INTERMediator.isIE) {
                        curVal = curVal.replace(/\r\n/g, "\r").replace(/\n/g, "\r").replace(/\r/g, "<br/>");
                    }
                    element.innerHTML = curVal;
                } else {
                    if (curVal.length > 0 && INTERMediator.isTrident && INTERMediator.ieVersion >= 11) {
                        // for IE11
                        curVal = curVal.replace(/\r\n/g, IMLib.nl_char).replace(/\r/g, IMLib.nl_char);
                    }
                    element.value = curVal;
                }
            } else { // include option and button tag node
                if (INTERMediator.defaultTargetInnerHTML) {
                    element.innerHTML = curVal;
                } else {
                    element.appendChild(document.createTextNode(curVal));
                }
            }
        }
        if ((nodeTag === 'INPUT' || nodeTag === 'SELECT' || nodeTag === 'TEXTAREA') && !isReplaceOrAppned) {
            var idValue = element.id;
            var elementCapt = element;
            INTERMediatorLib.addEvent(element, 'blur', function (event) {
                if (!IMLibUI.valueChange(idValue, true) && this.id === idValue) {
                    elementCapt.focus();
                }
            });
        }
        element.setAttribute('data-im-element', 'processed');
        return needPostValueSet;
    },

    getValueFromIMNode: function (element) {
        var nodeTag, typeAttr, newValue, mergedValues, targetNodes, k, valueAttr;

        if (element) {
            nodeTag = element.tagName;
            typeAttr = element.getAttribute('type');
        } else {
            return '';
        }
        if (INTERMediatorLib.isWidgetElement(element)
            || (INTERMediatorLib.isWidgetElement(element.parentNode))) {
            newValue = element._im_getValue();
        } else if (nodeTag == 'INPUT') {
            if (typeAttr == 'checkbox') {
                if (INTERMediatorOnPage.dbClassName === 'DB_FileMaker_FX') {
                    mergedValues = [];
                    targetNodes = element.parentNode.getElementsByTagName('INPUT');
                    for (k = 0; k < targetNodes.length; k++) {
                        if (targetNodes[k].checked) {
                            mergedValues.push(targetNodes[k].getAttribute('value'));
                        }
                    }
                    newValue = mergedValues.join(IMLib.nl_char);
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
        } else if (nodeTag == 'SELECT') {
            newValue = element.value;
        } else if (nodeTag == 'TEXTAREA') {
            newValue = element.value;
        } else {
            newValue = element.innerHTML;
        }
        return newValue;
    },

    deleteNodes: function (removeNodes) {
        var removeNode, removingNodes, i, j, k, removeNodeId, nodeId, calcObject, referes, values, key;

        for (key = 0; key < removeNodes.length; key++) {
            removeNode = document.getElementById(removeNodes[key]);
            if (removeNode) {
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
                            if (IMLibCalc.calculateRequiredObject.hasOwnProperty(nodeId)) {
                                calcObject = IMLibCalc.calculateRequiredObject[nodeId];
                                referes = {};
                                values = {};
                                for (j in calcObject.referes) {
                                    if (calcObject.referes.hasOwnProperty(j)) {
                                        referes[j] = [];
                                        values[j] = [];
                                        for (k = 0; k < calcObject.referes[j].length; k++) {
                                            if (removeNodeId != calcObject.referes[j][k]) {
                                                referes[j].push(calcObject.referes[j][k]);
                                                values[j].push(calcObject.values[j][k]);
                                            }
                                        }
                                    }
                                }
                                calcObject.referes = referes;
                                calcObject.values = values;
                            }
                        }
                    }
                }
                try {
                    removeNode.parentNode.removeChild(removeNode);
                } catch (ex) {
                    // Avoid an error for Safari
                }
            }
        }
    }
};
/*
 * INTER-Mediator
 * Copyright (c) INTER-Mediator Directive Committee (http://inter-mediator.org)
 * This project started at the end of 2009 by Masayuki Nii msyk@msyk.net.
 *
 * INTER-Mediator is supplied under MIT License.
 * Please see the full license for details:
 * https://github.com/INTER-Mediator/INTER-Mediator/blob/master/dist-docs/License.txt
 */

IMLibEventResponder = {
    touchEventCancel: false,

    isSetup: false,

    setup: function () {
        var body;

        if (IMLibEventResponder.isSetup) {
            return;
        }

        IMLibEventResponder.isSetup = true;
        IMLibChangeEventDispatch = new IMLibEventDispatch();
        IMLibKeyEventDispatch = new IMLibEventDispatch();
        IMLibMouseEventDispatch = new IMLibEventDispatch();
        body = document.getElementsByTagName('BODY')[0];

        INTERMediatorLib.addEvent(body, 'change', function (e) {
            //console.log('Event Dispatcher: change');
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
        INTERMediatorLib.addEvent(body, 'keydown', function (e) {
            //console.log('Event Dispatcher: keydown');
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
        INTERMediatorLib.addEvent(body, 'click', function (e) {
            //console.log('Event Dispatcher: click');
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
    this.dispatchTable = {};
    this.dispatchTableTarget = {};

    this.clearAll = function () {
        this.dispatchTable = {};
        this.dispatchTableTarget = {};
    };

    this.setExecute = function (idValue, exec) {
        if (idValue && exec) {
            this.dispatchTable[idValue] = exec;
        }
    };

    this.setTargetExecute = function (targetValue, exec) {
        if (targetValue && exec) {
            this.dispatchTableTarget[targetValue] = exec;
        }
    };

    this.setExecuteByCode = function (idValue, charCode, exec) {
        if (idValue && charCode) {
            if (!this.dispatchTable[idValue]) {
                this.dispatchTable[idValue] = {};
            }
            this.dispatchTable[idValue][charCode] = exec;
        }
    };
}



/*
 * INTER-Mediator
 * Copyright (c) INTER-Mediator Directive Committee (http://inter-mediator.org)
 * This project started at the end of 2009 by Masayuki Nii msyk@msyk.net.
 *
 * INTER-Mediator is supplied under MIT License.
 * Please see the full license for details:
 * https://github.com/INTER-Mediator/INTER-Mediator/blob/master/dist-docs/License.txt
 */

var IMLibContextPool = {
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
        var i, j, viewName, refNode, targetNodes, result = [], calcKey;
        viewName = context.viewName;
        if (this.poolingContexts == null) {
            return null;
        }
        if (portal) {
            for (i = 0; i < this.poolingContexts.length; i++) {
                if (this.poolingContexts[i].viewName === viewName &&
                    this.poolingContexts[i].binding[recKey] !== undefined &&
                    this.poolingContexts[i].binding[recKey][key] !== undefined &&
                    this.poolingContexts[i].binding[recKey][key][portal] !== undefined &&
                    this.poolingContexts[i].store[recKey] !== undefined &&
                    this.poolingContexts[i].store[recKey][key] !== undefined &&
                    this.poolingContexts[i].store[recKey][key][portal] !== undefined) {

                    this.poolingContexts[i].store[recKey][key][portal] = value;
                    targetNodes = this.poolingContexts[i].binding[recKey][key][portal];
                    for (j = 0; j < targetNodes.length; j++) {
                        refNode = document.getElementById(targetNodes[j].id);
                        if (refNode) {
                            IMLibElement.setValueToIMNode(refNode, targetNodes[j].target, value, true);
                            result.push(targetNodes[j].id);
                        }
                    }
                }
            }
        } else {
            for (i = 0; i < this.poolingContexts.length; i++) {
                if (this.poolingContexts[i].viewName === viewName &&
                    this.poolingContexts[i].binding[recKey] !== undefined &&
                    this.poolingContexts[i].binding[recKey][key] !== undefined &&
                    this.poolingContexts[i].store[recKey] !== undefined &&
                    this.poolingContexts[i].store[recKey][key] !== undefined) {

                    this.poolingContexts[i].store[recKey][key] = value;
                    targetNodes = this.poolingContexts[i].binding[recKey][key];
                    for (j = 0; j < targetNodes.length; j++) {
                        refNode = document.getElementById(targetNodes[j].id);
                        calcKey = targetNodes[j].id;
                        if (targetNodes[j].target && targetNodes[j].target.length > 0) {
                            calcKey += INTERMediator.separator + targetNodes[j].target;
                        }
                        if (refNode && !(calcKey in IMLibCalc.calculateRequiredObject)) {
                            IMLibElement.setValueToIMNode(refNode, targetNodes[j].target, value, true);
                            result.push(targetNodes[j].id);
                            //console.log(refNode, targetNodes[j].target, value);
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
        if (!element) {
            return result;
        }

        linkInfo = INTERMediatorLib.getLinkedElementInfo(element);
        if (!linkInfo && INTERMediatorLib.isWidgetElement(element.parentNode)) {
            linkInfo = INTERMediatorLib.getLinkedElementInfo(element.parentNode);
        }
        nodeInfo = INTERMediatorLib.getNodeInfoArray(linkInfo[0]);

        targetName = target === '' ? '_im_no_target' : target;
        if (this.poolingContexts === null) {
            return null;
        }
        for (i = 0; i < this.poolingContexts.length; i++) {
            targetContext = this.poolingContexts[i];
            if (targetContext.contextInfo[idValue] &&
                targetContext.contextInfo[idValue][targetName] &&
                targetContext.contextInfo[idValue][targetName].context.contextName == nodeInfo.table) {
                result = targetContext.contextInfo[idValue][targetName];
                return result;
            }
        }
        return null;
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
        var keyField = contextDef.key ? contextDef.key : 'id';
        return contextInfo.record.substr(keyField.length + 1);
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
        var i, result = [];
        if (!cName) {
            return false;
        }
        //parentKeyField = 'id';
        for (i = 0; i < this.poolingContexts.length; i++) {
            if (this.poolingContexts[i].contextName == cName &&
                this.poolingContexts[i].foreignValue[parentKeyField] == fValue) {
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
        var i, j, field, nodeIds = [], targetKeying, targetKeyingObj, parentKeying, relatedId, idValue, delNodes,
            contextAndKey, sameOriginContexts, countDeleteNodes;

        contextAndKey = getContextAndKeyFromId(repeaterIdValue);
        if (contextAndKey == null) {
            return;
        }
        sameOriginContexts = this.getContextsWithSameOrigin(contextAndKey.context);
        //sameOriginContexts.push(contextAndKey.context);
        targetKeying = contextAndKey.key;
        //targetKeyingObj = contextAndKey.context.binding[targetKeying];

        for (i = 0; i < sameOriginContexts.length; i++) {
            targetKeyingObj = sameOriginContexts[i].binding[targetKeying];
            for (field in targetKeyingObj) {
                if (targetKeyingObj.hasOwnProperty(field)) {
                    for (j = 0; j < targetKeyingObj[field].length; j++) {
                        if (nodeIds.indexOf(targetKeyingObj[field][j].id) < 0) {
                            nodeIds.push(targetKeyingObj[field][j].id);
                        }
                    }
                }
            }

            if (INTERMediatorOnPage.dbClassName === 'DB_FileMaker_FX') {
                // for FileMaker portal access mode
                parentKeying = Object.keys(contextAndKey.context.binding)[0];
                relatedId = targetKeying.split('=')[1];
                if (sameOriginContexts[i].binding[parentKeying] &&
                    sameOriginContexts[i].binding[parentKeying]['_im_repeater'] &&
                    sameOriginContexts[i].binding[parentKeying]['_im_repeater'][relatedId] &&
                    sameOriginContexts[i].binding[parentKeying]['_im_repeater'][relatedId][0]) {
                    nodeIds.push(sameOriginContexts[i].binding[parentKeying]['_im_repeater'][relatedId][0].id);
                }
            }
        }
        delNodes = [];
        for (i = 0; i < sameOriginContexts.length; i++) {
            for (idValue in sameOriginContexts[i].contextInfo) {
                if (sameOriginContexts[i].contextInfo.hasOwnProperty(idValue)) {
                    if (nodeIds.indexOf(idValue) >= 0) {
                        delete contextAndKey.context.contextInfo[idValue];
                        delNodes.push(idValue);
                    }
                }
            }
            delete sameOriginContexts[i].binding[targetKeying];
            delete sameOriginContexts[i].store[targetKeying];
        }
        countDeleteNodes = delNodes.length;
        IMLibElement.deleteNodes(delNodes);

        this.poolingContexts = this.poolingContexts.filter(function (context) {
            return nodeIds.indexOf(context.enclosureNode.id) < 0;
        });

        return countDeleteNodes;

        // Private functions
        function getContextAndKeyFromId(repeaterIdValue) {
            var i, field, j, keying, foreignKey;

            for (i = 0; i < IMLibContextPool.poolingContexts.length; i++) {
                for (keying in IMLibContextPool.poolingContexts[i].binding) {
                    if (IMLibContextPool.poolingContexts[i].binding.hasOwnProperty(keying)) {
                        for (field in IMLibContextPool.poolingContexts[i].binding[keying]) {
                            if (IMLibContextPool.poolingContexts[i].binding[keying].hasOwnProperty(field)
                                && field == '_im_repeater') {
                                for (j = 0; j < IMLibContextPool.poolingContexts[i].binding[keying][field].length; j++) {
                                    if (repeaterIdValue == IMLibContextPool.poolingContexts[i].binding[keying][field][j].id) {
                                        return ({context: IMLibContextPool.poolingContexts[i], key: keying});
                                    }
                                }

                                if (INTERMediatorOnPage.dbClassName === 'DB_FileMaker_FX') {
                                    // for FileMaker portal access mode
                                    for (foreignKey in IMLibContextPool.poolingContexts[i].binding[keying][field]) {
                                        for (j = 0; j < IMLibContextPool.poolingContexts[i].binding[keying][field][foreignKey].length; j++) {
                                            if (repeaterIdValue == IMLibContextPool.poolingContexts[i].binding[keying][field][foreignKey][j].id) {
                                                return ({
                                                    context: IMLibContextPool.poolingContexts[i],
                                                    key: '-recid=' + foreignKey
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return null;
        }
    },

    getContextsWithSameOrigin: function (originalContext) {
        var i, contexts = [], contextDef, isPortal = false;

        contextDef = IMLibContextPool.getContextDef(originalContext.contextName);
        if (contextDef && contextDef['relation']) {
            for (i in contextDef['relation']) {
                if (contextDef['relation'].hasOwnProperty(i) && contextDef['relation'][i]['portal']) {
                    isPortal = true;
                    break;
                }
            }
        }
        for (i = 0; i < IMLibContextPool.poolingContexts.length; i++) {
            if (IMLibContextPool.poolingContexts[i].sourceName == originalContext.sourceName) {
                if (!isPortal || originalContext.parentContext != IMLibContextPool.poolingContexts[i]) {
                    contexts.push(IMLibContextPool.poolingContexts[i]);
                }
            }
        }
        return contexts;
    },

    updateOnAnotherClient: function (eventName, info) {
        var i, j, k, entityName = info.entity, contextDef, contextView, keyField, recKey;

        if (eventName == 'update') {
            for (i = 0; i < this.poolingContexts.length; i++) {
                contextDef = this.getContextDef(this.poolingContexts[i].contextName);
                contextView = contextDef.view ? contextDef.view : contextDef.name;
                if (contextView == entityName) {
                    keyField = contextDef.key;
                    recKey = keyField + '=' + info.pkvalue;
                    this.poolingContexts[i].setValue(recKey, info.field[0], info.value[0]);

                    var bindingInfo = this.poolingContexts[i].binding[recKey][info.field[0]];
                    for (j = 0; j < bindingInfo.length; j++) {
                        var updateRequiredContext = IMLibContextPool.dependingObjects(bindingInfo[j].id);
                        for (k = 0; k < updateRequiredContext.length; k++) {
                            updateRequiredContext[k].foreignValue = {};
                            updateRequiredContext[k].foreignValue[info.field[0]] = info.value[0];
                            if (updateRequiredContext[k]) {
                                INTERMediator.constructMain(updateRequiredContext[k]);
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
    },

    getContextDef: function (contextName) {
        return INTERMediatorLib.getNamedObject(INTERMediatorOnPage.getDataSources(), 'name', contextName);
    },

    getContextFromNodeId: function (nodeId) {
        var i, context, contextDef, rKey, fKey, pKey, isPortal, bindInfo;
        if (!this.poolingContexts) {
            return null;
        }
        for (i = 0; i < this.poolingContexts.length; i++) {
            context = this.poolingContexts[i];
            contextDef = context.getContextDef();
            isPortal = false;
            if (contextDef['relation']) {
                for (rKey in contextDef['relation']) {
                    if (contextDef['relation'][rKey][portal]) {
                        isPortal = true;
                    }
                }
            }
            for (rKey in context.binding) {
                for (fKey in context.binding[rKey]) {
                    if (isPortal) {
                        for (pKey in context.binding[rKey][fKey]) {
                            bindInfo = context.binding[rKey][fKey][pKey];
                            if (bindInfo.nodeId == nodeId) {
                                return context;
                            }
                        }
                    } else {
                        bindInfo = context.binding[rKey][fKey];
                        if (bindInfo.nodeId == nodeId) {
                            return context;
                        }
                    }
                }
            }
        }
        return null;
    },

    getContextFromEnclosureNode: function (enclosureNode) {
        var i, context;
        if (!this.poolingContexts) {
            return null;
        }
        for (i = 0; i < this.poolingContexts.length; i++) {
            context = this.poolingContexts[i];
            if (context.enclosureNode == enclosureNode) {
                return context;
            }
        }
        return null;
    },

    generateContextObject: function (contextDef, enclosure, repeaters, repeatersOriginal) {
        var contextObj = new IMLibContext(contextDef['name']);
        contextObj.contextDefinition = contextDef;
        contextObj.enclosureNode = enclosure;
        contextObj.repeaterNodes = repeaters;
        contextObj.original = repeatersOriginal;
        contextObj.sequencing = true;
        return contextObj;
    }
};

var IMLibContext = function (contextName) {
    this.contextName = contextName;  // Context Name, set on initialization.
    this.tableName = null;
    this.viewName = null;
    this.sourceName = null;
    this.contextDefinition = null;  // Context Definition object, set on initialization.
    this.store = {};
    this.binding = {};
    this.contextInfo = {};
    this.modified = {};
    this.recordOrder = [];
    this.pendingOrder = [];
    IMLibContextPool.registerContext(this);

    this.foreignValue = {};
    this.enclosureNode = null;    // Set on initialization.
    this.repeaterNodes = null;   // Set on initialization.
    this.dependingObject = [];
    this.original = null;      // Set on initialization.
    this.nullAcceptable = true;
    this.parentContext = null;
    this.registeredId = null;
    this.sequencing = false;       // Set true on initialization.
    this.dependingParentObjectInfo = null;
    this.isPortal = false;
    this.potalContainingRecordKV = null;

    this.updateFieldValue = function (idValue, succeedProc, errorProc, warnMultipleRecProc, warnOthersModifyProc) {
        var nodeInfo, contextInfo, linkInfo, changedObj, criteria, newValue;

        changedObj = document.getElementById(idValue);
        linkInfo = INTERMediatorLib.getLinkedElementInfo(changedObj);
        nodeInfo = INTERMediatorLib.getNodeInfoArray(linkInfo[0]);  // Suppose to be the first definition.
        contextInfo = IMLibContextPool.getContextInfoFromId(idValue, nodeInfo.target);   // suppose to target = ''

        if (INTERMediator.ignoreOptimisticLocking) {
            IMLibContextPool.updateContext(idValue, nodeInfo.target);
            newValue = IMLibElement.getValueFromIMNode(changedObj);
            if (newValue !== null) {
                criteria = contextInfo.record.split('=');
                INTERMediatorOnPage.retrieveAuthInfo();
                if (contextInfo.context.isPortal) {
                    criteria = contextInfo.context.potalContainingRecordKV.split('=');
                    INTERMediator_DBAdapter.db_update_async(
                        {
                            name: contextInfo.context.parentContext.contextName,
                            conditions: [{field: criteria[0], operator: '=', value: criteria[1]}],
                            dataset: [
                                {
                                    field: contextInfo.field + '.' + contextInfo.record.split('=')[1],
                                    value: newValue
                                }
                            ]
                        },
                        succeedProc,
                        errorProc
                    );
                } else {
                    criteria = contextInfo.record.split('=');
                    INTERMediator_DBAdapter.db_update_async(
                        {
                            name: contextInfo.context.contextName,
                            conditions: [{field: criteria[0], operator: '=', value: criteria[1]}],
                            dataset: [{field: contextInfo.field, value: newValue}]
                        },
                        succeedProc,
                        errorProc
                    );
                }

            }
        } else {
            var targetContext = contextInfo.context;
            var parentContext = targetContext.parentContext;
            var targetField = contextInfo['field'];
            var keyingComp
                = (targetContext.isPortal ? targetContext.potalContainingRecordKV : contextInfo['record']).split('=');
            var keyingField = keyingComp[0];
            keyingComp.shift();
            var keyingValue = keyingComp.join('=');
            INTERMediator_DBAdapter.db_query_async(
                {
                    name: targetContext.isPortal ? parentContext.contextName : targetContext.contextName,
                    records: 1,
                    paging: false,
                    fields: [contextInfo['field']],
                    parentkeyvalue: null,
                    conditions: [
                        {field: keyingField, operator: '=', value: keyingValue}
                    ],
                    useoffset: false,
                    primaryKeyOnly: true
                },
                (function () {
                    var targetFieldCapt = targetField;
                    var contextInfoCapt = contextInfo;
                    var targetContextCapt = targetContext;
                    var changedObjectCapt = changedObj;
                    var nodeInfoCapt = nodeInfo;
                    var idValueCapt = idValue;
                    return function (result) {
                        var initialvalue, newValue, isOthersModified, currentFieldVal, recordset = [],
                            portalRecords, index, keyField, keyingComp, criteria;
                        if (targetContextCapt.isPortal) {
                            portalRecords = targetContextCapt.getPortalRecordsetImpl(
                                result.dbresult[0],
                                targetContextCapt.contextName);
                            keyField = targetContextCapt.getKeyField();
                            keyingComp = contextInfoCapt.record.split('=');
                            for (index = 0; index < portalRecords.length; index++) {
                                if (portalRecords[index][keyField] == keyingComp[1]) {
                                    recordset.push(portalRecords[index]);
                                    break;
                                }
                            }
                        } else {
                            recordset = result.dbresult;
                        }
                        if (!recordset || !recordset[0] ||  // This value could be null or undefined
                            recordset[0][targetFieldCapt] === undefined) {
                            errorProc();
                            return;
                        }
                        if (result.resultCount > 1) {
                            if (!warnMultipleRecProc()) {
                                return;
                            }
                        }
                        if (targetContextCapt.isPortal) {
                            for (var i = 0; i < recordset.length; i++) {
                                if (recordset[i]['-recid'] === contextInfo['record'].split('=')[1]) {
                                    currentFieldVal = recordset[i][targetFieldCapt];
                                    break;
                                }
                            }
                            initialvalue = targetContextCapt.getValue(Object.keys(parentContext.store)[0], targetFieldCapt, '-recid=' + recordset[i]['-recid']);
                        } else {
                            currentFieldVal = recordset[0][targetFieldCapt];
                            initialvalue = targetContextCapt.getValue(contextInfoCapt.record, targetFieldCapt);
                        }
                        isOthersModified = checkSameValue(initialvalue, currentFieldVal);
                        if (changedObjectCapt.tagName == 'INPUT' &&
                            changedObjectCapt.getAttribute('type') == 'checkbox') {
                            if (initialvalue == changedObjectCapt.value) {
                                isOthersModified = false;
                            } else if (!parseInt(currentFieldVal)) {
                                isOthersModified = false;
                            } else {
                                isOthersModified = true;
                            }
                        }
                        if (isOthersModified) {
                            // The value of database and the field is different. Others must be changed this field.
                            newValue = IMLibElement.getValueFromIMNode(changedObjectCapt);
                            if (!warnOthersModifyProc(initialvalue, newValue, currentFieldVal)) {
                                return;
                            }
                            INTERMediatorOnPage.retrieveAuthInfo(); // This is required. Why?
                        }
                        IMLibContextPool.updateContext(idValueCapt, nodeInfoCapt.target);
                        newValue = IMLibElement.getValueFromIMNode(changedObjectCapt);
                        if (newValue != null) {
                            INTERMediatorOnPage.retrieveAuthInfo();
                            if (targetContextCapt.isPortal) {
                                criteria = targetContextCapt.potalContainingRecordKV.split('=');
                                INTERMediator_DBAdapter.db_update_async(
                                    {
                                        name: targetContextCapt.parentContext.contextName,
                                        conditions: [{field: criteria[0], operator: '=', value: criteria[1]}],
                                        dataset: [
                                            {
                                                field: contextInfoCapt.field + '.' + contextInfoCapt.record.split('=')[1],
                                                value: newValue
                                            }
                                        ]
                                    },
                                    succeedProc,
                                    errorProc
                                );
                            } else {
                                criteria = contextInfoCapt.record.split('=');
                                INTERMediator_DBAdapter.db_update_async(
                                    {
                                        name: targetContextCapt.contextName,
                                        conditions: [{field: criteria[0], operator: '=', value: criteria[1]}],
                                        dataset: [{field: contextInfo.field, value: newValue}]
                                    },
                                    succeedProc,
                                    errorProc
                                );
                            }
                        }
                    };
                })(),
                function
                    () {
                    INTERMediatorOnPage.hideProgress();
                    INTERMediator.setErrorMessage('Error in valueChange method.', 'EXCEPTION-1');
                    IMLibUI.clearLockInfo();
                }
            );
        }

        var handleAsNullValue = ["0000-00-00", "0000-00-00 00:00:00"];

        function checkSameValue(initialvalue, currentFieldVal)  {
            if (handleAsNullValue.indexOf(initialvalue))   {
                initialvalue = "";
            }
            if (handleAsNullValue.indexOf(currentFieldVal))   {
                currentFieldVal = "";
            }
            return initialvalue != currentFieldVal;
        }
    };

    this.getKeyField = function () {
        var keyField;
        if (INTERMediatorOnPage.dbClassName === 'DB_FileMaker_FX') {
            if (this.isPortal) {
                keyField = '-recid';
            } else {
                keyField = this.contextDefinition['key'] ? this.contextDefinition['key'] : '-recid';
            }
        } else {
            keyField = this.contextDefinition['key'] ? this.contextDefinition['key'] : 'id';
        }
        return keyField;
    };

    this.getCalculationFields = function () {
        var calcDef = this.contextDefinition['calculation'];
        var calcFields = [], ix;
        for (ix in calcDef) {
            if (calcDef.hasOwnProperty(ix)) {
                calcFields.push(calcDef[ix]['field']);
            }
        }
        return calcFields;
    };

    this.isUseLimit = function () {
        var useLimit = false;
        if (this.contextDefinition['records'] && this.contextDefinition['paging']) {
            useLimit = true;
        }
        return useLimit;
    };

    this.getPortalRecords = function () {
        var targetRecords = {};
        if (!this.isPortal) {
            return null;
        }
        targetRecords.recordset = this.getPortalRecordsetImpl(
            this.parentContext.store[this.potalContainingRecordKV], this.contextName);
        return targetRecords;
    };

    this.getPortalRecordsetImpl = function (store, contextName) {
        var result, recId, recordset, key, contextDef;
        recordset = [];
        if (store[0]) {
            if (!store[0][contextName]) {
                for (key in store[0]) {
                    contextDef = INTERMediatorLib.getNamedObject(INTERMediatorOnPage.getDataSources(), 'name', key);
                    if (contextName === contextDef.view && !store[0][contextName]) {
                        contextName = key;
                        break;
                    }
                }
            }
            if (store[0][contextName]) {
                result = store[0][contextName];
                for (recId in result) {
                    if (result.hasOwnProperty(recId) && isFinite(recId)) {
                        recordset.push(result[recId]);
                    }
                }
            }
        }
        return recordset;
    };

    this.getRecordNumber = function () {
        var recordNumber;

        if (this.contextDefinition['navi-control'] &&
            this.contextDefinition['navi-control'] === 'detail') {
            recordNumber = 1;
        } else {
            if (this.contextDefinition.maxrecords) {
                if (parseInt(INTERMediator.pagedSize, 10) === 0) {
                    if (this.contextDefinition.records) {
                        recordNumber = parseInt(this.contextDefinition.records, 10);
                    } else {
                        recordNumber = parseInt(this.contextDefinition.maxrecords, 10);
                    }
                } else {
                    if (parseInt(this.contextDefinition.maxrecords, 10) < parseInt(INTERMediator.pagedSize, 10)) {
                        if (parseInt(this.contextDefinition.maxrecords, 10) < parseInt(this.contextDefinition.records, 10)) {
                            recordNumber = parseInt(this.contextDefinition.records, 10);
                        } else {
                            recordNumber = parseInt(this.contextDefinition.maxrecords, 10);
                        }
                    } else {
                        if (this.contextDefinition.relation) {
                            recordNumber = parseInt(this.contextDefinition.records, 10);
                        } else {
                            recordNumber = parseInt(INTERMediator.pagedSize, 10);
                        }
                    }
                }
            } else {
                if (parseInt(INTERMediator.pagedSize, 10) === 0 ||
                    (parseInt(this.contextDefinition.records, 10) < parseInt(INTERMediator.pagedSize, 10))) {
                    recordNumber = parseInt(this.contextDefinition.records, 10);
                } else {
                    if (this.contextDefinition.relation) {
                        recordNumber = parseInt(this.contextDefinition.records, 10);
                    } else {
                        recordNumber = parseInt(INTERMediator.pagedSize, 10);
                    }
                }
            }
            if (!this.contextDefinition.relation &&
                this.contextDefinition.paging && Boolean(this.contextDefinition.paging) === true) {
                INTERMediator.setLocalProperty('_im_pagedSize', recordNumber);
            }
        }
        return recordNumber;
    };

    this.setRelationWithParent = function (currentRecord, parentObjectInfo, parentContext) {
        var relationDef, index, joinField, fieldName, i;

        this.parentContext = parentContext;

        if (currentRecord) {
            try {
                relationDef = this.contextDefinition['relation'];
                if (relationDef) {
                    for (index in relationDef) {
                        if (Boolean(relationDef[index].portal) === true) {
                            this.isPortal = true;
                            this.potalContainingRecordKV = '-recid=' + currentRecord['-recid'];
                        }
                        joinField = relationDef[index]['join-field'];
                        this.addForeignValue(joinField, currentRecord[joinField]);
                        for (fieldName in parentObjectInfo) {
                            if (fieldName == relationDef[index]['join-field']) {
                                for (i = 0; i < parentObjectInfo[fieldName].length; i++) {
                                    this.addDependingObject(parentObjectInfo[fieldName][i]);
                                }
                                this.dependingParentObjectInfo =
                                    JSON.parse(JSON.stringify(parentObjectInfo));
                            }
                        }
                    }
                }
            } catch (ex) {
                if (ex == '_im_requath_request_') {
                    throw ex;
                } else {
                    INTERMediator.setErrorMessage(ex, 'EXCEPTION-25');
                }
            }
        }

    };

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
    };

    this.indexingArray = function (keyField) {
        var ar = [], key, keyArray, counter = 0;
        for (key in this.store) {
            keyArray = key.split('=');
            ar[counter] = this.store[key][keyField];
            counter += 1;
        }
        return ar;
    };

    this.clearAll = function () {
        this.store = {};
        this.binding = {};
    };

    this.setContextName = function (name) {
        this.contextName = name;
    };

    this.getContextDef = function () {
        return INTERMediatorLib.getNamedObject(INTERMediatorOnPage.getDataSources(), 'name', this.contextName);
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
            this.sourceName = this.contextName;
            // This is not a valid case, it just prevent the error in the unit test.
            return;
        }
        contextDef = this.getContextDef();
        if (contextDef) {
            this.viewName = contextDef['view'] ? contextDef['view'] : contextDef['name'];
            this.tableName = contextDef['table'] ? contextDef['table'] : contextDef['name'];
            this.sourceName = (contextDef['source'] ? contextDef['source']
                : (contextDef['table'] ? contextDef['table']
                : (contextDef['view'] ? contextDef['view'] : contextDef['name'])));
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
            INTERMediatorOnPage.getDataSources(), 'name', this.contextName);
        return contextDef;
    };

    /*
     * The isDebug parameter is for debugging and testing. Usually you should not specify it.
     */
    this.checkOrder = function (oneRecord, isDebug) {
        var i, fields = [], directions = [], oneSortKey, condtextDef, lower, upper, index, targetRecord,
            contextValue, checkingValue, stop;
        if (isDebug !== true) {
            if (INTERMediator && INTERMediator.additionalSortKey[this.contextName]) {
                for (i = 0; i < INTERMediator.additionalSortKey[this.contextName].length; i++) {
                    oneSortKey = INTERMediator.additionalSortKey[this.contextName][i];
                    if (!(oneSortKey.field in fields)) {
                        fields.push(oneSortKey.field);
                        directions.push(oneSortKey.direction);
                    }
                }
            }
            condtextDef = this.getContextDef();
            if (condtextDef && condtextDef.sort) {
                for (i = 0; i < condtextDef.sort.length; i++) {
                    oneSortKey = condtextDef.sort[i];
                    if (!(oneSortKey.field in fields)) {
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
            console.log('#lower=' + lower + ',upper=' + upper + ',index=' + index +
                ',contextValue=' + contextValue + ',checkingValue=' + checkingValue);
        }
        return index;
    };

    /*
     * The isDebug parameter is for debugging and testing. Usually you should not specify it.
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
        var nodeId, field, repeaters = [], repeater, node, i, enclosure, children;

        var recKey = this.recordOrder[index];
        for (field in this.binding[recKey]) {
            nodeId = this.binding[recKey][field].nodeId;
            repeater = INTERMediatorLib.getParentRepeater(document.getElementById(nodeId));
            if (!(repeater in repeaters)) {
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

    this.storeRecords = function (records) {
        var ix, record, field, keyField, keyValue;
        var contextDef = contextDef = INTERMediatorLib.getNamedObject(
            INTERMediatorOnPage.getDataSources(), 'name', this.contextName);
        keyField = contextDef['key'] ? contextDef['key'] : 'id';
        if (records.recordset) {
            for (ix = 0; ix < records.recordset.length; ix++) {
                record = records.recordset[ix];
                for (field in record) {
                    keyValue = record[keyField] ? record[keyField] : ix;
                    this.setValue(keyField + '=' + keyValue, field, record[field]);
                }
            }
        }
    };

    this.getDataAtLastRecord = function (key) {
        var lastKey;
        var storekeys = Object.keys(this.store);
        if (storekeys.length > 0) {
            lastKey = storekeys[storekeys.length - 1];
            return this.getValue(lastKey, key, value);
        }
        return undefined;
    };

    // setData____ methods are for storing data both the model and the database.
//
    this.setDataAtLastRecord = function (key, value) {
        var lastKey, keyAndValue;
        var storekeys = Object.keys(this.store);
        if (storekeys.length > 0) {
            lastKey = storekeys[storekeys.length - 1];
            this.setValue(lastKey, key, value);
            keyAndValue = lastKey.split('=');
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
        var targetKey, contextDef, storeElements;
        contextDef = this.getContextDef();
        if (!contextDef) {
            return;
        }
        targetKey = contextDef.key + '=' + pkValue;
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
        var updatedNodeIds = null;
        if (portal) {
            /* eslint no-console: ["error", {allow: ["error"]}] */
            console.error('Using the portal parameter in IMLibContext.setValue');
        }
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
                    //this.store[recKey][key][portal] = value;
                    this.store[recKey][key] = value;
                } else {
                    this.store[recKey][key] = value;
                }
                if (nodeId) {
                    if (portal) {
                        //this.binding[recKey][key][portal].push({id: nodeId, target: target});
                        this.binding[recKey][key].push({id: nodeId, target: target});
                    } else {
                        this.binding[recKey][key].push({id: nodeId, target: target});
                    }
                    if (this.contextInfo[nodeId] === undefined) {
                        this.contextInfo[nodeId] = {};
                    }
                    this.contextInfo[nodeId][target == '' ? '_im_no_target' : target] =
                    {context: this, record: recKey, field: key};
                    if (portal) {
                        this.contextInfo[nodeId][target == '' ? '_im_no_target' : target].portal = portal;
                    }
                } else {
                    if (INTERMediator.partialConstructing) {
                        updatedNodeIds = IMLibContextPool.synchronize(this, recKey, key, value, target, portal);
                    }
                }
            }
        }
        return updatedNodeIds;
    };

    this.getValue = function (recKey, key, portal) {
        var value;
        try {
            if (portal) {
                value = this.store[portal][key];
            } else {
                value = this.store[recKey][key];
            }
            if (Array.isArray(value)) {
                value = value.join();
            }
            return value === undefined ? null : value;
        } catch (ex) {
            return null;
        }
    };

    this.isValueUndefined = function (recKey, key, portal) {
        var value, tableOccurence, relatedRecId;
        try {
            if (portal) {
                tableOccurence = key.split('::')[0];
                relatedRecId = portal.split('=')[1];
                value = this.store[recKey][0][tableOccurence][relatedRecId][key];
            } else {
                value = this.store[recKey][key];
            }
            return value === undefined ? true : false;
        } catch (ex) {
            return null;
        }
    };

    this.getContextInfo = function (nodeId, target) {
        try {
            var info = this.contextInfo[nodeId][target == '' ? '_im_no_target' : target];
            return info === undefined ? null : info;
        } catch (ex) {
            return null;
        }
    };

    this.getContextValue = function (nodeId, target) {
        try {
            var info = this.contextInfo[nodeId][target == '' ? '_im_no_target' : target];
            var value = info.context.getValue(info.record, info.field);
            return value === undefined ? null : value;
        } catch (ex) {
            return null;
        }
    };

    this.getContextRecord = function (nodeId) {
        var infos, keys, i;
        try {
            infos = this.contextInfo[nodeId];
            keys = Object.keys(infos);
            for (i = 0; i < keys.length; i++) {
                if (infos[keys[i]]) {
                    return this.store[infos[keys[i]].record];
                }
            }
            return null;
        } catch (ex) {
            return null;
        }
    };

    this.removeEntry = function (pkvalue) {
        var keyField, keying, bindingInfo, contextDef, targetNode, repeaterNodes, i, parentNode,
            removingNodeIds = [];
        contextDef = this.getContextDef();
        keyField = contextDef.key;
        keying = keyField + '=' + pkvalue;
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
            opePosition = checkResult.indexOf('D');
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
                opePosition = checkResult.indexOf('EX');
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
                                operator: '=',
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
                return conditionDef.operator == 'ex' ? 'EX' : 'D';
            }

            realValue = oneRecord[conditionDef.field];
            if (!realValue) {
                return false;
            }
            switch (conditionDef.operator) {
            case '=':
            case 'eq':
                return realValue == conditionDef.value;
            case '>':
            case 'gt':
                return realValue > conditionDef.value;
            case '<':
            case 'lt':
                return realValue < conditionDef.value;
            case '>=':
            case 'gte':
                return realValue >= conditionDef.value;
            case '<=':
            case 'lte':
                return realValue <= conditionDef.value;
            case '!=':
            case 'neq':
                return realValue != conditionDef.value;
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
     * Initialize this object
     */
    this.setTable(this);
};


var IMLibLocalContext = {
    contextName: '_',
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
                        IMLibElement.setValueToIMNode(node, '', value, true);
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
        var jsonString, key, searchLen, hashLen, trailLen;
        INTERMediatorOnPage.removeCookie('_im_localcontext');
        if (INTERMediator.isIE && INTERMediator.ieVersion < 9) {
            this.store._im_additionalCondition = INTERMediator.additionalCondition;
            this.store._im_additionalSortKey = INTERMediator.additionalSortKey;
            this.store._im_startFrom = INTERMediator.startFrom;
            this.store._im_pagedSize = INTERMediator.pagedSize;
            /*
             IE8 issue: '' string is modified as 'null' on JSON stringify.
             http://blogs.msdn.com/b/jscript/archive/2009/06/23/serializing-the-value-of-empty-dom-elements-using-native-json-in-ie8.aspx
             */
            jsonString = JSON.stringify(this.store, function (k, v) {
                return v === '' ? '' : v;
            });
        } else {
            jsonString = JSON.stringify(this.store);
        }
        if (INTERMediator.useSessionStorage === true &&
            typeof sessionStorage !== 'undefined' &&
            sessionStorage !== null) {
            try {
                searchLen = location.search ? location.search.length : 0;
                hashLen = location.hash ? location.hash.length : 0;
                trailLen = searchLen + hashLen;
                key = '_im_localcontext' + document.URL.toString();
                key = (trailLen > 0) ? key.slice(0, -trailLen) : key;
                sessionStorage.setItem(key, jsonString);
            } catch (ex) {
                INTERMediatorOnPage.setCookieWorker('_im_localcontext', jsonString, false, 0);
            }
        } else {
            INTERMediatorOnPage.setCookieWorker('_im_localcontext', jsonString, false, 0);
        }
        //console.log('##Archive:', key);
        //console.log('##Archive:', this.store);
    },

    unarchive: function () {
        var localContext = '', searchLen, hashLen, key, trailLen;
        if (INTERMediator.useSessionStorage === true &&
            typeof sessionStorage !== 'undefined' &&
            sessionStorage !== null) {
            try {
                searchLen = location.search ? location.search.length : 0;
                hashLen = location.hash ? location.hash.length : 0;
                trailLen = searchLen + hashLen;
                key = '_im_localcontext' + document.URL.toString();
                key = (trailLen > 0) ? key.slice(0, -trailLen) : key;
                localContext = sessionStorage.getItem(key);
            } catch (ex) {
                localContext = INTERMediatorOnPage.getCookie('_im_localcontext');
            }
        } else {
            localContext = INTERMediatorOnPage.getCookie('_im_localcontext');
        }
        if (localContext && localContext.length > 0) {
            this.store = JSON.parse(localContext);
            //console.log('##Unarchive:', key);
            //console.log('##Unarchive:', this.store);
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

    bindingNode: function (node) {
        var linkInfos, nodeInfo, idValue, i, j, value, params, idArray, unexistId;
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
                if (this.binding[nodeInfo.field].indexOf(idValue) < 0) {
                    this.binding[nodeInfo.field].push(idValue);
                    //this.store[nodeInfo.field] = document.getElementById(idValue).value;
                }
                unexistId = -1;
                while (unexistId >= 0) {
                    for (j = 0; j < this.binding[nodeInfo.field].length; j++) {
                        if (!document.getElementById(this.binding[nodeInfo.field][j])) {
                            unexistId = j;
                        }
                    }
                    if (unexistId >= 0) {
                        delete this.binding[nodeInfo.field][unexistId];
                    }
                }

                params = nodeInfo.field.split(':');
                switch (params[0]) {
                case 'addorder':
                    IMLibMouseEventDispatch.setExecute(idValue, IMLibUI.eventAddOrderHandler);
                    break;
                case 'update':
                    IMLibMouseEventDispatch.setExecute(idValue, (function () {
                        var contextName = params[1];
                        return function () {
                            IMLibUI.eventUpdateHandler(contextName);
                        };
                    })());
                    break;
                case 'condition':
                    IMLibKeyEventDispatch.setExecuteByCode(idValue, 13, (function () {
                        var contextName = params[1];
                        return function () {
                            INTERMediator.startFrom = 0;
                            IMLibUI.eventUpdateHandler(contextName);
                            IMLibPageNavigation.navigationSetup();
                        };
                    })());
                    break;
                case 'limitnumber':
                    IMLibChangeEventDispatch.setExecute(idValue, (function () {
                        var contextName = params[1];
                        return function () {
                            INTERMediator.pagedSize = document.getElementById(idValue).value;
                            IMLibUI.eventUpdateHandler(contextName);
                            IMLibPageNavigation.navigationSetup();
                        };
                    })());
                    break;
                default:
                    IMLibChangeEventDispatch.setExecute(idValue, IMLibLocalContext.update);
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
        IMLibLocalContext.updateFromNodeValue(idValue);
    },

    updateFromNodeValue: function (idValue) {
        var node, nodeValue, linkInfos, nodeInfo, i;
        node = document.getElementById(idValue);
        nodeValue = IMLibElement.getValueFromIMNode(node);
        linkInfos = INTERMediatorLib.getLinkedElementInfo(node);
        for (i = 0; i < linkInfos.length; i++) {
            IMLibLocalContext.store[linkInfos[i]] = nodeValue;
            nodeInfo = INTERMediatorLib.getNodeInfoArray(linkInfos[i]);
            if (nodeInfo.table == IMLibLocalContext.contextName) {
                IMLibLocalContext.setValue(nodeInfo.field, nodeValue);
            }
        }
    },

    updateFromStore: function (idValue) {
        var node, nodeValue, linkInfos, nodeInfo, i, target, comp;
        node = document.getElementById(idValue);
        target = node.getAttribute('data-im');
        comp = target.split(INTERMediator.separator);
        if (comp[1]) {
            nodeValue = IMLibLocalContext.store[comp[1]];
            linkInfos = INTERMediatorLib.getLinkedElementInfo(node);
            for (i = 0; i < linkInfos.length; i++) {
                IMLibLocalContext.store[linkInfos[i]] = nodeValue;
                nodeInfo = INTERMediatorLib.getNodeInfoArray(linkInfos[i]);
                if (nodeInfo.table == IMLibLocalContext.contextName) {
                    IMLibLocalContext.setValue(nodeInfo.field, nodeValue);
                }
            }
        }
    },

    updateAll: function (isStore) {
        var index, key, nodeIds, idValue, targetNode;
        for (key in IMLibLocalContext.binding) {
            nodeIds = IMLibLocalContext.binding[key];
            for (index = 0; index < nodeIds.length; index++) {
                idValue = nodeIds[index];
                targetNode = document.getElementById(idValue);
                if (targetNode &&
                    ( targetNode.tagName == 'INPUT' || targetNode.tagName == 'TEXTAREA' || targetNode.tagName == 'SELECT')) {
                    if (isStore === true) {
                        IMLibLocalContext.updateFromStore(idValue);
                    } else {
                        IMLibLocalContext.updateFromNodeValue(idValue);
                    }
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
                    self.bindingNode(node);
                    children = node.childNodes; // Check all child nodes.
                    if (children) {
                        for (i = 0; i < children.length; i++) {
                            seek(children[i]);
                        }
                    }
                } catch (ex) {
                    if (ex == '_im_requath_request_') {
                        throw ex;
                    } else {
                        INTERMediator.setErrorMessage(ex, 'EXCEPTION-31');
                    }
                }
            }
        }
    }
};
/*
 * INTER-Mediator
 * Copyright (c) INTER-Mediator Directive Committee (http://inter-mediator.org)
 * This project started at the end of 2009 by Masayuki Nii msyk@msyk.net.
 *
 * INTER-Mediator is supplied under MIT License.
 * Please see the full license for details:
 * https://github.com/INTER-Mediator/INTER-Mediator/blob/master/dist-docs/License.txt
 */

//'use strict';

var IMLib = {
    nl_char: '\n',
    cr_char: '\r',
    tab_char: '\t',
    singleQuote_char: '\'',
    doubleQuote_char: '"',
    backSlash_char: '\\',

    get zerolength_str() {
        return '';
    },
    set zerolength_str(value) {
        // do nothing
    },

    get crlf_str() {
        return '\r\n';
    },
    set crlf_str(value) {
        // do nothing
    }
};

var INTERMediatorLib = {

    ignoreEnclosureRepeaterClassName: '_im_ignore_enc_rep',
    ignoreEnclosureRepeaterControlName: 'ignore_enc_rep',
    roleAsRepeaterClassName: '_im_repeater',
    roleAsEnclosureClassName: '_im_enclosure',
    roleAsRepeaterDataControlName: 'repeater',
    roleAsEnclosureDataControlName: 'enclosure',
    roleAsSeparatorDataControlName: 'separator',
    roleAsHeaderDataControlName: 'header',
    roleAsFooterDataControlName: 'footer',
    roleAsNoResultDataControlName: 'noresult',
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
            INTERMediatorLib.cachedDigitSeparator = ['.', ',', 3];
        }

        IMLibLocalContext.unarchive();

        return null;
    },

    setup: function () {
        if (window.addEventListener) {
            window.addEventListener('load', this.initialize, false);
        } else if (window.attachEvent) { // for IE
            window.attachEvent('onload', this.initialize);
        } else {
            window.onload = this.initialize;
        }

        return null;
    },

    digitSeparator: function () {
        return this.cachedDigitSeparator;
    },

    generatePasswordHash: function (password) {
        var numToHex, salt, saltHex, code, lowCode, highCode, i;
        numToHex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
        salt = '';
        saltHex = '';
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
        controlAttr = node.getAttribute('data-im-control');
        if (controlAttr && controlAttr.indexOf(INTERMediatorLib.ignoreEnclosureRepeaterControlName) >= 0) {
            return false;
        }
        tagName = node.tagName;
        if ((tagName === 'TBODY') ||
            (tagName === 'UL') ||
            (tagName === 'OL') ||
            (tagName === 'SELECT') ||
            ((tagName === 'DIV' || tagName === 'SPAN') &&
            className &&
            className.indexOf(INTERMediatorLib.roleAsEnclosureClassName) >= 0) ||
            (controlAttr &&
            controlAttr.indexOf(INTERMediatorLib.roleAsEnclosureDataControlName) >= 0)) {
            if (nodeOnly) {
                return true;
            } else {
                children = node.childNodes;
                for (k = 0; k < children.length; k++) {
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
        controlAttr = node.getAttribute('data-im-control');
        if (controlAttr && controlAttr.indexOf(INTERMediatorLib.ignoreEnclosureRepeaterControlName) >= 0) {
            return false;
        }
        tagName = node.tagName;
        if ((tagName === 'TR') || (tagName === 'LI') || (tagName === 'OPTION')
            || (className && className.indexOf(INTERMediatorLib.roleAsRepeaterClassName) >= 0)
            || (controlAttr && controlAttr.indexOf(INTERMediatorLib.roleAsRepeaterDataControlName) >= 0)
            || (controlAttr && controlAttr.indexOf(INTERMediatorLib.roleAsSeparatorDataControlName) >= 0)
            || (controlAttr && controlAttr.indexOf(INTERMediatorLib.roleAsFooterDataControlName) >= 0)
            || (controlAttr && controlAttr.indexOf(INTERMediatorLib.roleAsHeaderDataControlName) >= 0)
            || (controlAttr && controlAttr.indexOf(INTERMediatorLib.roleAsNoResultDataControlName) >= 0)
        ) {
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

        if (node != null && node.getAttribute) {
            attr = node.getAttribute('data-im');
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
            attr = node.getAttribute('data-im-widget');
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
            if (!parentNode && INTERMediatorLib.getLinkedElementInfoImpl(parentNode)) {
                attr = parentNode.getAttribute('data-im-widget');
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
            if ((repeaterTag === 'TR' && enclosureTag === 'TBODY') ||
                (repeaterTag === 'OPTION' && enclosureTag === 'SELECT') ||
                (repeaterTag === 'LI' && enclosureTag === 'OL') ||
                (repeaterTag === 'LI' && enclosureTag === 'UL')) {
                return true;
            }
            enclosureClass = INTERMediatorLib.getClassAttributeFromNode(enclosure);
            enclosureDataAttr = enclosure.getAttribute('data-im-control');
            if ((enclosureClass && enclosureClass.indexOf(INTERMediatorLib.roleAsEnclosureClassName) >= 0) ||
                (enclosureDataAttr && enclosureDataAttr.indexOf('enclosure') >= 0)) {
                repeaterClass = INTERMediatorLib.getClassAttributeFromNode(repeater);
                repeaterDataAttr = repeater.getAttribute('data-im-control');
                if ((repeaterClass
                    && repeaterClass.indexOf(INTERMediatorLib.roleAsRepeaterClassName) >= 0)
                    || (repeaterDataAttr
                    && repeaterDataAttr.indexOf(INTERMediatorLib.roleAsRepeaterDataControlName) >= 0 )
                    || (repeaterDataAttr
                    && repeaterDataAttr.indexOf(INTERMediatorLib.roleAsSeparatorDataControlName) >= 0 )
                    || (repeaterDataAttr
                    && repeaterDataAttr.indexOf(INTERMediatorLib.roleAsFooterDataControlName) >= 0 )
                    || (repeaterDataAttr
                    && repeaterDataAttr.indexOf(INTERMediatorLib.roleAsHeaderDataControlName) >= 0 )
                    || (repeaterDataAttr
                    && repeaterDataAttr.indexOf(INTERMediatorLib.roleAsNoResultDataControlName) >= 0 )
                ) {
                    return true;
                } else if (repeaterTag === 'INPUT') {
                    repeaterType = repeater.getAttribute('type');
                    if (repeaterType &&
                        ((repeaterType.indexOf('radio') >= 0 || repeaterType.indexOf('check') >= 0))) {
                        return true;
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
        var result = INTERMediatorLib.getLinkedElementInfoImpl(node)
        if (result !== false)   {
            return result;
        }
        if (INTERMediatorLib.isWidgetElement(node.parentNode)) {
            return INTERMediatorLib.getLinkedElementInfo(node.parentNode);
        }
        return false;
    },

    getLinkedElementInfoImpl: function (node) {
        var defs = [], eachDefs, reg, i, attr, matched;
        if (INTERMediatorLib.isLinkedElement(node)) {
            attr = node.getAttribute('data-im');
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
            classAttr = node.getAttribute('data-im-widget');
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
        //else if (tag == 'DIV') return 'DIV';
        //else if (tag == 'SPAN') return 'SPAN';
        return null;
    },

    getNodeInfoArray: function (nodeInfo) {
        var comps, tableName, fieldName, targetName;

        if (!nodeInfo || !nodeInfo.split) {
            return {
                'table': null,
                'field': null,
                'target': null,
                'tableindex': null,
                'crossTable': false
            };
        }
        comps = nodeInfo.split(INTERMediator.separator);
        tableName = '';
        fieldName = '';
        targetName = '';
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
            'tableindex': '_im_index_' + tableName,
            'crossTable': INTERMediator.crossTableStage == 3
        };
    },

    getCalcNodeInfoArray: function (idValue) {
        var comps, tableName, fieldName, targetName, node, attribute;

        if (!idValue) {
            return null;
        }
        node = document.getElementById(idValue);
        if (!node) {
            return null;
        }
        attribute = node.getAttribute('data-im');
        if (!attribute) {
            return null;
        }
        comps = attribute.split(INTERMediator.separator);
        tableName = '';
        fieldName = '';
        targetName = '';
        if (comps.length == 3) {
            tableName = comps[0];
            fieldName = comps[1];
            targetName = comps[2];
        } else if (comps.length == 2) {
            fieldName = comps[0];
            targetName = comps[1];
        } else {
            fieldName = attribute;
        }
        return {
            'table': tableName,
            'field': fieldName,
            'target': targetName,
            'tableindex': '_im_index_' + tableName
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
            this.eventInfos.push({'node': node, 'event': evt, 'function': func});
            return this.eventInfos.length - 1;
        } else if (node.attachEvent) {
            node.attachEvent('on' + evt, func);
            this.eventInfos.push({'node': node, 'event': evt, 'function': func});
            return this.eventInfos.length - 1;
        }
        return -1;
    },

    removeEvent: function (serialId) {
        if (this.eventInfos[serialId].node.removeEventListener) {
            this.eventInfos[serialId].node.removeEventListener(this.eventInfos[serialId].evt, this.eventInfos[serialId].func, false);
        } else if (this.eventInfos[serialId].node.detachEvent) {
            this.eventInfos[serialId].node.detachEvent('on' + this.eventInfos[serialId].evt, this.eventInfos[serialId].func);
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
            underNumStr = '0' + underNumStr;
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
            return 'null';
        }
        if (typeof obj == 'object') {
            str = '';
            if (obj.constractor === Array) {
                for (i = 0; i < obj.length; i++) {
                    str += INTERMediatorLib.objectToString(obj[i]) + ', ';
                }
                return '[' + str + ']';
            } else {
                for (key in obj) {
                    str += "'" + key + "':" + INTERMediatorLib.objectToString(obj[key]) + ", ";
                }
                return '{' + str + '}';
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
                resultStr = resultStr.replace('@' + counter + '@', dataArray[counter - 1]);
            }
        }
        return resultStr;
    },

    getInsertedStringFromErrorNumber: function (errNum, dataArray) {
        var resultStr, counter, messageArray;

        messageArray = INTERMediatorOnPage.getMessages();
        resultStr = messageArray ? messageArray[errNum] : 'Error:' + errNum;
        if (dataArray) {
            for (counter = 1; counter <= dataArray.length; counter++) {
                resultStr = resultStr.replace('@' + counter + '@', dataArray[counter - 1]);
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
            if (ar.hasOwnProperty(index) && ar[index][key1] == named1 && ar[index][key2] == named2) {
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
            if (obj.hasOwnProperty(index)) {
                recordset[obj[index]['field']] = obj[index]['value'];
            }
        }
        return recordset;
    },

    getNodePath: function (node) {
        if (node.tagName === null) {
            return '';
        } else {
            return INTERMediatorLib.getNodePath(node.parentNode) + '/' + node.tagName;
        }
    },

    isPopupMenu: function (element) {
        if (!element || !element.tagName) {
            return false;
        }
        if (element.tagName == 'SELECT') {
            return true;
        }
        return false;
    },

    /*
     If the cNode parameter is like '_im_post', this function will search data-im-control='post' elements.
     */
    getElementsByClassNameOrDataAttr: function (node, cName) {
        var nodes = [], attrValue;

        attrValue = (cName.match(/^_im_/)) ? cName.substr(4) : cName;
        if (attrValue) {
            checkNode(node);
        }
        return nodes;

        function checkNode(target) {
            var value, i, items;
            if (target === undefined || target.nodeType !== 1) {
                return;
            }
            value = INTERMediatorLib.getClassAttributeFromNode(target);
            if (value) {
                items = value.split('|');
                for (i = 0; i < items.length; i++) {
                    if (items[i] == attrValue) {
                        nodes.push(target);
                    }
                }
            }
            value = target.getAttribute('data-im-control');
            if (value) {
                items = value.split(/[| ]/);
                for (i = 0; i < items.length; i++) {
                    if (items[i] == attrValue) {
                        nodes.push(target);
                    }
                }
            }
            value = target.getAttribute('data-im');
            if (value) {
                items = value.split(/[| ]/);
                for (i = 0; i < items.length; i++) {
                    if (items[i] == attrValue) {
                        nodes.push(target);
                    }
                }
            }
            for (i = 0; i < target.children.length; i++) {
                checkNode(target.children[i]);
            }
        }
    },

    getElementsByAttributeValue: function (node, attribute, value) {
        var nodes = [];
        var reg = new RegExp(value);
        checkNode(node);
        return nodes;

        function checkNode(target) {
            var aValue, i;
            if (target === undefined || target.nodeType !== 1) {
                return;
            }
            aValue = target.getAttribute(attribute);
            if (aValue && aValue.match(reg)) {
                nodes.push(target);
            }
            for (i = 0; i < target.children.length; i++) {
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
            if (target === undefined || target.nodeType !== 1) {
                return;
            }
            className = INTERMediatorLib.getClassAttributeFromNode(target);
            if (className && className.match(reg)) {
                nodes.push(target);
            }
            for (i = 0; i < target.children.length; i++) {
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
            if (target === undefined || target.nodeType !== 1) {
                return;
            }
            nodeId = target.getAttribute('id');
            if (nodeId && nodeId.match(reg)) {
                nodes.push(target);
            }
            for (i = 0; i < target.children.length; i++) {
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

    removeChildNodes: function (node) {
        if (node) {
            while (node.childNodes.length > 0) {
                node.removeChild(node.childNodes[0]);
            }
        }
    },

    clearErrorMessage: function (node) {
        var errorMsgs, j;
        if (node) {
            errorMsgs = INTERMediatorLib.getElementsByClassName(node.parentNode, '_im_alertmessage');
            for (j = 0; j < errorMsgs.length; j++) {
                errorMsgs[j].parentNode.removeChild(errorMsgs[j]);
            }
        }
    },

    dateTimeStringISO: function (dt) {
        dt = (!dt) ? new Date() : dt;
        return dt.getFullYear() + '-'
            + ('0' + (dt.getMonth() + 1)).substr(-2, 2) + '-'
            + ('0' + dt.getDate()).substr(-2, 2) + ' '
            + ('0' + dt.getHours()).substr(-2, 2) + ':'
            + ('0' + dt.getMinutes()).substr(-2, 2) + ':'
            + ('0' + dt.getSeconds()).substr(-2, 2);
    },

    dateTimeStringFileMaker: function (dt) {
        dt = (!dt) ? new Date() : dt;
        return ('0' + (dt.getMonth() + 1)).substr(-2, 2) + '/'
            + ('0' + dt.getDate()).substr(-2, 2) + '/'
            + dt.getFullYear() + ' '
            + ('0' + dt.getHours()).substr(-2, 2) + ':'
            + ('0' + dt.getMinutes()).substr(-2, 2) + ':'
            + ('0' + dt.getSeconds()).substr(-2, 2);
    },

    dateStringISO: function (dt) {
        dt = (!dt) ? new Date() : dt;
        return dt.getFullYear() + '-'
            + ('0' + (dt.getMonth() + 1)).substr(-2, 2) + '-'
            + ('0' + dt.getDate()).substr(-2, 2);
    },

    dateStringFileMaker: function (dt) {
        dt = (!dt) ? new Date() : dt;
        return ('0' + (dt.getMonth() + 1)).substr(-2, 2) + '/'
            + ('0' + dt.getDate()).substr(-2, 2) + '/'
            + dt.getFullYear();
    },

    timeString: function (dt) {
        dt = (!dt) ? new Date() : dt;
        return ('0' + dt.getHours()).substr(-2, 2) + ':'
            + ('0' + dt.getMinutes()).substr(-2, 2) + ':'
            + ('0' + dt.getSeconds()).substr(-2, 2);
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
 IMLibNodeGraph.addEdge('a','b');
 IMLibNodeGraph.addEdge('b','c');
 IMLibNodeGraph.addEdge('c','d');
 IMLibNodeGraph.addEdge('a','e');
 IMLibNodeGraph.addEdge('b','f');
 IMLibNodeGraph.addEdge('a','f');
 IMLibNodeGraph.addEdge('i','j');
 IMLibNodeGraph.addNode('x');

 The first calling of the getLeafNodesWithRemoving method returns 'd', 'f', 'e', 'j', 'x'.
 The second calling does 'c', 'i'. The third one does 'b', the forth one does 'a'.
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

    },

    decodeOpenIDToken: function ($token) {
        var header, payload, cert, components = $token.split('.');
        if (components.length != 3) {
            return false;
        }
        header = Base64.decode(components[0]);
        payload = Base64.decode(components[1]);
        cert = Base64.decode(components[2]);
    }
};
/*
 * INTER-Mediator
 * Copyright (c) INTER-Mediator Directive Committee (http://inter-mediator.org)
 * This project started at the end of 2009 by Masayuki Nii msyk@msyk.net.
 *
 * INTER-Mediator is supplied under MIT License.
 * Please see the full license for details:
 * https://github.com/INTER-Mediator/INTER-Mediator/blob/master/dist-docs/License.txt
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

    updateCalculationInfo: function (contextObj, keyingValue, currentContext, nodeId, nInfo, currentRecord) {
        var calcDef, exp, field, elements, i, index, objectKey, itemIndex, values, referes,
            calcDefField, atPos, fieldLength;

        calcDef = currentContext['calculation'];
        for (index in calcDef) {
            atPos = calcDef[index]['field'].indexOf(INTERMediator.separator);
            fieldLength = calcDef[index]['field'].length;
            calcDefField = calcDef[index]['field'].substring(0, atPos >= 0 ? atPos : fieldLength);
            if (calcDefField == nInfo['field']) {
                try {
                    exp = calcDef[index]['expression'];
                    field = calcDef[index]['field'];
                    elements = Parser.parse(exp).variables();
                    objectKey = nodeId +
                        (nInfo.target.length > 0 ? (INTERMediator.separator + nInfo.target) : '');
                } catch (ex) {
                    INTERMediator.setErrorMessage(ex,
                        INTERMediatorLib.getInsertedString(
                            INTERMediatorOnPage.getMessages()[1036], [field, exp]));
                }
                if (elements && objectKey) {
                    values = {};
                    referes = {};
                    for (i = 0; i < elements.length; i++) {
                        itemIndex = elements[i];
                        if (itemIndex) {
                            values[itemIndex] = [currentRecord[itemIndex]];
                            referes[itemIndex] = [undefined];
                        }
                        contextObj.setValue(
                            keyingValue, itemIndex, currentRecord[itemIndex], nodeId, nInfo.target, null);
                    }
                    IMLibCalc.calculateRequiredObject[objectKey] = {
                        'field': field,
                        'expression': exp,
                        'nodeInfo': nInfo,
                        'values': values,
                        'referes': referes
                    };
                }
            }
        }
    },


    updateCalculationFields: function () {
        var nodeId, exp, nInfo, valuesArray, leafNodes, calcObject, ix, refersArray, calcFieldInfo;
        var targetNode, field, valueSeries, targetElement, i, hasReferes, contextInfo, idValue, record;

        IMLibCalc.setUndefinedToAllValues();
        IMLibNodeGraph.clear();
        for (nodeId in IMLibCalc.calculateRequiredObject) {
            calcObject = IMLibCalc.calculateRequiredObject[nodeId];
            if (calcObject) {
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
                    idValue = leafNodes[i].match(IMLibCalc.regexpForSeparator) ?
                        leafNodes[i].split(IMLibCalc.regexpForSeparator)[0] : leafNodes[i];
                    targetNode = document.getElementById(idValue);
                    exp = calcObject.expression;
                    nInfo = calcObject.nodeInfo;
                    valuesArray = calcObject.values;
                    refersArray = calcObject.referes;
                    for (field in valuesArray) {
                        valueSeries = [];
                        for (ix = 0; ix < valuesArray[field].length; ix++) {
                            if (valuesArray[field][ix] == undefined) {
                                if (refersArray[field][ix]) {
                                    targetElement = document.getElementById(refersArray[field][ix]);
                                    valueSeries.push(IMLibElement.getValueFromIMNode(targetElement));
                                } else {
                                    contextInfo = IMLibContextPool.getContextInfoFromId(idValue, nInfo.target);
                                    if (contextInfo && contextInfo.context) {
                                        record = contextInfo.context.getContextRecord(idValue);
                                        valueSeries.push(record[field]);
                                    }
                                }
                            } else {
                                valueSeries.push(valuesArray[field][ix]);
                            }
                        }
                        calcObject.values[field] = valueSeries;
                    }
                    IMLibElement.setValueToIMNode(targetNode, nInfo.target, Parser.evaluate(exp, valuesArray), true);
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
        var nodeId, newValueAdded, leafNodes, calcObject, ix, updatedValue, isRecalcAll = false;
        var newValue, field, i, updatedNodeIds, updateNodeValues, cachedIndex, exp, nInfo, valuesArray;
        var refersArray, valueSeries, targetElement, contextInfo, record, idValue;

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
            idValue = nodeId.match(IMLibCalc.regexpForSeparator) ?
                nodeId.split(IMLibCalc.regexpForSeparator)[0] : nodeId;
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
                if (calcObject) {
                    idValue = leafNodes[i].match(IMLibCalc.regexpForSeparator) ?
                        leafNodes[i].split(IMLibCalc.regexpForSeparator)[0] : leafNodes[i];
                    exp = calcObject.expression;
                    nInfo = calcObject.nodeInfo;
                    valuesArray = calcObject.values;
                    refersArray = calcObject.referes;
                    for (field in valuesArray) {
                        valueSeries = [];
                        for (ix = 0; ix < valuesArray[field].length; ix++) {
                            if (valuesArray[field][ix] == undefined) {
                                if (refersArray[field][ix]) {
                                    targetElement = document.getElementById(refersArray[field][ix]);
                                    valueSeries.push(IMLibElement.getValueFromIMNode(targetElement));
                                } else {
                                    contextInfo = IMLibContextPool.getContextInfoFromId(idValue, nInfo.target);
                                    record = contextInfo.context.getContextRecord(idValue);
                                    valueSeries.push(record[field]);
                                }
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
                        //console.log('calc-test', calcObject.expression, calcObject.values);
                        updatedValue = Parser.evaluate(
                            calcObject.expression,
                            calcObject.values
                        );
                        IMLibElement.setValueToIMNode(
                            document.getElementById(idValue), nInfo.target, updatedValue, true);
                        updatedNodeIds.push(idValue);
                        updateNodeValues.push(updatedValue);
                    }
                }
            }
        } while (leafNodes.length > 0);
        if (IMLibNodeGraph.nodes.length > 0) {
            // Spanning Tree Detected.
        }

    },

    setUndefinedToAllValues: function () {
        var nodeId, calcObject, ix, targetNode, field, targetExp, targetIds, isRemoved, idValue, repeaterTop;

        do {
            isRemoved = false;
            for (nodeId in IMLibCalc.calculateRequiredObject) {
                idValue = nodeId.match(IMLibCalc.regexpForSeparator) ?
                    nodeId.split(IMLibCalc.regexpForSeparator)[0] : nodeId;
                if (!document.getElementById(idValue)) {
                    delete IMLibCalc.calculateRequiredObject[nodeId];
                    isRemoved = true;
                    break;
                }
            }
        } while (isRemoved);

        for (nodeId in IMLibCalc.calculateRequiredObject) {
            calcObject = IMLibCalc.calculateRequiredObject[nodeId];
            targetNode = document.getElementById(nodeId);
            for (field in calcObject.values) {
                if (field.indexOf(INTERMediator.separator) > -1) {
                    targetExp = field;
                } else {
                    targetExp = calcObject.nodeInfo.table + INTERMediator.separator + field;
                }
                if (nodeId.nodeInfo && nodeId.nodeInfo.crossTable) {
                    repeaterTop = targetNode;
                    while (repeaterTop.tagName != 'TD' && repeaterTop.tagName != 'TH') {
                        repeaterTop = repeaterTop.parentNode;
                    }
                    do {
                        targetIds = INTERMediatorOnPage.getNodeIdsHavingTargetFromNode(targetNode, targetExp);
                        if (targetIds && targetIds.length > 0) {
                            break;
                        }
                        targetNode = INTERMediatorLib.getParentRepeater(
                            INTERMediatorLib.getParentEnclosure(targetNode));
                    } while (targetNode);
                } else {
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
                }
                if (INTERMediatorLib.is_array(targetIds) && targetIds.length > 0) {
                    calcObject.referes[field] = [];
                    calcObject.values[field] = [];
                    for (ix = 0; ix < targetIds.length; ix++) {
                        calcObject.referes[field].push(targetIds[ix]);
                        calcObject.values[field].push(undefined);
                    }
                } else {
                    calcObject.referes[field] = [undefined];
                    calcObject.values[field] = [undefined];
                }
            }
        }
    }
};
/*
 * INTER-Mediator
 * Copyright (c) INTER-Mediator Directive Committee (http://inter-mediator.org)
 * This project started at the end of 2009 by Masayuki Nii msyk@msyk.net.
 *
 * INTER-Mediator is supplied under MIT License.
 * Please see the full license for details:
 * https://github.com/INTER-Mediator/INTER-Mediator/blob/master/dist-docs/License.txt
 */

//'use strict';

var INTERMediatorOnPage = {
    authCountLimit: 4,
    authCount: 0,
    authUser: '',
    authHashedPassword: '',
    authCryptedPassword: '',
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
    passwordPolicy: null,
    creditIncluding: null,
    masterScrollPosition: null,
    nonSupportMessageId: 'nonsupportmessage',
    isFinishToConstruct: false,
    isAutoConstruct: true,

    isShowChangePassword: true,
    isSetDefaultStyle: true,
    authPanelTitle: null,
    isOAuthAvailable: false,
    oAuthClientID: null,
    oAuthClientSecret: null,
    oAuthBaseURL: null,
    oAuthRedirect: null,
    oAuthScope: null,

    additionalExpandingEnclosureFinish: {},
    additionalExpandingRecordFinish: {},

    getEditorPath: null,
    getEntryPath: null,
    getIMRootPath: null,
    getDataSources: null,
    getOptionsAliases: null,
    getOptionsTransaction: null,
    dbClassName: null,
    browserCompatibility: null,
    clientNotificationIdentifier: null,
    metadata: null,
    isLDAP: null,

    clearCredentials: function () {
        'use strict';
        INTERMediatorOnPage.authChallenge = null;
        INTERMediatorOnPage.authHashedPassword = null;
        INTERMediatorOnPage.authCryptedPassword = null;
    },
    /*
     This method 'getMessages' is going to be replaced valid one with the browser's language.
     Here is defined to prevent the warning of static check.
     */
    getMessages: function () {
        'use strict';
        return null;
    },

    getURLParametersAsArray: function () {
        'use strict';
        var i, params, eqPos, result, key, value;
        result = {};
        params = location.search.substring(1).split('&');
        for (i = 0; i < params.length; i++) {
            eqPos = params[i].indexOf('=');
            if (eqPos > 0) {
                key = params[i].substring(0, eqPos);
                value = params[i].substring(eqPos + 1);
                result[key] = decodeURIComponent(value);
            }
        }
        return result;
    },

    getContextInfo: function (contextName) {
        'use strict';
        var dataSources, index;
        dataSources = INTERMediatorOnPage.getDataSources();
        for (index in dataSources) {
            if (dataSources.hasOwnProperty(index) && dataSources[index].name == contextName) {
                return dataSources[index];
            }
        }
        return null;
    },

    isComplementAuthData: function () {
        'use strict';
        return INTERMediatorOnPage.authUser !== null && INTERMediatorOnPage.authUser.length > 0 &&
            INTERMediatorOnPage.authHashedPassword !== null && INTERMediatorOnPage.authHashedPassword.length > 0 &&
            INTERMediatorOnPage.authUserSalt !== null && INTERMediatorOnPage.authUserSalt.length > 0 &&
            INTERMediatorOnPage.authChallenge !== null && INTERMediatorOnPage.authChallenge.length > 0;
    },

    retrieveAuthInfo: function () {
        'use strict';
        if (INTERMediatorOnPage.requireAuthentication) {
            if (INTERMediatorOnPage.isOnceAtStarting) {
                switch (INTERMediatorOnPage.authStoring) {
                case 'cookie':
                case 'cookie-domainwide':
                    INTERMediatorOnPage.authUser =
                        INTERMediatorOnPage.getCookie('_im_username');
                    INTERMediatorOnPage.authHashedPassword =
                        INTERMediatorOnPage.getCookie('_im_credential');
                    INTERMediatorOnPage.mediaToken =
                        INTERMediatorOnPage.getCookie('_im_mediatoken');
                    INTERMediatorOnPage.authCryptedPassword =
                        INTERMediatorOnPage.getCookie('_im_crypted');
                    break;
                case 'session-storage':
                    INTERMediatorOnPage.authUser =
                        INTERMediatorOnPage.getSessionStorageWithFallDown('_im_username');
                    INTERMediatorOnPage.authHashedPassword =
                        INTERMediatorOnPage.getSessionStorageWithFallDown('_im_credential');
                    INTERMediatorOnPage.mediaToken =
                        INTERMediatorOnPage.getSessionStorageWithFallDown('_im_mediatoken');
                    INTERMediatorOnPage.authCryptedPassword =
                        INTERMediatorOnPage.getSessionStorageWithFallDown('_im_crypted');
                    break;
                default:
                    INTERMediatorOnPage.removeCookie('_im_username');
                    INTERMediatorOnPage.removeCookie('_im_credential');
                    INTERMediatorOnPage.removeCookie('_im_mediatoken');
                    INTERMediatorOnPage.removeCookie('_im_crypted');
                    break;
                }
                INTERMediatorOnPage.isOnceAtStarting = false;
            }
            if (INTERMediatorOnPage.authUser.length > 0) {
                if (!INTERMediator_DBAdapter.getChallenge()) {
                    INTERMediator.flushMessage();
                }
            }
        }
    },

    logout: function () {
        'use strict';
        INTERMediatorOnPage.authUser = '';
        INTERMediatorOnPage.authHashedPassword = '';
        INTERMediatorOnPage.authCryptedPassword = '';
        INTERMediatorOnPage.authUserSalt = '';
        INTERMediatorOnPage.authChallenge = '';
        INTERMediatorOnPage.clientId = '';
        INTERMediatorOnPage.removeCredencialsFromCookieOrStorage();
        INTERMediatorOnPage.removeFromSessionStorageWithFallDown('_im_localcontext');
    },

    storeSessionStorageWithFallDown: function (key, value) {
        if (INTERMediator.useSessionStorage === true &&
            typeof sessionStorage !== 'undefined' &&
            sessionStorage !== null) {
            try {
                sessionStorage.setItem(INTERMediatorOnPage.getKeyWithRealm(key), value);
            } catch (ex) {
                INTERMediatorOnPage.setCookie(key, value);
            }
        } else {
            INTERMediatorOnPage.setCookie(key, value);
        }
    },

    getSessionStorageWithFallDown: function (key) {
        var value;
        if (INTERMediator.useSessionStorage === true &&
            typeof sessionStorage !== 'undefined' &&
            sessionStorage !== null) {
            try {
                value = sessionStorage.getItem(INTERMediatorOnPage.getKeyWithRealm(key));
                value = value ? value : '';
            } catch (ex) {
                value = INTERMediatorOnPage.getCookie(key);
            }
        } else {
            value = INTERMediatorOnPage.getCookie(key);
        }
        return value;
    },

    removeFromSessionStorageWithFallDown: function (key) {
        if (INTERMediator.useSessionStorage === true &&
            typeof sessionStorage !== 'undefined' &&
            sessionStorage !== null) {
            try {
                sessionStorage.removeItem(INTERMediatorOnPage.getKeyWithRealm(key));
            } catch (ex) {
                INTERMediatorOnPage.removeCookie(key);
            }
        } else {
            INTERMediatorOnPage.removeCookie(key);
        }
    },

    removeCredencialsFromCookieOrStorage: function () {
        'use strict';
        switch (INTERMediatorOnPage.authStoring) {
        case 'cookie':
        case 'cookie-domainwide':
            INTERMediatorOnPage.removeCookie('_im_username');
            INTERMediatorOnPage.removeCookie('_im_credential');
            INTERMediatorOnPage.removeCookie('_im_mediatoken');
            INTERMediatorOnPage.removeCookie('_im_crypted');
            break;
        case 'session-storage':
            INTERMediatorOnPage.removeFromSessionStorageWithFallDown('_im_username');
            INTERMediatorOnPage.removeFromSessionStorageWithFallDown('_im_credential');
            INTERMediatorOnPage.removeFromSessionStorageWithFallDown('_im_mediatoken');
            INTERMediatorOnPage.removeFromSessionStorageWithFallDown('_im_crypted');
            break;
        }
    },

    storeCredentialsToCookieOrStorage: function () {
        'use strict';
        switch (INTERMediatorOnPage.authStoring) {
        case 'cookie':
            if (INTERMediatorOnPage.authUser) {
                INTERMediatorOnPage.setCookie('_im_username', INTERMediatorOnPage.authUser);
            }
            if (INTERMediatorOnPage.authHashedPassword) {
                INTERMediatorOnPage.setCookie('_im_credential', INTERMediatorOnPage.authHashedPassword);
            }
            if (INTERMediatorOnPage.mediaToken) {
                INTERMediatorOnPage.setCookie('_im_mediatoken', INTERMediatorOnPage.mediaToken);
            }
            if (INTERMediatorOnPage.authCryptedPassword) {
                INTERMediatorOnPage.setCookie('_im_crypted', INTERMediatorOnPage.authCryptedPassword);
            }
            break;
        case 'cookie-domainwide':
            if (INTERMediatorOnPage.authUser) {
                INTERMediatorOnPage.setCookieDomainWide('_im_username', INTERMediatorOnPage.authUser);
            }
            if (INTERMediatorOnPage.authHashedPassword) {
                INTERMediatorOnPage.setCookieDomainWide('_im_credential', INTERMediatorOnPage.authHashedPassword);
            }
            if (INTERMediatorOnPage.mediaToken) {
                INTERMediatorOnPage.setCookieDomainWide('_im_mediatoken', INTERMediatorOnPage.mediaToken);
            }
            if (INTERMediatorOnPage.authCryptedPassword) {
                INTERMediatorOnPage.setCookieDomainWide('_im_crypted', INTERMediatorOnPage.authCryptedPassword);
            }
            break;
        case 'session-storage':
            if (INTERMediatorOnPage.authUser) {
                INTERMediatorOnPage.storeSessionStorageWithFallDown('_im_username', INTERMediatorOnPage.authUser);
            }
            if (INTERMediatorOnPage.authHashedPassword) {
                INTERMediatorOnPage.storeSessionStorageWithFallDown('_im_credential', INTERMediatorOnPage.authHashedPassword);
            }
            if (INTERMediatorOnPage.mediaToken) {
                INTERMediatorOnPage.storeSessionStorageWithFallDown('_im_mediatoken', INTERMediatorOnPage.mediaToken);
            }
            if (INTERMediatorOnPage.authCryptedPassword) {
                INTERMediatorOnPage.storeSessionStorageWithFallDown('_im_crypted', INTERMediatorOnPage.authCryptedPassword);
            }
            break;
        }
    },

    defaultBackgroundColor: null,
    loginPanelHTML: null,

    authenticating: function (doAfterAuth, doTest) {
        'use strict';
        var bodyNode, backBox, frontPanel, labelWidth, userLabel, userSpan, userBox, msgNumber,
            passwordLabel, passwordSpan, passwordBox, breakLine, chgpwButton, authButton, panelTitle,
            newPasswordLabel, newPasswordSpan, newPasswordBox, newPasswordMessage, realmBox, keyCode,
            messageNode, oAuthButton;

        this.checkPasswordPolicy = function (newPassword, userName, policyString) {
            var terms, i, policyCheck, message = [], minLen;
            if (!policyString) {
                return message;
            }
            terms = policyString.split(/[\s,]/);
            for (i = 0; i < terms.length; i++) {
                switch (terms[i].toUpperCase()) {
                case 'USEALPHABET':
                    if (!newPassword.match(/[A-Za-z]/)) {
                        policyCheck = false;
                        message.push(INTERMediatorLib.getInsertedStringFromErrorNumber(2015));
                    }
                    break;
                case 'USENUMBER':
                    if (!newPassword.match(/[0-9]/)) {
                        policyCheck = false;
                        message.push(INTERMediatorLib.getInsertedStringFromErrorNumber(2016));
                    }
                    break;
                case 'USEUPPER':
                    if (!newPassword.match(/[A-Z]/)) {
                        policyCheck = false;
                        message.push(INTERMediatorLib.getInsertedStringFromErrorNumber(2017));
                    }
                    break;
                case 'USELOWER':
                    if (!newPassword.match(/[a-z]/)) {
                        policyCheck = false;
                        message.push(INTERMediatorLib.getInsertedStringFromErrorNumber(2018));
                    }
                    break;
                case 'USEPUNCTUATION':
                    if (!newPassword.match(/[^A-Za-z0-9]/)) {
                        policyCheck = false;
                        message.push(INTERMediatorLib.getInsertedStringFromErrorNumber(2019));
                    }
                    break;
                case 'NOTUSERNAME':
                    if (newPassword == userName) {
                        policyCheck = false;
                        message.push(INTERMediatorLib.getInsertedStringFromErrorNumber(2020));
                    }
                    break;
                default:
                    if (terms[i].toUpperCase().indexOf('LENGTH') === 0) {
                        minLen = terms[i].match(/[0-9]+/)[0];
                        if (newPassword.length < minLen) {
                            policyCheck = false;
                            message.push(
                                INTERMediatorLib.getInsertedStringFromErrorNumber(2021, [minLen]));
                        }
                    }
                }
            }
            return message;
        };

        if (doTest) {
            return;
        }

        if (INTERMediatorOnPage.authCount > INTERMediatorOnPage.authCountLimit) {
            INTERMediatorOnPage.authenticationError();
            INTERMediatorOnPage.logout();
            INTERMediator.flushMessage();
            return;
        }

        bodyNode = document.getElementsByTagName('BODY')[0];
        backBox = document.createElement('div');
        bodyNode.insertBefore(backBox, bodyNode.childNodes[0]);
        backBox.style.height = '100%';
        backBox.style.width = '100%';
        if (INTERMediatorOnPage.defaultBackgroundImage) {
            if (INTERMediatorOnPage.isSetDefaultStyle && INTERMediatorOnPage.getIMRootPath !== undefined) {
                backBox.style.backgroundImage =
                    'url(' + INTERMediatorOnPage.getIMRootPath() + '/themes/default/images/background.gif)';
            }
        }
        if (INTERMediatorOnPage.defaultBackgroundColor) {
            backBox.style.backgroundColor = INTERMediatorOnPage.defaultBackgroundColor;
        }
        backBox.style.position = 'absolute';
        backBox.style.padding = ' 50px 0 0 0';
        backBox.style.top = '0';
        backBox.style.left = '0';
        backBox.style.zIndex = '999998';

        if (INTERMediatorOnPage.loginPanelHTML) {
            backBox.innerHTML = INTERMediatorOnPage.loginPanelHTML;
            passwordBox = document.getElementById('_im_password');
            userBox = document.getElementById('_im_username');
            authButton = document.getElementById('_im_authbutton');
            chgpwButton = document.getElementById('_im_changebutton');
            oAuthButton = document.getElementById('_im_oauthbutton');
        } else {
            frontPanel = document.createElement('div');
            if (INTERMediatorOnPage.isSetDefaultStyle) {
                frontPanel.style.width = '450px';
                frontPanel.style.backgroundColor = '#333333';
                frontPanel.style.color = '#DDDDAA';
                frontPanel.style.margin = '50px auto 0 auto';
                frontPanel.style.padding = '20px';
                frontPanel.style.borderRadius = '10px';
                frontPanel.style.position = 'relative';
            }
            frontPanel.id = '_im_authpanel';
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
                realmBox.style.textAlign = 'left';
                frontPanel.appendChild(realmBox);
                breakLine = document.createElement('HR');
                frontPanel.appendChild(breakLine);
            }

            labelWidth = '100px';
            userLabel = document.createElement('LABEL');
            frontPanel.appendChild(userLabel);
            userSpan = document.createElement('span');
            if (INTERMediatorOnPage.isSetDefaultStyle) {
                userSpan.style.minWidth = labelWidth;
                userSpan.style.textAlign = 'right';
                userSpan.style.cssFloat = 'left';
            }
            INTERMediatorLib.setClassAttributeToNode(userSpan, '_im_authlabel');
            userLabel.appendChild(userSpan);
            msgNumber = INTERMediatorOnPage.isEmailAsUsername ? 2011 : 2002;
            userSpan.appendChild(document.createTextNode(INTERMediatorLib.getInsertedStringFromErrorNumber(msgNumber)));
            userBox = document.createElement('INPUT');
            userBox.type = 'text';
            userBox.id = '_im_username';
            userBox.size = '20';
            userBox.setAttribute('autocapitalize', 'off');
            userLabel.appendChild(userBox);

            breakLine = document.createElement('BR');
            breakLine.clear = 'all';
            frontPanel.appendChild(breakLine);

            passwordLabel = document.createElement('LABEL');
            frontPanel.appendChild(passwordLabel);
            passwordSpan = document.createElement('SPAN');
            if (INTERMediatorOnPage.isSetDefaultStyle) {
                passwordSpan.style.minWidth = labelWidth;
                passwordSpan.style.textAlign = 'right';
                passwordSpan.style.cssFloat = 'left';
            }
            INTERMediatorLib.setClassAttributeToNode(passwordSpan, '_im_authlabel');
            passwordLabel.appendChild(passwordSpan);
            passwordSpan.appendChild(document.createTextNode(INTERMediatorLib.getInsertedStringFromErrorNumber(2003)));
            passwordBox = document.createElement('INPUT');
            passwordBox.type = 'password';
            passwordBox.id = '_im_password';
            passwordBox.size = '20';
            passwordLabel.appendChild(passwordBox);

            authButton = document.createElement('BUTTON');
            authButton.appendChild(document.createTextNode(INTERMediatorLib.getInsertedStringFromErrorNumber(2004)));
            frontPanel.appendChild(authButton);

            breakLine = document.createElement('BR');
            breakLine.clear = 'all';
            frontPanel.appendChild(breakLine);

            newPasswordMessage = document.createElement('DIV');
            newPasswordMessage.style.textAlign = 'center';
            newPasswordMessage.style.textSize = '10pt';
            newPasswordMessage.style.color = '#994433';
            newPasswordMessage.id = '_im_login_message';
            frontPanel.appendChild(newPasswordMessage);

            if (this.isShowChangePassword && !INTERMediatorOnPage.isNativeAuth) {
                breakLine = document.createElement('HR');
                frontPanel.appendChild(breakLine);

                newPasswordLabel = document.createElement('LABEL');
                frontPanel.appendChild(newPasswordLabel);
                newPasswordSpan = document.createElement('SPAN');
                if (INTERMediatorOnPage.isSetDefaultStyle) {
                    newPasswordSpan.style.minWidth = labelWidth;
                    newPasswordSpan.style.textAlign = 'right';
                    newPasswordSpan.style.cssFloat = 'left';
                    newPasswordSpan.style.fontSize = '0.7em';
                    newPasswordSpan.style.paddingTop = '4px';
                }
                INTERMediatorLib.setClassAttributeToNode(newPasswordSpan, '_im_authlabel');
                newPasswordLabel.appendChild(newPasswordSpan);
                newPasswordSpan.appendChild(
                    document.createTextNode(INTERMediatorLib.getInsertedStringFromErrorNumber(2006)));
                newPasswordBox = document.createElement('INPUT');
                newPasswordBox.type = 'password';
                newPasswordBox.id = '_im_newpassword';
                newPasswordBox.size = '12';
                newPasswordLabel.appendChild(newPasswordBox);
                chgpwButton = document.createElement('BUTTON');
                chgpwButton.appendChild(document.createTextNode(INTERMediatorLib.getInsertedStringFromErrorNumber(2005)));
                frontPanel.appendChild(chgpwButton);

                newPasswordMessage = document.createElement('DIV');
                newPasswordMessage.style.textAlign = 'center';
                newPasswordMessage.style.textSize = '10pt';
                newPasswordMessage.style.color = '#994433';
                newPasswordMessage.id = '_im_newpass_message';
                frontPanel.appendChild(newPasswordMessage);
            }
            if (this.isOAuthAvailable) {
                breakLine = document.createElement('HR');
                frontPanel.appendChild(breakLine);
                oAuthButton = document.createElement('BUTTON');
                oAuthButton.appendChild(document.createTextNode(
                    INTERMediatorLib.getInsertedStringFromErrorNumber(2014)));
                frontPanel.appendChild(oAuthButton);
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
            var inputUsername, inputPassword, challengeResult, messageNode;

            messageNode = document.getElementById('_im_newpass_message');
            if (messageNode) {
                INTERMediatorLib.removeChildNodes(messageNode);
            }

            inputUsername = document.getElementById('_im_username').value;
            inputPassword = document.getElementById('_im_password').value;

            if (inputUsername === '' || inputPassword === '') {
                messageNode = document.getElementById('_im_login_message');
                INTERMediatorLib.removeChildNodes(messageNode);
                messageNode.appendChild(
                    document.createTextNode(
                        INTERMediatorLib.getInsertedStringFromErrorNumber(2013)));
                return;
            }
            INTERMediatorOnPage.authUser = inputUsername;
            bodyNode.removeChild(backBox);
            if (inputUsername !== '' &&  // No usename and no challenge, get a challenge.
                (INTERMediatorOnPage.authChallenge === null || INTERMediatorOnPage.authChallenge.length < 24 )) {
                INTERMediatorOnPage.authHashedPassword = 'need-hash-pls';   // Dummy Hash for getting a challenge
                challengeResult = INTERMediator_DBAdapter.getChallenge();
                if (!challengeResult) {
                    INTERMediator.flushMessage();
                    return; // If it's failed to get a challenge, finish everything.
                }
            }
            INTERMediatorOnPage.authCryptedPassword =
                INTERMediatorOnPage.publickey.biEncryptedString(inputPassword);
            INTERMediatorOnPage.authHashedPassword =
                SHA1(inputPassword + INTERMediatorOnPage.authUserSalt) +
                INTERMediatorOnPage.authUserHexSalt;

            if (INTERMediatorOnPage.authUser.length > 0) {   // Authentication succeed, Store coockies.
                INTERMediatorOnPage.storeCredentialsToCookieOrStorage();
            }

            doAfterAuth();  // Retry.
            INTERMediator.flushMessage();
        };
        if (chgpwButton) {
            var checkPolicyMethod = this.checkPasswordPolicy;
            chgpwButton.onclick = function () {
                var inputUsername, inputPassword, inputNewPassword, result, messageNode, message;

                messageNode = document.getElementById('_im_login_message');
                INTERMediatorLib.removeChildNodes(messageNode);
                messageNode = document.getElementById('_im_newpass_message');
                INTERMediatorLib.removeChildNodes(messageNode);

                inputUsername = document.getElementById('_im_username').value;
                inputPassword = document.getElementById('_im_password').value;
                inputNewPassword = document.getElementById('_im_newpassword').value;
                if (inputUsername === '' || inputPassword === '' || inputNewPassword === '') {
                    messageNode = document.getElementById('_im_newpass_message');
                    INTERMediatorLib.removeChildNodes(messageNode);
                    messageNode.appendChild(
                        document.createTextNode(
                            INTERMediatorLib.getInsertedStringFromErrorNumber(2007)));
                    return;
                }

                message = checkPolicyMethod(inputNewPassword, inputUsername, INTERMediatorOnPage.passwordPolicy);
                if (message.length > 0) {  // Policy violated.
                    messageNode.appendChild(document.createTextNode(message.join(', ')));
                    return;
                }

                result = INTERMediator_DBAdapter.changePassword(inputUsername, inputPassword, inputNewPassword);
                messageNode.appendChild(
                    document.createTextNode(
                        INTERMediatorLib.getInsertedStringFromErrorNumber(result ? 2009 : 2010)));

                INTERMediator.flushMessage();
            };
        }
        if (this.isOAuthAvailable && oAuthButton) {
            oAuthButton.onclick = function () {
                var authURL;
                INTERMediatorOnPage.setCookieDomainWide('_im_oauth_backurl', location.href, true);
                INTERMediatorOnPage.setCookieDomainWide('_im_oauth_realm', INTERMediatorOnPage.realm, true);
                INTERMediatorOnPage.setCookieDomainWide('_im_oauth_expired', INTERMediatorOnPage.authExpired, true);
                INTERMediatorOnPage.setCookieDomainWide('_im_oauth_storing', INTERMediatorOnPage.authStoring, true);
                authURL = INTERMediatorOnPage.oAuthBaseURL +
                    '?scope=' + encodeURIComponent(INTERMediatorOnPage.oAuthScope) +
                    '&redirect_uri=' + encodeURIComponent(INTERMediatorOnPage.oAuthRedirect) +
                    '&response_type=code' +
                    '&client_id=' + encodeURIComponent(INTERMediatorOnPage.oAuthClientID);
                location.href = authURL;
            };
        }

        if (INTERMediatorOnPage.authCount > 0) {
            messageNode = document.getElementById('_im_login_message');
            INTERMediatorLib.removeChildNodes(messageNode);
            messageNode.appendChild(
                document.createTextNode(
                    INTERMediatorLib.getInsertedStringFromErrorNumber(2012)));
        }

        window.scroll(0, 0);
        userBox.focus();
        INTERMediatorOnPage.authCount++;
    },

    authenticationError: function () {
        'use strict';
        var bodyNode, backBox, frontPanel;

        INTERMediatorOnPage.hideProgress();

        bodyNode = document.getElementsByTagName('BODY')[0];
        backBox = document.createElement('div');
        bodyNode.insertBefore(backBox, bodyNode.childNodes[0]);
        backBox.style.height = '100%';
        backBox.style.width = '100%';
        //backBox.style.backgroundColor = '#BBBBBB';
        if (INTERMediatorOnPage.isSetDefaultStyle && INTERMediatorOnPage.getIMRootPath !== undefined) {
            backBox.style.backgroundImage =
                'url(' + INTERMediatorOnPage.getIMRootPath() + '/themes/default/images/background-error.gif)';
        }
        backBox.style.position = 'absolute';
        backBox.style.padding = ' 50px 0 0 0';
        backBox.style.top = '0';
        backBox.style.left = '0';
        backBox.style.zIndex = '999999';

        frontPanel = document.createElement('div');
        frontPanel.style.width = '240px';
        frontPanel.style.backgroundColor = '#333333';
        frontPanel.style.color = '#DD6666';
        frontPanel.style.fontSize = '16pt';
        frontPanel.style.margin = '50px auto 0 auto';
        frontPanel.style.padding = '20px 4px 20px 4px';
        frontPanel.style.borderRadius = '10px';
        frontPanel.style.position = 'relatvie';
        frontPanel.style.textAlign = 'Center';
        frontPanel.onclick = function () {
            bodyNode.removeChild(backBox);
        };
        backBox.appendChild(frontPanel);
        frontPanel.appendChild(document.createTextNode(INTERMediatorLib.getInsertedStringFromErrorNumber(2001)));
    },

    /**
     *
     * @param deleteNode
     * @returns {boolean}
     */
    INTERMediatorCheckBrowser: function (deleteNode) {
        'use strict';
        var positiveList, matchAgent, matchOS, versionStr, agent, os, judge = false, specifiedVersion,
            versionNum, agentPos = -1, dotPos, bodyNode, elm, childElm, grandChildElm, i;

        positiveList = INTERMediatorOnPage.browserCompatibility();
        matchAgent = false;
        matchOS = false;

        if (positiveList.edge && navigator.userAgent.indexOf('Edge/') > -1) {
            positiveList = {'edge': positiveList.edge};
        } else if (positiveList.trident && navigator.userAgent.indexOf('Trident/') > -1) {
            positiveList = {'trident': positiveList.trident};
        } else if (positiveList.msie && navigator.userAgent.indexOf('MSIE ') > -1) {
            positiveList = {'msie': positiveList.msie};
        } else if (positiveList.opera &&
            (navigator.userAgent.indexOf('Opera/') > -1 || navigator.userAgent.indexOf('OPR/') > -1)) {
            positiveList = {'opera': positiveList.opera, 'opr': positiveList.opera};
        }

        for (agent in positiveList) {
            if (positiveList.hasOwnProperty(agent)) {
                if (navigator.userAgent.toUpperCase().indexOf(agent.toUpperCase()) > -1) {
                    matchAgent = true;
                    if (positiveList[agent] instanceof Object) {
                        for (os in positiveList[agent]) {
                            if (positiveList[agent].hasOwnProperty(os) &&
                                navigator.platform.toUpperCase().indexOf(os.toUpperCase()) > -1) {
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
        }

        if (matchAgent && matchOS) {
            specifiedVersion = parseInt(versionStr, 10);

            if (navigator.appVersion.indexOf('Edge/') > -1) {
                agentPos = navigator.appVersion.indexOf('Edge/') + 5;
            } else if (navigator.appVersion.indexOf('Trident/') > -1) {
                agentPos = navigator.appVersion.indexOf('Trident/') + 8;
            } else if (navigator.appVersion.indexOf('MSIE ') > -1) {
                agentPos = navigator.appVersion.indexOf('MSIE ') + 5;
            } else if (navigator.appVersion.indexOf('OPR/') > -1) {
                agentPos = navigator.appVersion.indexOf('OPR/') + 4;
            } else if (navigator.appVersion.indexOf('Opera/') > -1) {
                agentPos = navigator.appVersion.indexOf('Opera/') + 6;
            } else if (navigator.appVersion.indexOf('Chrome/') > -1) {
                agentPos = navigator.appVersion.indexOf('Chrome/') + 7;
            } else if (navigator.appVersion.indexOf('Safari/') > -1 &&
                navigator.appVersion.indexOf('Version/') > -1) {
                agentPos = navigator.appVersion.indexOf('Version/') + 8;
            } else if (navigator.userAgent.indexOf('Firefox/') > -1) {
                agentPos = navigator.userAgent.indexOf('Firefox/') + 8;
            }

            if (agentPos > -1) {
                if (navigator.userAgent.indexOf('Firefox/') > -1) {
                    dotPos = navigator.userAgent.indexOf('.', agentPos);
                    versionNum = parseInt(navigator.userAgent.substring(agentPos, dotPos), 10);
                } else {
                    dotPos = navigator.appVersion.indexOf('.', agentPos);
                    versionNum = parseInt(navigator.appVersion.substring(agentPos, dotPos), 10);
                }
                /*
                 As for the appVersion property of IE, refer http://msdn.microsoft.com/en-us/library/aa478988.aspx
                 */
            } else {
                dotPos = navigator.appVersion.indexOf('.');
                versionNum = parseInt(navigator.appVersion.substring(0, dotPos), 10);
            }
            if (INTERMediator.isTrident) {
                specifiedVersion = specifiedVersion + 4;
            }
            if (versionStr.indexOf('-') > -1) {
                judge = (specifiedVersion >= versionNum);
                if (document.documentMode) {
                    judge = (specifiedVersion >= document.documentMode);
                }
            } else if (versionStr.indexOf('+') > -1) {
                judge = (specifiedVersion <= versionNum);
                if (document.documentMode) {
                    judge = (specifiedVersion <= document.documentMode);
                }
            } else {
                judge = (specifiedVersion == versionNum);
                if (document.documentMode) {
                    judge = (specifiedVersion == document.documentMode);
                }
            }
        }
        if (judge === true) {
            if (deleteNode) {
                deleteNode.parentNode.removeChild(deleteNode);
            }
        } else {
            bodyNode = document.getElementsByTagName('BODY')[0];
            elm = document.createElement('div');
            elm.setAttribute('align', 'center');
            childElm = document.createElement('font');
            childElm.setAttribute('color', 'gray');
            grandChildElm = document.createElement('font');
            grandChildElm.setAttribute('size', '+2');
            grandChildElm.appendChild(document.createTextNode(INTERMediatorOnPage.getMessages()[1022]));
            childElm.appendChild(grandChildElm);
            childElm.appendChild(document.createElement('br'));
            childElm.appendChild(document.createTextNode(INTERMediatorOnPage.getMessages()[1023]));
            childElm.appendChild(document.createElement('br'));
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
     Seek nodes from the repeater of 'fromNode' parameter.
     */
    getNodeIdFromIMDefinition: function (imDefinition, fromNode, justFromNode) {
        'use strict';
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
        'use strict';
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
        'use strict';
        var enclosureNode, nodeIds, i;

        if (justFromNode === true) {
            enclosureNode = fromNode;
        } else if (justFromNode === false) {
            enclosureNode = INTERMediatorLib.getParentEnclosure(fromNode);
        } else {
            enclosureNode = INTERMediatorLib.getParentRepeater(fromNode);
        }
        if (enclosureNode !== null) {
            nodeIds = [];
            if (Array.isArray(enclosureNode)) {
                for (i = 0; i < enclosureNode.length; i++) {
                    seekNode(enclosureNode[i], imDefinition);
                }
            } else {
                seekNode(enclosureNode, imDefinition);
            }
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
                            if (children[i].getAttribute('id')) {
                                nodeIds.push(children[i].getAttribute('id'));
                            } else {
                                nodeIds.push(children[i]);
                            }
                        }
                    }
                    seekNode(children[i], imDefinition);
                }
            }
        }
    },

    getNodeIdsHavingTargetFromNode: function (fromNode, imDefinition) {
        'use strict';
        return INTERMediatorOnPage.getNodeIdsFromIMDefinition(imDefinition, fromNode, true);
    },

    getNodeIdsHavingTargetFromRepeater: function (fromNode, imDefinition) {
        'use strict';
        return INTERMediatorOnPage.getNodeIdsFromIMDefinition(imDefinition, fromNode, IMLib.zerolength_str);
    },

    getNodeIdsHavingTargetFromEnclosure: function (fromNode, imDefinition) {
        'use strict';
        return INTERMediatorOnPage.getNodeIdsFromIMDefinition(imDefinition, fromNode, false);
    },

    /* Cookies support */
    getKeyWithRealm: function (str) {
        'use strict';
        if (INTERMediatorOnPage.realm.length > 0) {
            return str + '_' + INTERMediatorOnPage.realm;
        }
        return str;
    },

    getCookie: function (key) {
        'use strict';
        var s, i, targetKey;
        s = document.cookie.split('; ');
        targetKey = this.getKeyWithRealm(key);
        for (i = 0; i < s.length; i++) {
            if (s[i].indexOf(targetKey + '=') === 0) {
                return decodeURIComponent(s[i].substring(s[i].indexOf('=') + 1));
            }
        }
        return '';
    },
    removeCookie: function (key) {
        'use strict';
        document.cookie = this.getKeyWithRealm(key) + '=; path=/; max-age=0; expires=Thu, 1-Jan-1900 00:00:00 GMT;';
        document.cookie = this.getKeyWithRealm(key) + '=; max-age=0;  expires=Thu, 1-Jan-1900 00:00:00 GMT;';
    },

    setCookie: function (key, val) {
        'use strict';
        this.setCookieWorker(this.getKeyWithRealm(key), val, false, INTERMediatorOnPage.authExpired);
    },

    setCookieDomainWide: function (key, val, noRealm) {
        'use strict';
        var realKey;
        realKey = (noRealm === true) ? key : this.getKeyWithRealm(key);
        this.setCookieWorker(realKey, val, true, INTERMediatorOnPage.authExpired);
    },

    setCookieWorker: function (key, val, isDomain, expired) {
        'use strict';
        var cookieString;
        var d = new Date();
        d.setTime(d.getTime() + expired * 1000);
        cookieString = key + '=' + encodeURIComponent(val) + ( isDomain ? ';path=/' : '' ) + ';';
        if (expired > 0) {
            cookieString += 'max-age=' + expired + ';expires=' + d.toUTCString() + ';';
        }
        if (document.URL.substring(0, 8) == 'https://') {
            cookieString += 'secure;';
        }
        document.cookie = cookieString;
    },

    hideProgress: function () {
        'use strict';
        var frontPanel;
        frontPanel = document.getElementById('_im_progress');
        if (frontPanel) {
            frontPanel.parentNode.removeChild(frontPanel);
        }
    },

    showProgress: function () {
        'use strict';
        var rootPath, headNode, bodyNode, frontPanel, linkElement, imageProgress, imageIM;

        frontPanel = document.getElementById('_im_progress');
        if (!frontPanel) {
            rootPath = INTERMediatorOnPage.getIMRootPath();
            headNode = document.getElementsByTagName('HEAD')[0];
            bodyNode = document.getElementsByTagName('BODY')[0];
            frontPanel = document.createElement('div');
            frontPanel.setAttribute('id', '_im_progress');
            frontPanel.style.position = 'fixed';
            linkElement = document.createElement('link');
            linkElement.setAttribute('href', rootPath + '/themes/default/css/style.css');
            linkElement.setAttribute('rel', 'stylesheet');
            linkElement.setAttribute('type', 'text/css');
            headNode.appendChild(linkElement);
            if (bodyNode.firstChild) {
                bodyNode.insertBefore(frontPanel, bodyNode.firstChild);
            } else {
                bodyNode.appendChild(frontPanel);
            }

            /*  GIF animation image was generated on
             But they describe no copyright or kind of message doesn't required.
             */
            imageIM = document.createElement('img');
            imageIM.setAttribute('id', '_im_logo');
            imageIM.setAttribute('src', rootPath + '/themes/default/images/logo.gif');
            frontPanel.appendChild(imageIM);
            imageProgress = document.createElement('img');
            imageProgress.setAttribute('src', rootPath + '/themes/default/images/inprogress.gif');
            frontPanel.appendChild(imageProgress);
            frontPanel.appendChild(document.createElement('BR'));
            frontPanel.appendChild(document.createTextNode('INTER-Mediator working'));
        }
    }
};
/*
 * INTER-Mediator
 * Copyright (c) INTER-Mediator Directive Committee (http://inter-mediator.org)
 * This project started at the end of 2009 by Masayuki Nii msyk@msyk.net.
 *
 * INTER-Mediator is supplied under MIT License.
 * Please see the full license for details:
 * https://github.com/INTER-Mediator/INTER-Mediator/blob/master/dist-docs/License.txt
 */

/**
 * TinyMCE bridgeObject
 * @type {{instanciate: Function, ids: Array, finish: Function}}
 */

//'use strict';

var IMParts_Catalog = {};
/*********
 *
 * File Uploader
 * @type {{html5DDSuported: boolean, instanciate: Function, ids: Array, finish: Function}}
 */
IMParts_Catalog['fileupload'] = {
    html5DDSuported: false,
    progressSupported: false,   // see http://www.johnboyproductions.com/php-upload-progress-bar/
    forceOldStyleForm: false,
    uploadButtonLabel: '送信',
    uploadCancelButtonLabel: 'キャンセル',
    uploadId: 'sign' + Math.random(),

    instanciate: function (parentNode) {
        var inputNode, formNode, buttonNode, hasTapEvent;
        var newId = parentNode.getAttribute('id') + '-e';
        var newNode = document.createElement('DIV');
        IMLibLocalContext.setValue('uploadFileSelect', 'false');
        INTERMediatorLib.setClassAttributeToNode(newNode, '_im_fileupload');
        newNode.setAttribute('id', newId);
        this.ids.push(newId);
        if (this.forceOldStyleForm || (INTERMediator.isEdge && INTERMediator.ieVersion < 14)) {
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
        hasTapEvent = ('ontouchstart' in window);
        if (hasTapEvent) {
            this.html5DDSuported = false;
        }
        var autoReload = (parentNode.getAttribute('data-im-widget-reload') !== null)
            ? parentNode.getAttribute('data-im-widget-reload') : false;
        newNode.setAttribute('data-im-widget-reload', autoReload);
        if (this.html5DDSuported) {
            newNode.dropzone = 'copy';
            var widgetStyle = (parentNode.getAttribute('data-im-widget-style') === 'false') ? false : true;
            if (widgetStyle) {
                newNode.style.width = '200px';
                newNode.style.height = '100px';
                newNode.style.paddingTop = '20px';
                newNode.style.backgroundColor = '#AAAAAA';
                newNode.style.border = '3px dotted #808080';
                newNode.style.textAlign = 'center';
                newNode.style.fontSize = '75%';
                var eachLine = INTERMediatorOnPage.getMessages()[3101].split(/\n/);
                for (var i = 0; i < eachLine.length; i++) {
                    if (i > 0) {
                        newNode.appendChild(document.createElement('BR'));
                    }
                    newNode.appendChild(document.createTextNode(eachLine[i]));
                }
            }
        } else {
            formNode = document.createElement('FORM');
            formNode.className = '_im_fileupload_form';
            formNode.setAttribute('method', 'post');
            formNode.setAttribute('action', INTERMediatorOnPage.getEntryPath() + '?access=uploadfile');
            formNode.setAttribute('enctype', 'multipart/form-data');
            var divNode = document.createElement('DIV');
            divNode.className = '_im_fileupload_form_wrapper form-wrapper';
            divNode.appendChild(formNode);
            newNode.appendChild(divNode);

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
            inputNode.className = '_im_uploadfile';
            inputNode.addEventListener('change',function(){
                if (this.files[0].size > 0) {
                    this.nextSibling.removeAttribute('disabled');
                }
            }, false);
            formNode.appendChild(inputNode);

            var cancelButtonWrapper, cancelButton;
            cancelButtonWrapper = document.createElement('DIV');
            cancelButtonWrapper.className = '_im_fileupload_cancel_button_wrapper';
            cancelButton = document.createElement('BUTTON');
            cancelButton.className = '_im_fileupload_cancel_button';
            cancelButton.appendChild(document.createTextNode(this.uploadCancelButtonLabel));
            cancelButtonWrapper.appendChild(cancelButton);

            buttonNode = document.createElement('BUTTON');
            buttonNode.className = '_im_fileupload_button';
            buttonNode.setAttribute('type', 'submit');
            buttonNode.setAttribute('disabled', '');
            buttonNode.appendChild(document.createTextNode(this.uploadButtonLabel));
            newNode.addEventListener('click', function (event) {
                if (this.children.length > 0) {
                    if (this.children[0].style.display === 'none' || this.children[0].style.display === '') {
                        this.children[0].style.display = 'flex';
                        this.children[0].style.display = '-webkit-flex';
                    }
                }
            }, true);
            cancelButtonWrapper.addEventListener('click', function(c) {
                this.parentNode.style.display = 'none';
            });
            divNode.appendChild(cancelButtonWrapper);
            formNode.appendChild(buttonNode);
            this.formFromId[newId] = formNode;
        }
        if (parentNode.getAttribute('data-im-widget-inner') === 'true') {
            var children = parentNode.children;
            for (var c = children.length - 1; c >= 0; c--) {
                newNode.appendChild(children[c]);
            }
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
            }
        };
    },
    ids: [],
    formFromId: {},
    finish: function () {
        var shaObj, hmacValue, targetNode, formNode, i, tagetIdLocal, isProgressingLocal, serialIdLocal, uploadIdLocal;

        if (this.html5DDSuported) {
            for (i = 0; i < this.ids.length; i++) {
                tagetIdLocal = this.ids[i];
                targetNode = document.getElementById(tagetIdLocal);
                if (targetNode) {
                    INTERMediatorLib.addEvent(targetNode, 'dragleave', function (event) {
                        event.preventDefault();
                        event.target.style.backgroundColor = '#AAAAAA';
                    });
                    INTERMediatorLib.addEvent(targetNode, 'dragover', function (event) {
                        event.preventDefault();
                        event.target.style.backgroundColor = '#AADDFF';
                    });
                    isProgressingLocal = this.progressSupported;
                    serialIdLocal = this.ids.length;
                    uploadIdLocal = this.uploadId;
                    INTERMediatorLib.addEvent(targetNode, 'drop', (function () {
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
                                infoFrame.style.width = '100%';
                                infoFrame.style.height = '24px';
                                eventTarget.appendChild(infoFrame);
                            }
                            for (var i = 0; i < event.dataTransfer.files.length; i++) {
                                file = event.dataTransfer.files[i];
                                fileNameNode = document.createElement('DIV');
                                fileNameNode.appendChild(document.createTextNode(
                                    INTERMediatorOnPage.getMessages()[3102] + file.name));
                                fileNameNode.style.marginTop = '20px';
                                fileNameNode.style.backgroundColor = '#FFFFFF';
                                fileNameNode.style.textAlign = 'center';
                                event.target.appendChild(fileNameNode);
                            }
                            var updateInfo = IMLibContextPool.getContextInfoFromId(eventTarget.getAttribute('id'), '');
                            if (isProgressing) {
                                infoFrame.style.display = 'block';
                                setTimeout(function () {
                                    infoFrame.setAttribute('src',
                                        'upload_frame.php?up_id=' + uploadId + iframeId);
                                });
                            }
                            INTERMediator_DBAdapter.uploadFile(
                                '&_im_contextname=' + encodeURIComponent(updateInfo.context.contextName) +
                                    '&_im_field=' + encodeURIComponent(updateInfo.field) +
                                    '&_im_keyfield=' + encodeURIComponent(updateInfo.record.split('=')[0]) +
                                    '&_im_keyvalue=' + encodeURIComponent(updateInfo.record.split('=')[1]) +
                                    '&_im_contextnewrecord=' + encodeURIComponent('uploadfile') +
                                    (isProgressing ?
                                    ('&APC_UPLOAD_PROGRESS=' + encodeURIComponent(uploadId + iframeId)) : ''),
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
                                        fvalue = IMLibContextPool.getKeyFieldValueFromId(tagetId, '');
                                        contextObjects = IMLibContextPool.getContextsFromNameAndForeignValue(
                                            relatedContextName, fvalue, context.key);
                                    } else {
                                        contextObjects = IMLibContextPool.getContextFromName(updateInfo.context.contextName);
                                    }
                                    contextInfo = IMLibContextPool.getContextInfoFromId(tagetId, '');
                                    contextInfo.context.setValue(contextInfo.record, contextInfo.field, dbresult);
                                    if (contextObjects) {
                                        for (i = 0; i < contextObjects.length; i++) {
                                            contextObj = contextObjects[i];
                                            INTERMediator.construct(contextObj);
                                        }
                                    }
                                    INTERMediator.flushMessage();
                                    if (targetNode.getAttribute('data-im-widget-reload') === 'true') {
                                        INTERMediator.construct();
                                    }
                                    event.target.style.backgroundColor = '#AAAAAA';
                                },
                                function () {
                                    event.target.style.backgroundColor = '#AAAAAA';
                                });
                        };
                    })());
                }
            }

        } else {
            for (i = 0; i < this.ids.length; i++) {
                targetNode = document.getElementById(this.ids[i]);
                formNode = targetNode.getElementsByTagName('FORM')[0];
                if (targetNode && formNode) {
                    var updateInfo = IMLibContextPool.getContextInfoFromId(this.ids[i], '');
                    //= INTERMediator.updateRequiredObject[IMParts_im_fileupload.ids[i]];
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
                    inputNode.setAttribute('value', updateInfo.record.split('=')[0]);
                    formNode.appendChild(inputNode);

                    inputNode = document.createElement('INPUT');
                    inputNode.setAttribute('type', 'hidden');
                    inputNode.setAttribute('name', '_im_keyvalue');
                    inputNode.setAttribute('value', updateInfo.record.split('=')[1]);
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
                        if (INTERMediatorOnPage.authHashedPassword && INTERMediatorOnPage.authChallenge) {
                            shaObj = new jsSHA(INTERMediatorOnPage.authHashedPassword, 'ASCII');
                            hmacValue = shaObj.getHMAC(INTERMediatorOnPage.authChallenge,
                                'ASCII', 'SHA-256', 'HEX');
                            inputNode.value = hmacValue;
                        } else {
                            inputNode.value = 'dummy';
                        }
                    }
                    formNode.appendChild(inputNode);

                    if (INTERMediatorOnPage.authUser.length > 0) {
                        inputNode = document.createElement('INPUT');
                        inputNode.setAttribute('type', 'hidden');
                        inputNode.setAttribute('name', 'cresponse');
                        inputNode.setAttribute('value',
                            INTERMediatorOnPage.publickey.biEncryptedString(
                                INTERMediatorOnPage.authCryptedPassword + IMLib.nl_char +
                                INTERMediatorOnPage.authChallenge));
                        formNode.appendChild(inputNode);
                    }

                    if (this.progressSupported) {
                        inputNode = document.createElement('iframe');
                        inputNode.setAttribute('id', 'upload_frame' + i);
                        inputNode.setAttribute('name', 'upload_frame');
                        inputNode.setAttribute('frameborder', '0');
                        inputNode.setAttribute('border', '0');
                        inputNode.setAttribute('scrolling', 'no');
                        inputNode.setAttribute('scrollbar', 'no');
                        formNode.appendChild(inputNode);

                        INTERMediatorLib.addEvent(formNode, 'submit', (function () {
                            var iframeId = i;
                            return function (event) {

                                var iframeNode = document.getElementById('upload_frame' + iframeId);
                                iframeNode.style.display = 'block';
                                setTimeout(function () {
                                    var infoURL = selfURL() + '?uploadprocess=' +
                                        this.uploadId + iframeId;
                                    iframeNode.setAttribute('src', infoURL);
                                });
                                return true;
                            };
                        })());
                    }
                }
            }
        }
        this.ids = [];
        this.formFromId = {};

        function selfURL() {
            var nodes = document.getElementsByTagName('SCRIPT');
            for (var i = 0; i < nodes.length; i++) {
                var srcAttr = nodes[i].getAttribute('src');
                if (srcAttr.match(/\.php/)) {
                    return srcAttr;
                }
            }
            return null;
        }
    }
};
/*
 * INTER-Mediator
 * Copyright (c) INTER-Mediator Directive Committee (http://inter-mediator.org)
 * This project started at the end of 2009 by Masayuki Nii msyk@msyk.net.
 *
 * INTER-Mediator is supplied under MIT License.
 * Please see the full license for details:
 * https://github.com/INTER-Mediator/INTER-Mediator/blob/master/dist-docs/License.txt
 */

IMLibPageNavigation = {
    deleteInsertOnNavi: [],
    /**
     * Create Navigation Bar to move previous/next page
     */

    navigationSetup: function () {
        var navigation, i, insideNav, navLabel, node, start, pageSize, allCount, disableClass, c_node,
            prevPageCount, nextPageCount, endPageCount, onNaviInsertFunction, onNaviDeleteFunction,
            onNaviCopyFunction, contextName, contextDef, buttonLabel;

        navigation = document.getElementById('IM_NAVIGATOR');
        if (navigation !== null) {
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
                disableClass = ' IM_NAV_disabled';
                node = document.createElement('SPAN');
                navigation.appendChild(node);
                node.appendChild(document.createTextNode(
                    ((navLabel === null || navLabel[4] === null) ?
                        INTERMediatorOnPage.getMessages()[1] : navLabel[4]) +
                    (allCount === 0 ? 0 : start + 1) +
                    ((Math.min(start + pageSize, allCount) - start > 1) ?
                        (((navLabel === null || navLabel[5] === null) ? '-' : navLabel[5]) +
                        Math.min(start + pageSize, allCount)) : '') +
                    ((navLabel === null || navLabel[6] === null) ? ' / ' : navLabel[6]) + (allCount) +
                    ((navLabel === null || navLabel[7] === null) ? '' : navLabel[7])));
                node.setAttribute('class', 'IM_NAV_info');
            }

            if ((navLabel === null || navLabel[0] !== false) && INTERMediator.pagination === true) {
                node = document.createElement('SPAN');
                navigation.appendChild(node);
                node.appendChild(document.createTextNode(
                    (navLabel === null || navLabel[0] === null) ? '<<' : navLabel[0]));
                node.setAttribute('class', 'IM_NAV_button' + (start === 0 ? disableClass : ''));
                INTERMediatorLib.addEvent(node, 'click', function () {
                    INTERMediator_DBAdapter.unregister();
                    INTERMediator.startFrom = 0;
                    INTERMediator.constructMain(true);
                });

                node = document.createElement('SPAN');
                navigation.appendChild(node);
                node.appendChild(document.createTextNode(
                    (navLabel === null || navLabel[1] === null) ? '<' : navLabel[1]));
                node.setAttribute('class', 'IM_NAV_button' + (start === 0 ? disableClass : ''));
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
                node.setAttribute('class', 'IM_NAV_button' + (start + pageSize >= allCount ? disableClass : ''));
                nextPageCount =
                    (start + pageSize < allCount) ? start + pageSize : ((allCount - pageSize > 0) ? start : 0);
                INTERMediatorLib.addEvent(node, 'click', function () {
                    INTERMediator_DBAdapter.unregister();
                    INTERMediator.startFrom = nextPageCount;
                    INTERMediator.constructMain(true);
                });

                node = document.createElement('SPAN');
                navigation.appendChild(node);
                node.appendChild(document.createTextNode(
                    (navLabel === null || navLabel[3] === null) ? '>>' : navLabel[3]));
                node.setAttribute('class', 'IM_NAV_button' + (start + pageSize >= allCount ? disableClass : ''));
                if (allCount % pageSize === 0) {
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
                node = document.createElement('SPAN');
                navigation.appendChild(node);
                node.appendChild(document.createTextNode(INTERMediatorOnPage.getMessages()[10]));
                c_node = document.createElement('INPUT');
                c_node.setAttribute('class', 'IM_NAV_JUMP');
                c_node.setAttribute('type', 'text');
                c_node.setAttribute('value', Math.ceil(INTERMediator.startFrom / pageSize + 1));
                node.appendChild(c_node);
                node.appendChild(document.createTextNode(INTERMediatorOnPage.getMessages()[11]));
                INTERMediatorLib.addEvent(
                    c_node,
                    'change',
                    function () {
                        if (c_node.value < 1) {
                            c_node.value = 1;
                        }
                        var max_page = Math.ceil(allCount / pageSize);
                        if (max_page < c_node.value) {
                            c_node.value = max_page;
                        }
                        INTERMediator.startFrom = ( ~~c_node.value - 1 ) * pageSize;
                        INTERMediator.construct(true);
                    }
                );
                // ---------
            }

            if (navLabel === null || navLabel[9] !== false) {
                for (i = 0; i < IMLibPageNavigation.deleteInsertOnNavi.length; i++) {
                    switch (IMLibPageNavigation.deleteInsertOnNavi[i]['kind']) {
                    case 'INSERT':
                        node = document.createElement('SPAN');
                        navigation.appendChild(node);
                        contextName = IMLibPageNavigation.deleteInsertOnNavi[i]['name'];
                        contextDef = IMLibContextPool.getContextDef(contextName);
                        if (contextDef && contextDef['button-names'] && contextDef['button-names']['insert']) {
                            buttonLabel = contextDef['button-names']['insert'];
                        } else {
                            buttonLabel = INTERMediatorOnPage.getMessages()[3] + ': ' + contextName;
                        }
                        node.appendChild(document.createTextNode(buttonLabel));
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
                    case　'DELETE':
                        node = document.createElement('SPAN');
                        navigation.appendChild(node);
                        contextName = IMLibPageNavigation.deleteInsertOnNavi[i]['name'];
                        contextDef = IMLibContextPool.getContextDef(contextName);
                        if (contextDef && contextDef['button-names'] && contextDef['button-names']['delete']) {
                            buttonLabel = contextDef['button-names']['delete'];
                        } else {
                            buttonLabel = INTERMediatorOnPage.getMessages()[4] + ': ' + contextName;
                        }
                        node.appendChild(document.createTextNode(buttonLabel));
                        node.setAttribute('class', 'IM_NAV_button');
                        onNaviDeleteFunction = function (a, b, c, d) {
                            var contextName = a, keyName = b, keyValue = c, confirming = d;
                            return function () {
                                IMLibPageNavigation.deleteRecordFromNavi(contextName, keyName, keyValue, confirming);
                            };
                        };
                        INTERMediatorLib.addEvent(
                            node,
                            'click',
                            onNaviDeleteFunction(
                                IMLibPageNavigation.deleteInsertOnNavi[i]['name'],
                                IMLibPageNavigation.deleteInsertOnNavi[i]['key'],
                                IMLibPageNavigation.deleteInsertOnNavi[i]['value'],
                                IMLibPageNavigation.deleteInsertOnNavi[i]['confirm'] ? true : false));
                        break;
                    case　'COPY':
                        node = document.createElement('SPAN');
                        navigation.appendChild(node);
                        contextName = IMLibPageNavigation.deleteInsertOnNavi[i]['name'];
                        contextDef = IMLibContextPool.getContextDef(contextName);
                        if (contextDef && contextDef['button-names'] && contextDef['button-names']['copy']) {
                            buttonLabel = contextDef['button-names']['copy'];
                        } else {
                            buttonLabel = INTERMediatorOnPage.getMessages()[15] + ': ' + contextName;
                        }
                        node.appendChild(document.createTextNode(buttonLabel));
                        node.setAttribute('class', 'IM_NAV_button');
                        onNaviCopyFunction = function (a, b) {
                            var contextDef = a, record = b;
                            return function () {
                                IMLibPageNavigation.copyRecordFromNavi(contextDef, record);
                            };
                        };
                        INTERMediatorLib.addEvent(
                            node,
                            'click',
                            onNaviCopyFunction(
                                IMLibPageNavigation.deleteInsertOnNavi[i]['contextDef'],
                                IMLibPageNavigation.deleteInsertOnNavi[i]['keyValue']));
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
        var conditions, restore, contextDef;

        if (isConfirm) {
            if (!confirm(INTERMediatorOnPage.getMessages()[1026])) {
                return;
            }
        }
        INTERMediatorOnPage.showProgress();
        contextDef = INTERMediatorLib.getNamedObject(
            INTERMediatorOnPage.getDataSources(), 'name', targetName);
        if (contextDef === null) {
            alert('no targetname :' + targetName);
            INTERMediatorOnPage.hideProgress();
            return;
        }

        try {
            INTERMediatorOnPage.retrieveAuthInfo();
            INTERMediator_DBAdapter.db_createRecord_async({name: targetName, dataset: []},
                function (response) {
                    var newId = response.newRecordKeyValue;
                    if (newId > -1) {
                        restore = INTERMediator.additionalCondition;
                        if (contextDef.records <= 1) {
                            INTERMediator.startFrom = 0;
                            INTERMediator.pagedAllCount = 1;
                            conditions = INTERMediator.additionalCondition;
                            conditions[targetName] = {field: keyField, value: newId};
                            INTERMediator.additionalCondition = conditions;
                            IMLibLocalContext.archive();
                        } else {
                            INTERMediator.pagedAllCount++;
                        }
                        INTERMediator_DBAdapter.unregister();
                        INTERMediator.constructMain(true);
                        INTERMediator.additionalCondition = restore;
                        IMLibPageNavigation.navigationSetup();
                    }
                    IMLibCalc.recalculation();
                    INTERMediatorOnPage.hideProgress();
                    INTERMediator.flushMessage();

                }, null);
        } catch (ex) {
            if (ex == '_im_requath_request_') {
                if (INTERMediatorOnPage.requireAuthentication) {
                    if (!INTERMediatorOnPage.isComplementAuthData()) {
                        INTERMediatorOnPage.clearCredentials();
                        INTERMediatorOnPage.authenticating(function () {
                            IMLibPageNavigation.insertRecordFromNavi(targetName, keyField, isConfirm);
                        });
                        INTERMediator.flushMessage();
                        return;
                    }
                }
            } else {
                INTERMediator.setErrorMessage(ex, 'EXCEPTION-5');
            }
        }

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
            INTERMediator_DBAdapter.db_delete_async(
                {
                    name: targetName,
                    conditions: [{field: keyField, operator: '=', value: keyValue}]
                },
                function () {
                    INTERMediator.pagedAllCount--;
                    INTERMediator.totalRecordCount--;
                    if (INTERMediator.pagedAllCount - INTERMediator.startFrom < 1) {
                        INTERMediator.startFrom--;
                        if (INTERMediator.startFrom < 0) {
                            INTERMediator.startFrom = 0;
                        }
                    }
                    INTERMediator.constructMain(true);
                    INTERMediatorOnPage.hideProgress();
                    INTERMediator.flushMessage();
                },
                null
            );
        } catch (ex) {
            INTERMediator.setErrorMessage(ex, 'EXCEPTION-6');
        }
    },

    copyRecordFromNavi: function (contextDef, keyValue) {
        var assocDef, i, def, assocContexts, pStart, copyTerm, index;

        INTERMediatorOnPage.showProgress();
        if (contextDef['repeat-control'].match(/confirm-copy/)) {
            if (!confirm(INTERMediatorOnPage.getMessages()[1041])) {
                return;
            }
        }
        try {
            if (contextDef['relation']) {
                for (index in contextDef['relation']) {
                    if (contextDef['relation'][index]['portal'] == true) {
                        contextDef['portal'] = true;
                    }
                }
            }

            assocDef = [];
            if (contextDef['repeat-control'].match(/copy-/)) {
                pStart = contextDef['repeat-control'].indexOf('copy-');
                copyTerm = contextDef['repeat-control'].substr(pStart + 5);
                if ((pStart = copyTerm.search(/\s/)) > -1) {
                    copyTerm = copyTerm.substr(0, pStart);
                }
                assocContexts = copyTerm.split(',');
                for (i = 0; i < assocContexts.length; i++) {
                    def = IMLibContextPool.getContextDef(assocContexts[i]);
                    if (def['relation'][0]['foreign-key']) {
                        assocDef.push({
                            name: def['name'],
                            field: def['relation'][0]['foreign-key'],
                            value: keyValue
                        });
                    }
                }
            }
            INTERMediatorOnPage.retrieveAuthInfo();
            INTERMediator_DBAdapter.db_copy_async(
                {
                    name: contextDef['name'],
                    conditions: [{field: contextDef['key'], operator: '=', value: keyValue}],
                    associated: assocDef.length > 0 ? assocDef : null
                },
                (function () {
                    var contextDefCapt = contextDef;
                    return function (result) {
                        var restore, conditions;
                        var newId = result.newRecordKeyValue;
                        if (newId > -1) {
                            restore = INTERMediator.additionalCondition;
                            INTERMediator.startFrom = 0;
                            if (contextDefCapt.records <= 1) {
                                conditions = INTERMediator.additionalCondition;
                                conditions[contextDefCapt.name] = {field: contextDefCapt.key, value: newId};
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
                    };
                })(),
                null
            );
        } catch (ex) {
            INTERMediator.setErrorMessage(ex, 'EXCEPTION-43');
        }
    },

    saveRecordFromNavi: function (dontUpdate) {
        var keying, field, keyingComp, keyingField, keyingValue, checkQueryParameter, i, initialValue,
            currentVal, fieldArray, valueArray, difference, needUpdate = true, context, updateData, response;

        INTERMediatorOnPage.showProgress();
        INTERMediatorOnPage.retrieveAuthInfo();
        for (i = 0; i < IMLibContextPool.poolingContexts.length; i++) {
            context = IMLibContextPool.poolingContexts[i];
            updateData = context.getModified();
            for (keying in updateData) {
                if (updateData.hasOwnProperty(keying)) {
                    fieldArray = [];
                    valueArray = [];
                    for (field in updateData[keying]) {
                        if (updateData[keying].hasOwnProperty(field)) {
                            fieldArray.push(field);
                            valueArray.push({field: field, value: updateData[keying][field]});
                        }
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
                            if (ex == '_im_requath_request_') {
                                if (INTERMediatorOnPage.requireAuthentication && !INTERMediatorOnPage.isComplementAuthData()) {
                                    INTERMediatorOnPage.clearCredentials();
                                    INTERMediatorOnPage.authenticating(
                                        (function () {
                                            var qParam = checkQueryParameter;
                                            return function () {
                                                INTERMediator.db_query(qParam);
                                            };
                                        })()
                                    );
                                    return;
                                }
                            } else {
                                INTERMediator.setErrorMessage(ex, 'EXCEPTION-28');
                            }
                        }

                        if (currentVal.recordset === null ||
                            currentVal.recordset[0] === null) {
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

                        difference = false;
                        for (field in updateData[keying]) {
                            if (updateData[keying].hasOwnProperty(field)) {
                                initialValue = context.getValue(keying, field);
                                if (initialValue != currentVal.recordset[0][field]) {
                                    difference += INTERMediatorLib.getInsertedString(
                                        INTERMediatorOnPage.getMessages()[1035], [
                                            field,
                                            currentVal.recordset[0][field],
                                            updateData[keying][field]
                                        ]);
                                }
                            }
                        }
                        if (difference !== false) {
                            if (!confirm(INTERMediatorLib.getInsertedString(
                                    INTERMediatorOnPage.getMessages()[1034], [difference]))) {
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
                        if (ex == '_im_requath_request_') {
                            if (INTERMediatorOnPage.requireAuthentication && !INTERMediatorOnPage.isComplementAuthData()) {
                                INTERMediatorOnPage.clearCredentials();
                                INTERMediatorOnPage.authenticating(
                                    function () {
                                        IMLibPageNavigation.saveRecordFromNavi(dontUpdate);
                                    }
                                );
                                return;
                            }
                        } else {
                            INTERMediator.setErrorMessage(ex, 'EXCEPTION-29');
                        }
                    }
                    context.clearModified();
                }
            }
        }
        if (needUpdate && (dontUpdate !== true)) {
            INTERMediator.constructMain(true);
        }
        INTERMediatorOnPage.hideProgress();
        INTERMediator.flushMessage();
    }
};
/*
 * INTER-Mediator
 * Copyright (c) INTER-Mediator Directive Committee (http://inter-mediator.org)
 * This project started at the end of 2009 by Masayuki Nii msyk@msyk.net.
 *
 * INTER-Mediator is supplied under MIT License.
 * Please see the full license for details:
 * https://github.com/INTER-Mediator/INTER-Mediator/blob/master/dist-docs/License.txt
 */

var IMLibUI = {

    isShiftKeyDown: false,
    isControlKeyDown: false,

    mobileSelectionColor: '#BBBBBB',
    mobileNaviBackButtonId: null,

    changeValueLock: {},

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

    lockUIElement: function (idValue) {
        IMLibUI.changeValueLock[idValue] = true;
    },

    isLockUIElement: function (idValue) {
        return IMLibUI.changeValueLock[idValue] === true;
    },

    hasLockUIElement: function () {
        var key, judge = false;
        for(key in IMLibUI.changeValueLock) {
            judge |= IMLibUI.changeValueLock[key];
        }
        return judge;
    },

    unlockUIElement: function (idValue) {
        IMLibUI.changeValueLock[idValue] = false;
    },

    clearLockInfo: function (idValue) {
        IMLibUI.changeValueLock = {};
    },
    /*
     valueChange
     Parameters: It the validationOnly parameter is set to true, this method should return the boolean value
     if validation is succeed or not.
     */
    valueChange: function (idValue, validationOnly) {
        var changedObj, objType, i, newValue, result, linkInfo, nodeInfo, contextInfo, parentContext,
            keyingComp, keyingField, keyingValue, targetField, targetContext, targetNode, targetSpec;

        if (IMLibUI.isShiftKeyDown && IMLibUI.isControlKeyDown) {
            INTERMediator.setDebugMessage('Canceled to update the value with shift+control keys.');
            INTERMediator.flushMessage();
            IMLibUI.isShiftKeyDown = false;
            IMLibUI.isControlKeyDown = false;
            return true;
        }
        IMLibUI.isShiftKeyDown = false;
        IMLibUI.isControlKeyDown = false;

        changedObj = document.getElementById(idValue);
        if (!changedObj) {
            return false;
        }
        if (changedObj.readOnly) {  // for Internet Explorer
            return true;
        }

        // Locking.
        if (!validationOnly && IMLibUI.isLockUIElement(idValue)) {
            setTimeout((function () {
                var idCapt = idValue;
                var voCapt = validationOnly;
                return function () {
                    IMLibUI.valueChange(idCapt, voCapt);
                }
            })(), 100);
            return true;
        }
        IMLibUI.lockUIElement(idValue);

        linkInfo = INTERMediatorLib.getLinkedElementInfo(changedObj);
        // for js-widget support
        // if (!linkInfo && INTERMediatorLib.isWidgetElement(changedObj.parentNode)) {
        //     linkInfo = INTERMediatorLib.getLinkedElementInfo(changedObj.parentNode);
        // }
        nodeInfo = INTERMediatorLib.getNodeInfoArray(linkInfo[0]);  // Suppose to be the first definition.
        contextInfo = IMLibContextPool.getContextInfoFromId(idValue, nodeInfo.target);
        if (!contextInfo) { // In case of local context
            IMLibUI.unlockUIElement(idValue);
            targetNode = document.getElementById(idValue);
            targetSpec = targetNode.getAttribute('data-im');
            if (targetSpec && targetSpec.split(INTERMediator.separator)[0] == IMLibLocalContext.contextName) {
                IMLibLocalContext.updateFromNodeValue(idValue);
                IMLibCalc.recalculation();
                return true;
            }
            return false;
        }

        if (!IMLibUI.validation(changedObj)) {  // Validation error.
            changedObj.focus();
            window.setTimeout((function () {
                var originalObj = changedObj;
                var originalContextInfo = contextInfo;
                return function () {
                    if (originalContextInfo) {
                        originalObj.value = originalContextInfo.context.getValue(
                            originalContextInfo.record, originalContextInfo.field);
                    }
                    originalObj.removeAttribute('data-im-validation-notification');
                };
            })(), 0);
            return false;
        }
        if (validationOnly === true) {
            IMLibUI.unlockUIElement(idValue);
            return true;
        }

        objType = changedObj.getAttribute('type');
        if (objType === 'radio' && !changedObj.checked) {
            INTERMediatorOnPage.hideProgress();
            return true;
        }

        if (!contextInfo) {
            IMLibUI.unlockUIElement(idValue);
            return false;
        }
        newValue = IMLibElement.getValueFromIMNode(changedObj);
        parentContext = contextInfo.context.parentContext;
        if (parentContext) {
            result = parentContext.isValueUndefined(Object.keys(parentContext.store)[0], contextInfo.field, contextInfo.record)
        } else {
            result = contextInfo.context.isValueUndefined(contextInfo.record, contextInfo.field, false)
        }
        if (result) {
            INTERMediator.setErrorMessage('Error in updating.',
                INTERMediatorLib.getInsertedString(
                    INTERMediatorOnPage.getMessages()[1040],
                    [contextInfo.context.contextName, contextInfo.field]));
            IMLibUI.unlockUIElement(idValue);
            return false;
        }
        if (INTERMediatorOnPage.getOptionsTransaction() == 'none') {
            // Just supporting NON-target info.
            // contextInfo.context.setValue(
            // contextInfo.record, contextInfo.field, newValue);
            contextInfo.context.setModified(contextInfo.record, contextInfo.field, newValue);
            IMLibUI.unlockUIElement(idValue);
            return false;
        }
        INTERMediatorOnPage.showProgress();
        contextInfo.context.updateFieldValue(
            idValue,
            (function () {
                var idValueCapt2 = idValue;
                var contextInfoCapt = contextInfo;
                var newValueCapt = newValue;
                return function (result) {
                    var updateRequiredContext, currentValue, associatedNode;
                    updateRequiredContext = IMLibContextPool.dependingObjects(idValueCapt2);
                    for (i = 0; i < updateRequiredContext.length; i++) {
                        updateRequiredContext[i].foreignValue = {};
                        updateRequiredContext[i].foreignValue[contextInfoCapt.field] = newValueCapt;
                        if (updateRequiredContext[i]) {
                            INTERMediator.constructMain(updateRequiredContext[i]);
                            associatedNode = updateRequiredContext[i].enclosureNode;
                            if (INTERMediatorLib.isPopupMenu(associatedNode)) {
                                currentValue = contextInfo.context.getContextValue(associatedNode.id, '');
                                IMLibElement.setValueToIMNode(associatedNode, '', currentValue, false);
                            }
                        }
                    }
                    INTERMediatorOnPage.hideProgress();
                    IMLibCalc.recalculation();//IMLibCalc.recalculation(idValueCapt2); // Optimization Required
                    INTERMediator.flushMessage();
                    IMLibUI.unlockUIElement(idValueCapt2);
                };
            })(),
            (function () {
                var targetFieldCapt = targetField;
                return function () {
                    alert(INTERMediatorLib.getInsertedString(
                        INTERMediatorOnPage.getMessages()[1003], [targetFieldCapt]));
                    INTERMediatorOnPage.hideProgress();
                    IMLibUI.clearLockInfo();
                };
            })(),
            function () {
                var response = confirm(INTERMediatorOnPage.getMessages()[1024]);
                if (!response) {
                    INTERMediatorOnPage.hideProgress();
                    IMLibUI.clearLockInfo();
                }
                return response;
            },
            (function () {
                var changedObjectCapt = changedObj;
                return function (initialvalue, newValue, currentFieldVal) {
                    if (!confirm(INTERMediatorLib.getInsertedString(
                            INTERMediatorOnPage.getMessages()[1001], [initialvalue, newValue, currentFieldVal]))) {
                        window.setTimeout(function () {
                            changedObjectCapt.focus();
                        }, 0);

                        INTERMediatorOnPage.hideProgress();
                        IMLibUI.clearLockInfo();
                        return false;
                    }
                    return true;
                }
            })()
        );
        return true;
    },

    validation: function (changedObj) {
        var linkInfo, matched, context, i, index, didValidate, contextInfo,
            result, messageNodes = [], messageNode;
        if (messageNodes) {
            while (messageNodes.length > 0) {
                messageNodes[0].parentNode.removeChild(messageNodes[0]);
                delete messageNodes[0];
            }
        }
        if (!messageNodes) {
            messageNodes = [];
        }
        try {
            linkInfo = INTERMediatorLib.getLinkedElementInfo(changedObj);
            didValidate = false;
            result = true;
            if (linkInfo.length > 0) {
                matched = linkInfo[0].match(/([^@]+)/);
                if (matched[1] !== IMLibLocalContext.contextName) {
                    context = INTERMediatorLib.getNamedObject(
                        INTERMediatorOnPage.getDataSources(), 'name', matched[1]);
                    if (context != null && context.validation != null) {
                        for (i = 0; i < linkInfo.length; i++) {
                            matched = linkInfo[i].match(/([^@]+)@([^@]+)/);
                            for (index in context.validation) {
                                if (context.validation[index].field === matched[2]) {
                                    didValidate = true;
                                    result = Parser.evaluate(
                                        context.validation[index].rule,
                                        {'value': changedObj.value, 'target': changedObj});
                                    if (!result) {
                                        switch (context.validation[index].notify) {
                                        case 'inline':
                                            INTERMediatorLib.clearErrorMessage(changedObj);
                                            messageNode = INTERMediatorLib.createErrorMessageNode(
                                                'SPAN', context.validation[index].message);
                                            changedObj.parentNode.insertBefore(
                                                messageNode, changedObj.nextSibling);
                                            messageNodes.push(messageNode);
                                            break;
                                        case 'end-of-sibling':
                                            INTERMediatorLib.clearErrorMessage(changedObj);
                                            messageNode = INTERMediatorLib.createErrorMessageNode(
                                                'DIV', context.validation[index].message);
                                            changedObj.parentNode.appendChild(messageNode);
                                            messageNodes.push(messageNode);
                                            break;
                                        default:
                                            if (changedObj.getAttribute('data-im-validation-notification') !== 'alert') {
                                                alert(context.validation[index].message);
                                                changedObj.setAttribute('data-im-validation-notification', 'alert');
                                            }
                                            break;
                                        }
                                        contextInfo = IMLibContextPool.getContextInfoFromId(changedObj, '');
                                        if (contextInfo) {                                        // Just supporting NON-target info.
                                            changedObj.value = contextInfo.context.getValue(
                                                contextInfo.record, contextInfo.field);
                                            window.setTimeout(function () {
                                                changedObj.focus();
                                            }, 0);
                                            if (INTERMediatorOnPage.doAfterValidationFailure !== null) {
                                                INTERMediatorOnPage.doAfterValidationFailure(changedObj, linkInfo[i]);
                                            }
                                        }
                                        return result;
                                    } else {
                                        switch (context.validation[index].notify) {
                                        case 'inline':
                                        case 'end-of-sibling':
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
                        result = INTERMediatorOnPage.doAfterValidationSucceed(changedObj, linkInfo[i]);
                    }
                }
            }
            return result;
        } catch (ex) {
            if (ex === '_im_requath_request_') {
                throw ex;
            } else {
                INTERMediator.setErrorMessage(ex, 'EXCEPTION-32: on the validation process.');
            }
            return false;
        }
    },

    copyButton: function (contextObj, keyValue) {
        var contextDef, assocDef, i, index, def, assocContexts, pStart, copyTerm;

        INTERMediatorOnPage.showProgress();
        contextDef = contextObj.getContextDef();
        if (contextDef['repeat-control'].match(/confirm-copy/)) {
            if (!confirm(INTERMediatorOnPage.getMessages()[1041])) {
                return;
            }
        }
        try {
            if (contextDef['relation']) {
                for (index in contextDef['relation']) {
                    if (contextDef['relation'][index]['portal'] == true) {
                        contextDef['portal'] = true;
                    }
                }
            }

            assocDef = [];
            if (contextDef['repeat-control'].match(/copy-/)) {
                pStart = contextDef['repeat-control'].indexOf('copy-');
                copyTerm = contextDef['repeat-control'].substr(pStart + 5);
                if ((pStart = copyTerm.search(/\s/)) > -1) {
                    copyTerm = copyTerm.substr(0, pStart);
                }
                assocContexts = copyTerm.split(',');
                for (i = 0; i < assocContexts.length; i++) {
                    def = IMLibContextPool.getContextDef(assocContexts[i]);
                    if (def['relation'][0]['foreign-key']) {
                        assocDef.push({
                            name: def['name'],
                            field: def['relation'][0]['foreign-key'],
                            value: keyValue
                        });
                    }
                }
            }

            INTERMediatorOnPage.retrieveAuthInfo();
            INTERMediator_DBAdapter.db_copy_async(
                {
                    name: contextDef['name'],
                    conditions: [{field: contextDef['key'], operator: '=', value: keyValue}],
                    associated: assocDef.length > 0 ? assocDef : null
                },
                (function () {
                    var contextDefCapt = contextDef;
                    var contextObjCapt = contextObj;
                    return function (result) {
                        var restore, conditions, sameOriginContexts;
                        var newId = result.newRecordKeyValue;
                        if (newId > -1) {
                            restore = INTERMediator.additionalCondition;
                            INTERMediator.startFrom = 0;
                            if (contextDefCapt.records <= 1) {
                                conditions = INTERMediator.additionalCondition;
                                conditions[contextDefCapt.name] = {field: contextDefCapt.key, value: newId};
                                INTERMediator.additionalCondition = conditions;
                                IMLibLocalContext.archive();
                            }
                            INTERMediator_DBAdapter.unregister();
                            INTERMediator.constructMain(contextObjCapt);
                            sameOriginContexts = IMLibContextPool.getContextsWithSameOrigin(contextObjCapt);
                            for (i = 0; i < sameOriginContexts.length; i++) {
                                INTERMediator.constructMain(sameOriginContexts[i], null);
                            }
                            INTERMediator.additionalCondition = restore;
                        }
                        IMLibCalc.recalculation();
                        INTERMediatorOnPage.hideProgress();
                        INTERMediator.flushMessage();
                    };
                })(),
                null
            );
        } catch (ex) {
            INTERMediator.setErrorMessage(ex, 'EXCEPTION-43');
        }
    },

    deleteButton: function (currentContext, keyField, keyValue, isConfirm) {
        var i, dialogMessage, parentKeyValue, deleteSuccessProc, targetRepeaters;

        if (isConfirm) {
            dialogMessage = INTERMediatorOnPage.getMessages()[1025];
            if (!window.confirm(dialogMessage)) {
                return;
            }
        }
        INTERMediatorOnPage.showProgress();
        try {
            INTERMediatorOnPage.retrieveAuthInfo();
            deleteSuccessProc = (function () {
                var currentContextCapt = currentContext;
                var keying = keyField + '=' + keyValue;
                return function () {
                    if (currentContextCapt['relation'] == true) {
                        INTERMediator.pagedAllCount--;
                        if (INTERMediator.pagedAllCount - INTERMediator.startFrom < 1) {
                            INTERMediator.startFrom = INTERMediator.startFrom - INTERMediator.pagedSize;
                            if (INTERMediator.startFrom < 0) {
                                INTERMediator.startFrom = 0;
                            }
                        }
                        if (INTERMediator.pagedAllCount >= INTERMediator.pagedSize) {
                            INTERMediator.construct();
                        }
                    }
                    IMLibPageNavigation.navigationSetup();
                    targetRepeaters = currentContextCapt.binding[keying]['_im_repeater'];
                    for (i = 0; i < targetRepeaters.length; i++) {
                        IMLibContextPool.removeRecordFromPool(targetRepeaters[i].id);
                    }
                    IMLibCalc.recalculation();
                    INTERMediatorOnPage.hideProgress();
                    INTERMediator.flushMessage();
                };
            })();

            if (currentContext.isPortal) {
                parentKeyValue = currentContext.potalContainingRecordKV.split('=');
                INTERMediator_DBAdapter.db_update_async({
                        name: currentContext.parentContext.contextName,
                        conditions: [
                            {field: parentKeyValue[0], operator: '=', value: parentKeyValue[1]}
                        ],
                        dataset: [
                            {
                                field: '-delete.related',
                                operator: '=',
                                value: currentContext.contextName + '.' + keyValue
                            }
                        ]
                    },
                    deleteSuccessProc,
                    null);
            } else {
                INTERMediator_DBAdapter.db_delete_async({
                        name: currentContext.contextName,
                        conditions: [{field: keyField, operator: '=', value: keyValue}]
                    },
                    deleteSuccessProc,
                    function () {
                        INTERMediator.setErrorMessage('Delete Error', 'EXCEPTION-46');
                    }
                );
            }

        } catch (ex) {
            if (ex == '_im_requath_request_') {
                if (INTERMediatorOnPage.requireAuthentication && !INTERMediatorOnPage.isComplementAuthData()) {
                    INTERMediatorOnPage.clearCredentials();
                    INTERMediatorOnPage.authenticating(
                        function () {
                            IMLibUI.deleteButton(
                                currentContext, keyField, keyValue, false);
                        }
                    );
                    return;
                }
            } else {
                INTERMediator.setErrorMessage(ex, 'EXCEPTION-3');
            }
        }
    },

    insertButton: function (currentObj, keyValue, foreignValues, updateNodes, isConfirm) {
        var currentContext, recordSet, index, targetRecord, portalField,
            targetPortalField, targetPortalValue, existRelated = false, relatedRecordSet, targetName;

        if (isConfirm) {
            if (!confirm(INTERMediatorOnPage.getMessages()[1026])) {
                return;
            }
        }
        INTERMediatorOnPage.showProgress();
        targetName = currentObj.contextName;
        currentContext = currentObj.getContextDef();
        recordSet = [];
        relatedRecordSet = [];
        if (foreignValues != null) {
            for (index in currentContext['relation']) {
                if (currentContext['relation'].hasOwnProperty(index)) {
                    recordSet.push({
                        field: currentContext['relation'][index]['foreign-key'],
                        value: foreignValues[currentContext['relation'][index]['join-field']]
                    });
                }
            }
        }
        INTERMediatorOnPage.retrieveAuthInfo();
        if (currentObj.isPortal) {
            relatedRecordSet = [];
            for (index in currentContext['default-values']) {
                if (currentContext['default-values'].hasOwnProperty(index)) {
                    relatedRecordSet.push({
                        field: targetName + '::' + currentContext['default-values'][index]['field'] + '.0',
                        value: currentContext['default-values'][index]['value']
                    });
                }
            }

            if (relatedRecordSet.length == 0) {
                targetPortalValue = '';
                targetRecord = INTERMediator_DBAdapter.db_query(
                    {
                        name: targetName,
                        records: 1,
                        conditions: [
                            {
                                field: currentContext['key'] ? currentContext['key'] : '-recid',
                                operator: '=',
                                value: keyValue
                            }
                        ]
                    }
                );
                for (portalField in targetRecord['recordset'][0][0]) {
                    if (portalField.indexOf(targetName + '::') > -1 && portalField !== targetName + '::-recid') {
                        existRelated = true;
                        targetPortalField = portalField;
                        if (portalField == targetName + '::' + recordSet[0]['field']) {
                            targetPortalValue = recordSet[0]['value'];
                            break;
                        }
                        if (portalField != targetName + '::id'
                            && portalField != targetName + '::' + recordSet[0]['field']) {
                            break;
                        }
                    }
                }

                if (existRelated == false) {
                    targetRecord = INTERMediator_DBAdapter.db_query(
                        {
                            name: targetName,
                            records: 0,
                            conditions: [
                                {
                                    field: currentContext['key'] ? currentContext['key'] : '-recid',
                                    operator: '=',
                                    value: keyValue
                                }
                            ]
                        }
                    );
                    for (portalField in targetRecord['recordset']) {
                        if (portalField.indexOf(targetName + '::') > -1 && portalField !== targetName + '::-recid') {
                            targetPortalField = portalField;
                            if (portalField == targetName + '::' + recordSet[0]['field']) {
                                targetPortalValue = recordSet[0]['value'];
                                break;
                            }
                            if (portalField != targetName + '::id'
                                && portalField != targetName + '::' + recordSet[0]['field']) {
                                break;
                            }
                        }
                    }
                }
                relatedRecordSet.push({field: targetPortalField + '.0', value: targetPortalValue});
            }

            if (currentContext.relation && currentContext.relation[0] &&
                currentContext.relation[0]['join-field']) {
                INTERMediator_DBAdapter.db_update({
                    name: currentObj.parentContext.contextName,
                    conditions: [{
                        field: currentContext.relation[0]['join-field'],
                        operator: '=',
                        value: foreignValues.id
                    }],
                    dataset: relatedRecordSet
                });
                INTERMediator.constructMain();
            } else {
                INTERMediator.setErrorMessage('Insert Error (Portal Access Mode)', 'EXCEPTION-4');
            }
        } else {
            INTERMediator_DBAdapter.db_createRecord_async(
                {name: targetName, dataset: recordSet},
                generateAfterInsertRecordFunc(targetName, currentContext, updateNodes, foreignValues, existRelated),
                function () {
                    INTERMediator.setErrorMessage('Insert Error', 'EXCEPTION-4');
                }
            );
        }

        function generateAfterInsertRecordFunc(targetName, currentContext, updateNodes, foreignValues, existRelated) {
            var targetNameCapt = targetName;
            var currentContextCapt = currentContext;
            var updateNodesCapt = updateNodes;
            var foreignValuesCapt = foreignValues;
            var existRelatedCapt = existRelated;
            var keyValueCapt = keyValue;
            return function (result) {
                var keyField, newRecordId, associatedContext, conditions, createdRecord,
                    i, sameOriginContexts;
                newRecordId = result.newRecordKeyValue;
                keyField = currentContextCapt['key'] ? currentContextCapt['key'] : '-recid';
                associatedContext = IMLibContextPool.contextFromEnclosureId(updateNodesCapt);
                if (associatedContext) {
                    associatedContext.foreignValue = foreignValuesCapt;
                    if (currentContextCapt['portal'] == true && existRelatedCapt == false) {
                        conditions = INTERMediator.additionalCondition;
                        conditions[targetNameCapt] = {
                            field: keyField,
                            operator: '=',
                            value: keyValueCapt
                        };
                        INTERMediator.additionalCondition = conditions;
                    }
                    createdRecord = [{}];
                    createdRecord[0][keyField] = newRecordId;
                    INTERMediator.constructMain(associatedContext, result.dbresult);
                    sameOriginContexts = IMLibContextPool.getContextsWithSameOrigin(associatedContext);
                    for (i = 0; i < sameOriginContexts.length; i++) {
                        INTERMediator.constructMain(sameOriginContexts[i], null);
                    }
                }
                IMLibCalc.recalculation();
                INTERMediatorOnPage.hideProgress();
                INTERMediator.flushMessage();
            };
        }
    },

    clickPostOnlyButton: function (node) {
        var i, j, fieldData, elementInfo, comp, contextCount, selectedContext, contextInfo, validationInfo;
        var mergedValues, inputNodes, typeAttr, k, messageNode, result, alertmessage;
        var linkedNodes, namedNodes, index, hasInvalid, isMerged, contextNodes;
        var targetNode = node.parentNode;
        while (!INTERMediatorLib.isEnclosure(targetNode, true)) {
            targetNode = targetNode.parentNode;
            if (!targetNode) {
                return;
            }
        }

        if (INTERMediatorOnPage.processingBeforePostOnlyContext) {
            if (!INTERMediatorOnPage.processingBeforePostOnlyContext(targetNode)) {
                return;
            }
        }

        contextNodes = [];
        linkedNodes = [];
        namedNodes = [];
        for (i = 0; i < targetNode.childNodes.length; i++) {
            seekLinkedElementInThisContext(targetNode.childNodes[i]);
            seekLinkedElementInAllChildren(targetNode.childNodes[i]);
        }
        contextCount = {};
        for (i = 0; i < contextNodes.length; i++) {
            elementInfo = INTERMediatorLib.getLinkedElementInfo(contextNodes[i]);
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
                                case 'inline':
                                case 'end-of-sibling':
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
                                        {'value': linkedNodes[i].value, 'target': linkedNodes[i]}
                                    );
                                    if (!result) {
                                        hasInvalid = true;
                                        switch (validationInfo.notify) {
                                        case 'inline':
                                            INTERMediatorLib.clearErrorMessage(linkedNodes[i]);
                                            messageNode = INTERMediatorLib.createErrorMessageNode(
                                                'SPAN', validationInfo.message);
                                            linkedNodes[i].parentNode.insertBefore(
                                                messageNode, linkedNodes[i].nextSibling);
                                            break;
                                        case 'end-of-sibling':
                                            INTERMediatorLib.clearErrorMessage(linkedNodes[i]);
                                            messageNode = INTERMediatorLib.createErrorMessageNode(
                                                'DIV', validationInfo.message);
                                            linkedNodes[i].parentNode.appendChild(messageNode);
                                            break;
                                        default:
                                            alertmessage += validationInfo.message + IMLib.nl_char;
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
                    if (namedNodes[i].tagName == 'INPUT') {
                        inputNodes = [namedNodes[i]];
                    } else {
                        inputNodes = namedNodes[i].getElementsByTagName('INPUT');
                    }
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
                    if (mergedValues.length > 0) {
                        isMerged = false;
                        for (index = 0; index < fieldData.length; index++) {
                            if (fieldData[index]['field'] == comp[1]) {
                                fieldData[index]['value'] += mergedValues.join(IMLib.nl_char) + IMLib.nl_char;
                                isMerged = true;
                            }
                        }
                        if (!isMerged) {
                            fieldData.push({
                                field: comp[1],
                                value: mergedValues.join(IMLib.nl_char) + IMLib.nl_char
                            });
                        }
                    }
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

        contextInfo = INTERMediatorLib.getNamedObject(INTERMediatorOnPage.getDataSources(), 'name', selectedContext);
        INTERMediator_DBAdapter.db_createRecord_async(
            {name: selectedContext, dataset: fieldData},
            function (result) {
                var newNode, parentOfTarget, targetNode = node, thisContext = contextInfo,
                    isSetMsg = false;
                INTERMediator.flushMessage();
                if (INTERMediatorOnPage.processingAfterPostOnlyContext) {
                    INTERMediatorOnPage.processingAfterPostOnlyContext(targetNode, result.newRecordKeyValue);
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
            }, null);

        function seekLinkedElementInThisContext(node) {    // Just seek out side of inner enclosure
            var children, i;
            if (node.nodeType === 1) {
                if (INTERMediatorLib.isLinkedElement(node)) {
                    contextNodes.push(node);
                } else if (INTERMediatorLib.isWidgetElement(node)) {
                    contextNodes.push(node);
                } else {
                    if (INTERMediatorLib.isEnclosure(node)) {
                        return;
                    }
                    children = node.childNodes;
                    for (i = 0; i < children.length; i++) {
                        seekLinkedElementInThisContext(children[i]);
                    }
                }
            }
        }

        function seekLinkedElementInAllChildren(node) {   // Traverse inside of enclosure
            var children, i;
            if (node.nodeType === 1) {
                if (INTERMediatorLib.isNamedElement(node)) {
                    namedNodes.push(node);
                } else if (INTERMediatorLib.isLinkedElement(node)) {
                    linkedNodes.push(node);
                } else if (INTERMediatorLib.isWidgetElement(node)) {
                    linkedNodes.push(node);
                } else {
                    children = node.childNodes;
                    for (i = 0; i < children.length; i++) {
                        seekLinkedElementInAllChildren(children[i]);
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
            targetKey = e.target.getAttribute('data-im');
        } else {
            targetKey = e.srcElement.getAttribute('data-im');
        }
        targetSplit = targetKey.split(':');
        if (targetSplit[0] != '_@addorder' || targetSplit.length < 3) {
            return;
        }
        for (key in IMLibLocalContext.store) {
            itemSplit = key.split(':');
            if (itemSplit.length > 3 && itemSplit[0] == 'valueofaddorder' && itemSplit[1] == targetSplit[1]) {
                extValue = IMLibLocalContext.getValue(key);
                if (extValue) {
                    IMLibLocalContext.store[key]++;
                }
            }
        }
        IMLibLocalContext.setValue('valueof' + targetKey.substring(2), 1);
        IMLibUI.eventUpdateHandler(targetSplit[1]);
    }
};
/*
 tiny-sha1
 Tiny version of SHA-1 (Secured Hash Algorithm) in Javascript
 The MIT License (MIT)
 Copyright (c) 2011 Chun Fai Wong
 https://code.google.com/p/tiny-sha1/
 */
function SHA1(s){function U(a,b,c){while(0<c--)a.push(b)}function L(a,b){return(a<<b)|(a>>>(32-b))}function P(a,b,c){return a^b^c}function A(a,b){var c=(b&0xFFFF)+(a&0xFFFF),d=(b>>>16)+(a>>>16)+(c>>>16);return((d&0xFFFF)<<16)|(c&0xFFFF)}var B="0123456789abcdef";return(function(a){var c=[],d=a.length*4,e;for(var i=0;i<d;i++){e=a[i>>2]>>((3-(i%4))*8);c.push(B.charAt((e>>4)&0xF)+B.charAt(e&0xF))}return c.join('')}((function(a,b){var c,d,e,f,g,h=a.length,v=0x67452301,w=0xefcdab89,x=0x98badcfe,y=0x10325476,z=0xc3d2e1f0,M=[];U(M,0x5a827999,20);U(M,0x6ed9eba1,20);U(M,0x8f1bbcdc,20);U(M,0xca62c1d6,20);a[b>>5]|=0x80<<(24-(b%32));a[(((b+65)>>9)<<4)+15]=b;for(var i=0;i<h;i+=16){c=v;d=w;e=x;f=y;g=z;for(var j=0,O=[];j<80;j++){O[j]=j<16?a[j+i]:L(O[j-3]^O[j-8]^O[j-14]^O[j-16],1);var k=(function(a,b,c,d,e){var f=(e&0xFFFF)+(a&0xFFFF)+(b&0xFFFF)+(c&0xFFFF)+(d&0xFFFF),g=(e>>>16)+(a>>>16)+(b>>>16)+(c>>>16)+(d>>>16)+(f>>>16);return((g&0xFFFF)<<16)|(f&0xFFFF)})(j<20?(function(t,a,b){return(t&a)^(~t&b)}(d,e,f)):j<40?P(d,e,f):j<60?(function(t,a,b){return(t&a)^(t&b)^(a&b)}(d,e,f)):P(d,e,f),g,M[j],O[j],L(c,5));g=f;f=e;e=L(d,30);d=c;c=k}v=A(v,c);w=A(w,d);x=A(x,e);y=A(y,f);z=A(z,g)}return[v,w,x,y,z]}((function(t){var a=[],b=255,c=t.length*8;for(var i=0;i<c;i+=8){a[i>>5]|=(t.charCodeAt(i/8)&b)<<(24-(i%32))}return a}(s)).slice(),s.length*8))))}/* A JavaScript implementation of the SHA family of hashes, as defined in FIPS
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

//var biRadixBase = 2;
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
//var dpl10 = 9;
// lr10 = 10 ^ dpl10
//var lr10 = biFromNumber(1000000000);

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
};
BigInt.prototype.isOne = function () {
    return this.digits[0] == 1 && !this.isNeg && biNormalize(this).digits.length == 1;
};
BigInt.prototype.isEqual = function (bis) {
    var i;
    if (this.isNeg != bis.isNeg)
        return false;
    if (this.digits.length != bis.digits.length)
        return false;
    for (i = this.digits.length - 1; i > -1; i--)
        if (this.digits[i] != bis.digits[i])
            return false;
    return true;
};
BigInt.prototype.blankZero = function () {
    this.digits.length = 1;
    this.digits[0] = 0;
};
BigInt.prototype.blankOne = function () {
    this.digits.length = 1;
    this.digits[0] = 1;
};
BigInt.prototype.blankEmpty = function () {
    this.digits.length = 0;
};

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
    var result, j;
    if (Math.abs(i) > maxInteger)
        return (biFromFloat(i));
    result = new BigInt();
    if (result.isNeg = i < 0)
        i = -i;
    j = 0;
    while (i > 0) {
        result.digits[j++] = i & maxDigitVal;
        i >>>= biRadixBits;
    }
    return result;
}

function biFromFloat(i) {
    var result, j, c;
    result = new BigInt();
    if (result.isNeg = i < 0)
        i = -i;
    j = 0;
    while (i > 0) {
        c = Math.floor(i / biRadix);
        result.digits[j++] = i - c * biRadix;
        i = c;
    }
    return result;
}

function biFromString(s, radix) {
    var isNeg, first, result, place, i, c, digit, biDigit;
    if (radix == 16)
        return biFromHex(s);
    isNeg = s.charAt(0) == '-';
    first = (isNeg ? 1 : 0) - 1;
    result = new BigInt();
    place = biCopy(bigOne);
    for (i = s.length - 1; i > first; i--) {
        c = s.charCodeAt(i);
        digit = charToHex(c);
        biDigit = biMultiplyDigit(place, digit);
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
    var result, sl, i;
    result = new BigInt();
    if (s.charAt(0) == '-') {
        result.isNeg = true;
        s = substr(s, 1);
    } else {
        result.isNeg = false;
    }
    sl = s.length;
    for (i = sl, j = 0; i > 0; i -= biHexPerDigit, j++)
        result.digits[j] = hexToDigit(s.substr(Math.max(i - biHexPerDigit, 0), Math.min(i, biHexPerDigit)));
    return biNormalize(result);
}

function reverseStr(s) {
    var result = "", i;
    for (i = s.length - 1; i > -1; i--)
        result += s.charAt(i);
    return result;
}

var hexatrigesimalToChar = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z'];

function biToString(x, radix) {
    // 2 <= radix <= 36
    var b, qr, result;
    if (radix == 16)
        return biToHex(x);
    b = biFromNumber(radix);
    qr = biDivideModulo(biAbs(x), b);
    result = hexatrigesimalToChar[qr[1].digits[0]];
    while (!qr[0].isZero()) {
        qr = biDivideModulo(qr[0], b);
        result += hexatrigesimalToChar[qr[1].digits[0]];
    }
    return (x.isNeg ? "-" : "") + reverseStr(result);
}

function biToDecimal(x) {
    return biToString(x, 10);
}

var hexToChar = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'a', 'b', 'c', 'd', 'e', 'f'];

function digitToHex(n) {
    var mask, result, i;
    mask = 0xf;
    result = "";
    for (i = 0; i < biHexPerDigit; i++) {
        result += hexToChar[n & mask];
        n >>>= 4;
    }
    return reverseStr(result);
}

function digitToHexTrunk(n) {
    var mask, result, i;
    if (n == 0)
        return "0";
    mask = 0xf;
    result = "";
    for (i = 0; i < biHexPerDigit && n > 0; i++) {
        result += hexToChar[n & mask];
        n >>>= 4;
    }
    return reverseStr(result);
}

function biToHex(x) {
    var i, result;
    result = x.isNeg ? "-" : "";
    i = biHighIndex(x);
    result += digitToHexTrunk(x.digits[i--]);
    while (i > -1)
        result += digitToHex(x.digits[i--]);
    return result;
}

function biToNumber(x) {
    var result = 0, faktor = 1, k;
    k = biHighIndex(x) + 1;
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
    var result = 0, sl, i;
    sl = Math.min(s.length, biHexPerDigit);
    for (i = 0; i < sl; i++) {
        result <<= 4;
        result |= charToHex(s.charCodeAt(i))
    }
    return result;
}

function biDump(b) {
    return (b.isNeg ? "minus " : "plus ") + b.digits.join(" ");
}

function biNormalize(x) {
    var k, i;
    k = x.digits.length;
    if (x.digits[k - 1] != 0 && !isNaN(x.digits[k - 1]))
        return x;
    for (i = k - 1; i > 0; i--)
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

function biHighIndex(num) {
    biNormalize(num);
    return num.digits.length - 1;
}

function biNumBits(num) {
    var n, d, m, result;
    n = biHighIndex(num);
    d = num.digits[n];
    m = (n + 1) * bitsPerDigit;
    for (result = m; result > m - bitsPerDigit; result--) {
        if ((d & biHalfRadix) != 0)
            break;
        d <<= 1;
    }
    return result;
}

function biCompareAbs(numx, numy) {
    var nx = biHighIndex(numx);
    var ny = biHighIndex(numy);
    if (nx != ny)
        return 1 - 2 * ((nx < ny) ? 1 : 0);
    for (var i = numx.digits.length - 1; i > -1; i--)
        if (numx.digits[i] != numy.digits[i])
            return 1 - 2 * ((numx.digits[i] < numy.digits[i]) ? 1 : 0);
    return 0;
}

function biCompare(numx, numy) {
    if (numx.isNeg != numy.isNeg)
        return 1 - 2 * (numx.isNeg ? 1 : 0);
    return numx.isNeg ? -biCompareAbs(numx, numy) : biCompareAbs(numx, numy);
}

function biAddNatural(numx, numy) {
    var nx, ny, i, c, result, source, k;
    nx = biHighIndex(numx) + 1;
    ny = biHighIndex(numy) + 1;
    i = 0;
    c = 0;
    if (nx > ny) {
        result = biAbs(numx);
        source = numy;
        k = ny;
    } else {
        result = biAbs(numy);
        source = numx;
        k = nx;
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

function biSubtractNatural(numx, numy) {
// require numx >= numy
    var nx, ny, result, resultdigits, xdigits, ydigits, c, i;
    nx = biHighIndex(numx) + 1;
    ny = biHighIndex(numy) + 1;
    result = biAbs(numx);
    resultdigits = result.digits;
    xdigits = numx.digits;
    ydigits = numy.digits;
    c = 0;
    for (i = 0; i < ny; i++) {
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

function biAdd(numx, numy) {
    var result, x_y;
    if (!numx.isNeg && !numy.isNeg)
        return biAddNatural(numx, numy);
    if (numx.isNeg && numy.isNeg) {
        result = biAddNatural(numx, numy);
        result.isNeg = true;
        return result;
    }
    x_y = biCompareAbs(numx, numy);
    if (x_y == 0)
        return biFromNumber(0);
    if (x_y > 0) {
        result = biSubtractNatural(numx, numy);
        result.isNeg = numx.isNeg;
    }
    if (x_y < 0) {
        result = biSubtractNatural(numy, numx);
        result.isNeg = numy.isNeg;
    }
    return result;
}

function biSubtract(numx, numy) {
    var result, x_y;
    if (!numx.isNeg && numy.isNeg)
        return biAddNatural(numx, numy);
    if (numx.isNeg && !numy.isNeg) {
        result = biAddNatural(numx, numy);
        result.isNeg = true;
        return result;
    }
    x_y = biCompareAbs(numx, numy);
    if (x_y == 0)
        return biCopy(bigZero);
    if (x_y > 0) {
        result = biSubtractNatural(numx, numy);
        result.isNeg = numx.isNeg;
    }
    if (x_y < 0) {
        result = biSubtractNatural(numy, numx);
        result.isNeg = !numx.isNeg;
    }
    return result;
}

function biMultiply(numx, numy) {
    var c, n, t, result, resultdigits, xdigits, ydigits, i, j, uv, k;
    n = biHighIndex(numx) + 1;
    t = biHighIndex(numy) + 1;
    if (n == 1 && numx.digits[0] == 0 || t == 1 && numy.digits[0] == 0)
        return new BigInt();
    result = new BigInt(n + t);
    resultdigits = result.digits;
    xdigits = numx.digits;
    ydigits = numy.digits;
    for (i = 0; i < t; i++) {
        c = 0;
        k = i;
        for (j = 0; j < n; j++, k++) {
            uv = resultdigits[k] + xdigits[j] * ydigits[i] + c;
            resultdigits[k] = uv & maxDigitVal;
            c = uv >>> biRadixBits;
        }
        resultdigits[i + n] = c;
    }
    result.isNeg = numx.isNeg != numy.isNeg;
    return biNormalize(result);
}

function biMultiplyDigit(numx, numy) {
    var n, result, c, j, uv;
    n = biHighIndex(numx) + 1;
    result = new BigInt(n);
    c = 0;
    for (j = 0; j < n; j++) {
        uv = result.digits[j] + numx.digits[j] * numy + c;
        result.digits[j] = uv & maxDigitVal;
        c = uv >>> biRadixBits;
    }
    result.digits[n] = c;
    return result;
}

function arrayCopy(src, srcStart, dest, destStart, count) {
    var i, m;
    if (srcStart >= src.length) {
        if (dest.length == 0)
            dest[0] = 0;
        return;
    }
    for (i = 0; i < destStart; i++)
        // if !dest[i] ???//todo
        dest[i] = 0;
    m = Math.min(srcStart + count, src.length);
    for (i = srcStart, j = destStart; i < m; i++, j++)
        dest[j] = src[i];
}

function biShiftLeft(x, n) {
    var digitCount, result, bits, rightBits, i;
    digitCount = Math.floor(n / bitsPerDigit);
    result = new BigInt();
    arrayCopy(x.digits, 0, result.digits, digitCount, x.digits.length);
    bits = n % bitsPerDigit;
    rightBits = bitsPerDigit - bits;
    result.digits[result.digits.length] = result.digits[result.digits.length] >>> rightBits;
    for (i = result.digits.length - 1; i > 0; i--)
        result.digits[i] = ((result.digits[i] << bits) & maxDigitVal) | (result.digits[i - 1] >>> rightBits);
    result.digits[0] = (result.digits[0] << bits) & maxDigitVal;
    result.isNeg = x.isNeg;
    return biNormalize(result);
}

function biShiftRight(x, n) {
    var digitCount, result, bits, leftBits, i;
    digitCount = Math.floor(n / bitsPerDigit);
    result = new BigInt();
    arrayCopy(x.digits, digitCount, result.digits, 0, x.digits.length - digitCount);
    bits = n % bitsPerDigit;
    leftBits = bitsPerDigit - bits;
    for (i = 0; i < result.digits.length - 1; i++)
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
    var c, n, t, uv, k, result, resultdigits, xdigits, ydigits, i, j;
    n = biHighIndex(x) + 1;
    t = biHighIndex(y) + 1;
    if (n == 1 && x.digits[0] == 0 || t == 1 && y.digits[0] == 0)
        return new BigInt();
    result = new BigInt(p);
    resultdigits = result.digits;
    xdigits = x.digits;
    ydigits = y.digits;
    for (i = 0; i < t && i < p; i++) {
        c = 0;
        k = i;
        for (j = 0; j < n && k < p; j++, k++) {
            uv = resultdigits[k] + xdigits[j] * ydigits[i] + c;
            resultdigits[k] = uv & maxDigitVal;
            c = uv >>> biRadixBits;
        }
        resultdigits[i + n] = c;
    }
    result = biModuloByRadixPower(result, p);
    result.isNeg = x.isNeg != y.isNeg;
    return biNormalize(result);
}

function biDivideModuloNatural(x, y) {
    var nx, ny, q, r, nr, jm, qm, flag;
    nx = biHighIndex(x);
    ny = biHighIndex(y);
    q = new BigInt(-1);
    q.digits = [];
    r = new BigInt();
    //r.digits = [0]
    for (var i = nx; i > -1; i--) {
        r.digits.unshift(x.digits[i]);
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
        nr = biHighIndex(r);
        if (nr == ny)
            jm = Math.floor((r.digits[nr] * biRadix + (r.digits[nr - 1] || 0)) /
                (y.digits[ny] * biRadix + (y.digits[ny - 1] || 0) + 1));
        else
            jm = Math.floor((r.digits[nr] * biRadixSquared + (r.digits[nr - 1] || 0) * biRadix + (r.digits[nr - 2] || 0)) /
                (y.digits[ny] * biRadix + (y.digits[ny - 1] || 0) + 1));
        jm = Math.max(0, Math.min(jm, maxDigitVal));
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
    var q, r, origXIsNeg, origYIsNeg, result;
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
    origXIsNeg = x.isNeg;
    origYIsNeg = y.isNeg;
    result = biDivideModuloNatural(biAbs(x), biAbs(y));
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
    var result;
    e = biModulo(e, m);
     result = biExtendedEuclid(m, e);
    if (!result[2].isOne())
        return null;
    return biModulo(result[1], m);
}

function biExtendedEuclid(a, b) {
    var result;
    if (biCompare(a, b) >= 0)
        return biExtendedEuclidNatural(a, b);
     result = biExtendedEuclidNatural(b, a);
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
    m = biMultiplyModByRadixPower(m, N.Ninv, N.nN);
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
    //this.radix = 16;
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
    var i, j, k, block, sl, result;
    s = biUTF8Encode(s);
    s = s.replace(/[\x00]/gm, String.fromCharCode(255)); //not UTF-8 zero replace
    s = s + String.fromCharCode(254); //not UTF-8 terminal sybol
    sl = s.length;
    s = s + biRandomPadding(this.chunkSize - sl % this.chunkSize);
    sl = s.length;
    result = "";
    block = new BigInt();
    for (i = 0; i < sl; i += this.chunkSize) {
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
 * INTER-Mediator
 * Copyright (c) INTER-Mediator Directive Committee (http://inter-mediator.org)
 * This project started at the end of 2009 by Masayuki Nii msyk@msyk.net.
 *
 * INTER-Mediator is supplied under MIT License.
 * Please see the full license for details:
 * https://github.com/INTER-Mediator/INTER-Mediator/blob/master/dist-docs/License.txt
 */

/*==================================================
 Database Access Object for Server-based Database
 ==================================================*/

//'use strict';

var INTERMediator_DBAdapter = {

    eliminateDuplicatedConditions: false,
    /*
     If this property is set to true, the dupilicate conditions in query is going to eliminate before
     submitting to the server. This behavior is required in some case of FileMaker Server, but it can resolve
     by using the id=>-recid in a context. 2015-4-19 Masayuki Nii.
     */
    debugMessage: false,

    generate_authParams: function () {
        var authParams = '', shaObj, hmacValue;
        if (INTERMediatorOnPage.authUser.length > 0) {
            authParams = '&clientid=' + encodeURIComponent(INTERMediatorOnPage.clientId);
            authParams += '&authuser=' + encodeURIComponent(INTERMediatorOnPage.authUser);
            if (INTERMediatorOnPage.isNativeAuth || INTERMediatorOnPage.isLDAP) {
                if (INTERMediatorOnPage.authCryptedPassword && INTERMediatorOnPage.authChallenge) {
                    authParams += '&cresponse=' + encodeURIComponent(
                            INTERMediatorOnPage.publickey.biEncryptedString(INTERMediatorOnPage.authCryptedPassword +
                                IMLib.nl_char + INTERMediatorOnPage.authChallenge));
                    if (INTERMediator_DBAdapter.debugMessage) {
                        INTERMediator.setDebugMessage('generate_authParams/authCryptedPassword=' +
                            INTERMediatorOnPage.authCryptedPassword);
                        INTERMediator.setDebugMessage('generate_authParams/authChallenge=' +
                            INTERMediatorOnPage.authChallenge);
                    }
                } else {
                    authParams += '&cresponse=dummy';
                }
            }
            if (INTERMediatorOnPage.authHashedPassword && INTERMediatorOnPage.authChallenge) {
                shaObj = new jsSHA(INTERMediatorOnPage.authHashedPassword, 'ASCII');
                hmacValue = shaObj.getHMAC(INTERMediatorOnPage.authChallenge, 'ASCII', 'SHA-256', 'HEX');
                authParams += '&response=' + encodeURIComponent(hmacValue);
                if (INTERMediator_DBAdapter.debugMessage) {
                    INTERMediator.setDebugMessage('generate_authParams/authHashedPassword=' +
                        INTERMediatorOnPage.authHashedPassword);
                    INTERMediator.setDebugMessage('generate_authParams/authChallenge=' +
                        INTERMediatorOnPage.authChallenge);
                }
            } else {
                authParams += '&response=dummy';
            }
        }

        authParams += '&notifyid=';
        authParams += encodeURIComponent(INTERMediatorOnPage.clientNotificationIdentifier());
        authParams += ('&pusher=' + (INTERMediator.pusherAvailable ? 'yes' : ''));
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
            if (INTERMediator_DBAdapter.debugMessage) {
                INTERMediator.setDebugMessage('store_challenge/authChallenge=' + INTERMediatorOnPage.authChallenge);
                INTERMediator.setDebugMessage('store_challenge/authUserHexSalt=' + INTERMediatorOnPage.authUserHexSalt);
                INTERMediator.setDebugMessage('store_challenge/authUserSalt=' + INTERMediatorOnPage.authUserSalt);
            }
        }
    },

    logging_comAction: function (debugMessageNumber, appPath, accessURL, authParams) {
        INTERMediator.setDebugMessage(
            INTERMediatorOnPage.getMessages()[debugMessageNumber] +
            'Accessing:' + decodeURI(appPath) + ', Parameters:' + decodeURI(accessURL + authParams));
    },

    logging_comResult: function (myRequest, resultCount, dbresult, requireAuth, challenge, clientid, newRecordKeyValue, changePasswordResult, mediatoken) {
        var responseTextTrancated;
        if (INTERMediator.debugMode > 1) {
            if (myRequest.responseText.length > 1000) {
                responseTextTrancated = myRequest.responseText.substr(0, 1000) + ' ...[trancated]';
            } else {
                responseTextTrancated = myRequest.responseText;
            }
            INTERMediator.setDebugMessage('myRequest.responseText=' + responseTextTrancated);
            INTERMediator.setDebugMessage('Return: resultCount=' + resultCount +
                ', dbresult=' + INTERMediatorLib.objectToString(dbresult) + IMLib.nl_char +
                'Return: requireAuth=' + requireAuth +
                ', challenge=' + challenge + ', clientid=' + clientid + IMLib.nl_char +
                'Return: newRecordKeyValue=' + newRecordKeyValue +
                ', changePasswordResult=' + changePasswordResult + ', mediatoken=' + mediatoken
            );
        }
    },

    server_access: function (accessURL, debugMessageNumber, errorMessageNumber) {
        var newRecordKeyValue = '', dbresult = '', resultCount = 0, totalCount = null, challenge = null,
            clientid = null, requireAuth = false, myRequest = null, changePasswordResult = null,
            mediatoken = null, appPath, authParams, jsonObject, i, notifySupport = false, useNull = false,
            registeredID = '';
        appPath = INTERMediatorOnPage.getEntryPath();
        authParams = INTERMediator_DBAdapter.generate_authParams();
        INTERMediator_DBAdapter.logging_comAction(debugMessageNumber, appPath, accessURL, authParams);
        INTERMediatorOnPage.notifySupport = notifySupport;
        try {
            myRequest = new XMLHttpRequest();
            myRequest.open('POST', appPath, false, INTERMediatorOnPage.httpuser, INTERMediatorOnPage.httppasswd);
            myRequest.setRequestHeader('charset', 'utf-8');
            myRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            myRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            myRequest.setRequestHeader('X-From', location.href);
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
            registeredID = jsonObject.hasOwnProperty('registeredid') ? jsonObject.registeredid : '';


            INTERMediator_DBAdapter.logging_comResult(myRequest, resultCount, dbresult, requireAuth,
                challenge, clientid, newRecordKeyValue, changePasswordResult, mediatoken);
            INTERMediator_DBAdapter.store_challenge(challenge);
            if (clientid !== null) {
                INTERMediatorOnPage.clientId = clientid;
            }
            if (mediatoken !== null) {
                INTERMediatorOnPage.mediaToken = mediatoken;
            }
            // This is forced fail-over for the password was changed in LDAP auth.
            if (INTERMediatorOnPage.isLDAP === true &&
                INTERMediatorOnPage.authUserHexSalt != INTERMediatorOnPage.authHashedPassword.substr(-8, 8)) {
                if (accessURL != 'access=challenge') {
                    requireAuth = true;
                }
            }
        } catch (e) {
            if (INTERMediatorOnPage.getIMRootPath() !== '[ERROR]') {
                INTERMediator.setErrorMessage(e,
                    INTERMediatorLib.getInsertedString(
                        INTERMediatorOnPage.getMessages()[errorMessageNumber], [e, myRequest.responseText]));
            }
        }
        if (accessURL.indexOf('access=changepassword&newpass=') === 0) {
            return changePasswordResult;
        }
        if (requireAuth) {
            INTERMediator.setDebugMessage('Authentication Required, user/password panel should be show.');
            INTERMediatorOnPage.clearCredentials();
            throw '_im_requath_request_';
        }
        if (!accessURL.match(/access=challenge/)) {
            INTERMediatorOnPage.authCount = 0;
        }
        INTERMediatorOnPage.storeCredentialsToCookieOrStorage();
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

    /* No return values */
    server_access_async: function (accessURL, debugMessageNumber, errorMessageNumber, successProc, failedProc, authAgainProc) {
        var newRecordKeyValue = '', dbresult = '', resultCount = 0, totalCount = null,
            challenge = null, clientid = null, requireAuth = false, myRequest = null,
            changePasswordResult = null, mediatoken = null, appPath,
            authParams, jsonObject, i, notifySupport = false, useNull = false, registeredID = '';
        appPath = INTERMediatorOnPage.getEntryPath();
        authParams = INTERMediator_DBAdapter.generate_authParams();
        INTERMediator_DBAdapter.logging_comAction(debugMessageNumber, appPath, accessURL, authParams);
        INTERMediatorOnPage.notifySupport = notifySupport;
        try {
            myRequest = new XMLHttpRequest();
            myRequest.open('POST', appPath, true,
                INTERMediatorOnPage.httpuser, INTERMediatorOnPage.httppasswd);
            myRequest.setRequestHeader('charset', 'utf-8');
            myRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            myRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            myRequest.setRequestHeader('X-From', location.href);
            myRequest.onreadystatechange = function () {
                switch (myRequest.readyState) {
                case 0: // Unsent
                    break;
                case 1: // Opened
                    break;
                case 2: // Headers Received
                    break;
                case 3: // Loading
                    break;
                case 4:
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
                    registeredID = jsonObject.hasOwnProperty('registeredid') ? jsonObject.registeredid : '';

                    if (jsonObject.errorMessages.length > 0) {
                        INTERMediator.setErrorMessage('Communication Error: ' + jsonObject.errorMessages);
                        failedProc();
                        throw 'Communication Error';
                    }

                    INTERMediator_DBAdapter.logging_comResult(myRequest, resultCount, dbresult, requireAuth,
                        challenge, clientid, newRecordKeyValue, changePasswordResult, mediatoken);
                    INTERMediator_DBAdapter.store_challenge(challenge);
                    if (clientid !== null) {
                        INTERMediatorOnPage.clientId = clientid;
                    }
                    if (mediatoken !== null) {
                        INTERMediatorOnPage.mediaToken = mediatoken;
                    }
                    // This is forced fail-over for the password was changed in LDAP auth.
                    if (INTERMediatorOnPage.isLDAP === true &&
                        INTERMediatorOnPage.authUserHexSalt != INTERMediatorOnPage.authHashedPassword.substr(-8, 8)) {
                        if (accessURL != 'access=challenge') {
                            requireAuth = true;
                        }
                    }
                    if (accessURL.indexOf('access=changepassword&newpass=') === 0) {
                        if (successProc) {
                            successProc({
                                dbresult: dbresult,
                                resultCount: resultCount,
                                totalCount: totalCount,
                                newRecordKeyValue: newRecordKeyValue,
                                newPasswordResult: changePasswordResult,
                                registeredId: registeredID,
                                nullAcceptable: useNull
                            });
                        }
                        return;
                    }
                    if (requireAuth) {
                        INTERMediator.setDebugMessage('Authentication Required, user/password panel should be show.');
                        INTERMediatorOnPage.clearCredentials();
                        if (authAgainProc) {
                            authAgainProc(myRequest);
                        }
                        return;
                    }
                    if (!accessURL.match(/access=challenge/)) {
                        INTERMediatorOnPage.authCount = 0;
                    }
                    INTERMediatorOnPage.storeCredentialsToCookieOrStorage();
                    INTERMediatorOnPage.notifySupport = notifySupport;
                    if (successProc) {
                        successProc({
                            dbresult: dbresult,
                            resultCount: resultCount,
                            totalCount: totalCount,
                            newRecordKeyValue: newRecordKeyValue,
                            newPasswordResult: changePasswordResult,
                            registeredId: registeredID,
                            nullAcceptable: useNull
                        });
                    }
                    break;
                }
            };
            myRequest.send(accessURL + authParams);
        } catch (e) {
            INTERMediator.setErrorMessage(e,
                INTERMediatorLib.getInsertedString(
                    INTERMediatorOnPage.getMessages()[errorMessageNumber], [e, myRequest.responseText]));
            if (failedProc) {
                failedProc();
            }
        }
    },

    changePassword: function (username, oldpassword, newpassword) {
        var challengeResult, params, result, messageNode;

        if (username && oldpassword) {
            INTERMediatorOnPage.authUser = username;
            if (username !== '' &&  // No usename and no challenge, get a challenge.
                (INTERMediatorOnPage.authChallenge === null || INTERMediatorOnPage.authChallenge.length < 24 )) {
                INTERMediatorOnPage.authHashedPassword = 'need-hash-pls';   // Dummy Hash for getting a challenge
                challengeResult = INTERMediator_DBAdapter.getChallenge();
                if (!challengeResult) {
                    messageNode = document.getElementById('_im_newpass_message');
                    if (messageNode) {
                        INTERMediatorLib.removeChildNodes(messageNode);
                        messageNode.appendChild(
                            document.createTextNode(
                                INTERMediatorLib.getInsertedStringFromErrorNumber(2008)));
                    } else {
                        alert(INTERMediatorLib.getInsertedStringFromErrorNumber(2008));
                    }
                    INTERMediator.flushMessage();
                    return; // If it's failed to get a challenge, finish everything.
                }
            }
            INTERMediatorOnPage.authHashedPassword =
                SHA1(oldpassword + INTERMediatorOnPage.authUserSalt) +
                INTERMediatorOnPage.authUserHexSalt;
        } else {
            INTERMediatorOnPage.retrieveAuthInfo();
        }
        params = 'access=changepassword&newpass=' + INTERMediatorLib.generatePasswordHash(newpassword);
        try {
            result = INTERMediator_DBAdapter.server_access(params, 1029, 1030);
            if (result) {
                INTERMediatorOnPage.authCryptedPassword =
                    INTERMediatorOnPage.publickey.biEncryptedString(newpassword);
                INTERMediatorOnPage.authHashedPassword =
                    SHA1(newpassword + INTERMediatorOnPage.authUserSalt)
                    + INTERMediatorOnPage.authUserHexSalt;
                INTERMediatorOnPage.storeCredentialsToCookieOrStorage();
            }
        } catch (e) {
            return false;
        }
        return result;
    },

    getChallenge: function () {
        try {
            this.server_access('access=challenge', 1027, 1028);
        } catch (ex) {
            if (ex == '_im_requath_request_') {
                throw ex;
            } else {
                INTERMediator.setErrorMessage(ex, 'EXCEPTION-19');
            }
        }
        if (INTERMediatorOnPage.authChallenge === null) {
            return false;
        }
        return true;
    },

    uploadFile: function (parameters, uploadingFile, doItOnFinish, exceptionProc) {
        var myRequest = null, appPath, authParams, accessURL, i;
        //           var result = this.server_access('access=uploadfile' + parameters, 1031, 1032, uploadingFile);
        appPath = INTERMediatorOnPage.getEntryPath();
        authParams = INTERMediator_DBAdapter.generate_authParams();
        accessURL = 'access=uploadfile' + parameters;
        INTERMediator_DBAdapter.logging_comAction(1031, appPath, accessURL, authParams);
        try {
            myRequest = new XMLHttpRequest();
            myRequest.open('POST', appPath, true, INTERMediatorOnPage.httpuser, INTERMediatorOnPage.httppasswd);
            myRequest.setRequestHeader('charset', 'utf-8');
            var params = (accessURL + authParams).split('&');
            var fd = new FormData();
            for (i = 0; i < params.length; i++) {
                var valueset = params[i].split('=');
                fd.append(valueset[0], decodeURIComponent(valueset[1]));
            }
            fd.append('_im_uploadfile', uploadingFile['content']);
            myRequest.onreadystatechange = function () {
                switch (myRequest.readyState) {
                case 3:
                    break;
                case 4:
                    INTERMediator_DBAdapter.uploadFileAfterSucceed(myRequest, doItOnFinish, exceptionProc, false);
                    break;
                }
            };
            myRequest.send(fd);
        } catch (e) {
            INTERMediator.setErrorMessage(e,
                INTERMediatorLib.getInsertedString(
                    INTERMediatorOnPage.getMessages()[1032], [e, myRequest.responseText]));
            exceptionProc();
        }
    },

    uploadFileAfterSucceed: function (myRequest, doItOnFinish, exceptionProc, isErrorDialog) {
        var newRecordKeyValue = '', dbresult = '', resultCount = 0, challenge = null,
            clientid = null, requireAuth = false, changePasswordResult = null,
            mediatoken = null, jsonObject, i, returnValue = true;
        try {
            //console.log(myRequest.responseText);
            jsonObject = JSON.parse(myRequest.responseText);
        } catch (ex) {
            INTERMediator.setErrorMessage(ex,
                INTERMediatorLib.getInsertedString(
                    INTERMediatorOnPage.getMessages()[1032], ['', '']));
            INTERMediator.flushMessage();
            exceptionProc();
            return false;
        }
        resultCount = jsonObject.resultCount ? jsonObject.resultCount : 0;
        dbresult = jsonObject.dbresult ? jsonObject.dbresult : null;
        requireAuth = jsonObject.requireAuth ? jsonObject.requireAuth : false;
        challenge = jsonObject.challenge ? jsonObject.challenge : null;
        clientid = jsonObject.clientid ? jsonObject.clientid : null;
        newRecordKeyValue = jsonObject.newRecordKeyValue ? jsonObject.newRecordKeyValue : '';
        changePasswordResult = jsonObject.changePasswordResult ? jsonObject.changePasswordResult : null;
        mediatoken = jsonObject.mediatoken ? jsonObject.mediatoken : null;
        for (i = 0; i < jsonObject.errorMessages.length; i++) {
            if (isErrorDialog) {
                window.alert(jsonObject.errorMessages[i]);
            } else {
                INTERMediator.setErrorMessage(jsonObject.errorMessages[i]);
            }
            returnValue = false;
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
            INTERMediatorOnPage.mediaToken = mediatoken;
        }
        if (requireAuth) {
            INTERMediator.setDebugMessage('Authentication Required, user/password panel should be show.');
            INTERMediatorOnPage.clearCredentials();
            //throw '_im_requath_request_';
            exceptionProc();
        }
        INTERMediatorOnPage.authCount = 0;
        INTERMediatorOnPage.storeCredentialsToCookieOrStorage();
        doItOnFinish(dbresult);
        return returnValue;
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
        var params, returnValue, result, contextDef;

        if (!INTERMediator_DBAdapter.db_queryChecking(args)) {
            return;
        }
        params = INTERMediator_DBAdapter.db_queryParameters(args);
        // INTERMediator_DBAdapter.eliminateDuplicatedConditions = false;
        // params += '&randkey' + Math.random();    // For ie...
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
            returnValue.count = Object.keys(result.dbresult).length;
            // for (var ix in result.dbresult) {
            //     returnValue.count++;
            // }

            contextDef = INTERMediatorLib.getNamedObject(
                INTERMediatorOnPage.getDataSources(), 'name', args.name);
            if (!contextDef.relation &&
                args.paging && Boolean(args.paging) === true) {
                INTERMediator.pagedAllCount = parseInt(result.resultCount, 10);
                if (result.totalCount) {
                    INTERMediator.totalRecordCount = parseInt(result.totalCount, 10);
                }
            }
            if ((args.paging !== null) && (Boolean(args.paging) === true)) {
                INTERMediator.pagination = true;
                if (!(Number(args.records) >= Number(INTERMediator.pagedSize) &&
                    Number(INTERMediator.pagedSize) > 0)) {
                    INTERMediator.pagedSize = parseInt(args.records, 10);
                }
            }
        } catch (ex) {
            if (ex == '_im_requath_request_') {
                throw ex;
            } else {
                INTERMediator.setErrorMessage(ex, 'EXCEPTION-17');
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
            if (ex == '_im_requath_request_') {
                if (INTERMediatorOnPage.requireAuthentication) {
                    if (!INTERMediatorOnPage.isComplementAuthData()) {
                        INTERMediatorOnPage.clearCredentials();
                        INTERMediatorOnPage.authenticating(
                            function () {
                                returnValue = INTERMediator_DBAdapter.db_queryWithAuth(args, completion);
                            });
                        return;
                    }
                }
            } else {
                INTERMediator.setErrorMessage(ex, 'EXCEPTION-16');
            }
        }
        completion(returnValue);
    },

    db_query_async: function (args, successProc, failedProc) {
        var params;

        if (!INTERMediator_DBAdapter.db_queryChecking(args)) {
            return;
        }
        params = INTERMediator_DBAdapter.db_queryParameters(args);
        // INTERMediator_DBAdapter.eliminateDuplicatedConditions = false;
        try {
            this.server_access_async(
                params,
                1012,
                1004,
                (function () {
                    var contextDef;
                    var contextName = args.name;
                    var recordsNumber = Number(args.records);
                    var succesProcCapt = successProc;
                    return function (result) {
                        result.count = Object.keys(result.dbresult).length;
                        // for (var ix in result.dbresult) {
                        //     result.count++;
                        // }

                        contextDef = IMLibContextPool.getContextDef(contextName);
                        if (!contextDef.relation &&
                            args.paging && Boolean(args.paging) === true) {
                            INTERMediator.pagedAllCount = parseInt(result.resultCount, 10);
                            if (result.totalCount) {
                                INTERMediator.totalRecordCount = parseInt(result.totalCount, 10);
                            }
                        }
                        if ((args.paging !== null) && (Boolean(args.paging) === true)) {
                            INTERMediator.pagination = true;
                            if (!(recordsNumber >= Number(INTERMediator.pagedSize) &&
                                Number(INTERMediator.pagedSize) > 0)) {
                                INTERMediator.pagedSize = parseInt(recordsNumber, 10);
                            }
                        }

                        succesProcCapt(result);
                    };
                })(),
                failedProc,
                INTERMediator_DBAdapter.createExceptionFunc(
                    1016,
                    (function () {
                        var argsCapt = args;
                        var succesProcCapt = successProc;
                        var failedProcCapt = failedProc;
                        return function () {
                            INTERMediator_DBAdapter.db_query_async(
                                argsCapt, succesProcCapt, failedProcCapt);
                        };
                    })()
                )
            );
        } catch (ex) {
            INTERMediator.setErrorMessage(ex, 'EXCEPTION-17');
        }
    },

    db_queryChecking: function (args) {
        var noError = true;
        if (args.name === null || args.name === '') {
            INTERMediator.setErrorMessage(INTERMediatorLib.getInsertedStringFromErrorNumber(1005));
            noError = false;
        }
        return noError;
    },

    db_queryParameters: function (args) {
        var i, index, params, counter, extCount, criteriaObject, sortkeyObject,
            extCountSort, recordLimit = 10000000, conditions, conditionSign, modifyConditions,
            orderFields, key, keyParams, value, fields, operator, orderedKeys, removeIndice = [];
        if (args.records === null) {
            params = 'access=read&name=' + encodeURIComponent(args.name);
        } else {
            if (parseInt(args.records, 10) === 0 &&
                INTERMediatorOnPage.dbClassName === 'DB_FileMaker_FX') {
                params = 'access=describe&name=' + encodeURIComponent(args.name);
            } else {
                params = 'access=read&name=' + encodeURIComponent(args.name);
            }
            if (Boolean(args.uselimit) === true &&
                parseInt(args.records, 10) >= INTERMediator.pagedSize &&
                parseInt(INTERMediator.pagedSize, 10) > 0) {
                recordLimit = INTERMediator.pagedSize;
            } else {
                recordLimit = args.records;
            }
        }

        if (args['primaryKeyOnly']) {
            params += '&pkeyonly=true';
        }

        if (args['fields']) {
            for (i = 0; i < args['fields'].length; i++) {
                params += '&field_' + i + '=' + encodeURIComponent(args['fields'][i]);
            }
        }
        counter = 0;
        if (args['parentkeyvalue']) {
            //noinspection JSDuplicatedDeclaration
            for (index in args['parentkeyvalue']) {
                if (args['parentkeyvalue'].hasOwnProperty(index)) {
                    params += '&foreign' + counter +
                        'field=' + encodeURIComponent(index);
                    params += '&foreign' + counter +
                        'value=' + encodeURIComponent(args['parentkeyvalue'][index]);
                    counter++;
                }
            }
        }
        if (args.useoffset && INTERMediator.startFrom !== null) {
            params += '&start=' + encodeURIComponent(INTERMediator.startFrom);
        }
        extCount = 0;
        conditions = [];
        while (args['conditions'] && args['conditions'][extCount]) {
            conditionSign = args['conditions'][extCount]['field'] + '#' +
                args['conditions'][extCount]['operator'] + '#' +
                args['conditions'][extCount]['value'];
            if (!INTERMediator_DBAdapter.eliminateDuplicatedConditions || conditions.indexOf(conditionSign) < 0) {
                params += '&condition' + extCount;
                params += 'field=' + encodeURIComponent(args['conditions'][extCount]['field']);
                params += '&condition' + extCount;
                params += 'operator=' + encodeURIComponent(args['conditions'][extCount]['operator']);
                params += '&condition' + extCount;
                params += 'value=' + encodeURIComponent(args['conditions'][extCount]['value']);
                conditions.push(conditionSign);
            }
            extCount++;
        }
        criteriaObject = INTERMediator.additionalCondition[args['name']];
        if (criteriaObject) {
            if (criteriaObject['field']) {
                criteriaObject = [criteriaObject];
            }
            for (index = 0; index < criteriaObject.length; index++) {
                if (criteriaObject[index] && criteriaObject[index]['field']) {
                    if (criteriaObject[index]['value'] || criteriaObject[index]['field'] == '__operation__') {
                        conditionSign =
                            criteriaObject[index]['field'] + '#' +
                            ((criteriaObject[index]['operator'] !== undefined) ? criteriaObject[index]['operator'] : '') + '#' +
                            ((criteriaObject[index]['value'] !== undefined) ? criteriaObject[index]['value'] : '' );
                        if (!INTERMediator_DBAdapter.eliminateDuplicatedConditions || conditions.indexOf(conditionSign) < 0) {
                            params += '&condition' + extCount;
                            params += 'field=' + encodeURIComponent(criteriaObject[index]['field']);
                            if (criteriaObject[index]['operator'] !== undefined) {
                                params += '&condition' + extCount;
                                params += 'operator=' + encodeURIComponent(criteriaObject[index]['operator']);
                            }
                            if (criteriaObject[index]['value'] !== undefined) {
                                params += '&condition' + extCount;
                                value = criteriaObject[index]['value'];
                                if (Array.isArray(value)) {
                                    value = JSON.stringify(value);
                                }
                                params += 'value=' + encodeURIComponent(value);
                            }
                            if (criteriaObject[index]['field'] != '__operation__') {
                                conditions.push(conditionSign);
                            } else {
                                //conditions = [];
                            }
                        }
                        extCount++;
                    }
                }
                if (criteriaObject[index] && criteriaObject[index]['onetime']) {
                    removeIndice.push = index;
                }
            }
            if (removeIndice.length > 0) {
                modifyConditions = [];
                for (index = 0; index < criteriaObject.length; index++) {
                    if (!(index in removeIndice)) {
                        modifyConditions.push(criteriaObject[index]);
                    }
                }
                INTERMediator.additionalCondition[args['name']] = modifyConditions;
                IMLibLocalContext.archive();
            }
        }

        extCountSort = 0;
        sortkeyObject = INTERMediator.additionalSortKey[args['name']];
        if (sortkeyObject) {
            if (sortkeyObject['field']) {
                sortkeyObject = [sortkeyObject];
            }
            for (index = 0; index < sortkeyObject.length; index++) {
                params += '&sortkey' + extCountSort;
                params += 'field=' + encodeURIComponent(sortkeyObject[index]['field']);
                params += '&sortkey' + extCountSort;
                params += 'direction=' + encodeURIComponent(sortkeyObject[index]['direction']);
                extCountSort++;
            }
        }

        orderFields = {};
        for (key in IMLibLocalContext.store) {
            if (IMLibLocalContext.store.hasOwnProperty(key)) {
                value = String(IMLibLocalContext.store[key]);
                keyParams = key.split(':');
                if (keyParams && keyParams.length > 1 && keyParams[1].trim() == args['name'] && value.length > 0) {
                    if (keyParams[0].trim() == 'condition' && keyParams.length >= 4) {
                        fields = keyParams[2].split(',');
                        operator = keyParams[3].trim();
                        if (fields.length > 1) {
                            params += '&condition' + extCount + 'field=__operation__';
                            params += '&condition' + extCount + 'operator=ex';
                            extCount++;
                            //conditions = [];
                        }
                        for (index = 0; index < fields.length; index++) {
                            conditionSign = fields[index].trim() + '#' + operator + '#' + value;
                            if (!INTERMediator_DBAdapter.eliminateDuplicatedConditions || conditions.indexOf(conditionSign) < 0) {
                                params += '&condition' + extCount + 'field=' + encodeURIComponent(fields[index].trim());
                                params += '&condition' + extCount + 'operator=' + encodeURIComponent(operator);
                                params += '&condition' + extCount + 'value=' + encodeURIComponent(value);
                                conditions.push(conditionSign);
                            }
                            extCount++;
                        }
                    } else if (keyParams[0].trim() == 'valueofaddorder' && keyParams.length >= 4) {
                        orderFields[parseInt(value)] = [keyParams[2].trim(), keyParams[3].trim()];
                    } else if (keyParams[0].trim() == 'limitnumber' && keyParams.length >= 4) {
                        recordLimit = parseInt(value);
                    }
                }
            }
        }
        params += '&records=' + encodeURIComponent(recordLimit);
        orderedKeys = Object.keys(orderFields);
        for (i = 0; i < orderedKeys.length; i++) {
            params += '&sortkey' + extCountSort + 'field=' + encodeURIComponent(orderFields[orderedKeys[i]][0]);
            params += '&sortkey' + extCountSort + 'direction=' + encodeURIComponent(orderFields[orderedKeys[i]][1]);
            extCountSort++;
        }
        return params;
    },

    /*
     db_update
     Update the database. The parameter of this function should be the object as below:

     {   name:<Name of the Context>
     conditions:<the array of the object {field:xx,operator:xx,value:xx} to search records>
     dataset:<the array of the object {field:xx,value:xx}. each value will be set to the field.> }
     */
    db_update: function (args) {
        var params, result;
        if (!INTERMediator_DBAdapter.db_updateChecking(args)) {
            return;
        }
        params = INTERMediator_DBAdapter.db_updateParameters(args);
        result = this.server_access(params, 1013, 1014);
        return result.dbresult;
    },

    db_updateWithAuth: function (args, completion) {
        var returnValue = false;
        INTERMediatorOnPage.retrieveAuthInfo();
        try {
            returnValue = INTERMediator_DBAdapter.db_update(args);
        } catch (ex) {
            if (ex == '_im_requath_request_') {
                if (INTERMediatorOnPage.requireAuthentication) {
                    if (!INTERMediatorOnPage.isComplementAuthData()) {
                        INTERMediatorOnPage.clearCredentials();
                        INTERMediatorOnPage.authenticating(
                            function () {
                                returnValue = INTERMediator_DBAdapter.db_updateWithAuth(args, completion);
                            });
                        return;
                    }
                }
            } else {
                INTERMediator.setErrorMessage(ex, 'EXCEPTION-15');
            }
        }
        completion(returnValue);
    },

    db_updateChecking: function (args) {
        var noError = true, contextDef;

        if (args['name'] === null) {
            INTERMediator.setErrorMessage(INTERMediatorLib.getInsertedStringFromErrorNumber(1007));
            noError = false;
        }
        contextDef = IMLibContextPool.getContextDef(args['name']);
        if (!contextDef['key']) {
            INTERMediator.setErrorMessage(
                INTERMediatorLib.getInsertedStringFromErrorNumber(1045, [args['name']]));
            noError = false;
        }
        if (args['dataset'] === null) {
            INTERMediator.setErrorMessage(INTERMediatorLib.getInsertedStringFromErrorNumber(1011));
            noError = false;
        }
        return noError;
    },

    db_updateParameters: function (args) {
        var params, extCount, counter, index, addedObject;
        params = 'access=update&name=' + encodeURIComponent(args['name']);
        counter = 0;
        if (INTERMediator.additionalFieldValueOnUpdate
            && INTERMediator.additionalFieldValueOnUpdate[args['name']]) {
            addedObject = INTERMediator.additionalFieldValueOnUpdate[args['name']];
            if (addedObject['field']) {
                addedObject = [addedObject];
            }
            for (index in addedObject) {
                if (addedObject.hasOwnProperty(index)) {
                    var oneDefinition = addedObject[index];
                    params += '&field_' + counter + '=' + encodeURIComponent(oneDefinition['field']);
                    params += '&value_' + counter + '=' + encodeURIComponent(oneDefinition['value']);
                    counter++;
                }
            }
        }

        if (args['conditions'] != null) {
            for (extCount = 0; extCount < args['conditions'].length; extCount++) {
                params += '&condition' + extCount + 'field=';
                params += encodeURIComponent(args['conditions'][extCount]['field']);
                params += '&condition' + extCount + 'operator=';
                params += encodeURIComponent(args['conditions'][extCount]['operator']);
                if (args['conditions'][extCount]['value']) {
                    params += '&condition' + extCount + 'value=';
                    params += encodeURIComponent(args['conditions'][extCount]['value']);
                }
            }
        }
        for (extCount = 0; extCount < args['dataset'].length; extCount++) {
            params += '&field_' + (counter + extCount) + '=' + encodeURIComponent(args['dataset'][extCount]['field']);
            if (INTERMediator.isTrident && INTERMediator.ieVersion == 8) {
                params += '&value_' + (counter + extCount) + '=' + encodeURIComponent(args['dataset'][extCount]['value'].replace(/\n/g, ''));
            } else {
                params += '&value_' + (counter + extCount) + '=' + encodeURIComponent(args['dataset'][extCount]['value']);
            }
        }
        return params;
    },

    db_update_async: function (args, successProc, failedProc) {
        var params;
        if (!INTERMediator_DBAdapter.db_updateChecking(args)) {
            return;
        }
        params = INTERMediator_DBAdapter.db_updateParameters(args);
        if (params) {
            INTERMediatorOnPage.retrieveAuthInfo();
            INTERMediator_DBAdapter.server_access_async(
                params,
                1013,
                1014,
                successProc,
                failedProc,
                INTERMediator_DBAdapter.createExceptionFunc(
                    1016,
                    (function () {
                        var argsCapt = args;
                        var succesProcCapt = successProc;
                        var failedProcCapt = failedProc;
                        return function () {
                            INTERMediator_DBAdapter.db_update_async(
                                argsCapt, succesProcCapt, failedProcCapt);
                        };
                    })()
                )
            );
        }
    },

    /*
     db_delete
     Delete the record. The parameter of this function should be the object as below:

     {   name:<Name of the Context>
     conditions:<the array of the object {field:xx,operator:xx,value:xx} to search records, could be null>}
     */
    db_delete: function (args) {
        var params, result;
        if (!INTERMediator_DBAdapter.db_deleteChecking(args)) {
            return;
        }
        params = INTERMediator_DBAdapter.db_deleteParameters(args);
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
            if (ex == '_im_requath_request_') {
                if (INTERMediatorOnPage.requireAuthentication) {
                    if (!INTERMediatorOnPage.isComplementAuthData()) {
                        INTERMediatorOnPage.clearCredentials();
                        INTERMediatorOnPage.authenticating(
                            function () {
                                returnValue = INTERMediator_DBAdapter.db_deleteWithAuth(args, completion);
                            });
                        return;
                    }
                }
            } else {
                INTERMediator.setErrorMessage(ex, 'EXCEPTION-14');
            }
        }
        completion(returnValue);
    },

    db_deleteChecking: function (args) {
        var noError = true, contextDef;

        if (args['name'] === null) {
            INTERMediator.setErrorMessage(INTERMediatorLib.getInsertedStringFromErrorNumber(1019));
            noError = false;
        }
        contextDef = IMLibContextPool.getContextDef(args['name']);
        if (!contextDef['key']) {
            INTERMediator.setErrorMessage(
                INTERMediatorLib.getInsertedStringFromErrorNumber(1045, [args['name']]));
            noError = false;
        }
        if (args['conditions'] === null) {
            INTERMediator.setErrorMessage(INTERMediatorLib.getInsertedStringFromErrorNumber(1020));
            noError = false;
        }
        return noError;
    },

    db_deleteParameters: function (args) {
        var params, i, counter, index, addedObject;
        params = 'access=delete&name=' + encodeURIComponent(args['name']);
        counter = 0;
        if (INTERMediator.additionalFieldValueOnDelete
            && INTERMediator.additionalFieldValueOnDelete[args['name']]) {
            addedObject = INTERMediator.additionalFieldValueOnDelete[args['name']];
            if (addedObject['field']) {
                addedObject = [addedObject];
            }
            for (index in addedObject) {
                if (addedObject.hasOwnProperty(index)) {
                    var oneDefinition = addedObject[index];
                    params += '&field_' + counter + '=' + encodeURIComponent(oneDefinition['field']);
                    params += '&value_' + counter + '=' + encodeURIComponent(oneDefinition['value']);
                    counter++;
                }
            }
        }

        for (i = 0; i < args['conditions'].length; i++) {
            params += '&condition' + i + 'field=' + encodeURIComponent(args['conditions'][i]['field']);
            params += '&condition' + i + 'operator=' + encodeURIComponent(args['conditions'][i]['operator']);
            params += '&condition' + i + 'value=' + encodeURIComponent(args['conditions'][i]['value']);
        }
        return params;
    },

    db_delete_async: function (args, successProc, failedProc) {
        var params;
        if (!INTERMediator_DBAdapter.db_deleteChecking(args)) {
            return;
        }
        params = INTERMediator_DBAdapter.db_deleteParameters(args);
        if (params) {
            INTERMediatorOnPage.retrieveAuthInfo();
            INTERMediator_DBAdapter.server_access_async(
                params,
                1017,
                1015,
                successProc,
                failedProc,
                INTERMediator_DBAdapter.createExceptionFunc(
                    1016,
                    (function () {
                        var argsCapt = args;
                        var succesProcCapt = successProc;
                        var failedProcCapt = failedProc;
                        return function () {
                            INTERMediator_DBAdapter.db_delete_async(
                                argsCapt, succesProcCapt, failedProcCapt);
                        };
                    })()
                )
            );
        }
    },

    /*
     db_createRecord
     Create a record. The parameter of this function should be the object as below:

     {   name:<Name of the Context>
     dataset:<the array of the object {field:xx,value:xx}. Initial value for each field> }

     This function returns the value of the key field of the new record.
     */
    db_createRecord: function (args) {
        var params, result;
        params = INTERMediator_DBAdapter.db_createParameters(args);
        if (params) {
            result = INTERMediator_DBAdapter.server_access(params, 1018, 1016);
            INTERMediator.flushMessage();
            return {
                newKeyValue: result.newRecordKeyValue,
                recordset: result.dbresult
            };
        }
        return false;
    },

    db_createRecordWithAuth: function (args, completion) {
        var returnValue = false;
        INTERMediatorOnPage.retrieveAuthInfo();
        try {
            returnValue = INTERMediator_DBAdapter.db_createRecord(args);
        } catch (ex) {
            if (ex == '_im_requath_request_') {
                if (INTERMediatorOnPage.requireAuthentication) {
                    if (!INTERMediatorOnPage.isComplementAuthData()) {
                        INTERMediatorOnPage.clearCredentials();
                        INTERMediatorOnPage.authenticating(
                            function () {
                                returnValue = INTERMediator_DBAdapter.db_createRecordWithAuth(args, completion);
                            });
                        return;
                    }
                }
            } else {
                INTERMediator.setErrorMessage(ex, 'EXCEPTION-13');
            }
        }
        if (completion) {
            completion(returnValue.newKeyValue);
        }
    },

    db_createRecord_async: function (args, successProc, failedProc) {
        var params = INTERMediator_DBAdapter.db_createParameters(args);
        if (params) {
            INTERMediatorOnPage.retrieveAuthInfo();
                INTERMediator_DBAdapter.server_access_async(
                    params,
                    1018,
                    1016,
                    successProc,
                    failedProc,
                    INTERMediator_DBAdapter.createExceptionFunc(
                        1016,
                        (function () {
                            var argsCapt = args;
                            var succesProcCapt = successProc;
                            var failedProcCapt = failedProc;
                            return function () {
                                INTERMediator_DBAdapter.db_createRecord_async(
                                    argsCapt, succesProcCapt, failedProcCapt);
                            };
                        })()
                    )
                );
        }
    },

    db_createParameters: function (args) {
        var params, i, index, addedObject, counter, targetKey, ds, key, contextDef;

        if (args['name'] === null) {
            INTERMediator.setErrorMessage(INTERMediatorLib.getInsertedStringFromErrorNumber(1021));
            return false;
        }
        contextDef = IMLibContextPool.getContextDef(args['name']);
        if (!contextDef['key']) {
            INTERMediator.setErrorMessage(
                INTERMediatorLib.getInsertedStringFromErrorNumber(1045, [args['name']]));
            return false;
        }
        ds = INTERMediatorOnPage.getDataSources(); // Get DataSource parameters
        targetKey = null;
        for (key in ds) { // Search this table from DataSource
            if (ds.hasOwnProperty(key) && ds[key]['name'] == args['name']) {
                targetKey = key;
                break;
            }
        }
        if (targetKey === null) {
            INTERMediator.setErrorMessage('no targetname :' + args['name']);
            return false;
        }
        params = 'access=create&name=' + encodeURIComponent(args['name']);
        counter = 0;
        if (INTERMediator.additionalFieldValueOnNewRecord
            && INTERMediator.additionalFieldValueOnNewRecord[args['name']]) {
            addedObject = INTERMediator.additionalFieldValueOnNewRecord[args['name']];
            if (addedObject['field']) {
                addedObject = [addedObject];
            }
            for (index in addedObject) {
                if (addedObject.hasOwnProperty(index)) {
                    var oneDefinition = addedObject[index];
                    params += '&field_' + counter + '=' + encodeURIComponent(oneDefinition['field']);
                    params += '&value_' + counter + '=' + encodeURIComponent(oneDefinition['value']);
                    counter++;
                }
            }
        }

        for (i = 0; i < args['dataset'].length; i++) {
            params += '&field_' + counter + '=' + encodeURIComponent(args['dataset'][i]['field']);
            params += '&value_' + counter + '=' + encodeURIComponent(args['dataset'][i]['value']);
            counter++;
        }
        return params;
    },

    /*
     db_copy
     Copy the record. The parameter of this function should be the object as below:
     {
     name: The name of context,
     conditions: [ {
     field: Field name, operator: '=', value: Field Value : of the source record
     }],
     associated: Associated Record info.
     [{name: assocDef['name'], field: fKey, value: fValue}]
     }
     {   name:<Name of the Context>
     conditions:<the array of the object {field:xx,operator:xx,value:xx} to search records, could be null>}
     */
    db_copy: function (args) {
        var params, result;
        params = INTERMediator_DBAdapter.db_copyParameters(args);
        if (params) {
            result = INTERMediator_DBAdapter.server_access(params, 1017, 1015);
            INTERMediator.flushMessage();
            return {
                newKeyValue: result.newRecordKeyValue,
                recordset: result.dbresult
            };
        }
        return false;
    },

    db_copyWithAuth: function (args, completion) {
        var returnValue = false;
        INTERMediatorOnPage.retrieveAuthInfo();
        try {
            returnValue = INTERMediator_DBAdapter.db_copy(args);
        } catch (ex) {
            if (ex == '_im_requath_request_') {
                if (INTERMediatorOnPage.requireAuthentication) {
                    if (!INTERMediatorOnPage.isComplementAuthData()) {
                        INTERMediatorOnPage.clearCredentials();
                        INTERMediatorOnPage.authenticating(
                            function () {
                                returnValue = INTERMediator_DBAdapter.db_copyWithAuth(args, completion);
                            });
                        return;
                    }
                }
            } else {
                INTERMediator.setErrorMessage(ex, 'EXCEPTION-14');
            }
        }
        completion(returnValue);
    },

    db_copy_async: function (args, successProc, failedProc) {
        var params = INTERMediator_DBAdapter.db_copyParameters(args);
        if (params) {
            INTERMediatorOnPage.retrieveAuthInfo();
            INTERMediator_DBAdapter.server_access_async(
                params,
                1017,
                1015,
                successProc,
                failedProc,
                INTERMediator_DBAdapter.createExceptionFunc(
                    1016,
                    (function () {
                        var argsCapt = args;
                        var succesProcCapt = successProc;
                        var failedProcCapt = failedProc;
                        return function () {
                            INTERMediator_DBAdapter.db_copy_async(
                                argsCapt, succesProcCapt, failedProcCapt);
                        };
                    })()
                )
            );
        }
    },

    db_copyParameters: function (args) {
        var noError = true, params, i;

        if (args['name'] === null) {
            INTERMediator.setErrorMessage(INTERMediatorLib.getInsertedStringFromErrorNumber(1019));
            noError = false;
        }
        if (args['conditions'] === null) {
            INTERMediator.setErrorMessage(INTERMediatorLib.getInsertedStringFromErrorNumber(1020));
            noError = false;
        }
        if (!noError) {
            return false;
        }

        params = 'access=copy&name=' + encodeURIComponent(args['name']);
        for (i = 0; i < args['conditions'].length; i++) {
            params += '&condition' + i + 'field=' + encodeURIComponent(args['conditions'][i]['field']);
            params += '&condition' + i + 'operator=' + encodeURIComponent(args['conditions'][i]['operator']);
            params += '&condition' + i + 'value=' + encodeURIComponent(args['conditions'][i]['value']);
        }
        if (args['associated']) {
            for (i = 0; i < args['associated'].length; i++) {
                params += '&assoc' + i + '=' + encodeURIComponent(args['associated'][i]['name']);
                params += '&asfield' + i + '=' + encodeURIComponent(args['associated'][i]['field']);
                params += '&asvalue' + i + '=' + encodeURIComponent(args['associated'][i]['value']);
            }
        }
        return params;
    },

    createExceptionFunc: function (errMessageNumber, AuthProc) {
        var errorNumCapt = errMessageNumber;
        return function (myRequest) {
            if (INTERMediatorOnPage.requireAuthentication) {
                if (!INTERMediatorOnPage.isComplementAuthData()) {
                    INTERMediatorOnPage.clearCredentials();
                    INTERMediatorOnPage.authenticating(AuthProc);
                }
            } else {
                INTERMediator.setErrorMessage('Communication Error',
                    INTERMediatorLib.getInsertedString(
                        INTERMediatorOnPage.getMessages()[errorNumCapt],
                        ['Communication Error', myRequest.responseText]));
            }
        };
    },

    unregister: function (entityPkInfo) {
        var result = null, params;
        if (INTERMediatorOnPage.clientNotificationKey) {
            var appKey = INTERMediatorOnPage.clientNotificationKey();
            if (appKey && appKey != '_im_key_isnt_supplied') {
                params = 'access=unregister';
                if (entityPkInfo) {
                    params += '&pks=' + encodeURIComponent(JSON.stringify(entityPkInfo));
                }
                result = this.server_access(params, 1018, 1016);
                return result;
            }
        }
    }
};
/*
 Based on ndef.parser, by Raphael Graf(r@undefined.ch)
 http://www.undefined.ch/mparser/index.html

 Ported to JavaScript and modified by Matthew Crumley (email@matthewcrumley.com, http://silentmatt.com/)

 You are free to use and modify this code in anyway you find useful. Please leave this comment in the code
 to acknowledge its original source. If you feel like it, I enjoy hearing about projects that use my code,
 but don't feel like you have to let me know or ask permission.
 */
/*
 * INTER-Mediator
 * Copyright (c) INTER-Mediator Directive Committee (http://inter-mediator.org)
 * This project started at the end of 2009 by Masayuki Nii msyk@msyk.net.
 *
 * INTER-Mediator is supplied under MIT License.
 * Please see the full license for details:
 * https://github.com/INTER-Mediator/INTER-Mediator/blob/master/dist-docs/License.txt
 */

var Parser = (function (scope) {
    var TNUMBER = 0;
    var TOP1 = 1;
    var TOP2 = 2;
    var TOP3 = 5;
    var SEP = 65;
    var TVAR = 3;
    var TFUNCALL = 4;

    Parser.regFirstVarChar = new RegExp('[\u00A0-\u1FFF\u2C00-\uDFFFa-zA-Z@_]');
    Parser.regRestVarChar = new RegExp('[\u00A0-\u1FFF\u2C00-\uDFFFa-zA-Z@_0-9]');

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
                return 'CALL';
            case SEP:
                return 'SEPARATOR';
            default:
                return 'Invalid Token';
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
        '\b': IMLib.backSlash_char + 'b',
        '\t': IMLib.backSlash_char + 't',
        '\n': IMLib.backSlash_char + 'n',
        '\f': IMLib.backSlash_char + 'f',
        '\r': IMLib.backSlash_char + 'r',
        '\'': IMLib.backSlash_char + IMLib.singleQuote_char,
        '\\': IMLib.backSlash_char + IMLib.backSlash_char
    };

    function escapeValue(v) {
        if (typeof v === 'string') {
            escapable.lastIndex = 0;
            return escapable.test(v) ?
            IMLib.singleQuote_char + v.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + IMLib.singleQuote_char :
            IMLib.singleQuote_char + v + IMLib.singleQuote_char;
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
            return new Expression(newexpression);
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
                        throw new Error('undefined variable: ' + item.index_);
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
                        if (Object.prototype.toString.call(n1) == '[object Array]') {
                            nstack.push(f.apply(undefined, n1));
                        } else {
                            nstack.push(f.call(undefined, n1));
                        }
                    }
                    else {
                        throw new Error(f + ' is not a function');
                    }
                }
                else {
                    throw new Error('invalid Expression');
                }
            }
            if (nstack.length > 1) {
                throw new Error('invalid Expression (parity)');
            }
            return nstack[0];
        },

        variables: function () {
            var L = this.tokens.length;
            var vars = [];
            for (var i = 0; i < L; i++) {
                var item = this.tokens[i];
                if (item.type_ === TVAR && (vars.indexOf(item.index_) == -1) && !(item.index_ in Parser.functions)) {
                    vars.push(item.index_);
                }
            }
            return vars;
        }
    };

    function iff(a, b, c) {
        var vala, valb, valc;
        vala = (a instanceof Array) ? arguments[0][0] : arguments[0];
        valb = (b instanceof Array) ? arguments[1][0] : arguments[1];
        valc = (c instanceof Array) ? arguments[2][0] : arguments[2];
        return vala ? valb : valc;
    }

    function greaterthan(a, b) {
        var numa, numb;
        numa = toNumber(a);
        numb = toNumber(b);
        if (!isNaN(numa) && !isNaN(numa)) {
            return Number(numa) > Number(numb);
        }
        return a > b;
    }

    function lessthan(a, b) {
        var numa, numb;
        numa = toNumber(a);
        numb = toNumber(b);
        if (!isNaN(numa) && !isNaN(numa)) {
            return Number(numa) < Number(numb);
        }
        return a < b;
    }

    function greaterequal(a, b) {
        var numa, numb;
        numa = toNumber(a);
        numb = toNumber(b);
        if (!isNaN(numa) && !isNaN(numa)) {
            return Number(numa) >= Number(numb);
        }
        return a >= b;
    }

    function lessequal(a, b) {
        var numa, numb;
        numa = toNumber(a);
        numb = toNumber(b);
        if (!isNaN(numa) && !isNaN(numa)) {
            return Number(numa) <= Number(numb);
        }
        return a <= b;
    }

    function equal(a, b) {
        var numa, numb;
        numa = toNumber(a);
        numb = toNumber(b);
        if (!isNaN(numa) && !isNaN(numa)) {
            return Number(numa) == Number(numb);
        }
        return a == b;
    }

    function notequal(a, b) {
        var numa, numb;
        numa = toNumber(a);
        numb = toNumber(b);
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
        var numa, numb;
        if ((typeof a) == "string" || (typeof b) == "string") {
            return addstring(a, b);
        }
        if (isReallyNaN(a) || isReallyNaN(b)) {
            return NaN;
        }
        numa = toNumber(a);
        numb = toNumber(b);
        if (!isNaN(numa) && !isNaN(numb)) {
            return Number(numa) + Number(numb);
        }
        return a + b;
    }

    function addstring(a, b) {
        return String(a) + String(b);
    }

    function sub(a, b) {
        var numa, numb, str, pos;
        if (isReallyNaN(a) || isReallyNaN(b)) {
            return NaN;
        }
        numa = toNumber(a);
        numb = toNumber(b);

        if (!isNaN(numa) && !isNaN(numb)) {
            return numa - numb;   // Numeric substruct
        }
        str = String(a);
        do {  // String substruct
            pos = str.indexOf(b);
            if (pos > -1) {
                str = str.substr(0, pos) + str.substr(pos + b.length);
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
        a = toNumber(a);
        return !a;
    }

    function logicaland(a, b) {
        a = toNumber(a);
        b = toNumber(b);
        return a && b;
    }

    function logicalor(a, b) {
        a = toNumber(a);
        b = toNumber(b);
        return a || b;
    }

    function sumfunc() {
        var result = 0, i;
        for (i = 0; i < arguments.length; i++) {
            result += toNumber(arguments[i]);
        }
        return result;
    }

    function averagefunc() {
        var result = 0, i, count = 0;

        for (i = 0; i < arguments.length; i++) {
            result += toNumber(arguments[i]);
            count++;
        }
        return result / count;
    }

    function listfunc() {
        var result = IMLib.zerolength_str, i;

        for (i = 0; i < arguments.length; i++) {
            result += String(arguments[i]);
            result += IMLib.nl_char;
        }
        return result;
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
    function toNumber(str) {
        var value;

        if (str === undefined) {
            return NaN;
        }
        if (str === true) {
            return true;
        }
        if (str === false) {
            return false;
        }
        if (str == IMLib.zerolength_str) {
            return 0;
        }
        value = str;
        if (INTERMediatorLib.is_array(str)) {
            if (str.length < 1) {
                return 0;
            } else {
                value = str[0];
            }
        }
        value = unformat(value);
        return value;
    }

    /* ===== private ===== */

    // TODO: use hypot that doesn't overflow
    function pyt(a, b) {
        return Math.sqrt(a * a + b * b);
    }

    function append(a, b) {
        if (Object.prototype.toString.call(a) != '[object Array]') {
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
        var stra, strb, arraya, arrayb, i, nls, nl = IMLib.nl_char;
        stra = (a instanceof Array) ? a.join() : a;
        nls = [
            stra.indexOf(IMLib.crlf_str),
            stra.indexOf(IMLib.cr_char), stra.indexOf(IMLib.nl_char)
        ];
        for (i = 0; i < nls.length; i++) {
            nls[i] = (nls[i] < 0) ? stra.length : nls[i];
        }
        if (nls[0] < stra.length && nls[0] <= nls[1] && nls[0] < nls[2]) {
            nl = IMLib.crlf_str;
        } else if (nls[1] < stra.length && nls[1] < nls[0] && nls[1] < nls[2]) {
            nl = IMLib.cr_char;
        }
        arraya = stra.replace(IMLib.crlf_str, IMLib.nl_char)
            .replace(IMLib.cr_char, IMLib.nl_char).split(IMLib.nl_char);
        strb = (b instanceof Array) ? b.join() : b;
        arrayb = strb.replace(IMLib.crlf_str, IMLib.nl_char)
            .replace(IMLib.cr_char, IMLib.nl_char).split(IMLib.nl_char);
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

    function itemIndexOfFunc(list, str) {
        if (!list) {
            return -1;
        }
        var a = list.replace(IMLib.crlf_str, IMLib.nl_char).replace(IMLib.cr_char, IMLib.nl_char);
        var ix = 0;
        var item, pos;
        while (a.length > 0) {
            pos = a.indexOf(IMLib.nl_char);
            if (pos > -1) {
                item = a.substr(0, pos);
                a = a.substr(pos + 1);
            } else {
                item = a;
                a = IMLib.zerolength_str;
            }
            if (item == str) {
                return ix;
            }
            ix++;
        }
        return -1;
    }

    function numberformat(val, digit) {
        var stra, strb;
        stra = (val instanceof Array) ? val.join() : val;
        strb = (digit instanceof Array) ? digit.join() : digit;
        return INTERMediatorLib.numberFormat(stra, strb);
    }

    function substr(str, pos, len) {
        var stra, p, l;
        if (str == null) {
            return null;
        }
        stra = (str instanceof Array) ? str.join() : str;
        p = (pos instanceof Array) ? pos.join() : pos;
        l = (len instanceof Array) ? len.join() : len;

        return stra.substr(p, l);
    }

    function substring(str, start, end) {
        var stra, s, e;
        if (str == null) {
            return null;
        }
        stra = (str instanceof Array) ? str.join() : str;
        s = (start instanceof Array) ? start.join() : start;
        e = (end instanceof Array) ? end.join() : end;

        return stra.substring(s, e);
    }

    function leftstring(str, start) {
        var stra, s;
        if (str == null) {
            return null;
        }
        stra = String((str instanceof Array) ? str.join() : str);
        s = parseInt((start instanceof Array) ? start.join() : start);

        return stra.substring(0, s);
    }


    function midstring(str, start, end) {
        var stra, s, e;
        if (str == null) {
            return null;
        }
        stra = String((str instanceof Array) ? str.join() : str);
        s = parseInt((start instanceof Array) ? start.join() : start);
        e = parseInt((end instanceof Array) ? end.join() : end);

        return stra.substr(s, e);
    }

    function rightstring(str, start) {
        var stra, s;
        if (str == null) {
            return null;
        }
        stra = String((str instanceof Array) ? str.join() : str);
        s = parseInt((start instanceof Array) ? start.join() : start);

        return stra.substring(stra.length - s);
    }

    function indexof(str, search, from) {
        var stra, s;
        if (str == null) {
            return null;
        }
        stra = (str instanceof Array) ? str.join() : str;
        s = (search instanceof Array) ? search.join() : search;
        if (from == undefined) {
            return stra.indexOf(s);
        }
        return stra.indexOf(s, from);

    }

    function lastindexof(str, search, from) {
        var stra, s;
        if (str == null) {
            return null;
        }
        stra = (str instanceof Array) ? str.join() : str;
        s = (search instanceof Array) ? search.join() : search;
        if (from == undefined) {
            return stra.lastIndexOf(s);
        }
        return stra.lastIndexOf(s, from);

    }

    function replace(str, start, end, rep) {
        var stra, s, e, r;
        if (str == null) {
            return null;
        }
        stra = (str instanceof Array) ? str.join() : str;
        s = (start instanceof Array) ? start.join() : start;
        e = (end instanceof Array) ? end.join() : end;
        r = (rep instanceof Array) ? rep.join() : rep;
        return stra.substr(0, s) + r + stra.substr(e);
    }

    function substitute(str, search, rep) {
        var stra, s, r, reg;
        if (str == null) {
            return null;
        }
        stra = (str instanceof Array) ? str.join() : str;
        s = (search instanceof Array) ? search.join() : search;
        r = (rep instanceof Array) ? rep.join() : rep;
        reg = new RegExp(s, 'g');
        return stra.replace(reg, r);
    }

    function match(str, pattern) {
        var stra, p;
        stra = (str instanceof Array) ? str.join() : str;
        p = (pattern instanceof Array) ? pattern.join() : pattern;
        return stra.match(new RegExp(p));
    }

    function test(str, pattern) {
        var stra, p;
        if (str == null) {
            return null;
        }
        stra = (str instanceof Array) ? str.join() : str;
        p = (pattern instanceof Array) ? pattern.join() : pattern;
        return (new RegExp(p)).test(stra);
    }

    Parser.timeOffset = (new Date()).getTimezoneOffset();

    function DateInt(str) {
        var theDate;
        if (str === undefined) {
            theDate = Date.now();
        } else {
            theDate = Date.parse(str.replace(/-/g, '/'));
            theDate -= Parser.timeOffset * 60000;
        }
        return parseInt(theDate / 86400000);
    }

    function SecondInt(str) {
        var theDate;
        if (str === undefined) {
            theDate = Date.now();
        } else {
            theDate = Date.parse(str.replace(/-/g, '/'));
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

    function datecomponents(y, m, d) {
        var m0 = m - 1;
        if (m0 < 0 || m0 > 11) {
            y += parseInt(m0 / 12);
            m = m0 % 12 + 1;
        }
        //var str = parseInt(y) + '/' + ('0' + parseInt(m)).substr(-2, 2) + '/01';
        return parseInt(Date.UTC(y, m - 1, d, 0, 0, 0) / 86400000);
    }

    function datetimecomponents(y, m, d, h, i, s) {
        if (s < 0 || s > 59) {
            i += parseInt(s / 60);
            s = s % 60;
        }
        if (i < 0 || i > 59) {
            h += parseInt(i / 60);
            i = i % 60;
        }
        if (h < 0 || h > 23) {
            d += parseInt(h / 24);
            h = h % 24;
        }
        var m0 = m - 1;
        if (m0 < 0 || m0 > 11) {
            y += parseInt(m0 / 12);
            m = m0 % 12 + 1;
        }
        //var str = parseInt(y) + '/' + ('0' + parseInt(m)).substr(-2, 2) + '/01 ' +
        //    ('0' + parseInt(h)).substr(-2, 2) + ':' + ('0' + parseInt(i)).substr(-2, 2) + ':' +
        //    ('0' + parseInt(s)).substr(-2, 2);
        return Date.UTC(y, m - 1, d, h, i, s) / 1000;
    }

    function yearAlt(d) {
        return INTERMediator.dateTimeFunction ? yeardt(d) : yeard(d);
    }

    function monthAlt(d) {
        return INTERMediator.dateTimeFunction ? monthdt(d) : monthd(d);
    }

    function dayAlt(d) {
        return INTERMediator.dateTimeFunction ? daydt(d) : dayd(d);
    }

    function weekdayAlt(d) {
        return INTERMediator.dateTimeFunction ? weekdaydt(d) : weekdayd(d);
    }

    function hourAlt(d) {
        return INTERMediator.dateTimeFunction ? hourdt(d) : 0;
    }

    function minuteAlt(d) {
        return INTERMediator.dateTimeFunction ? minutedt(d) : 0;
    }

    function secondAlt(d) {
        return INTERMediator.dateTimeFunction ? seconddt(d) : 0;
    }

    function yeard(d) {
        return new Date(dvalue(d) * 86400000).getFullYear();
    }

    function monthd(d) {
        return new Date(dvalue(d) * 86400000).getMonth() + 1;
    }

    function dayd(d) {
        return new Date(dvalue(d) * 86400000).getDate();
    }

    function weekdayd(d) {
        return new Date(dvalue(d) * 86400000).getDay();
    }

    function yeardt(dt) {
        return new Date(dtvalue(dt) * 1000).getFullYear();
    }

    function monthdt(dt) {
        return new Date(dtvalue(dt) * 1000).getMonth() + 1;
    }

    function daydt(dt) {
        return new Date(dtvalue(dt) * 1000).getDate();
    }

    function weekdaydt(dt) {
        return new Date(dtvalue(dt) * 1000).getDay();
    }

    function hourdt(dt) {
        return new Date(dtvalue(dt) * 1000).getHours();
    }

    function minutedt(dt) {
        return new Date(dtvalue(dt) * 1000).getMinutes();
    }

    function seconddt(dt) {
        return new Date(dtvalue(dt) * 1000).getSeconds();
    }

    function addyear(d, a) {
        return INTERMediator.dateTimeFunction ? addyeardt(d, a) : addyeard(d, a);
    }

    function addmonth(d, a) {
        return INTERMediator.dateTimeFunction ? addmonthdt(d, a) : addmonthd(d, a);
    }

    function addday(d, a) {
        return INTERMediator.dateTimeFunction ? adddaydt(d, a) : adddayd(d, a);
    }

    function addhour(d, a) {
        return INTERMediator.dateTimeFunction ? addhourdt(d, a) : NaN;
    }

    function addminute(d, a) {
        return INTERMediator.dateTimeFunction ? addminutedt(d, a) : NaN;
    }

    function addsecond(d, a) {
        return INTERMediator.dateTimeFunction ? addseconddt(d, a) : NaN;
    }

    function addyeard(d, a) {
        return calcDateComponent(d, a, 0);
    }

    function addmonthd(d, a) {
        return calcDateComponent(d, a, 1);
    }

    function adddayd(d, a) {
        return calcDateComponent(d, a, 2);
    }

    function addyeardt(dt, a) {
        return calcDateTimeComponent(dt, a, 0);
    }

    function addmonthdt(dt, a) {
        return calcDateTimeComponent(dt, a, 1);
    }

    function adddaydt(dt, a) {
        return calcDateTimeComponent(dt, a, 2);
    }

    function addhourdt(dt, a) {
        return calcDateTimeComponent(dt, a, 3);
    }

    function addminutedt(dt, a) {
        return calcDateTimeComponent(dt, a, 4);
    }

    function addseconddt(dt, a) {
        return calcDateTimeComponent(dt, a, 5);
    }

    function endofmonth(d) {
        return INTERMediator.dateTimeFunction ? endofmonthdt(d) : endofmonthd(d);
    }

    function endofmonthd(d) {
        return adddayd(addmonthd(startofmonthd(d), 1), -1);
    }

    function endofmonthdt(dt) {
        return addseconddt(addmonthdt(startofmonthdt(dt), 1), -1);
    }

    function startofmonth(d) {
        return INTERMediator.dateTimeFunction ? startofmonthdt(d) : startofmonthd(d);
    }

    function startofmonthd(d) {
        var str = yeard(d) + '/' + ('0' + monthd(d)).substr(-2, 2) + '/01';
        return DateInt(str);
    }

    function startofmonthdt(dt) {
        var str = yeardt(dt) + '/' + ('0' + monthdt(dt)).substr(-2, 2) + '/01 00:00:00';
        return SecondInt(str);
    }

    function today() {
        return parseInt(Date.now() / 86400);
    }

    function nowFunction() {
        return parseInt(Date.now() / 1000);
    }

    function unformat(value) {
        var valueString, numberString, i, c;
        valueString = String(value);
        numberString = IMLib.zerolength_str;
        for (i = 0; i < valueString.length; i++) {
            c = valueString.substr(i, 1);
            if (c >= '0' && c <= '9') {
                numberString += c;
            } else if (c >= '０' && c <= '９') {
                numberString += c;
            } else if (c == '.' || c == '-') {
                numberString += c;
            }
        }
        return parseFloat(numberString);
    }

    function choiceFunc() {
        var index;
        if (arguments[0] == null || arguments[0] == undefined) {
            return arguments[0];
        }
        index = parseInt(arguments[0]);
        if (index < 0 || index >= (arguments.length - 1)) {
            return undefined;
        }
        return arguments[index + 1];
    }

    function conditionFunc() {
        var index;
        for (index = 0; index < arguments.length; index += 2) {
            if (arguments[index] == true && index + 1 < arguments.length) {
                return arguments[index + 1];
            }
        }
        return undefined;
    }

    function accumulateFunc() {
        var index, c = '';
        for (index = 0; index < arguments.length; index += 2) {
            if (arguments[index] == true && index + 1 < arguments.length) {
                c = c + arguments[index + 1] + '\n';
            }
        }
        return c;
    }

    function Parser() {
        this.success = false;
        this.errormsg = IMLib.zerolength_str;
        this.expression = IMLib.zerolength_str;

        this.pos = 0;

        this.tokennumber = 0;
        this.tokenprio = 0;
        this.tokenindex = 0;
        this.tmpprio = 0;

        Parser.functions = {
            'random': random,
            'fac': fac,
            'min': Math.min,
            'max': Math.max,
            'pyt': pyt,
            'pow': Math.pow,
            'atan2': Math.atan2,
            'if': iff,
            'sum': sumfunc,
            'average': averagefunc,
            'list': listfunc,
            'format': numberformat,
            'substr': substr,
            'substring': substring,
            'indexof': indexof,
            'lastindexof': lastindexof,
            'replace': replace,
            'substitute': substitute,
            'match': match,
            'test': test,
            'sin': Math.sin,
            'cos': Math.cos,
            'tan': Math.tan,
            'asin': Math.asin,
            'acos': Math.acos,
            'atan': Math.atan,
            'sqrt': Math.sqrt,
            'log': Math.log,
            'abs': Math.abs,
            'ceil': Math.ceil,
            'floor': Math.floor,
            'round': roundfunc,
            'exp': Math.exp,
            'items': itematindex,
            'length': length,
            'datetime': SecondInt,
            'date': DateInt,
            'datecomponents': datecomponents,
            'datetimecomponents': datetimecomponents,
            'year': yearAlt,
            'month': monthAlt,
            'day': dayAlt,
            'weekday': weekdayAlt,
            'hour': hourAlt,
            'minute': minuteAlt,
            'second': secondAlt,
            'yeard': yeard,
            'monthd': monthd,
            'dayd': dayd,
            'weekdayd': weekdayd,
            'yeardt': yeardt,
            'monthdt': monthdt,
            'daydt': daydt,
            'weekdaydt': weekdaydt,
            'hourdt': hourdt,
            'minutedt': minutedt,
            'seconddt': seconddt,
            'addyear': addyear,
            'addmonth': addmonth,
            'addday': addday,
            'addhour': addhour,
            'addminute': addminute,
            'addsecond': addsecond,
            'addyeard': addyeard,
            'addmonthd': addmonthd,
            'adddayd': adddayd,
            'addyeardt': addyeardt,
            'addmonthdt': addmonthdt,
            'adddaydt': adddaydt,
            'addhourdt': addhourdt,
            'addminutedt': addminutedt,
            'addseconddt': addseconddt,
            'endofmonth': endofmonth,
            'startofmonth': startofmonth,
            'endofmonthd': endofmonthd,
            'startofmonthd': startofmonthd,
            'endofmonthdt': endofmonthdt,
            'startofmonthdt': startofmonthdt,
            'today': today,
            'now': nowFunction,
            'right': rightstring,
            'mid': midstring,
            'left': leftstring,
            'itemIndexOf': itemIndexOfFunc,
            'choice': choiceFunc,
            'condition': conditionFunc,
            'accumulate': accumulateFunc
        };

        this.consts = {
            'E': Math.E,
            'PI': Math.PI
        };

        Parser.operators = {
            //    '-': [1, neg, 2], The minus operatior should be specially handled.
            '!': [1, logicalnot, 2],
            '+': [2, add, 4],
            '⊕': [2, addstring, 4],
            '-': [2, sub, 4],
            '*': [2, mul, 3],
            '/': [2, div, 3],
            '%': [2, mod, 3],
            '^': [2, Math.pow, 1],
            ',': [2, append, 15],
            '>': [2, greaterthan, 6],
            '<': [2, lessthan, 6],
            '>=': [2, greaterequal, 6],
            '<=': [2, lessequal, 6],
            '==': [2, equal, 7],
            '=': [2, equal, 7],
            '!=': [2, notequal, 7],
            '<>': [2, notequal, 7],
            '&&': [2, logicaland, 11],
            '||': [2, logicalor, 12],
            '∩': [2, charsetand, 3],
            '∪': [2, charsetor, 4],
            '⊁': [2, charsetnoother, 4],
            '⋀': [2, itemsetand, 3],
            '⋁': [2, itemsetor, 4],
            '⊬': [2, itemsetnoother, 4],
            '?': [2, iff, 13],
            ':': [4, iff, 13]
        };

        Parser.ops1 = {
            '-': neg//,   // The minus operatior should be specially handled.
        };
        Parser.ops2 = {};
        Parser.ops3 = {};
        Parser.ops3Trail = {};

        for (var op in Parser.operators) {
            if (Parser.operators.hasOwnProperty(op)) {
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

    }

    Parser.parse = function (expr) {
        return new Parser().parse(expr);
    };

    Parser.evaluate = function (expr, variables) {
        var result;
        result = Parser.parse(expr).evaluate(variables);

        //console.log(expr, variables);
        //console.log('result=', result);

        return result;
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
            this.errormsg = IMLib.zerolength_str;
            this.success = true;
            var operstack = [];
            var tokenstack = [];
            this.tmpprio = 0;
            var expected = (PRIMARY | LPAREN | FUNCTION | SIGN);
            var noperators = 0;
            this.expression = expr;
            this.pos = 0;
            var funcstack = [], token;

            while (this.pos < this.expression.length) {
                if (this.isOperator()) {
                    if (this.isSign() && (expected & SIGN)) {
                        if (this.isNegativeSign()) {
                            this.tokenprio = 2;
                            this.tokenindex = '-';
                            noperators++;
                            this.addfunc(tokenstack, operstack, TOP1);
                        }
                        expected = (PRIMARY | LPAREN | FUNCTION | SIGN);
                    }
                    else if (this.isComment()) {
                        // do nothing
                    }
                    else {
                        if ((expected & OPERATOR) === 0) {
                            this.error_parsing(this.pos, 'unexpected operator');
                        }
                        if (this.tokenindex == '?') {
                            this.tmpprio -= 40;
                            this.tokenindex = 'if';
                            this.addfunc(tokenstack, operstack, TOP2);
                            this.tmpprio += 40;
                            this.tokenindex = ',';
                            noperators += 3;
                            this.addfunc(tokenstack, operstack, TOP2);
                        } else if (this.tokenindex == ':') {
                            this.tokenindex = ',';
                            noperators += 2;
                            this.addfunc(tokenstack, operstack, TOP2);
                        } else /* if (this.tokenindex != ',') */ {
                            noperators += 2;
                            this.addfunc(tokenstack, operstack, TOP2);
                        }
                        expected = (PRIMARY | LPAREN | FUNCTION | SIGN);
                    }
                }
                else if (this.isNumber()) {
                    if ((expected & PRIMARY) === 0) {
                        this.error_parsing(this.pos, 'unexpected number');
                    }
                    token = new Token(TNUMBER, 0, 0, this.tokennumber);
                    tokenstack.push(token);

                    expected = (OPERATOR | RPAREN | COMMA);
                }
                else if (this.isString()) {
                    if ((expected & PRIMARY) === 0) {
                        this.error_parsing(this.pos, 'unexpected string');
                    }
                    token = new Token(TNUMBER, 0, 0, this.tokennumber);
                    tokenstack.push(token);

                    expected = (OPERATOR | RPAREN | COMMA);
                }
                else if (this.isLeftParenth()) {
                    if ((expected & LPAREN) === 0) {
                        this.error_parsing(this.pos, 'unexpected \'(\"');
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
                        token = new Token(TNUMBER, 0, 0, []);
                        tokenstack.push(token);
                    }
                    else if ((expected & RPAREN) === 0) {
                        this.error_parsing(this.pos, 'unexpected \")\"');
                    }

                    expected = (OPERATOR | RPAREN | COMMA | LPAREN | CALL);
                }
                else if (this.isConst()) {
                    if ((expected & PRIMARY) === 0) {
                        this.error_parsing(this.pos, 'unexpected constant');
                    }
                    var consttoken = new Token(TNUMBER, 0, 0, this.tokennumber);
                    tokenstack.push(consttoken);
                    expected = (OPERATOR | RPAREN | COMMA);
                }
                else if (this.isVar()) {
                    if ((expected & PRIMARY) === 0) {
                        this.error_parsing(this.pos, 'unexpected variable');
                    }
                    var vartoken = new Token(TVAR, this.tokenindex, 0, 0);
                    tokenstack.push(vartoken);
                    expected = (OPERATOR | RPAREN | COMMA | LPAREN | CALL);
                }
                else if (this.isWhite()) {
                    // do nothing
                }
                else {
                    if (this.errormsg === IMLib.zerolength_str) {
                        this.error_parsing(this.pos, 'unknown character');
                    }
                    else {
                        this.error_parsing(this.pos, this.errormsg);
                    }
                }
            }
            if (this.tmpprio < 0 || this.tmpprio >= 10) {
                this.error_parsing(this.pos, 'unmatched \"()\"');
            }
            while (operstack.length > 0) {
                var tmp = operstack.pop();
                tokenstack.push(tmp);
            }
//            if (noperators + 1 !== tokenstack.length) {
//                this.error_parsing(this.pos, 'parity');
//            }

            return new Expression(tokenstack);
        },

        evaluate: function (expr, variables) {
            var result;
            this.parse(expr).evaluate(variables);
            return result;
        },

        error_parsing: function (column, msg) {
            this.success = false;
            this.errormsg = 'parse error [column ' + (column) + ']: ' + msg;
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
            var str = IMLib.zerolength_str;
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
                    case IMLib.singleQuote_char:
                        buffer.push(IMLib.singleQuote_char);
                        break;
                    case IMLib.backSlash_char:
                        buffer.push(IMLib.backSlash_char);
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
                        buffer.push(IMLib.nl_char);
                        break;
                    case 'r':
                        buffer.push(IMLib.cr_char);
                        break;
                    case 't':
                        buffer.push(IMLib.tab_char);
                        break;
                    case 'u':
                        // interpret the following 4 characters as the hex of the unicode code point
                        var codePoint = parseInt(v.substring(i + 1, i + 5), 16);
                        buffer.push(String.fromCharCode(codePoint));
                        i += 4;
                        break;
                    default:
                        throw this.error_parsing(pos + i, 'Illegal escape sequence: \'\\' + c + IMLib.singleQuote_char);
                    }
                    escaping = false;
                } else {
                    if (c == IMLib.backSlash_char) {
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
            var str = IMLib.zerolength_str;
            var startpos = this.pos;
            if (this.pos < this.expression.length && this.expression.charAt(this.pos) == IMLib.singleQuote_char) {
                this.pos++;
                while (this.pos < this.expression.length) {
                    var code = this.expression.charAt(this.pos);
                    if (code != IMLib.singleQuote_char || str.slice(-1) == IMLib.backSlash_char) {
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
            var str, i;
            for (i in this.consts) {
                if (this.consts.hasOwnProperty(i)) {
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
                this.tokenindex = ',';
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
            var str = IMLib.zerolength_str;
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
                this.pos = this.expression.indexOf('*/', this.pos) + 2;
                if (this.pos === 1) {
                    this.pos = this.expression.length;
                }
                return true;
            }
            return false;
        }
    };

    scope.Parser = Parser;
    return Parser;
})(typeof exports === 'undefined' ? {} : exports);
/*
 * INTER-Mediator
 * Copyright (c) INTER-Mediator Directive Committee (http://inter-mediator.org)
 * This project started at the end of 2009 by Masayuki Nii msyk@msyk.net.
 *
 * INTER-Mediator is supplied under MIT License.
 * Please see the full license for details:
 * https://github.com/INTER-Mediator/INTER-Mediator/blob/master/dist-docs/License.txt
 */

/*
 This source file should be described statements to execute on the loading time of header's script tag.
 */

INTERMediator.propertyIETridentSetup();
INTERMediator.propertyW3CUserAgentSetup();

if (INTERMediator.isIE && INTERMediator.ieVersion < 9) {
    INTERMediator.startFrom = 0;
    INTERMediator.pagedSize = 0;
    INTERMediator.pagination = false;
    INTERMediator.additionalCondition = {};
    INTERMediator.additionalSortKey = {};
    IMLibCalc.regexpForSeparator = INTERMediator.separator;
} else {
    Object.defineProperty(INTERMediator, 'startFrom', {
        get: function () {
            return INTERMediator.getLocalProperty('_im_startFrom', 0);
        },
        set: function (value) {
            INTERMediator.setLocalProperty('_im_startFrom', value);
        }
    });
    Object.defineProperty(INTERMediator, 'pagedSize', {
        get: function () {
            return INTERMediator.getLocalProperty('_im_pagedSize', 0);
        },
        set: function (value) {
            INTERMediator.setLocalProperty('_im_pagedSize', value);
        }
    });
    Object.defineProperty(INTERMediator, 'pagination', {
        get: function () {
            return INTERMediator.getLocalProperty('_im_pagination', 0);
        },
        set: function (value) {
            INTERMediator.setLocalProperty('_im_pagination', value);
        }
    });
    Object.defineProperty(INTERMediator, 'additionalCondition', {
        get: function () {
            return INTERMediator.getLocalProperty('_im_additionalCondition', {});
        },
        set: function (value) {
            INTERMediator.setLocalProperty('_im_additionalCondition', value);
        }
    });
    Object.defineProperty(INTERMediator, 'additionalSortKey', {
        get: function () {
            return INTERMediator.getLocalProperty('_im_additionalSortKey', {});
        },
        set: function (value) {
            INTERMediator.setLocalProperty('_im_additionalSortKey', value);
        }
    });
    Object.defineProperty(IMLibCalc, 'regexpForSeparator', {
        get: function () {
            if (INTERMediator) {
                return new RegExp(INTERMediator.separator);
            }
            return new RegExp('@');
        }
    });
}

if (!INTERMediator.additionalCondition) {
    INTERMediator.additionalCondition = {};
}

if (!INTERMediator.additionalSortKey) {
    INTERMediator.additionalSortKey = {};
}

INTERMediatorLib.addEvent(window, 'beforeunload', function (e) {
//    var confirmationMessage = '';

//    (e || window.event).returnValue = confirmationMessage;     //Gecko + IE
//    return confirmationMessage;                                //Webkit, Safari, Chrome etc.

});

INTERMediatorLib.addEvent(window, 'unload', function () {
    INTERMediator_DBAdapter.unregister();
});

INTERMediatorLib.addEvent(window, 'load', function () {
    var key, errorNode;
    if (INTERMediatorOnPage.initLocalContext)   {
        for (key in INTERMediatorOnPage.initLocalContext) {
            if (INTERMediatorOnPage.initLocalContext.hasOwnProperty(key)){
                IMLibLocalContext.setValue(key, INTERMediatorOnPage.initLocalContext[key], true);
            }
        }
    }
    errorNode = document.getElementById(INTERMediatorOnPage.nonSupportMessageId);

    //if (INTERMediatorOnPage.dbClassName === 'DB_FileMaker_FX') {
    //    INTERMediator_DBAdapter.eliminateDuplicatedConditions = true;
    //}

    if (INTERMediatorOnPage.isAutoConstruct) {
        if (errorNode) {
            if (INTERMediatorOnPage.INTERMediatorCheckBrowser(errorNode)) {
                if (INTERMediatorOnPage.doBeforeConstruct) {
                    INTERMediatorOnPage.doBeforeConstruct();
                }
                if (INTERMediatorOnPage.isAutoConstruct) {
                    INTERMediator.construct(true);
                }
            }
        } else {
            if (INTERMediatorOnPage.doBeforeConstruct) {
                INTERMediatorOnPage.doBeforeConstruct();
            }
            if (INTERMediatorOnPage.isAutoConstruct) {
                INTERMediator.construct(true);
            }
        }
    }
    // INTERMediatorOnPage.isFinishToConstruct = true;
});

// ****** This file should terminate on the new line. INTER-Mediator adds some codes before here. ****
