var currentQuestionId;
//////////CURRENT QUESTION_ID//////////


//////////ON_LOADING_FUNCTION/////////////////
window.onload = function () {
    //////////////IF_LOCAL_STORAGE_DOES_NOT_EXIST_THEN_CREATE_IT//////////// 
    if (localStorage.getItem("discussion_questions") === null) {
        localStorage.setItem("discussion_questions", JSON.stringify([]));
    } else {
        document.getElementById("questions").innerHTML = "";
        var grand_parent = document.getElementById("questions");
        var obj = JSON.parse(localStorage.getItem("discussion_questions"));



        ///SHOW_ALL_THE_QUESTIONS////////////
        obj.forEach(function (each_question) {

            var parent = document.createElement("div");
            var child = document.createElement("h2");
            child.innerHTML = each_question.subject;
            var grandChild = document.createElement("p");
            grandChild.innerHTML = each_question.question;
            parent.appendChild(child);
            parent.appendChild(grandChild);

            parent.setAttribute("id", each_question.uuid.toString());

            parent.style.border = "1px solid rgb(192, 194, 196)";
            parent.style.padding = "5px";
            grand_parent.appendChild(parent);

            //////WHEN_CLICK_ON_THE_QUESTION_PASS_THE_ID_OF_IT/////////////
            parent.addEventListener("click", function () {
                showQuestionWithResponses(this["id"]);
            })
        })
    }
}


/////////////ON_CLICK_OF_SUBMIT_BUTTON///////////////
document.getElementById("submitQuestionButton").addEventListener("click", function () {

    //GET THE SUBJECT AND QUESTION//////////////
    var subject = document.getElementById("subject").value.trim();
    var question = document.getElementById("comment").value.trim();

    ///////////IF ANY ONE OF THEM IS EMPTY THEN SHOW ALERT///////////////
    if (subject === "" || question === "") {
        alert("Empty subject or question!!");
        return;
    }

    ///////////ASSIGN UUID TO EACH QUESTION////////////////
    var uuid = new Date().getTime();

    //getting from localstorage//
    var getArray = localStorage.getItem("discussion_questions");

    //parsing the array//
    getArray = JSON.parse(getArray);

    getArray.push({
        "subject": subject,
        "question": question,
        "uuid": uuid,
        "responses": []
    })

    ///SET THE LOCAL STORAGE////////
    localStorage.setItem("discussion_questions", JSON.stringify(getArray));

    //////////APPEND THE QUESTION////////
    append(subject, question, uuid);
    ////////AND THEN RELOAD THE WINDOW/////////
    location.reload();
})




function append(subject, question, uuid) {
    /////APPEND THE QUESTION//////////////
    var grand_parent = document.getElementById("questions");

    var parent = document.createElement("div");

    var child = document.createElement("h2");
    child.innerHTML = subject;

    var grandChild = document.createElement("p");

    grandChild.innerHTML = question;


    parent.appendChild(child);
    parent.appendChild(grandChild);

    parent.setAttribute("id", uuid.toString());

    parent.addEventListener("click", function () {
        showQuestionWithResponses(this);
    })
    parent.style.border = "1px solid rgb(192, 194, 196)";

    grand_parent.appendChild(parent);


    ////////CLEAR THE INPUTS//////////
    clear();
}

function showQuestionForm() {
    ////////////SHOW THE QUESTION FORM//////////
    document.getElementById("question_form").style.display = "block";
    ////////////HIDE THE ANSWER SECTION//////////////
    document.getElementById("answer_section").style.display = "none";
}

///////////////LISTENER ON QUESTION BUTTON//////////////
document.getElementById("question_button").addEventListener("click", showQuestionForm);

//////////////////////ANSWER SECTION WITHH RESPONSES//////////////
function showQuestionWithResponses(ReferenceId)

