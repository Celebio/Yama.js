

yama.register({
    name : 'myComp1',
    draw : function(){
        /*!
        root
            myComp2 onsupervent:titi
            div text:helloTitle
        !*/
    },
    helloTitle : "Hi",
    titi : function(a, b, c){
        console.log("myComp2 raised a particular event");
        this.helloTitle = "I saw it!";
        console.log(this);
    }
});



yama.register({
    name : 'myComp2',
    draw : function(){
        /*!
        root
            div:bigBtn onclick:ondivclick
                div text:btnText
        !*/
    },
    btnText : "Click HERE",
    ondivclick : function(){
        console.log("HOOO");
        console.log(this);
        this.onsupervent();
    }
});



yama.addLoadEvent(function(){
    var cont = document.getElementById("test");
    var myComponent = new yama.components.myComp1(cont);

    

    var testBtn = document.getElementById("testBtn");
    testBtn.onclick = function(){
        myComponent.titi();
    }


    var testResetBtn = document.getElementById("testResetBtn");
    testResetBtn.onclick = function(){
        myComponent.helloTitle = "Hi";
    }

    
});








