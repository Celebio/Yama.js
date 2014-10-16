/*! (C) WebReflection - Mit Style License */
Object.createStatic = (function (global) {
    // ... another crazy idea that works in old IEs too
    var
        o = {},
        Object = global.Object,
        defineProperty = Object.defineProperty,
        hasOwnProperty = o.hasOwnProperty,
        freeze = Object.preventExtensions || Object.freeze || Object.seal || function() {},
        WRITABLE = "writable",
        GET = "get",
        SET = "set",
        VALUE = "value"
    ;
    o[VALUE] = 1;
    try {
        // thanks @bga_ for the hint about IE8
        if (!(defineProperty && defineProperty(o,"_",o)/* <--- OMG it looks like E.T. !!! */._)) {
            throw SET;
        }
        // IE9 and others updated browsers
        return function createStatic(definition) {
            var
                o = {},
                current, key
            ;
            for (key in definition) {
                if (hasOwnProperty.call(definition, key)) {
                    current = definition[key];
                    current.enumerable = 1;
                    current.configurable = 0;
                    defineProperty(o, key, current);
                }
            }
            freeze(o);
            return o;
        };
    } catch(e) {
        if("__defineGetter__" in o) {
            return function createStatic(definition) {
                var
                    o = {},
                    current, key
                ;
                for (key in definition) {
                    if (hasOwnProperty.call(definition, key)) {
                        current = definition[key];
                        if (hasOwnProperty.call(current, VALUE)) {
                            if (hasOwnProperty.call(current, WRITABLE) && current[WRITABLE]) {
                                o[key] = current[VALUE];
                            } else {
                                o.__defineGetter__(key, function (value) {
                                    return function () {
                                        return value;
                                    };
                                }(current[VALUE]));
                                o.__defineSetter__(key, function () {
                                    throw "read-only";
                                });
                            }
                        } else {
                            if (hasOwnProperty.call(current, GET)) {
                                o.__defineGetter__(key, current[GET]);
                            }
                            if (hasOwnProperty.call(current, SET)) {
                                o.__defineSetter__(key, current[SET]);
                            }
                        }
                    }
                }
                freeze(o);
                return o;
            };
        } else {
            // IE 8, 7, 6
            id = 0;
            global.execScript( [
                "Function execVBScript(code)",
                    "ExecuteGlobal(code)",
                "End Function"
            ].join("\n"), "VBScript");
            return function createStatic(definition) {
                var
                    className = "StaticObject" + id++,
                    compile = ["Class " + className, "Private o"],
                    o = {},
                    current,
                    key
                ;
                for (key in definition) {
                    if (hasOwnProperty.call(definition, key)) {
                        current = definition[key];
                        if (hasOwnProperty.call(current, VALUE)) {
                            o[key] = current[VALUE];
                            compile.push(
                                "Public Property Get " + key,
                                    key + "=o." + key,
                                "End Property"
                            );
                            if (hasOwnProperty.call(current, WRITABLE) && current[WRITABLE]) {
                                compile.push(
                                    "Public Property Let " + key + "(" + VALUE + ")",
                                        "o." + key + "=" + VALUE,
                                    "End Property"
                                );
                            }
                        } else {
                            if (hasOwnProperty.call(current, GET)) {
                                o[key] = current[GET];
                                compile.push(
                                    "Public Property Get " + key,
                                        key + "=o." + key + "()",
                                    "End Property"
                                );
                            }
                            if (hasOwnProperty.call(current, SET)) {
                                o[key] = current[SET];
                                compile.push(
                                    "Public Property Let " + key + "(" + VALUE + ")",
                                        "o." + key + "(" + VALUE + ")",
                                    "End Property"
                                );
                            }
                        }
                    }
                }
                compile.push(
                        "Private Sub Class_Initialize()",
                            "Set o=" + className + "JS()",
                        "End Sub",
                    "End Class",
                    "Function " + className + "Factory()",
                        "Dim o",
                        "Set o=New " + className,
                        "Set " + className + "Factory=o",
                    "End Function"
                );
                global[className + "JS"] = function () {
                    global[className + "JS"] = null; 
                    return o;
                };
                console.log(compile);
                execVBScript(compile.join("\n"));
                return global[className + "Factory"]();
            };
        }
    } 
}(this));