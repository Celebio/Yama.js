/*!
 * Yama JavaScript library v0.1.0
 * (c) Onur Çelebi
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */


var yama = null;
yama = function(){
    var observableObjPrefix = "_obs_";
    var nativeElems = {'div':1, 'span':1, 'input':1, 'select':1, 'option':1, 'button':1};

    var watchThat = function(obj, prop, handler) {
        var oldval = obj[prop], newval = oldval,
        getter = function () {
            return newval;
        },
        setter = function (val) {
            oldval = newval;
            return newval = handler.call(obj, prop, oldval, val);
        };
        if (delete obj[prop]) { // can't watch constants
            if (Object.defineProperty) // ECMAScript 5
                Object.defineProperty(obj, prop, {
                    get: getter,
                    set: setter
                });
            else if (Object.prototype.__defineGetter__ && Object.prototype.__defineSetter__) { // legacy
                Object.prototype.__defineGetter__.call(obj, prop, getter);
                Object.prototype.__defineSetter__.call(obj, prop, setter);
            }
        }
    };


    function ObservableArray(items) {
        var _self = this,
            _array = [];

        _self.onItemAdded = null;
        _self.onItemSet = null;
        _self.onItemRemoved = null;

        function defineIndexProperty(index) {
            if (!(index in _self)) {
                Object.defineProperty(_self, index, {
                    configurable: true,
                    enumerable: true,
                    get: function () {
                        return _array[index];
                    },
                    set: function (v) {
                        _array[index] = v;
                        if (typeof _self.onItemSet === "function") {
                            _self.onItemSet(index, v);
                        }
                    }
                });
            }
        }

        _self.push = function () {
            var index;
            for (var i = 0, ln = arguments.length; i < ln; i++) {
                index = _array.length;
                _array.push(arguments[i]);
                defineIndexProperty(index);
                if (typeof _self.onItemAdded === "function") {
                    _self.onItemAdded(index, arguments[i]);
                }
            }
            return _array.length;
        };

        _self.pop = function () {
            if (~_array.length) {
                var index = _array.length - 1,
                    item = _array.pop();
                delete _self[index];
                if (typeof _self.onItemRemoved === "function") {
                    _self.onItemRemoved(index, item);
                }
                return item;
            }
        };

        _self.unshift = function () {
            for (var i = 0, ln = arguments.length; i < ln; i++) {
                _array.splice(i, 0, arguments[i]);
                defineIndexProperty(_array.length - 1);
                if (typeof _self.onItemAdded === "function") {
                    _self.onItemAdded(i, arguments[i]);
                }
            }
            return _array.length;
        };

        _self.shift = function () {
            if (~_array.length) {
                var item = _array.shift();
                _array.length === 0 && delete _self[index];
                if (typeof _self.onItemRemoved === "function") {
                    _self.onItemRemoved(0, item);
                }
                return item;
            }
        };

        _self.splice = function (index, howMany /*, element1, element2, ... */ ) {
            var removed = [],
                item,
                pos;

            index = !~index ? _array.length - index : index;

            howMany = (howMany == null ? _array.length - index : howMany) || 0;

            while (howMany--) {
                item = _array.splice(index, 1)[0];
                removed.push(item);
                delete _self[_array.length];
                if (typeof _self.onItemRemoved === "function") {
                    _self.onItemRemoved(index + removed.length - 1, item);
                }
            }

            for (var i = 2, ln = arguments.length; i < ln; i++) {
                _array.splice(index, 0, arguments[i]);
                defineIndexProperty(_array.length - 1);
                if (typeof _self.onItemAdded === "function") {
                    _self.onItemAdded(index, arguments[i]);
                }
                index++;
            }

            return removed;
        };

        Object.defineProperty(_self, "length", {
            configurable: false,
            enumerable: true,
            get: function () {
                return _array.length;
            },
            set: function (value) {
                var n = Number(value);
                if (n % 1 === 0 && n >= 0) {
                    if (n < _array.length) {
                        _self.splice(n);
                    } else if (n > _array.length) {
                        _self.push.apply(_self, new Array(n - _array.length));
                    }
                } else {
                    throw new RangeError("Invalid array length");
                }
                return value;
            }
        });

        Object.getOwnPropertyNames(Array.prototype).forEach(function (name) {
            if (!(name in _self)) {
                Object.defineProperty(_self, name, {
                    configurable: false,
                    enumerable: true,
                    writeable: false,
                    value: Array.prototype[name]
                });
            }
        });

        if (items instanceof Array) {
            _self.push.apply(_self, items);
        }
    }


    function _addLoadEvent(func)
    {   
        var oldonload = window.onload;
        if (typeof window.onload != 'function'){
            window.onload = func;
        } else {
            window.onload = function(){
            oldonload();
            func();
            }
        }
    }

    function findContext(contextBuffer, accessorName){
        var nameParts = accessorName.split('.');

        var curContextInd = contextBuffer.length-1;
        var curContext = null;
        var contextAccessor = null;
        var cont = true;
        do {
            curContext = contextBuffer[curContextInd];
            curContextInd--;

            var curCurContext = curContext;
            var lastCurContext = null;
            for (var k=0; k<nameParts.length && curCurContext; k++){
                var namePart = nameParts[k];
                lastCurContext = curCurContext;
                curCurContext = curCurContext[namePart];
            }
            if (typeof(curCurContext)!='undefined'){
                cont = false;
                contextAccessor = nameParts[nameParts.length-1];
                curContext = lastCurContext;
            }

        } while (curContextInd >= 0 && cont);

        if (curContextInd == -1){
            console.log("Unable to find reference to "+accessorName);
        }

        return {'context':curContext, 'contextAccessor': contextAccessor};
    }

    var _bindings = {
        'text':function(bDom){
            return function(nVal){
                bDom.innerHTML = nVal;
            };
        },
        'avalue':function(bDom){
            return function(nVal){
                bDom.value = nVal;
            };
        },
        'onclick':function(bDom, contextBuffer, curContext, paramAccessorName, yamaCompDesc){
            return function(){
                bDom.onclick = function(){
                    yamaCompDesc[paramAccessorName].call(curContext, function(paramName){
                        var contInfo = findContext(contextBuffer, paramName);
                        return contInfo.context[contInfo.contextAccessor];
                    });
                }
            };
        },
        'value':function(bDom, contextBuffer, curContext, paramAccessorName, yamaCompDesc){
            var existingEvent = bDom.onkeyup;
            var disabled = false;   // trick to disable observer notification
            bDom.onkeyup = function(e){
                if (existingEvent)
                    existingEvent.call(this, e);
                disabled = true;
                curContext[paramAccessorName] = this.value;
                disabled = false;
            }
            return function(nVal){
                if (!disabled)
                    bDom.value = nVal;
            };
        },
        'onenter':function(bDom, contextBuffer, curContext, paramAccessorName, yamaCompDesc){
            var existingEvent = bDom.onkeyup;
            bDom.onkeyup = function(e){
                if (existingEvent)
                    existingEvent.call(this, e);
                if (e.keyCode == 13)
                    yamaCompDesc[paramAccessorName].call(curContext);
            }
        }
    };

    function applyParamToDom(yamaCompDesc, contextBuffer, bDom, paramName, paramAccessorName){
        var curContextInfo = findContext(contextBuffer, paramAccessorName);
        var curContext = curContextInfo.context;
        var curContextAccessor = curContextInfo.contextAccessor;
        
        if (!curContext)
            return;

        if (_bindings[paramName]){
            var bindingInfo = _bindings[paramName];
            var obsPatternKey = observableObjPrefix+curContextAccessor;
            if (!curContext[obsPatternKey]){
                curContext[obsPatternKey] = [];
            }

            var contextBufferWhenBound = contextBuffer.slice(0);
            var tt = bindingInfo(bDom, contextBufferWhenBound, curContext, paramAccessorName, yamaCompDesc);
            
            if (tt){
                curContext[obsPatternKey].push(tt);
                if (typeof(curContext[curContextAccessor]) != 'undefined'){
                    tt(curContext[curContextAccessor]);
                }
            }
        }
    }

    function createDomFromName(domTag){
        if (nativeElems[domTag])
            return document.createElement(domTag);
        return null;
    }

    function createComponent(curContext, parentDom, elemName){
        var nameParts = elemName.split('.');
        var curComp = yama.components;
        for (var k=0; k<nameParts.length; k++){
            var namePart = nameParts[k];
            if (curComp[namePart]){
                curComp = curComp[namePart];
            } else {
                curComp = null;
                break;
            }
        }
        if (!curComp || typeof(curComp) != 'function'){
            throw "Component not found : "+elemName
        }

        var compInstance = new curComp(parentDom, curContext);
        return compInstance;
    }

    function drawForEachDirective(yamaCompDesc, contextBuffer, rootCont, lines, k, curIndent, iteratorName, collectionName, indexVarName){
        var obsPatternKey = observableObjPrefix+collectionName;

        var curContextInfo = findContext(contextBuffer, collectionName);
        var curContext = curContextInfo.context;
        var curContextAccessor = curContextInfo.contextAccessor;
        var indexVarName = indexVarName || "index";

        if (!curContext[obsPatternKey]){
            curContext[obsPatternKey] = [];
        }
        var tt = null;

        tt = function(){
            return function(nVal){
                rootCont.innerHTML = "";
                if (!nVal) return;
                for (var i=0; i<nVal.length; i++){
                    var nContext = {};
                    nContext[indexVarName] = i;
                    nContext[iteratorName] = nVal[i];

                    contextBuffer.push(nContext);
                    drawFromLines(yamaCompDesc, contextBuffer, rootCont, false, lines, k+1, curIndent);
                    contextBuffer.pop();
                }
            };
        }();

        if (tt){
            curContext[obsPatternKey].push(tt);
            tt(curContext[curContextAccessor]);
        }
    }


    function drawFromLines(yamaCompDesc, contextBuffer, rootCont, needsRoot, lines, startIndex, minIndent){
        var k = startIndex;
        if (k < lines.length){
            var line = lines[k];
            var elems = line.match(/([ \t]+)?([\w\.]+)?:*([\w\.]*)?(.*)?/);
            
            var curIndent = elems[1].length;
            var curElemName = elems[2];
            var curVarName = elems[3];
            var curElemParameters = elems[4];

            if (k == startIndex){
                if (needsRoot){
                    if (curElemName != 'root'){
                        throw "Must have a root tagged element";
                    } else {
                        return drawFromLines(yamaCompDesc, contextBuffer, rootCont, false, lines, k+1, curIndent);
                    }
                }
            }

            if (curIndent <= minIndent)
                return k;

            var nDom = null;
            var nK = k+1;
            var topContext = contextBuffer[contextBuffer.length-1];

            if (rootCont){
                if (nativeElems[curElemName]){
                    nDom = createDomFromName(curElemName);

                    if (curVarName){
                        nDom.className = curVarName;
                        topContext[curVarName] = nDom;
                    }
                    rootCont.appendChild(nDom);
    
                    if (curElemParameters){
                        var curElemParametersArr = curElemParameters.split(/\s+/);
                        
                        for (var jj=0; jj<curElemParametersArr.length; jj++){
                            var bLine = curElemParametersArr[jj];
                            var curParams = bLine.match(/([ \t]+)?([\w\.]+)?:*([\w\.]*)?(.*)?/);
                            var curParamName = curParams[2];
                            var curParamAccessorName = curParams[3];
                            if (curParamName){
                                applyParamToDom(yamaCompDesc, contextBuffer, nDom, curParamName, curParamAccessorName);
                            }
                        }
                    }
                } else if (curElemName == 'foreach'){
                    var iteratorName = null;
                    var collectionName = null;
                    var indexVarName = curVarName;

                    if (curElemParameters){
                        var curElemParametersArr = curElemParameters.split(/\s+/);
                        
                        for (var jj=0; jj<curElemParametersArr.length; jj++){
                            var bLine = curElemParametersArr[jj];
                            //var curParams = bLine.match(/([ \t]+)?(\w+)?:*(\w*)?(.*)?/);
                            var curParams = bLine.match(/([ \t]+)?(\w+)?:*([\w\.]*)?(.*)?/);
                            var curParamName = curParams[2];
                            var curParamAccessorName = curParams[3];
                            if (curParamName){
                                iteratorName = curParamName;
                                collectionName = curParamAccessorName;
                            }
                        }
                    }

                    drawForEachDirective(yamaCompDesc, contextBuffer, rootCont, lines, k, curIndent, iteratorName, collectionName, indexVarName);

                    // just to skip inner lines
                    nK = drawFromLines(yamaCompDesc, contextBuffer, null, false, lines, k+1, curIndent);
                } else {
                    var nCompInstance = createComponent(topContext, rootCont, curElemName);

                    if (curVarName)
                        topContext[curVarName] = nCompInstance;

                    if (curElemParameters){
                        var curElemParametersArr = curElemParameters.split(/\s+/);
                        
                        for (var jj=0; jj<curElemParametersArr.length; jj++){
                            var bLine = curElemParametersArr[jj];
                            var curParams = bLine.match(/([ \t]+)?([\w\.]+)?:*([\w\.]*)?(.*)?/);
                            var curParamName = curParams[2];
                            var curParamAccessorName = curParams[3];
                            if (curParamName){
                                if (typeof(topContext[curParamAccessorName])=='function'){
                                    nCompInstance[curParamName] = function(){
                                        topContext[curParamAccessorName].call(topContext);
                                    }
                                } else if (typeof(topContext[curParamAccessorName])!='undefined'){
                                    var obsPatternKey = observableObjPrefix+curParamAccessorName;
                                    if (!topContext[obsPatternKey]){
                                        topContext[obsPatternKey] = [];
                                    }
                                    var tt = null;
                                    tt = function(){
                                        return function(nVal){
                                            nCompInstance[curParamName] = nVal;
                                        };
                                    }();
                                    if (tt){
                                        topContext[obsPatternKey].push(tt);
                                        if (typeof(topContext[curParamAccessorName]) != 'undefined'){
                                            tt(topContext[curParamAccessorName]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }            

            if (nDom)
                nK = drawFromLines(yamaCompDesc, contextBuffer, nDom, false, lines, k+1, curIndent);

            nK = drawFromLines(yamaCompDesc, contextBuffer, rootCont, false, lines, nK, minIndent);

            return nK;
        }
        return k;
    }

    var me = {
        register : function(b){
            var drawFunctionString = b.draw.toString().
                                        replace(/^[^\/]+\/\*!?/, '').
                                        replace(/!\*\/[^\/]+$/, '');
            
            var reservedMembers = {'draw':1,'init':1,'name':1};
            var nameParts = b.name.split('.');
            
            var YamaComponent = function(cont, curContext){
                var contextBuffer = [];
                if (curContext)
                    contextBuffer.push(curContext);
                contextBuffer.push(this);

                var yamaComp = contextBuffer[contextBuffer.length-1];
                var toBeSet = [];

                for (var k in b){
                    if (!reservedMembers[k]){
                        if (typeof(b[k]) != 'function'){
                            var me = this;
                            this[k] = b[k];
                            
                            watchThat(this, k, function(id, oldVal, newVal){
                                if (newVal instanceof Array){
                                    var obsArr = new ObservableArray(newVal);

                                    var ntfo = function(){
                                        var memberName = id;
                                        return function(){
                                            var obsPatternKey = observableObjPrefix+memberName;
                                            if (yamaComp[obsPatternKey]){
                                                var updateHandlers = yamaComp[obsPatternKey];
                                                for (var uhi = 0; uhi<updateHandlers.length; uhi++){
                                                    var handlerInfo = updateHandlers[uhi];
                                                    if (handlerInfo)
                                                        handlerInfo(obsArr);
                                                }
                                            }
                                        };
                                    }();

                                    obsArr.onItemAdded = ntfo;
                                    obsArr.onItemSet = ntfo;
                                    obsArr.onItemRemoved = ntfo;

                                    me[id] = obsArr;
                                    ntfo();
                                    return obsArr;
                                } else {

                                    var obsPatternKey = observableObjPrefix+id;
                                    if (yamaComp[obsPatternKey]){
                                        var updateHandlers = yamaComp[obsPatternKey];
                                        for (var uhi = 0; uhi<updateHandlers.length; uhi++){
                                            var handlerInfo = updateHandlers[uhi];
                                            if (handlerInfo)
                                                handlerInfo(newVal);
                                        }
                                    }
                                    return newVal;
                                }
                            });

                            toBeSet.push(k);
                        } else {
                            yamaComp[k] = b[k];
                        }
                    }
                }

                var lines = drawFunctionString.match(/[^\r\n]+/g);
                drawFromLines(b, contextBuffer, cont, true, lines, 0, -1);

                for (var tbsi=0; tbsi<toBeSet.length; tbsi++){
                    var toBeSetItem = toBeSet[tbsi];
                    this[toBeSetItem] = this[toBeSetItem];
                }
                if (b.init)
                    b.init.call(this, cont);
            };
            var YamaComponentProto = {
            };

            var curObj = this.components;
            for (var k=0; k<nameParts.length; k++){
                var namePart = nameParts[k];
                if (k == nameParts.length-1){
                    if (curObj[namePart]){
                        throw "Component name collision : "+namePart;
                    } else {
                        curObj[namePart] = YamaComponent;
                        curObj[namePart].prototype = YamaComponentProto;
                    }
                } else {
                    if (!curObj[namePart])
                        curObj[namePart] = {};
                }
                curObj = curObj[namePart];
            }

        },

        addLoadEvent : function(f){
            _addLoadEvent(f);
        },
        bindings : _bindings,
        components : {}
        
    };

    return me;
}();








