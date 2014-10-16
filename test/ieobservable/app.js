

var Static = Object.createStatic({
    // public
    value: {
        get: function () {
            console.log('getting');
            return this._value;
        },
        set: function (bValue) {
            console.log("setting");
            this._value = bValue;
        }
    },
    // "protected"
    _value: {
        writable: true,
        value: 123
    }
});

//var a = {};
//a.prototype = Static;
// console.log('sdfks');
// var a = Static;
// console.log(a.value);


// // will invoke the setter
// a.value = 456;
// console.log(a.value); // 456

// // will throw an exception
// // or it won't work
// // Static.whatever = "no way";

// console.log(Static);


