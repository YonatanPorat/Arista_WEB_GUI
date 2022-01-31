function loadpage(page)
      {
        $("#div_center").load(page);

      }

function login(data) //Callback to hide item on page AFTER the page is fully load.
      {  
        document.getElementById("login").style.display = "block";
        document.getElementById("addSW").style.display = "none";
        document.getElementById("delSW").style.display = "none";
      }
function addSW(data) //Callback to hide item on page AFTER the page is fully load.
      {  
        document.getElementById("login").style.display = "none";
        document.getElementById("addSW").style.display = "block";
        document.getElementById("delSW").style.display = "none";
      }    
function delSW(data) //Callback to hide item on page AFTER the page is fully load.
      {  
        document.getElementById("login").style.display = "none";
        document.getElementById("addSW").style.display = "none";
        document.getElementById("delSW").style.display = "block";
      }    


function config(page)
{
  console.log("Runnig config with "+page)
    if (page === "login") 
        {
          $("#div_center").load('edit', login);
        }
    else if (page === "addSW") 
        {
          $("#div_center").load('edit', addSW);
        }
    else if (page === "delSW") 
        {
          $("#div_center").load('edit', delSW);
        }
    else
        {
          console.log("Unknow page in config() function "+page)
        }
}


    


/*
function loadpage_switch(page)
    {
      $.ajax({
          type: 'GET',
          url: "/switchList", //
      });
      loadpage(page)
    }

function edit(page)
    {
      $.ajax({
          type: 'GET',
          url: "/edit", 
          success: function(){
            //loadpage("edit")
          },
        complete: function(){
            if (page === "login") {
              console.log("hiddine")
              document.getElementById("test").style.display = "none";

            }
          },



      });
      
    }*/