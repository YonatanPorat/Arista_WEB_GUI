

var int_dict = {}; //dict with full data on each interface
var interface_list = []; //Only the interface names


function initTable(tableID){
    //Delete all cells in a given table
    console.log("init table: "+tableID)
    rowCount = document.getElementById(tableID).rows.length;
    console.log("# of rows: "+rowCount)
    for (let i = 1; i < rowCount-1; i++) {
        document.getElementById(tableID).deleteRow(i);
    }
}
function isEmpty(obj) { //Check if dict is empty
    return Object.keys(obj).length === 0;
  }
   

function loadpage(page)
      {
        $("#div_center").load(page);
      }

var validation = {
            isIPAddress:function(str) {
                var pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
                return pattern.test(str);  // returns a boolean
            },
            isNotEmpty:function (str) {
                var pattern =/\S+/;
                return pattern.test(str);  // returns a boolean
            },
            isVlan:function(str) {
                console.log("VALIDATING "+str)
                var pattern = /^\d+$/;
                if (str ==="no") //if numbers
                {
                    return true;
                }
                if (pattern.test(str)) //if numbers
                {
                    if ((str > 0) && (str <4095) ){return true; }
                    else {return false;}
                }
                else {return false;}

            },
            isIPmask:function(str) {
                var pattern = /^\d+$/;
                if (pattern.test(str)) //if numbers
                {
                    if ((str > 1) && (str <32) ){return true; }
                    else {return false;}
                }
                else {return false;}
            },

            isSame:function(str1,str2){
                return str1 === str2;
            }
        };   
    
function update_int_status(){
    //When user is trying to update inteface status of an existing SW
    switchIP = document.getElementById("span_IP_ID").textContent //Extracting the swip IP from the table header
    if (switchIP == 'No_leaf'){alert("Please select switch from switch list menu")}
    tmp=switchIP.split(": ")
    switchIP = tmp[1]
    console.log("Refreshing: "+switchIP)
    get_int_status(switchIP)
}

