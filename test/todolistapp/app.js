

yama.register({
    name : 'onur.myComponent1',
    draw : function(){
        /*!
        root
            input value:curTask onenter:addTask
            div
                foreach:itVar taskItem:taskList
                    div
                        span text:taskItem
                        span:close text:closeText onclick:onCloseClick
        !*/
    },

    curTask : "",
    closeText : "&times;",
    taskList : ["Create example", "Add pointer", "Remove context binder"],

    addTask : function(){
        this.taskList.unshift(this.curTask);
        this.curTask = '';
    },
    onCloseClick : function(g){
        this.taskList.splice(g('itVar'), 1);
    }

});


yama.addLoadEvent(function(){
    var cont = document.getElementById("test");
    var myComponent = new yama.components.onur.myComponent1(cont);    
});






