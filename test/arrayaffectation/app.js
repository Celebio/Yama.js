

yama.register({
    name : 'nereo.mycomponent',
    draw : function(){
        /*!
        root
            div text:title
            div:loopCont
                foreach item:myarray
                    div:userper text:item
        !*/
    },
    init : function(cont){
    },

    title : "Hey",
    myarray : [2, 4, 6]

});


yama.addLoadEvent(function(){
    // sample data
    var addData = [167, 276, 244, 261, 277, 146, 292, 145, 72, 141, 242, 182, 171, 110, 205, 70, 282, 263, 62, 101, 32, 164, 283, 285, 159, 225, 201, 117, 134, 172, 29, 182, 251, 291, 269, 119, 134, 64, 58, 255, 14, 34, 269, 191, 186, 134, 290, 50, 278, 71, 73, 82, 52, 190, 280, 69, 45, 217, 227, 281];
    var addDataCtr = 0;

    var cont = document.getElementById("test");
    var myComponent = new yama.components.nereo.mycomponent(cont);

    myComponent.title = "Array cont tester";

    var testBtn = document.getElementById("testBtn");
    testBtn.onclick = function(){
        var regularArr = [];
        for (var i=0; i<3; i++){
            regularArr.push(addData[addDataCtr++]);
        }

        myComponent.myarray = regularArr;       // Array affectation
    }

    var testBtn2 = document.getElementById("testBtn2");
    testBtn2.onclick = function(){
        myComponent.myarray.push(addData[addDataCtr++]);
    }
    
    var testBtn3 = document.getElementById("testBtn3");
    testBtn3.onclick = function(){
        myComponent.myarray[1] = 325;
    }

});