function get_int_status(swip){
    //When user select switch from switch list page to edit its intefaces
    switchIP = swip
    console.log("loading page with SWIP: "+swip)
    loadpage('interfaceStatus')

    $.ajax({
        type: 'POST',
        url: "/getIntStatus", //Calling python code  on app.py file
        dataType: 'json',
        data: JSON.stringify(switchIP), //POST data in JSON format
        success: function(results){
            cnt=0
            document.getElementById("update_int_status_ID").disabled = true;
            document.getElementById("update_int_status_ID2").disabled = true;
            //nat sort array of key
            for (const [key, value] of Object.entries(results)) //Iteraring on the "results" dict
            { 
                //incase we got error msg from the switch
                if (key === "data") {alert(results['data']); } //alert the user with error
                //Skip this key as this is not an Interface
                if (key === "Management1") { continue; } 
                if (key === "moreInfo") { continue; } 
                interface_list.push(key); 
            }
            var collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'}); //natural sort of interfaces eth1,eth10 --> eth1,eth2
            interface_list.sort(collator.compare);//natural sort of interfaces eth1,eth10 --> eth1,eth2
            var swModelName = results["moreInfo"]['showVer']['modelName'];
            var swHostName = results["moreInfo"]['hostName']['hostname'];
            //run in loop on all keys
            for (var i = 0; i < interface_list.length; i++) {
                 key = interface_list[i]
                 if (key === "data") {  //incase sw is unreachable 
                        alert(results[key]);
                        break; 
                    }
                    if (key === "switchports") { continue; } //Skip this key as this is not an Interface
                    if (key === "interfaces") { continue; } //Skip this key as this is not an Interface
                    if (key === "moreInfo") { continue; } //Skip this key as this is not an Interface
                    cnt=cnt+1

                    //LLDP neigbohr
                    var lldpList = "" //Init neigh list
                    if (isEmpty(results['moreInfo']['lldp']))
                    {
                        lldpList = "LLDP is not running"
                    }
                    else
                    {
                        for (const neighborX of (results['moreInfo']['lldp'])) {
                            if (neighborX["port"] === key)
                            {
                                lldpList=neighborX["neighborDevice"]+":"+neighborX["neighborPort"]+lldpList+","
                            }
                          }
                        //END LLDP     
                    }
                 
                    var int_OperStatus = results[key]['linkStatus'];
                    var int_Mode = results[key]['vlanInformation']['interfaceMode'];
                    var int_Desc = results[key]['description'];
                    var int_bw = results[key]['bandwidth']/1000000000+"G";
                    if (int_OperStatus === "disabled"){
                        var int_adminStatus = "SHUTDOWN"
                    }
                    else {
                        var int_adminStatus = "NO SHUT"
                    }
                    if (int_bw=="0G"){int_bw=results[key]['interfaceType']}
                    if (key === "Management1") { continue; } //Skip this key 
                    if (int_Mode !== "routed")
                    { 
                            var int_trunkNative = results['moreInfo']['switchports']['switchports'][key]['switchportInfo']['trunkingNativeVlanId'];
                            if (results['moreInfo']['switchports']['switchports'][key]['switchportInfo']['mode']=="trunk"){
                                var int_vlan = results['moreInfo']['switchports']['switchports'][key]['switchportInfo']['trunkAllowedVlans'];
                            }
                            else if (results['moreInfo']['switchports']['switchports'][key]['switchportInfo']['mode']=="access") {
                                var int_vlan = results['moreInfo']['switchports']['switchports'][key]['switchportInfo']['accessVlanId'];
                            }
                            else{
                                var int_vlan = "L3 Interface"
                            }
                            if (results['moreInfo']['switchports']['switchports'][key]['switchportInfo']['phoneVlan']=="0"){
                                var int_PhoneVlan = "no";
                            }
                            else {
                                var int_PhoneVlan = results['moreInfo']['switchports']['switchports'][key]['switchportInfo']['phoneVlan'];
                            }
                    } 
                    else //Routed Interface
                    {
                        var int_trunkNative = "";
                        var int_PhoneVlan = "";
                        var int_vlan = results['moreInfo']['interfaces']['interfaces'][key]['interfaceAddress']['ipAddr']['address']+"/"+results['moreInfo']['interfaces']['interfaces'][key]['interfaceAddress']['ipAddr']['maskLen'];
                    }
                    if (int_OperStatus == "disabled") {
                        int_shut = "no shut";
                    } else {
                        int_shut = "shut";
                    }
                    //Change the dropdown button on GUI according to interface mode
                    if (int_Mode === "trunk")
                    {
                        selectl2 = "";
                        selectTrunk = "selected";
                        selectl3 = "";
                    }                 
                    else if (int_Mode === "routed")
                    {
                        selectl2 = "";
                        selectTrunk = "";
                        selectl3 = "selected";
                    }       
                    else //Bridged mode  
                    {
                        selectl2 = "selected";
                        selectTrunk = "";
                        selectl3 = "";
                    }
                    int_PhoneMode = "Tagged"           
                    td0_checkBox = "<td><input class='form-check-input'  type='checkbox' id='CHK_"+key+"'  value=''  aria-label='...' /> </td>"
                    td0_spinner = "<td> <div id='SPN_"+key+"' class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div> </td>"
                     $(int_table).find('tbody').append("<tr id='row_"+key+"'>"+td0_checkBox+
                                                                            "<td class='mpt-3-half' contenteditable='false'' >"+key+"</td>"+
                                                                            "<td class='mpt-3-half' contenteditable='true' onchange='myFunction()' >"+int_Desc+"</td>"+
                                                                            "<td><span class='table-remove'><button id='BTN_"+key+"'onclick='shutInt(this.id)' type='button' class='btn btn-danger btn-rounded btn-sm my-0'>"+int_adminStatus+"</button></span></td>"+
                                                                            "<td class='mpt-3-half' contenteditable='false'' >"+int_OperStatus+"</td>"+
                                                                            "<td class='mpt-3-half' contenteditable='false'>"+int_bw+"</td>"+
                                                                            "<td class='mpt-3-half' ><select id='MODE_"+key+"' class='browser-default custom-select'><option "+selectl2+" value='l2'>Access</option><option "+selectTrunk+" value='trunk'>Trunk</option><option "+selectl3+" value='Routed'>L3</option></select></td>"+
                                                                            "<td class='mpt-3-half' contenteditable='true'>"+int_trunkNative+"</td>"+
                                                                            "<td class='mpt-3-half' contenteditable='true'>"+int_vlan+"</td>"+
                                                                            "<td class='mpt-3-half' contenteditable='true'>"+int_PhoneVlan+"</td>"+
                                                                            "<td class='mpt-3-half' contenteditable='false'>"+lldpList+"</td>");

                                                                            //"<td><span class='table-remove'><button id='BTNP_"+key+"'onclick='phoneMode(this.id)' type='button' class='btn btn-danger btn-rounded btn-sm my-0'>"+int_PhoneMode+"</button></span></td>");
                    
            }// END Iteraring on the "results" dict
            
            document.getElementById("int_table_header_id").innerHTML ="<b>"+swHostName+"</b> ("+swModelName+")<br><span id='span_IP_ID' > Connected to: "+swip+"</span> ";
            
            //itreate table cell to change "no shut" to green
            const table = document.querySelector("table");  
            for (const row of table.rows) 
            {  
                if (typeof row.getElementsByTagName("td")[3] !== 'undefined'){ //Skip table header
                    var adminStatusTXT = row.getElementsByTagName("td")[3]; 
                    var adminStatusID = "BTN_"+row.getElementsByTagName("td")[1].innerText;  //extract ID of the shut\no shut button
                    if (adminStatusTXT.innerText === "NO SHUT")
                    {
                        document.getElementById(adminStatusID).style.backgroundColor = "green";
                    }
                    else 
                    {
                        document.getElementById(adminStatusID).style.backgroundColor === "f93154";
                    }

                }
            }
        },
        complete: function(){
            document.getElementById("spinner1").style.display = "none";
            document.getElementById("update_int_status_ID").disabled = false;
            document.getElementById("update_int_status_ID2").disabled = false;

          },
  
    });

}

