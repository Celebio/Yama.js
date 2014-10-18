

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

    title : "Hello, world !",
    resetTitle : function(){
        this.title = "Welcome !";
    }
});


yama.addLoadEvent(function(){
    var cont = document.getElementById("test");
    var myComponent = new yama.components.nereo.mycomponent(cont);
    

    setTimeout(function(){
        document.getElementsByTagName("INPUT")[0].focus();
    }, 100);

});







