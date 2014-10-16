

yama.register({
    name : 'myComp1',
    draw : function(){
        /*!
        root
            myComp2 title:titi
            div text:titi
        !*/
    },
    titi : "Hi"
});



yama.register({
    name : 'myComp2',
    draw : function(){
        /*!
        root
            div text:title
        !*/
    },
    title : "Comp2 original title"
});



yama.addLoadEvent(function(){
    var cont = document.getElementById("test");
    var myComponent = new yama.components.myComp1(cont);

    
    myComponent.titi = "Simple tester";

    var testBtn = document.getElementById("testBtn");
    testBtn.onclick = function(){
        myComponent.titi = "Button clicked";
    }

    
});








