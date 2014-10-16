


yama.register({
    name : 'nereo.userperiod',
    draw : function(){
        /*!
        root
            span text:title
            foreach lang:period
                div text:ichBin
                div text:lang.name
                div text:lang.number
                div text:ichWar
        !*/
    },
    init : function(cont, a, b, c){
    },
    title : "Period ici",
    ichBin : "Ich bin",
    ichWar : "Ich war"

});

yama.register({
    name : 'nereo.userperiods',
    draw : function(){
        /*!
        root
            span text:title
            div:forEachCont
                foreach period:periods
                    div text:toto
                    span text:period
                    div text:index
                    div:tksjh
                        foreach lang:period
                            div text:lang
                    div:toto
                        nereo.userperiod
            span text:endTitle
        !*/
    },
    init : function(cont, a, b, c){
    },
    periods : [],
    title : "Bonjour",
    endTitle : "Au revoir",
    toto : "toto"
});


yama.register({
    name : 'nereo.anotheruser',
    draw : function(){
        /*!
        root
            span text:title
            nereo.another:bAnother 
            div text:title2
        !*/
    },
    init : function(cont, a, b, c){
    },

    title : "Super title",
    title2 : "tototo"

});




yama.register({
    name : 'nereo.another',
    draw : function(){
        /*!
        root
            span:toto
            span:titi text:titiTitle
            div text:composite.tata
        !*/
    },
    init : function(cont, a, b, c){
    },

    titiTitle : "Hop",
    composite : {
        'tata' : "Thats a string"
    }

});




yama.register({
    name : 'nereo.mycomponent',
    draw : function(){
        /*!
        root
            div:efv
                span:we text:title
                span:ehr text:titleThatDontExist
            span:vse onclick:changeTitle value:toto text:otherTitle
            div:somur text:somuerTitle
            div:tobeclicked onclick:changeSomurTitle
            div:anotherContainer
                div
                    nereo.another:titiComponent
            div:test2
                div
                    nereo.another:titiComponent1
                    nereo.another:titiComponent2
            nereo.userperiods:userper
        !*/
    },
    init : function(cont, a, b, c){
        console.log(this);
        //this.ehr.innerHTML = "Hello";   // old school js
        //this.vse.innerHTML = "KDJHS";   // old school js
        this.tobeclicked.innerHTML = "tobeclicked";
    },

    otherTitle : "Initial other text",
    title : "Super title",
    somuerTitle : "eee",

    changeSomurTitle : function(){
        this.somuerTitle = "OK";    // equivalent to this.somur.innerHTML = "OK";
        this.title = "jojo";
    },

    changeTitle : function(){
        this.title = "Hi";      // triggers observer update with angular-like syntax
        //console.log(this.titi);

        this.titiComponent.titiTitle = "Celebi";
        this.titiComponent.composite.tata = "OOOHH";
        this.titiComponent1.titiTitle = "LA Onur";
        this.titiComponent2.titiTitle = "ca avance?";

        this.userper.periods.push([{'name':"sfs", 'number':12}, {'name':"ada"}, {'name':"java"}]);
    }

});


yama.addLoadEvent(function(){
    var cont = document.getElementById("test");
    //console.log(yama.components);

    var myComponent = new yama.components.nereo.mycomponent(cont);

    myComponent.title = "titi toto";

    var testBtn = document.getElementById("testBtn");
    testBtn.onclick = function(){
        myComponent.somuerTitle = "Par le bouton";
    }

});











