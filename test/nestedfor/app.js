

yama.register({
    name : 'nereo.mycomponent',
    draw : function(){
        /*!
        root
            div text:title
            div:cont2 text:otherTitle
            div:loopCont1
                foreach:indVar1 iterator1:list1
                    div:it1cont
                        div text:it1text
                        div text:indVar1
                        div text:iterator1.title
                        div:loopCont2
                            foreach:indVar2 iterator2:iterator1.list2
                                div:it2cont
                                    div text:it2text
                                    div text:indVar1
                                    div text:indVar2
                                    div text:iterator2
        !*/
    },
    it1text : "index1",
    it2text : "index2",

    title : "Hey",
    otherTitle : "Other title",
    list1 : [
        {
            'title':"onur",
            'list2':[1,2,3]
        },
        {
            'title':"test",
            'list2':[4,5,6]
        }
    ]

});


yama.addLoadEvent(function(){
    var cont = document.getElementById("test");
    var myComponent = new yama.components.nereo.mycomponent(cont);

    // console.log(yama.components.nereo.mycomponent);
    // console.log(myComponent);
    
    myComponent.title = "Simple tester";


    
});








