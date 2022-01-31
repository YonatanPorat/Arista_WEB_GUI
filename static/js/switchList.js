



var switchIP = ['Error']
var test_list =["1","2"]

//Getting Vlan list static
//vlanList = ["Do not change","Bezeqcom-LAB-Network-ENG_9","Bezeqcom-LAB-Network-ENG_10","Bezeqcom-LAB-VOIP_17","Cam-intercom_41","Avaya_50","Energy_54","Internet_72","Islands_108_Floor-0","Islands_109_Floor-1-A","Islands_110_Floor-1-B","Islands_111_Floor-2-A","Islands_112_Floor-2-B","Islands_113_Floor-3-A","Islands_114_Floor-3-B","Islands_115_Floor-4-A","Islands_88_Floor-4-B","Islands_89_Floor-5-A","Islands_90_Floor-5-B","Islands_91_Floor-6-A","Islands_92_Floor-6-B","Islands_93_Floor-7-A","Islands_94_Floor-7-B","Multimedia_400","Radio_18","Hatal_30","Hatal_31","Hatal_34","Hatal_36","BakaraKnisa_42","Cam_43","Pritza_44","Security-Hamanor_45","Hatal_48","144_57","144_51","Hatal_55","144_57","144_58","Print_59","Nas-Access_63","Hatal_99","Islands_131","Islands_132","Islands_142","Islands_151","Print_159","Islands_161","Islands_162","Islands_171","Islands_172","Islands_181","Islands_182","Islands_191","Islands_192","Islands_211","Islands_212","Islands_221","Islands_222","Islands_231","Islands_232","Islands_241","Islands_251","Islands_252","Islands_253","Print_259","Print_260","Islands_261","Islands_262","Islands_271","Printer_299","Bezeqcom_302","Engusr_305","Engusr_308","Engusr_309","Engusr_316","Engusr_319","Engusr_320"]
//populateSelect('selectVlan',vlanList)

//phoneList = ["Do not change","Centrex_80_Floor-0","Centrex_81_Floor-1-A","Centrex_101_Floor-1-B","Centrex_82_Floor-2-A","Centrex_102_Floor-2-B","Centrex_83_Floor-3-A","Centrex_103_Floor-3-B","Centrex_84_Floor-4-A","Centrex_104_Floor-4-B","Centrex_85_Floor-5-A","Centrex_105_Floor-5-B","Centrex_86_Floor-6-A","Centrex_106_Floor-6-B","Centrex_87_Floor-7-A","Centrex_107_Floor-7-B","P199-Avaya_152","P144_56","Centrex_100","Centrex_121","Centrex_122","Centrex_123","P199_150","P144_153","P144_154","P199_155","P199_156","P144_157","P144_158","Centrex_200","Centrex_201","Centrex_202","Centrex_203","Centrex_204","Centrex_205","Centrex_206","Centrex_207","Centrex_208","Centrex_209","Centrex_210","Centrex_214","Centrex_215","Centrex_216","Centrex_217","Centrex_218","P199_276"]
//populateSelect('selectPhone',phoneList)

//Getting vlan list from Yaml file
function myCallback2(results){
console.log('Running Function myCallback2')
console.log(results)
//populateSelect('selectVlan',results['vlanList'])  //Read vlan list from vlans.yaml
//populateSelect('selectPhone',results['phoneList']) //Read vlan list from vlans.yaml
//populateSelect('port_id',test_list) //Read interface list from the SW

}
//Callback 1 START
/*
foo2(myCallback2);

function foo2(callback) {
  $.ajax({
      type: 'GET',
      url: "/bcom_vlans", //
      dataType: 'json',
      success: callback
        }); //END ajax POST
}


function loadpage(page)
      {
        $("#div_center").load(page);
      }
//Callback 1 END
*/

