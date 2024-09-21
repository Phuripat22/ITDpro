google.charts.load("current", {
  packages: ["corechart", "bar"],
});
google.charts.setOnLoadCallback(loadTable);

function loadTable() {
  const xhttp = new XMLHttpRequest();
  const uri = "http://localhost:3000/slist";
  xhttp.open("GET", uri);
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = "";
      var num = 1;
      const objects = JSON.parse(this.responseText);
      console.log(objects);

      for (let object of objects) {
        trHTML += "<tr>";
        trHTML += "<td>" + num + "</td>";
        trHTML += "<td>" + object["Ranking"] + "</td>";
        trHTML += "<td>" + object["Name"] + "</td>";
        trHTML += "<td>" + object["Year"] + "</td>";
        trHTML += "<td>" + object["Minutes"] + "</td>";
        trHTML += "<td>" + object["genre"] + "</td>";
        trHTML += "<td>" + object["Rating"] + "</td>";
        trHTML += "<td>" + object["Votes"] + "</td>";
        trHTML += "<td>";
        trHTML +='<a type="button" class="btn btn-outline-secondary me-2" onclick="showUpdateBox(\'' +object["_id"] +'\')"><i class="fas fa-edit"></i></a>';
        trHTML +='<a type="button" class="btn btn-outline-danger" onclick="showDeleteBox(\'' +object["_id"] + '\')"><i class="fas fa-trash"></i></a>';
        trHTML += "<tr>";

        num++;
      }
      document.getElementById("mytable").innerHTML = trHTML;

      loadGraph(objects);

    } 
  }
};


// -------------------------------------------------------------------------------------------------------------------------------

function loadQueryTable() {
  document.getElementById("mytable").innerHTML ='<tr><th scope="row" colspan="5">Loading...</th></tr>';
  const searchText = document.getElementById("searchTextBox").value;

  const xhttp = new XMLHttpRequest();
  const uri = "http://localhost:3000/slist/field/" + searchText;
  xhttp.open("GET", uri); 

  xhttp.send(); 
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = " ";
      var num = 1;
      const objects = JSON.parse(this.responseText).Complaint;
      for (let object of objects) {
        trHTML += "<tr>";
        trHTML += "<td>" + num + "</td>";
        trHTML += "<td>" + object["Ranking"] + "</td>";
        trHTML += "<td>" + object["Name"] + "</td>";
        trHTML += "<td>" + object["Year"] + "</td>";
        trHTML += "<td>" + object["Minutes"] + "</td>";
        trHTML += "<td>" + object["genre"] + "</td>";
        trHTML += "<td>" + object["Rating"] + "</td>";
        trHTML += "<td>" + object["Votes"] + "</td>";
        trHTML += "<td>";
        trHTML +=
          '<a type="button" class="btn btn-outline-secondary" onclick="showUpdateBox(\'' +
          object["_id"] +
          '\')"><i class="fas fa-edit"></i></a>';
        trHTML +=
          '<a type="button" class="btn btn-outline-danger" onclick="showDeleteBox(\'' +
          object["_id"] +
          '\')"><i class="fas fa-trash"></i></a></td>';
        trHTML += "<tr>";
        num++;
      }
      console.log(trHTML);
      document.getElementById("mytable").innerHTML = trHTML;
      
      loadGraph(objects);
    }
    }
  };

// -------------------------------------------------------------------------------------------------------------------------------

function showCreateBox() {
  Swal.fire({
    title: "Create Animation Movies Transaction",
    html:
      '<div class="mb-3"><label for="Ranking" class="form-label">Ranking</label>' +
      '<input class="form-control" id="Ranking" placeholder="Ranking"></div>' +

      '<div class="mb-3"><label for="Name" class="form-label">Name</label>' +
      '<input class="form-control" id="Name" placeholder="Name"></div>' +

      '<div class="mb-3"><label for="Year" class="form-label">Year</label>' +
      '<input class="form-control" id="Year" placeholder="Year"></div>' +

      '<div class="mb-3"><label for="Minutes" class="form-label">Minutes</label>' +
      '<input class="form-control" id="Minutes" placeholder="Minutes"></div>' +

      '<div class="mb-3"><label for="genre" class="form-label">genre</label>' +
      '<input class="form-control" id="genre" placeholder="genre"></div>' +

      '<div class="mb-3"><label for="Rating" class="form-label">Rating</label>' +
      '<input class="form-control" id="Rating" placeholder="Rating"></div>' +

      '<div class="mb-3"><label for="Votes" class="form-label">Votes</label>' +
      '<input class="form-control" id="Votes" placeholder="Votes"></div>' ,

    focusConfirm: false,
    preConfirm: () => {
      slistCreate();
    },
  });
}
// -------------------------------------------------------------------------------------------------------------------------------
function slistCreate() {
  const Ranking = document.getElementById("Ranking").value;
  const Name = document.getElementById("Name").value;
  const Year = document.getElementById("Year").value;
  const Minutes = document.getElementById("Minutes").value;
  const genre = document.getElementById("genre").value;
  const Rating = document.getElementById("Rating").value;
  const Votes = document.getElementById("Votes").value;

  console.log(
    JSON.stringify({
      Ranking: Ranking,
      Name: Name,
      Year: Year,
      Minutes: Minutes,
      genre: genre,
      Rating: Rating,
      Votes: Votes,

    })
  );

  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://localhost:3000/slist/create");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(
    JSON.stringify({
      Ranking: Ranking,
      Name: Name,
      Year: Year,
      Minutes: Minutes,
      genre: genre,
      Rating: Rating,
      Votes: Votes,
    })
  );

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      Swal.fire(
        "Good job!",
        "Create Successfully!",
        "success"
      );
      loadTable();
    }
  };
}

