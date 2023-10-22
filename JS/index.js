var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var studentDeName = "SCHOOL-DB";
var studentRelationName = "STUDENT-TABLE";
var connToken = "90931569|-31949333599031715|90960056";

$('#rollno').focus();

// Function to save the recno in local storage
function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

// Function to get the Roll-No as a JSON object
function getRollNoAsJsonObj() {
    var rollno = $("#rollno").val();
    var jsonStr = {
        "Roll-No": rollno
    };
    return JSON.stringify(jsonStr);
}

// Function to fill the form fields with data
function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#fullname").val(record.Full_Name);
    $("#class").val(record.Class);
    $("#birthdate").val(record.Birth_Date);
    $("#address").val(record.Address);
    $("#enrollmentdate").val(record.Enrollment_Date);
}

// Function to reset the form
function resetForm() {
    $("#rollno").val("");
    $("#fullname").val("");
    $("#class").val("");
    $("#birthdate").val("");
    $("#address").val("");
    $("#enrollmentdate").val("");
    $("#rollno").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#rollno").focus();
}

// Function to validate form data
function validateData() {
    var rollno, fullname, className, birthdate, address, enrollmentdate;
    rollno = $('#rollno').val();
    fullname = $('#fullname').val();
    className = $('#class').val();
    birthdate = $('#birthdate').val();
    address = $('#address').val();
    enrollmentdate = $('#enrollmentdate').val();

    if (rollno === '') {
        alert("Roll No. missing");
        $('#rollno').focus();
        return null;
    }

    if (fullname === '') {
        alert("Full Name missing");
        $('#fullname').focus();
        return null;
    }

    if (className === '') {
        alert("Class missing");
        $('#class').focus();
        return null;
    }

    if (birthdate === '') {
        alert("Birth Date missing");
        $('#birthdate').focus();
        return null;
    }

    if (address === '') {
        alert("Address missing");
        $('#address').focus();
        return null;
    }

    if (enrollmentdate === '') {
        alert("Enrollment Date missing");
        $('#enrollmentdate').focus();
        return null;
    }

    var jsonStrObj = {
        "Roll-No": rollno,
        Full_Name: fullname,
        Class: className,
        Birth_Date: birthdate,
        Address: address,
        Enrollment_Date: enrollmentdate
    };

    return JSON.stringify(jsonStrObj);
}

// Function to fetch student data
function getStudent() {
    var rollNoJsonObj = getRollNoAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, studentDeName, studentRelationName, rollNoJsonObj);
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({ async: true });

    if (resJsonObj.status === 400) {
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#fullname").focus();
    } else if (resJsonObj.status === 200) {
        $("#rollno").prop("disabled", true);
        fillData(resJsonObj);
        $("#change").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#fullname").focus();
    }
}

// Function to save student data
function saveStudent() {
    var jsonStrObj = validateData();

    if (!jsonStrObj) {
        return;
    }

    var putRequest = createPUTRequest(connToken, jsonStrObj, studentDeName, studentRelationName);
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });
    resetForm();
}

// Function to change student data
function changeStudent() {
    $("#change").prop("disabled", true);
    var jsonChg = validateData();

    if (!jsonChg) {
        return;
    }

    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, studentDeName, studentRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({ async: false });

    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    console.log(resJsonObj);
    resetForm();
}