function searchJS() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("swTable");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) 
  {
    hostname = tr[i].getElementsByTagName("td")[0];
    ipAdd = tr[i].getElementsByTagName("td")[1];
    role = tr[i].getElementsByTagName("td")[2];
    desc = tr[i].getElementsByTagName("td")[3];

    if (hostname) 
    {
      txtValue1 = hostname.textContent || hostname.innerText ;
      txtValue2 = ipAdd.textContent || ipAdd.innerText ;
      txtValue3 = role.textContent || role.innerText ;
      txtValue4 = desc.textContent || desc.innerText ;

      if (txtValue1.toUpperCase().indexOf(filter) > -1 || txtValue2.toUpperCase().indexOf(filter) > -1 || txtValue3.toUpperCase().indexOf(filter) > -1 || txtValue4.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

function getIntList (){
    //Get interface list from the switch
    //Get switch IP
    document.getElementById("leaf").value = switchIP[0] //Set sw name on popup form
    $.ajax({
      type: 'GET',
      url: "/update_interfaces", //
      dataType: 'json',
      success: callback
        }); //END ajax POST
}

function open_switchConfig (){
  //Get interface list from the switch
  //Get switch IP
  //document.getElementById("leaf").value = switchIP[0] //Set sw name on popup form
  $.ajax({
    type: 'GET',
    url: "/update_interfaces", //
    dataType: 'json',
    success: callback
      }); //END ajax POST
}


function populateSelect(selID,listName){

  var select = document.getElementById(selID);
   for(var i = 0; i < listName.length; i++)
   {
       var option = document.createElement("OPTION"),
           txt = document.createTextNode(listName[i]);
       option.appendChild(txt);
       console.log(txt)
       option.setAttribute("value",listName[i]);
       select.insertBefore(option,select.lastChild);
   }

}

function openForm(val)
 {
  document.getElementById("myForm").style.display = "block";
  switchIP[0]=val
  document.getElementById("leaf").value = switchIP[0] //Set sw name on popup form
 }

function closeForm() 
{
  document.getElementById("myForm").style.display = "none";
}


function isTrunk(){
  var trunkVal=document.getElementById("selectVlan").value
  if (trunkVal == "Trunk")
  {
    document.getElementById("VlanTrunk").disabled = false;
  }
  else 
  {   
    document.getElementById("VlanTrunk").value = "";
    document.getElementById("VlanTrunk").disabled = true;
  }
}

function set_btn(val){
  console.log('SET clicked');
  var portConfig_Dict = {'switch':'','port':'','admin_status':'','desc_text':'','isTrunk':'','vlan_num':'Do not change','phone_num':'Do not change'}; //Create JS dict with defualt inputs
  //var action = document.getElementById("sel_action_id").value;
  var portID = document.getElementById("port_id").value;
  var desc_text = document.getElementById("desc_text").value;
  var adminStat = document.getElementById("sel_adminStatus_id").value;
  var vlan_str = document.getElementById("selectVlan").value;
  var phone_str = document.getElementById("selectPhone").value;
  portConfig_Dict['isTrunk']=false 

  if (vlan_str == 'Do not change')
       {
         var vlan_str = 'Do not change'}
  else if (vlan_str == 'Trunk')
  {
    vlan_str = document.getElementById("VlanTrunk").value 
    portConfig_Dict['vlan_num']=vlan_str 
    portConfig_Dict['isTrunk']=true        
  }
  else {
        portConfig_Dict['vlan_num']=vlan_str 
        }
  if (phone_str == 'Do not change')
       {
        phone_num = 'Do not change'
       }
  else
       { 
        portConfig_Dict['phone_num'] = phone_str
       }

  portConfig_Dict['switch']=switchIP[0] //function openForm(aa) will update this
  portConfig_Dict['port']=portID
  portConfig_Dict['desc_text']=desc_text
  portConfig_Dict['admin_status']=adminStat


  console.log(portConfig_Dict);

  var retVal =confirm ("Setting SW: "+portConfig_Dict['switch']+"\nInterface: "+portConfig_Dict['port']+"\nData Vlan: "+portConfig_Dict['vlan_num']+"\nPhone Vlan: "+portConfig_Dict['phone_num']+"\nAdmin Status: "+portConfig_Dict['admin_status'] )
  if (retVal == true)
  {
    loadpage('waiting')

    console.log('Running /update_configlet');

    function myCallback(results){
      console.log('Running Function myCallback')
      console.log(results)
      loadpage('port_config')
      //alert(JSON.stringify(results, null, 4));
      alert(results['data'])
    }
    foo(myCallback);

    function foo(callback) {
      $.ajax({
          type: 'POST',
          url: "/update_configlet", //
          dataType: 'json',
          data: JSON.stringify(portConfig_Dict), //POST data in JSON
          success: callback
            }); //END ajax POST
    }

        //post values to /update_configlet page to update the configlet

  } //END if confirm == yes
  else
  {
      alert("Action aborted!");
      return false;
  }

} //END finc set btn





/*
function change_box() {
    d = document.getElementById("sel_action_id").value;
    if (d == 'desc'  )
    {
      document.getElementById('desc_text').style.display = 'inline';
      document.getElementById('desc_header').style.display = 'inline';
      document.getElementById('selectVlan_header').style.display = 'none';
      document.getElementById('selectVlan').style.display = 'none';
      document.getElementById('selectVlan_header').style.display = 'none';
      document.getElementById('selectVlan').style.display = 'none';
    }
    else if (d == 'vlan'  )
    {
      document.getElementById('desc_text').style.display = 'none';
      document.getElementById('desc_header').style.display = 'none';
      document.getElementById('selectVlan_header').style.display = 'none';
      document.getElementById('selectVlan').style.display = 'none';
      document.getElementById('selectVlan_header').style.display = 'inline';
      document.getElementById('selectVlan').style.display = 'inline';

      populateSelect('selectVlan',vlanList)
    }
    else if (d == 'shut'  )
    {
      document.getElementById('desc_text').style.display = 'none';
      document.getElementById('desc_header').style.display = 'none';
      document.getElementById('selectVlan_header').style.display = 'none';
      document.getElementById('selectVlan').style.display = 'none';
      document.getElementById('selectVlan_header').style.display = 'none';
      document.getElementById('selectVlan').style.display = 'none';
    }

    else if (d == 'noShut'  )
    {
      document.getElementById('desc_text').style.display = 'none';
      document.getElementById('desc_header').style.display = 'none';
      document.getElementById('selectVlan_header').style.display = 'none';
      document.getElementById('selectVlan').style.display = 'none';
      document.getElementById('selectVlan_header').style.display = 'none';
      document.getElementById('selectVlan').style.display = 'none';
    }

}
*/

function port_config(val){
  // THIS FUNC IS NOT IN USE!
  document.getElementById("myForm").style.display = "block"; //This will open the POP up box

  console.log('Port conifg '+val);

  //read values from select box on /port_config.html
  var action = document.getElementById("sel_action_id");
  var portID = document.getElementById("port_id");
  var switchIP = document.getElementById("switch_id");
  var desc_text = document.getElementById("desc_text");

  var portConfig_Dict = {'switch':'','port':'','action':'','desc_text':''}; //Create JS dict with defualt inputs
  portConfig_Dict['switch']=switchIP.value
  portConfig_Dict['port']=portID.value
  portConfig_Dict['action']=action.value
  portConfig_Dict['desc_text']=desc_text.value

  console.log(portConfig_Dict);

  //post values to /update_configlet page to update the configlet
  $.ajax({
      type: 'POST',
      url: "/update_configlet", //
      dataType: 'json',
      data: JSON.stringify(portConfig_Dict), //POST data in JSON format
        }); //END ajax POST

} //END port_config function
