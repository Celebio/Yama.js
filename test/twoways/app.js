

yama.register({
    name : 'nereo.mycomponent',
    draw : function(){
        /*!
        root
            span
                div text:title
                input:domInput value:title
            div
                div:footerDom onclick:resetTitle
        !*/
    },

    title : "Initial title",
    otherTitle : "Other title",
    resetTitle : function(){
        this.title = "Welcome !";
    }
});


yama.addLoadEvent(function(){
    var cont = document.getElementById("test");
    var myComponent = new yama.components.nereo.mycomponent(cont);
    
    // console.log(yama.components.nereo.mycomponent);
    // console.log(myComponent);
    
    // myComponent.title = "Simple tester";

    // var testBtn = document.getElementById("testBtn");
    // testBtn.onclick = function(){
    //     myComponent.otherTitle = "Bonjour";
    // }

    
});







