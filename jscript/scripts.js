

//load all data at startup
$(window).on('load', function(){
  if ($('#preloader').length) {
    console.log("hi");
    $('#preloader').delay(100).fadeOut('slow', function() {$(this).remove();});
  }
  getAll();
  populateDep();
  populateLoc();
});


function getAll(){
    $.ajax({
        type: 'GET',
        url: "php/getAll.php",
        success: function (response) {

            //var output = $.parseJSON(response);
            
            //console.log(response);

            var tableContents =  document.getElementById('tableContents');
            tableContents.innerHTML = "";

            for (let i in response['data']) {
                               
                tr = document.createElement('tr'); 

                td = document.createElement('td'); 
                td.setAttribute('data-th', 'First name: ');
                td.innerHTML = response['data'][i]['firstName'];
                tr.appendChild(td);
                
                td = document.createElement('td'); 
                td.setAttribute('data-th', 'Last name:  ');
                td.innerHTML = response['data'][i]['lastName'];
                tr.appendChild(td);

                td = document.createElement('td'); 
                td.setAttribute('data-th', 'Email:      ');
                td.innerHTML = response['data'][i]['email'];
                tr.appendChild(td);

                td = document.createElement('td'); 
                td.setAttribute('data-th', 'Department: ');
                td.innerHTML = response['data'][i]['department'];
                tr.appendChild(td);

                td = document.createElement('td'); 
                td.setAttribute('data-th', 'Location:   ');
                td.innerHTML = response['data'][i]['location'];
                tr.appendChild(td);

                td = document.createElement('td'); 
                td.setAttribute('data-th', '');
                var imgEdit = document.createElement('img'); 
                imgEdit.setAttribute('src', 'css/pen.svg');
                imgEdit.setAttribute('data-bs-toggle', 'modal' );
                imgEdit.setAttribute('data-bs-target', '#editPersModal' );
                imgEdit.addEventListener("click", function() { editPerson(this, response['data'][i]['id']); });
                var imgDelete = document.createElement('img');
                imgDelete.setAttribute('src', 'css/trash.svg');
                imgDelete.setAttribute('data-bs-toggle', 'modal' );
                imgDelete.setAttribute('data-bs-target', '#delPersModal' );
                imgDelete.addEventListener("click", function() { deletePerson(this, response['data'][i]['id']); });
                td.appendChild(imgEdit);
                td.appendChild(imgDelete);
                tr.appendChild(td);
                 
                tableContents.appendChild(tr);

          }
           
           
        },
    }).fail(function () {
        console.log("Error encountered!")
    });
};

//regex that allows letters, underscore, dash and space
var regExName = /^([a-zA-Z _-]+)$/;
var regExEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

//display alert function
function displayAlert(id, message){   
      $(id).html(message);
      $(id).css("display", "block");
      setInterval(function(){$(id).fadeOut();}, 3000);
}

//Add personnel
$("#addPersonnel").submit(function(e) {

  if($('#depDropdown-add').val()==null){
      e.preventDefault();
      displayAlert('#addAlertPers', 'Please select a department!');
  }else if($('#firstname').val()=="" || $('#lastname').val()=="" || $('#email').val()==""){
      e.preventDefault();
      displayAlert('#addAlertPers', 'Please complete all fields!');
  }else if(!regExName.test($('#firstname').val()) || !regExName.test($('#lastname').val())){
      e.preventDefault();
      displayAlert('#addAlertPers', 'Please only use letters, spaces, dashes or underscores for names!');
  }else{
  
    e.preventDefault(); 
   
    var form = $(this);
    
    $.ajax({
           type: "POST",
           url: "php/insertPersonnel.php",
           data: form.serialize(), 
           success: function(data)
           {
            populateDep();
            getAll();
           }
         });
  
         $('#firstname').val('');
         $('#lastname').val('');
         $('#email').val('');
        }
  
  });


//Update personnel