// -------------------------------------------------------------------------------------------------------------------------------
function showDeleteBox(id) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      Delete(id);
      Swal.fire(
        'Deleted!',
        'Your file has been deleted.',
        'success'
      )
    }
  })
}
// -------------------------------------------------------------------------------------------------------------------------------
function Delete(id) {
  console.log("Delete: ", id);
  const xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "http://localhost:3000/slist/delete");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(
    JSON.stringify({
      _id: id,
    })
  );
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      const objects = JSON.parse(this.responseText);
      Swal.fire(
        "Good job!",
        "Delete Successfully!",
        "success"
      );
      loadTable();
    }
  };
}

// -------------------------------------------------------------------------------------------------------------------------------
function showUpdateBox(id) {
  console.log("edit", id);
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:3000/slist/" + id);
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const object = JSON.parse(this.responseText).Complaint;
      console.log("showUpdateBox", object);
      Swal.fire({
        title: "Update data",
        html:
          '<input id="id" class="swal2-input" placeholder="OID" type="hidden" value="' +object["_id"] +'"><br>' +

          '<div class="mb-3"><label for="Ranking" class="form-label">Ranking</label>' +
          '<input class="form-control" id="Ranking" placeholder="Ranking" value="' +object["Ranking"] +'"></div>' +

          '<div class="mb-3"><label for="Name" class="form-label">Name</label>' +
          '<input class="form-control" id="Name" placeholder="Name" value="' +object["Name"] +'"></div>' +

          '<div class="mb-3"><label for="Year" class="form-label">Year</label>' +
          '<input class="form-control" id="Year" placeholder="Year" value="' +object["Year"] +'"></div>' +

          '<div class="mb-3"><label for="Minutes" class="form-label">Minutes</label>' +
          '<input class="form-control" id="Minutes" placeholder="Minutes" value="' +object["Minutes"] +'"></div>' +

          '<div class="mb-3"><label for="genre" class="form-label">genre</label>' +
          '<input class="form-control" id="genre" placeholder="genre" value="' +object["genre"] +'"></div>' +

          '<div class="mb-3"><label for="Rating" class="form-label">Rating</label>' +
          '<input class="form-control" id="Rating" placeholder="Rating" value="' +object["Rating"] +'"></div>' +
          
          '<div class="mb-3"><label for="Votes" class="form-label">Votes</label>' +
          '<input class="form-control" id="Votes" placeholder="Votes" value="' +object["Votes"] +'"></div>',

        focusConfirm: false,
        preConfirm: () => {
          Update();
        },
      });
    }
  };
}

function Update() {
  const id = document.getElementById("id").value;
  let Ranking = parseInt(document.getElementById("Ranking").value, 10);
  const Name = document.getElementById("Name").value;
  const Year = document.getElementById("Year").value;
  const Minutes = document.getElementById("Minutes").value;
  const genre = document.getElementById("genre").value;
  const Rating = document.getElementById("Rating").value;
  const Votes = document.getElementById("Votes").value;

  console.log(
    JSON.stringify({
      _id: id,
      Ranking: Ranking,
      Name: Name,
      Year: Year,
      Minutes: Minutes,
      genre: genre,
      Rating: Rating,
      Votes: Votes,
    })
  );

  const xhttp = new XMLHttpRequest();
  xhttp.open("PUT","http://localhost:3000/slist/update");
  xhttp.setRequestHeader("Content-Type","application/json;charset=UTF-8");
  xhttp.send(
    JSON.stringify({
      _id: id,
      Ranking: Ranking,
      Name: Name,
      Year: Year,
      Minutes: Minutes,
      genre: genre,
      Rating: Rating,
      Votes: Votes,
    })
  );

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      Swal.fire(
        "Good job!",
        "Update Successfully!",
        "success"
      );
      loadTable();
    }
  };
}

// -------------------------------------------------------------------------------------------------------------------------------
