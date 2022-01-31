
function clearLogs()
{
  if (confirm('Clear log file?')) {
      console.log("Clearing logs")
      $.ajax({
        type: 'GET',
        url: "/clearLogs", //
        dataType: 'json',
          }); //END ajax POST
  
  } else {
    return;
  }
  

}
function viewUser()
{

  console.log("ViewUser")
  $.ajax({
    type: 'GET',
    url: "/viewUser", //
    dataType: 'json',
    success: function(results){
      if (results==="")
      {
        alert ("No user configured")
      }
      else
      alert ("User: "+results)

    },

      }); //END ajax POST

  
}
function submitUserAction()
{

    console.log("submitUserAction() Function started " )
    var userInput = document.getElementById("edit_FRM");
    var userDict = {'oper':'','user':'','pass':'','hname':'','ip':'','role':'','desc':''};

    if (document.getElementById("login").style.display==='block')
    {
      userDict['oper']='login'
    }
    if (document.getElementById("addSW").style.display==='block')
    {
      userDict['oper']='addSW'
    }
    if (document.getElementById("delSW").style.display==='block')
    {
      userDict['oper']='delSW'
    }

    console.log(userDict )

    if (userDict['oper']=='login')
    {
      userDict['user'] = userInput.elements[0].value;    // Params from form
      userDict['pass'] = userInput.elements[1].value;    // Params from form

        $.ajax({
            type: 'POST',
            url: "/update_yaml", //Calling python code  /addDeviceToDB on app.py file
            dataType: 'json',
            data: JSON.stringify(userDict),
            success: function(results){
              console.log (results)
              alert ('User: '+userDict['user']+' - Updated')
            },
               //POST data in JSON format
        });
        
    }
    else if (userDict['oper'] == 'addSW')
      {
        userDict['hname'] = userInput.elements[2].value;    // Params from form
        userDict['ip'] = userInput.elements[3].value;    // Params from form
        if (userDict['hname']==='' || userDict['ip']==='')  // If hostnam
        {
          alert ("Hostname\\IP cannont be empty");
          return;
        }
        
        userDict['role'] = userInput.elements[4].value;   // Params from form
        userDict['desc'] = userInput.elements[5].value;   // Params from form

          $.ajax({
              type: 'POST',
              url: "/update_yaml", //Calling python code  /addDeviceToDB on app.py file
              dataType: 'json',
              data: JSON.stringify(userDict), //POST data in JSON format
              success: function(){
                alert (userDict['hname']+' Added')
              },
          });
      }

  else if (userDict['oper'] == 'delSW')
  {
    console.log("Deleting SW "+userDict['delSWIP'])
    userDict['delSWIP'] = userInput.elements[6].value;   // Params from form

      $.ajax({
          type: 'POST',
          url: "/update_yaml", //Calling python code  /addDeviceToDB on app.py file
          dataType: 'json',
          data: JSON.stringify(userDict), //POST data in JSON format
          success: function(results){
            console.log(results)
            alert (results['data'])

          },
      });
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
  console.log(delSW_Input)
  delSW['name'] = delSW_Input.elements[0].value;     // Params from form
  console.log(delSW_Input.elements)
  console.log( "document.getElementById()")

  console.log( document.getElementById("delSWIP").textContent)

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
