

yama.register({
    name : 'nereo.mycomponent',
    draw : function(){
        /*!
        root
            div text:title
            div:cont2 text:otherTitle
            div:loopCont
        !*/
    },
    init : function(cont){
        this.title = "Hey";
    },

    title : "Hey",
    otherTitle : "Other title"

});


yama.addLoadEvent(function(){
    var cont = document.getElementById("test");
    var myComponent = new yama.components.nereo.mycomponent(cont);

    // console.log(yama.components.nereo.mycomponent);
    // console.log(myComponent);
    
    myComponent.title = "Simple tester";

    var testBtn = document.getElementById("testBtn");
    testBtn.onclick = function(){
        myComponent.otherTitle = "Bonjour";
    }

    
});





