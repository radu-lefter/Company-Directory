//Preloader
$(window).on('load', function () {
  if ($('#preloader').length) {
  $('#preloader').delay(100).fadeOut('slow', function() {$(this).remove();});
}
});


//load all data at startup
$(window).on('load', getAll());


function getAll(){
    $.ajax({
        type: 'GET',
        url: "php/getAll.php",
        success: function (response) {

            //var output = $.parseJSON(response);
            
            console.log(response);

            var allTable =  document.getElementById('allTable');
            allTable.innerHTML = "";

            for (let i in response['data']) {
                               
                tr = document.createElement('tr'); 

                td = document.createElement('td'); 
                td.innerHTML = response['data'][i]['firstName'];
                tr.appendChild(td);
                
                td = document.createElement('td'); 
                td.innerHTML = response['data'][i]['lastName'];
                tr.appendChild(td);

                td = document.createElement('td'); 
                td.innerHTML = response['data'][i]['email'];
                tr.appendChild(td);

                td = document.createElement('td'); 
                td.innerHTML = response['data'][i]['department'];
                tr.appendChild(td);

                td = document.createElement('td'); 
                td.innerHTML = response['data'][i]['location'];
                tr.appendChild(td);

                td = document.createElement('td'); 
                var btnEdit = document.createElement('button'); 
                btnEdit.innerHTML = 'Edit';
                btnEdit.classList = 'btn btn-success m-1';
                btnEdit.setAttribute('data-bs-toggle', 'modal' );
                btnEdit.setAttribute('data-bs-target', '#editModal' );
                btnEdit.addEventListener("click", function() { editPerson(this, response['data'][i]['id']); });
                var btnDelete = document.createElement('button');
                btnDelete.innerHTML = 'Delete';
                btnDelete.classList = 'btn btn-danger';
                btnDelete.addEventListener("click", function() { deletePerson(this, response['data'][i]['id']); });
                td.appendChild(btnEdit);
                td.appendChild(btnDelete);
                tr.appendChild(td);
                 
                allTable.appendChild(tr);

          }
           
           
        },
    }).fail(function () {
        console.log("Error encountered!")
    });
};


//Delete
function deletePerson(e, id){
  e.parentNode.parentNode.parentNode.removeChild(e.parentNode.parentNode);

  $.ajax({
    type: 'POST',
    url: "php/deletePersonnel.php",
    data: {
          id:id
    },
    success: function (response) {

        
        //console.log(response);

    },
}).fail(function () {
    console.log("Error encountered!")
});
}

//Add
$("#addPersonnel").submit(function(e) {

  e.preventDefault(); // avoid to execute the actual submit of the form.
  $('#addModal').modal('hide');

  var form = $(this);
  
  $.ajax({
         type: "POST",
         url: "php/insertPersonnel.php",
         data: form.serialize(), // serializes the form's elements.
         success: function(data)
         {

          getAll();
         }
       });

  
});

//Update
function editPerson(e, id){
  
  var row = e.closest("tr");
  var tds = $(row).find("td"); 

  var fields = [];

  $.each(tds, function() {   
    fields.push($(this).text());                     
  });
fields.pop();
fields.push(id);
console.log(fields);

document.forms['editPersonnel']['firstname'].value = fields[0];
document.forms['editPersonnel']['lastname'].value = fields[1];
document.forms['editPersonnel']['email'].value = fields[2];
document.forms['editPersonnel']['department'].value = fields[3];
document.forms['editPersonnel']['id'].value = fields[5];


}

$("#editPersonnel").submit(function(e) {

  e.preventDefault(); // avoid to execute the actual submit of the form.
  $('#editModal').modal('hide');

  var form = $(this);
  
  $.ajax({
         type: "POST",
         url: "php/updatePersonnel.php",
         data: form.serialize(), // serializes the form's elements.
         success: function(data)
         {
          getAll();
         }
       });

});


//Search
function searchTable() {
  var input, filter, found, table, tr, td, i, j;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td");
      for (j = 0; j < td.length; j++) {
          if (td[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
              found = true;
          }
      }
      if (found) {
          tr[i].style.display = "";
          found = false;
      } else if (tr[i].id != 'tableHeader') {
          
          tr[i].style.display = "none";}
  }
}


//Populate the select list

let dropdown = $('#depDropdown');

dropdown.empty();
dropdown.append('<option selected="true" value="dummy" disabled>Choose department</option>');
dropdown.prop('selectedIndex', 0);

$.ajax({
  type: 'GET',
  url: "php/getAllDepartments.php",
  success: function (response) {

      //var output = $.parseJSON(response);
      console.log(response);

      if(response){
          for (let item of response['data']) {
              dropdown.append($('<option></option>').attr('value', item.id).text(item.name));
       }
      }
     
     
  },
}).fail(function () {
  console.log("Error encountered!")
});

//make the table sortable
const table = document.querySelector('table'); //get the table to be sorted

table.querySelectorAll('th') // get all the table header elements
  .forEach((element, columnNo)=>{ // add a click handler for each 
    element.addEventListener('click', event => {
        sortTable(table, columnNo); //call a function which sorts the table by a given column number
    })
  })

function sortTable(table, sortColumn){
// get the data from the table cells
const tableBody = table.querySelector('tbody')
const tableData = table2data(tableBody);
// sort the extracted data
tableData.sort((a, b)=>{
    if(a[sortColumn] > b[sortColumn]){
    return 1;
    }
    return -1;
})
// put the sorted data back into the table
data2table(tableBody, tableData);
}

// this function gets data from the rows and cells 
// within an html tbody element
function table2data(tableBody){
    const tableData = []; // create the array that'll hold the data rows
    tableBody.querySelectorAll('tr')
      .forEach(row=>{  // for each table row...
        const rowData = [];  // make an array for that row
        row.querySelectorAll('td')  // for each cell in that row
          .forEach(cell=>{
            rowData.push(cell.innerText);  // add it to the row data
          })
        tableData.push(rowData);  // add the full row to the table data 
      });
    return tableData;
  }
  
  // this function puts data into an html tbody element
  function data2table(tableBody, tableData){
    tableBody.querySelectorAll('tr') // for each table row...
      .forEach((row, i)=>{  
        const rowData = tableData[i]; // get the array for the row data
        row.querySelectorAll('td')  // for each table cell ...
          .forEach((cell, j)=>{
            cell.innerText = rowData[j]; // put the appropriate array element into the cell
          })
        tableData.push(rowData);
      });
  }