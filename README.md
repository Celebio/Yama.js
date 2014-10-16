Yama.js
=======

Build Reusable UI in Javascript

Yama.js is an attempt to combine what I liked most of Angular, Knockout and React.

It gets :
  - from React: The "everything is a component" philosophy and UI description in javascript files,
  - from Angular : Observables with seamless js syntax. `myComponent.title = "Hi"` instead of `myComponent.title("Hi")`
  - from Knockout : Declarative binding attributes

Enhanced reusability
--------------------
Yama encourages you to describe your UI as a component, that means you can reuse it later inside another component.

Declarative UI in js
--------------------
Yama includes a simple templating syntax to build the dom tree of your UI, and it binds automatically events and observables to your view object.

Real observables
----------------
Observables with seamless js syntax. Yama uses native javascript accessors to handle changes in view objects. It means that you can't get in trouble with digest loop because there isn't one.

Free, open source
-----------------
fork this repo

Vanilla JavaScript
------------------
works with any web framework and has no dependencies.

Not verbose
-----------
You only take care of writing the behaviour of your UI, nothing else. See "to do list" example

Lightweight
-----------
7 KB when minified


Examples
========

Hello world example
-------------------
```js
yama.register({
    name : 'myComponent1',
    draw : function(){
        /*!
        root
            div text:title
        !*/
    },

    title : "Hello, world !"
});
```
and you can use it like this :
```js
var myComponent = new yama.components.myComponent1(document.body);
```

A simple To Do List
-------------------
```js
yama.register({
    name : 'toDoListComponent',
    draw : function(){
        /*!
        root
          input value:curTask avalue:curTask onenter:addTask
          div
            foreach:itVar taskItem:taskList
              div
                span text:taskItem
                span:close text:closeText onclick:onCloseClick
        !*/
    },

    curTask : "",
    closeText : "×",
    taskList : ["Go to Walmart", "Learn to Play Guitar", "Justin Bieber concert"],

    addTask : function(){
        this.taskList.unshift(this.curTask);
        this.curTask = '';
    },
    onCloseClick : function(g){
        this.taskList.splice(g('itVar'), 1);
    }
});
```

Result :
![Yama to do list](http://i.imgur.com/MWPDark.png "Yama to do list example")
[See it live](http://celebio.github.io/Yama.js/#simpletodo)



[See more examples on project website](http://celebio.github.io/Yama.js/)


License
----

MIT