{
    //    alert(typeof ReferenceId);

    ///FIRST EMPTY THE QUESTION////////////
    document.getElementById("click_display_question").innerHTML = "";


    ///DISABLE THE QUESTION FORM/////
    document.getElementById("question_form").style.display = "none";

    //    alert(document.getElementById("answer_section"));

    ///////ENABLE THE ANSWER SECTION//////////
    document.getElementById("answer_section").style.display = "block";



    //GET THE LOCALSTORAGE////////////
    var obj = JSON.parse(localStorage.getItem("discussion_questions"));




    ///////////FILTER THE CURRENT OBJECT/////////////
    var search_object = obj.filter(function (value) {
        return ReferenceId === value.uuid.toString();
    })


    ////////SET THE ID OF THE CURRENT OBJECT/////////
    currentQuestionId = search_object[0].uuid;

    ///////////////DISPLAY THE QUESTION WITH SUBJECT///////
    var head = document.createElement("h3");
    head.innerHTML = search_object[0].subject;

    var span = document.createElement("p");
    span.innerHTML = search_object[0].question;



    document.getElementById("click_display_question").style.border = "1px solid rgb(192, 194, 196)";
    document.getElementById("click_display_question").style.padding = "5px";

    document.getElementById("click_display_question").appendChild(head);
    document.getElementById("click_display_question").appendChild(span);


    /////////////EMPTY THE RESPONSES INITIALLY///////////
    document.getElementById("responses").innerHTML = "";


    //    alert(currentQuestionId);

    var parentResponses = document.getElementById("responses");


    //////////////////////SHOW THE RESPONSES IF THEY HAVE ELSE SHOW THE MESSAGE NO RESPONSES
    if (search_object[0].responses.length > 0) {
        document.getElementById("responseHeading").innerHTML = "Responses!!!";
        for (var i = 0; i < search_object[0].responses.length; ++i) {
            var parent = document.createElement("div");

            var name = document.createElement("h3");
            name.innerHTML = search_object[0].responses[i].name;
            var answer = document.createElement("p");
            answer.innerHTML = search_object[0].responses[i].ans;

            parent.appendChild(name);
            parent.appendChild(answer);

            parent.style.border = "1px solid rgb(192, 194, 196)";
            parent.style.padding = "5px";
            parentResponses.appendChild(parent);

        }

    } else {
        document.getElementById("responseHeading").innerHTML = "No Responses Yet!!!";
    }
}



///////////////LISTENER ON RESOLVE BUTTON////////////////////
document.getElementById("resolve").addEventListener("click", function () {

    //GET THE LOCALSTORAGE OBJECT////////////
    var obj = JSON.parse(localStorage.getItem("discussion_questions"));

    ///////////////FILTER THE OBJECT TO REMOVE///////////
    obj = obj.filter(function (value) {

        return value.uuid != currentQuestionId;
    })

    ///////////AGAIN SET THE LOCALSTORAGE//////////////
    localStorage.setItem("discussion_questions", JSON.stringify(obj));
    ////////RELOAD THE PAGE////////////
    location.reload();
});



/////////////////ANSWER SUBMIT SECTION/////////////////

document.getElementById("submitAnswerButton").addEventListener("click", function () {

    ////////////GET THE NAME AND ANSWER///////////////
    var name = document.getElementById("name").value.trim();
    var ans = document.getElementById("answer").value.trim();


    ///ALERT IF THEY ARE EMPTY///////////////
    if (name === "" || answer === "") {
        alert("Empty name or answer!!!");
        return;
    }

    //GET THE LOCALSTORAGE////////
    var obj = JSON.parse(localStorage.getItem("discussion_questions"));


    //FILTER THE OBJECT IN WHICH ANSWERS ARE SET///////////
    var search_object = obj.filter(function (value) {
        return currentQuestionId === value.uuid;
    })


    /////////PUSH THE ANSWER WITH NAME//////////////
    search_object[0].responses.push({
        name: name,
        ans: ans
    });

    //////////////AGAIN SET THE LOCALSTORAGE////////////////
    localStorage.setItem("discussion_questions", JSON.stringify(obj));
    showQuestionWithResponses(currentQuestionId.toString());


    ///////////////CLAER THE ANSWER FORM////////////////
    Clearanswer();

})


/////////////CLEAR THE ANSWER FORM///////////
function Clearanswer() {
    document.getElementById("name").value = "";
    document.getElementById("answer").value = "";
}

//////////////CLEAR THE FORM INPUTS OF QUESTION FORM//////////////////
function clear() {
    document.getElementById("subject").value = "";
    document.getElementById("comment").value = "";
}


document.getElementById("filter_result").addEventListener("keyup", function () {

    document.getElementById("answer_section").style.display = "none";
    document.getElementById("question_form").style.display = "block";
    var searchItem = document.getElementById("filter_result").value.toUpperCase();


    var obj = JSON.parse(localStorage.getItem("discussion_questions"));


    var search_obj = obj.filter(function (value) {

        console.log(value.subject.toUpperCase());

        if (value.subject.toUpperCase().indexOf(searchItem) > -1) {
            return value;
        }
    })


    //    console.log(search_obj);
    document.getElementById("questions").innerHTML = "";
    var grand_parent = document.getElementById("questions");
    ///SHOW_ALL_THE_QUESTIONS////////////
    search_obj.forEach(function (each_question) {

        var parent = document.createElement("div");
        var child = document.createElement("h2");
        child.innerHTML = each_question.subject;
        var grandChild = document.createElement("p");
        grandChild.innerHTML = each_question.question;
        parent.appendChild(child);
        parent.appendChild(grandChild);

        parent.setAttribute("id", each_question.uuid.toString());

        parent.style.border = "1px solid rgb(192, 194, 196)";
        parent.style.padding = "5px";
        grand_parent.appendChild(parent);

        //////WHEN_CLICK_ON_THE_QUESTION_PASS_THE_ID_OF_IT/////////////
        parent.addEventListener("click", function () {
            showQuestionWithResponses(this["id"]);
        })
    })
});