function set_cfg()
{
    //user clicked to "update button"
    switchIP = document.getElementById("span_IP_ID").textContent //Extracting the swip IP from the table header
    tmp=switchIP.split(": ")
    switchIP = tmp[1]
    //switchIP = '10.100.164.109'
    update_int_dict = {[switchIP]:{}}
    int_dict = {}
    const table = document.querySelector("table");  
            for (const row of table.rows)  //Itrate on table to find which interfaces needs to be update
            {  
                    //console.log(row) 
                    var td1 = row.getElementsByTagName("td")[1]; //td1 is the second cell in each row contain int name
                    if (typeof td1 !== 'undefined'){ //Skip table header
                        if (is_checked("CHK_"+td1.innerHTML)) //from Int name with have the update btn ID
                        {
                            //Change the checkbox button into updating spinner
                            document.getElementById("CHK_"+td1.innerHTML).type = ""
                            document.getElementById("CHK_"+td1.innerHTML).className = "spinner-border text-primary";
                            //Interfaces to update
                            console.log(td1.innerHTML)
                            var td1_name = row.getElementsByTagName("td")[1].innerHTML; 
                            //Create interface to update dict
                            var intDesc = row.getElementsByTagName("td")[2].innerHTML; 
                            var intAdminStatus = row.getElementsByTagName("td")[3].innerText; 
                            var intMode = document.getElementById("MODE_"+td1_name).value; 
                            var intNativeVlan = row.getElementsByTagName("td")[7].innerHTML; 
                            var intAccVlan = row.getElementsByTagName("td")[8].innerText; 
                            var intPhoneVlan = row.getElementsByTagName("td")[9].innerHTML;
                            int_dict[td1_name] = {"td1_name":td1_name,"desc":intDesc,"nativeVlan":intNativeVlan,"accVlan":intAccVlan,"phoneVlan":intPhoneVlan,"adminStatus":intAdminStatus,"intMode":intMode}
                            console.log(intMode)

                            if (intMode === "bridged" || intMode === "l2") //User Input L2 Validation 
                            {
                                if (validation.isVlan(intAccVlan))
                                {
                                    console.log("VLAN OK")
                                }
                                else {alert("Error in Interfaces "+td1_name+" - '"+intAccVlan+"' Access Vlan Is not a valid Vlan Number (1-4094)")
                                return;  }

                                if (validation.isNotEmpty(intPhoneVlan))
                                {
                                    console.log ("PHONE NT EMPTY VALIDATING");
        
                                    if (validation.isVlan(intPhoneVlan))
                                    {
                                        console.log("Phone OK")
                                    }
                                    else {alert("Error in Interfaces "+td1_name+" - '"+intPhoneVlan+"' Phone Vlan Is not a valid Vlan Number (1-4094)")
                                    return;  }
    
                                }

                                if (validation.isVlan(intNativeVlan))
                                {
                                    console.log("Phone OK")
                                }
                               
                                else {alert("Error in Interfaces "+td1_name+" - '"+intNativeVlan+"' Native Vlan Is not a valid Vlan Number (1-4094)")
                                return;  }
                            } //END User Input L2 Validation 
                            if (intMode === "trunk") //User Input Trunk Validation 
                            {
                                if (validation.isVlan(intNativeVlan))
                                {continue;}
                                else {alert("Error in Interfaces "+td1_name+" - '"+intNativeVlan+"' Native Vlan not a valid Vlan Number (1-4094)")
                                return;  }
                            } //User Input Trunk Validation 
                            
                            if (intMode === "Routed") //User Input L3 Validation 
                            {
                                console.log("VALID R#")
                                const ip_split= intAccVlan.split('\/');
                                console.log("IP: "+ip_split[0])
                                console.log("MASK: "+ip_split[1])
                                
                                if (validation.isIPAddress(ip_split[0]))
                                {
                                    if (validation.isIPmask(ip_split[1]))
                                        {continue;}
                                    else 
                                    {
                                        alert("Error in Interfaces "+td1_name+" - '"+intAccVlan+"' Is not a valid Subnet format ex: x.x.x.x/x")
                                        return;  
                                    }
                                }
                                else 
                                {
                                    alert("Error in Interfaces "+td1_name+" - '"+intAccVlan+"' Is not a valid IP format ex: x.x.x.x/x")
                                    return;
                                }
                                

                            }//User Input L3 Validation 
                    } //END If checked
            } //End TypeOf 
        }//End table iteration
            update_int_dict[switchIP]=int_dict
            console.log("update_int_dict")
            console.log(int_dict)

            numOfInt=Object.keys(int_dict).length

            var intString = ""
            for (const [key, value] of Object.entries(int_dict)) {
                console.log(key, value);
                if (numOfInt==1)
                {
                    intString = key
                }
                else
                {
                    intString = key+'\n'+intString
                }
              }
            if (intString === "")   
            {
                alert ("No Interfaces were selected")
                return;
            }          
            alertString = "Interfaces: \n"+intString+"\nOn "+switchIP+" will be updated, Are you sure?"
            if (confirm(alertString)) {
                document.getElementById("set_cfg_ID").disabled = true;

                $.ajax({
                    type: 'POST',
                    url: "/setCfg", //Calling python code  on app.py file
                    dataType: 'json',
                    data: JSON.stringify(update_int_dict), //POST data in JSON format
                    success: function(results){
                        console.log("results['data'][0]")
                        console.log(results['data'][0])
                        if  (results['data'][0] === undefined)
                        {
                            //Change updating spinner back to checkbox button  
                            for (const [key, value] of Object.entries(int_dict))
                             {
                                document.getElementById("CHK_"+key).type = "checkbox"
                                document.getElementById("CHK_"+key).className = "form-check-input";
                                document.getElementById("CHK_"+key).checked=false
                              }
                              alert("Done, Please check logs")

                
                        }
                        else
                        {
                            alert(results['data'])
                        }                        
                    },
                    complete: function(){ 
                        document.getElementById("set_cfg_ID").disabled = false;
                       
                      },
                })
              } 
              else 
              {
                console.log('Update aborted by user');
                 //Change updating spinner back to checkbox button  
                for (const [key, value] of Object.entries(int_dict))
                {
                   document.getElementById("CHK_"+key).type = "checkbox"
                   document.getElementById("CHK_"+key).className = "form-check-input";
                   document.getElementById("CHK_"+key).checked=false
                 }
                 return;
              }
} //END Set_CFG


