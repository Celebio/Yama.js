

yama.register({
    name : 'nereo.mycomponent',
    draw : function(){
        /*!
        root
            div text:title myBinding:title
            div:cont2 text:otherTitle
            div:btn text:clickOnMe onclick:buttonClicked
        !*/
    },
    init : function(cont){
        this.title = "Hey";
    },

    title : "Hey",
    otherTitle : "Other title",
    clickOnMe : "Click here",
    buttonClicked : function(){
        this.otherTitle = "OKK";
    }

});

yama.bindings.myBinding = function(){

}


yama.addLoadEvent(function(){
    var cont = document.getElementById("test");
    var myComponent = new yama.components.nereo.mycomponent(cont);

    myComponent.title = "Simple tester";

    // var testBtn = document.getElementById("testBtn");
    // testBtn.onclick = function(){
    //     myComponent.otherTitle = "Bonjour";
    // }

    
});





