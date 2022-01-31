function getDropDown(selectObject) {
  var value = selectObject.value;
  console.log(value);
  if (value == 'selAct')
  {
    var name = document.getElementById('name_li');
    var ip = document.getElementById('ip_li');
    var role = document.getElementById('role_li');
    var desc = document.getElementById('desc_li');
    ip.style.display = "none";
    role.style.display = "none";
    desc.style.display = "none";

  }
  else if (value == 'addSW')
  {
    document.getElementById("nameTxt").innerHTML = "Switch name";
    var ip = document.getElementById('ip_li');
    var role = document.getElementById('role_li');
    var desc = document.getElementById('desc_li');
    ip.style.display = "inline";
    role.style.display = "inline";
    desc.style.display = "inline";
  }
  else if (value == 'addVlan')
  {
    document.getElementById("nameTxt").innerHTML = "Vlan name: vlanName_vlanNumber";

    var ip = document.getElementById('ip_li');
    var role = document.getElementById('role_li');
    var desc = document.getElementById('desc_li');
    ip.style.display = "none";
    role.style.display = "none";
    desc.style.display = "none";
  }
  else if (value == 'addPvlan')
  {
    document.getElementById("nameTxt").innerHTML = "Phone Vlan name: vlanName_vlanNumber";
    var ip = document.getElementById('ip_li');
    var role = document.getElementById('role_li');
    var desc = document.getElementById('desc_li');
    ip.style.display = "none";
    role.style.display = "none";
    desc.style.display = "none";
  }
  else if (value == 'delSW')
  {
    document.getElementById("nameTxt").innerHTML = "Switch name to delete";
    var ip = document.getElementById('ip_li');
    var role = document.getElementById('role_li');
    var desc = document.getElementById('desc_li');
    ip.style.display = "none";
    role.style.display = "none";
    desc.style.display = "none";
  }
  else if (value == 'delVlan')
  {
    document.getElementById("nameTxt").innerHTML = "Vlan name to delete";
    var ip = document.getElementById('ip_li');
    var role = document.getElementById('role_li');
    var desc = document.getElementById('desc_li');
    ip.style.display = "none";
    role.style.display = "none";
    desc.style.display = "none";
  }
  else if (value == 'delPvlan')
  {
    document.getElementById("nameTxt").innerHTML = "Phone Vlan name to delete";
    var ip = document.getElementById('ip_li');
    var role = document.getElementById('role_li');
    var desc = document.getElementById('desc_li');
    ip.style.display = "none";
    role.style.display = "none";
    desc.style.display = "none";
  }
  else
  {
    console.log("Error in getDropDown() edit.js ")

  }
}

function clearLogs()
{
  console.log("Clearing logs")
  $.ajax({
    type: 'GET',
    url: "/clearLogs", //
    dataType: 'json',
      }); //END ajax POST

}

function submitUserAction()
{

    console.log("submitUserAction() Function started " )

    var userInput = document.getElementById("edit_FRM");
    var userDict = {'oper':'','name':'','ip':'','role':'','desc':''};

    userDict['oper'] = userInput.elements[0].value;
    userDict['name'] = userInput.elements[1].value;     // Params from form
    if (userDict['name'] ==""){
      alert("Please fill all fields. Name cannot be empty")
      return;
    }

    console.log(userDict)
    if (userDict['oper']=='addSW' || userDict['oper']=='addVlan' || userDict['oper']=='addPvlan')
    {

    } 
  if (userDict['oper'] == 'addSW')
  {
    userDict['ip'] = userInput.elements[2].value;    // Params from form
    userDict['role'] = userInput.elements[3].value;   // Params from form
    userDict['desc'] = userInput.elements[4].value;   // Params from form

      $.ajax({
          type: 'POST',
          url: "/update_yaml", //Calling python code  /addDeviceToDB on app.py file
          dataType: 'json',
          data: JSON.stringify(userDict), //POST data in JSON format
      });
      alert (userDict['name']+' Added')
  }

  else if (userDict['oper'] == 'delSW')
  {
    console.log("Deleting SW "+userDict['name'])

      $.ajax({
          type: 'POST',
          url: "/update_yaml", //Calling python code  /addDeviceToDB on app.py file
          dataType: 'json',
          data: JSON.stringify(userDict), //POST data in JSON format
      });
      alert (userDict['name']+' deleted')
  }
  else if (userDict['oper'] == 'addVlan' || 'addPvlan' || 'delVlan' || 'delPvlan' )
  {


      function myCallback(results){
          console.log('Running Function myCallback_fn')
          console.log(results)
          alert(JSON.stringify(results, null, 4));
      }

      foo(myCallback);

      function foo(callback) {
        console.log('foo...')
          $.ajax({
              type: 'POST',
              url: "/vlan_update",
              dataType: 'json',
              data: JSON.stringify(userDict),
              success: callback
          }); // END Ajax
        }//End Foo


}

  else
  {
    console.log("Error edit.js")
  }
}// END  submitUserAction()



function ValidateUserInput(inputText,oper,validateAs)
   {
     console.log("Validating "+inputText+" as "+validateAs)
     var ipMask = /^(?=.*[^\.]$)((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.?){4}$/gm
     var name = /^Bcom-Azrieli/gm
     var mac = /^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$/igm
     var vlan = /[_]\d/gm //Match _ then digit eng_556
     if (validateAs == 'name')
     {
      if (oper == 'addVlan' || oper == 'addPvlan' )
       {format = vlan}
      if (oper == 'addSW' )
       {format = name}

     }
     else if (validateAs == 'vlan')
     {
       format = vlan
     }
     else if  (validateAs == 'mac')
     {
       format = mac
     }
     else
     {
       console.log("Error! Unknow validateAs: "+validateAs)

     }
     if(inputText.match(format))
       {
       //document.form1.text1.focus();
       console.log("Valid OK")
       return true;
       }
     else
       {
       //alert("You have entered an invalid "+validateAs+" address!\n"+inputText);
       //document.form1.text1.focus();
       return false;
       }
   } //END ValidateUserInput(inputText,validateAs)


function deleteDevice()
{
  console.log("delete Device Function started")
  var delSW_Input = document.getElementById("edit_FRM");
  var delSW = {'oper':'del','name':'','ip':'','role':'','desc':''};

  delSW['name'] = delSW_Input.elements[1].value;     // Params from form

  console.log(delSW)

     var conf = confirm("The Following SW: '"+delSW['name']+"' Will be deleted")
     if (conf == true)
     {
       function myCallback2(results){
           console.log('Running Function myCallback2')
           console.log(results)
           alert(JSON.stringify(results, null, 4));
       }

       foo2(myCallback2);



       $.ajax({
           type: 'POST',
           url: "/update_yaml", //Calling python code  /addDeviceToDB on app.py file
           dataType: 'json',
           data: JSON.stringify(delSW), //POST data in JSON format
           success: callback

       });
     }

     else {
       {
         console.log ("Device delete was canceled by User")

       }
     }

  }  // End Function