function is_checked(chk_btn_id) { //Check which intefaces are checkd to config
    if (document.getElementById(chk_btn_id).checked) {
        return true
    } else {
        return false
    }
}

function shutInt(btn_id){ 
    intr=btn_id.slice(4);
    var int_prop = document.getElementById(btn_id);
    btn_status = int_prop.innerText
    if (btn_status === "SHUTDOWN" )
    {
        document.getElementById(btn_id).style.backgroundColor = "green";
        document.getElementById(btn_id).innerText = "no SHUT"}
    if (btn_status ==="NO SHUT")
    {
        document.getElementById(btn_id).style.backgroundColor = "#f93154";
        document.getElementById(btn_id).innerText = "SHUTDOWN"}
}

function phoneMode(btn_id){ 
    intr=btn_id.slice(5);
    console.log(intr)

    var int_prop = document.getElementById(btn_id);
    btn_status = int_prop.innerText
    console.log(btn_status)

    if (btn_status === "TAGGED" )
    {
        document.getElementById(btn_id).style.backgroundColor = "blue";
        document.getElementById(btn_id).innerText = "UN-TAGGED"}
    if (btn_status ==="UN-TAGGED")
    {
        document.getElementById(btn_id).style.backgroundColor = "blue";
        document.getElementById(btn_id).innerText = "TAGGED"}
}
// ----------------------------------------------- //
