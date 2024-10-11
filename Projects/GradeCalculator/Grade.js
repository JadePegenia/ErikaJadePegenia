function Calculate(){
    var Name = document.getElementById("Name").value;
    var Exam = parseFloat(document.getElementById("score1").value);
    var Quiz = parseFloat(document.getElementById("score2").value);
    var Sw = parseFloat(document.getElementById("score3").value);
    var Recitation = parseFloat(document.getElementById("score4").value);
    var Attendance= parseFloat(document.getElementById("score5").value);
    
    var e = (Exam/100)*40;
    var q = (Quiz/100)*30;
    var s = (Sw/100)*10;
    var r = (Recitation/100)*10;
    var a = (Attendance/100)*10;

    var total = e+q+s+r+a;

    const result={
        name: Name,
        grade: total.toFixed(2),
    }
    const Rate={
        good:"Good",
        vg:"Very Good",
        vvg:"Very very Good",
        p:"Perfect",
        bye: "See you next year",
        invalid: "Invalid output please try again"

    }
    if (total>=75 && total<=100){

        document.getElementById("Statement").innerHTML = "Congratulation, you have passed, Mr/Ms. "+result.name+".";
        document.getElementById("finalgrade").innerHTML = "Your Grade is: "+result.grade+"%";
        
        if(total>=75 && total<=80){
            document.getElementById("rate").innerHTML = Rate.good;
        }
        else if (total>=81 && total <94){
            document.getElementById("rate").innerHTML = Rate.vg;
        }
        else if (total>=95 && total<=99){
            document.getElementById("rate").innerHTML =  Rate.vvg;
        }else{
            document.getElementById("rate").innerHTML = Rate.p;
        }
        
    }else if(total<=74 && total>=1){
        document.getElementById("Statement").innerHTML = "Sorry, but you have failed, Mr/Ms."+result.name+".";
        document.getElementById("finalgrade").innerHTML = "Your Grade is: "+result.grade+"%";
        document.getElementById("rate").innerHTML = Rate.bye;
    }else{
        document.getElementById("finalgrade").innerHTML = Rate.invalid+".";
        document.getElementById("rate").innerHTML = "";
    }

}
function Reset(){
    var Name = document.getElementById("Name").value="";
    var Exam = parseFloat(document.getElementById("score1").value="");
    var Quiz = parseFloat(document.getElementById("score2").value="");
    var Sw = parseFloat(document.getElementById("score3").value="");
    var Recitation = parseFloat(document.getElementById("score4").value="");
    var Attendance= parseFloat(document.getElementById("score5").value="");
    document.getElementById("Statement").innerHTML = "";
    document.getElementById("finalgrade").innerHTML = "";
    document.getElementById("rate").innerHTML = "";
}