function editPerson(e, id){
  
//get row data  
  var row = e.closest("tr");
  var tds = $(row).find("td"); 

  var fields = [];

  $.each(tds, function() {   
    fields.push($(this).text());                     
  });
fields.pop();
fields.push(id);
//console.log(fields);

//populate edit form with row data
document.forms['editPersonnel']['firstname'].value = fields[0];
document.forms['editPersonnel']['lastname'].value = fields[1];
document.forms['editPersonnel']['email'].value = fields[2];
//document.forms['editPersonnel']['department'].value = fields[3];
document.forms['editPersonnel']['id-edit'].value = fields[5];

let dropdownEdit = $('#depDropdown-edit');

dropdownEdit.empty();

  
  $.ajax({
    type: 'GET',
    url: "php/getAllDepartments.php",
    success: function (response) {
  
        //console.log(response);
        //get data for department dropdown
        var result = response['data'].filter(obj => {
          return obj.name === fields[3]
        })[0]

        //console.log(result);
  
        //populate edit department dropdown
        if(response){
            for (let item of response['data']) {
              if(result.id == item.id){
                dropdownEdit.append($('<option selected="true"></option>').attr('value', item.id).text(item.name));
              } else {
                dropdownEdit.append($('<option></option>').attr('value', item.id).text(item.name));
              }
         }
        }

        
    },
  }).fail(function () {
    console.log("Error encountered!")
  });


}

$("#editPersonnel").submit(function(e) {

if($('#firstname-edit').val()=="" || $('#lastname-edit').val()=="" || $('#email-edit').val()==""){
    e.preventDefault();
    displayAlert('#editAlertPers','Please complete all fields!');
}else if(!regExName.test($('#firstname-edit').val()) || !regExName.test($('#lastname-edit').val())){
  e.preventDefault();
  displayAlert('#editAlertPers', 'Please only use letters, spaces, dashes or underscores for names!');
}else{

  e.preventDefault(); 
  $('#editPersModal').modal('hide');

  var form = $(this);
  
  $.ajax({
         type: "POST",
         url: "php/updatePersonnel.php",
         data: form.serialize(), 
         success: function(data)
         {
          getAll();
         }
       });
      }

});

//Delete personnel
function deletePerson(e, id){

  var event = e;
  var rmvFrom = e.parentNode.parentNode.parentNode;
  var rmv = e.parentNode.parentNode;
  document.forms['deletePerson']['id-del'].value = id;
  //e.parentNode.parentNode.parentNode.removeChild(e.parentNode.parentNode);

  $("#deletePerson").submit(function(e){

    event.parentNode.parentNode.parentNode.removeChild(event.parentNode.parentNode);

    e.preventDefault(); 
    var form = $(this);

    $.ajax({
        type: 'POST',
        url: "php/deletePersonnel.php",
        data: form.serialize(),
        success: function (response) {
    
            
            //console.log(response);
    
        }
    }).fail(function () {
        console.log("Error encountered!")
    });
  });
  
  
}


//Add department
$("#addDep").submit(function(e) {

  if($('#dep-location-add').val()==null){
      e.preventDefault();
      displayAlert('#addAlertDep',"Please select a location!");
  }else if($('#dep-add-name').val()==""){
      e.preventDefault();
      displayAlert('#addAlertDep', 'Please complete all fields!');
  }else if(!regExName.test($('#dep-add-name').val())){
    e.preventDefault();
    displayAlert('#addAlertDep', 'Please only use letters, spaces, dashes or underscores for names!');
  }else{
    e.preventDefault(); 
  
    var form = $(this);
    
    $.ajax({
           type: "POST",
           url: "php/insertDepartment.php",
           data: form.serialize(), 
           success: function(response)
           {
            console.log(response);
            if(response['data'].length != 0){
              displayAlert('#addAlertDep', "Department already present!");
            }
            populateDep();
            populateLoc();
            getAll();
           }
         }).fail(function () {
          console.log("Error encountered!")
        });
  
         $('#dep-add-name').val('');
  }
  

});



//Update department
$( "#dep-edit" ).change(function() {
  $('#dep-edit-name').val($(this).children(':selected').text());
});

$("#editDep").submit(function(e) {

if($('#dep-edit').val()==null){
    e.preventDefault();
    displayAlert('#editAlertDep', "Please select a department!");
}else if($('#dep-location-edit').val()==null){
  e.preventDefault();
  displayAlert('#editAlertDep', "Please select a location!");
}else if($('#dep-edit-name').val()==""){
    e.preventDefault();
    displayAlert('#editAlertDep', 'Please complete all fields!');
}else if(!regExName.test($('#dep-edit-name').val())){
  e.preventDefault();
  displayAlert('#editAlertDep', 'Please only use letters, spaces, dashes or underscores for names!');
}else{

  e.preventDefault(); 
 

  var form = $(this);
  
  $.ajax({
         type: "POST",
         url: "php/updateDepartments.php",
         data: form.serialize(), 
         success: function(response)
         {
           //console.log(response);
          if(response['data'].length != 0){
            displayAlert('#editAlertDep', "Department already exists!");
          }
          populateDep();
          populateLoc();
          getAll();
         }
       });

       $('#dep-edit-name').val('');

  }

});

