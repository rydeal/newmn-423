var students = {
  Student: [],
};

if (sessionStorage) {
  localStorage.setItem("students", JSON.stringify(students));

  var st = JSON.parse(localStorage.getItem("students"));
  console.log(st.Students);
} else {
  alert("Error");
}

function getField() {
  // Selecting the studentInfo form from the page
  var studentData = document.querySelector("#studentInfo");
  // Grabs all info from inputs
  var studentDataObj = Object.fromEntries(new FormData(studentData));
  // Putting the classes into an array to solve the issue I was having with extracting data
  var newClass = document.getElementById("studentClasses").value.split(",");
  // Making the data a string
  var studentDataObjString = JSON.stringify(studentDataObj);
  // String of data is now turned into a JSON object
  var studentDataComplete = JSON.parse(studentDataObjString);
  // Adding a new key value pair of classes and putting the newClass array into it
  studentDataComplete.classes = newClass;
  // JSON object that we just made is pushed into the students JSON object
  students.Student.push(studentDataComplete);
  // Saving the JSON to local storage
  localStorage.setItem("students", JSON.stringify(students));
  // Resetting the input boxes so that users don't need to delete manually
  document.getElementById("studentInfo").reset();
  document.getElementById("studentClasses").value = "";
}

function displayStudents() {
  // Grabbing the data that is stored in local storage
  let studentData = JSON.parse(localStorage.getItem("students"));
  // Clears out the content div so that there isn't any data repeating
  document.getElementById("content").innerHTML = "";
  // Each loop to put in the data
  $.each(studentData.Student, function (index, value) {
    $("#content").append(
      `
          <div id="studentDisplay">
              <p>First Name: ${value.firstName}</p>
              <p>Last Name: ${value.lastName}</p>
              <p>Age: ${value.age}</p>
              <p>Phone: ${value.phone}</p>
              <p>Email: ${value.email}</p>
              <p>Address: ${value.address}</p>
              <p>Class: ${value.classes}</p>
          </div>
          `
    );
  });
}