//Delete department
$("#deleteDep").submit(function(e) {

  if($('#dep-del').val()==null){
    e.preventDefault();
    displayAlert('#delAlertDep', "Please select a department!");
  }else{

  e.preventDefault(); 
  

  var form = $(this);
  
  $.ajax({
         type: "POST",
         url: "php/deleteDepartmentByID.php",
         data: form.serialize(), 
         success: function(response)
         {
          console.log(response);
          if(response['data'].length != 0){
            displayAlert('#delAlertDep', "Department field contains other records!");
          }
          populateDep()
          getAll();
         }
       });

  }

});

//Add location
$("#addLoc").submit(function(e) {

  if($('#loc-add').val()==""){
    e.preventDefault();
    displayAlert('#addAlertLoc', 'Please complete the field!');
  }else if(!regExName.test($('#loc-add').val())){
    e.preventDefault();
    displayAlert('#addAlertLoc', 'Please only use letters, spaces, dashes or underscores for names!');
  }else{

  e.preventDefault();
  

  var form = $(this);
  
  $.ajax({
         type: "POST",
         url: "php/insertLocation.php",
         data: form.serialize(), 
         success: function(response)
         {
          //console.log(response);
          if(response['data'].length != 0){
            displayAlert('#addAlertLoc', "Location already present!");
          }
          populateLoc();
          getAll();
         }
       });
  
       $('#loc-add').val('');
      
      }

});



//Update location
$( "#loc-select-edit" ).change(function() {
  $('#loc-name-edit').val($(this).children(':selected').text());
});

$("#editLoc").submit(function(e) {

  if($('#loc-select-edit').val()==null){
    e.preventDefault();
    displayAlert('#editAlertLoc', "Please select a location!");
}else if($('#loc-name-edit').val()==""){
    e.preventDefault();
    displayAlert('#editAlertLoc', 'Please complete all fields!');
}else if(!regExName.test($('#loc-name-edit').val())){
  e.preventDefault();
  displayAlert('#editAlertLoc', 'Please only use letters, spaces, dashes or underscores for names!');
}else{

  e.preventDefault(); 
  

  var form = $(this);
  
  $.ajax({
         type: "POST",
         url: "php/updateLocation.php",
         data: form.serialize(), 
         success: function(response)
         {
          //console.log(response);
          if(response['data'].length != 0){
            displayAlert('#editAlertLoc', "Location already exists!");
          }
          populateLoc();
          getAll();
         }
       });

  $('#loc-name-edit').val('');

      }

});

//Delete location
$("#deleteLoc").submit(function(e) {

  if($('#loc-del').val()==null){
    e.preventDefault();
    displayAlert('#delAlertLoc', "Please select a location!");
  }else{

  e.preventDefault(); 


  var form = $(this);
  
  $.ajax({
         type: "POST",
         url: "php/deleteLocation.php",
         data: form.serialize(), 
         success: function(response)
         {
          console.log(response);

          if(response['data'].length != 0){
            displayAlert('#delAlertLoc', "Location field contains other records!");
          }
          populateLoc();
          getAll();
         }
       });

  } 
 

});


//Populate the departments select list
function populateDep(){
  let dropdownAdd = $('.depDropdown');

  dropdownAdd.empty();
  dropdownAdd.append('<option selected="true" value="dummy" disabled>Choose department</option>');
  dropdownAdd.prop('selectedIndex', 0);
    
    $.ajax({
      type: 'GET',
      url: "php/getAllDepartments.php",
      success: function (response) {
    
          //console.log(response);
    
          if(response){
              for (let item of response['data']) {
                dropdownAdd.append($('<option></option>').attr('value', item.id).text(item.name));
           }
          }
         
         
      },
    }).fail(function () {
      console.log("Error encountered!")
    });
}



//Populate the location select list
function populateLoc(){
  let dropdownAddLocation = $('.locDropdown');

  dropdownAddLocation.empty();
  dropdownAddLocation.append('<option selected="true" value="dummy" disabled>Choose location</option>');
  dropdownAddLocation.prop('selectedIndex', 0);
    
    $.ajax({
      type: 'GET',
      url: "php/getAllLocations.php",
      success: function (response) {
    
          //console.log(response);
    
          if(response){
              for (let item of response['data']) {
                dropdownAddLocation.append($('<option></option>').attr('value', item.id).text(item.name));
           }
          }
         
         
      },
    }).fail(function () {
      console.log("Error encountered!")
    });
}



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



