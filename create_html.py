 # -*- coding: utf-8 -*-

import os
import yaml #pip3 install pyyaml

table_date = {}
def editSwitch(oper,swName, swIP, swRole, swDesc):
    try:
        with open(r'switches.yaml') as file:
            table_date = yaml.load(file, Loader=yaml.FullLoader)
    except Exception as e:
            print("ERROR Reading switches.yaml file: "+str(e))

    if oper == "addSW":
        print("Adding "+swName)
        table_date[swName] = [swIP,swRole,swDesc]
    if oper == "delSW":
        print("Deleting "+swName)
        try:
            del table_date[swName]
        except Exception as e:
                print(str(e))
                print("ERROR: SW '"+swName+"' Does not exist")
    with open('switches.yaml', 'w') as outfile: #open file with "w" so no need to init old
        yaml.dump(table_date, outfile, default_flow_style=False)
    return table_date
    return "EDIT"
def main():
    try:
        with open(r'switches.yaml') as file:
            table_date = yaml.load(file, Loader=yaml.FullLoader)
    except Exception as e:
        print("ERROR Reading switches.yaml file: "+str(e))


    #print(table_date)
    print("Updating Switch list  ")



    table_header ='''
    <!DOCTYPE html>
    <!-- THIS HTML IS DYNAMICALLY CREATE BY THE create_html.py DO NOT TRY TO EDIT THIS FILE -->

    <script src="static/js/jquery-1.9.0.js"></script>
    <script src="static/js/switchList.js"></script>
    <script src="static/js/interfaceStatus.js"></script>


    <html>

    <head>
        <link rel="stylesheet" href= "static/css/switchList.css">
    </head>
      <body>
        <!-- <button class="open-button" onclick="openForm()">Open Form</button> -->

      <h2>Device List</h2>

      <input type="text" id="myInput" onkeyup="searchJS()" placeholder="Search ..." title="Type in a name"/>

      <table id="swTable">
        <tr class="header">
          <th style="width:20%;">Hostname</th>
          <th style="width:15%;">IP Address/DNS</th>
          <th style="width:15%;">Role</th>
          <th style="width:50%;">Description</th>

        </tr>
    '''


    table_content = ""
    for key in table_date:
        table_content = table_content + '<tr><td><a onclick="get_int_status('+"'"+table_date[key][0]+"'"
        table_content = table_content + ')" href="javascript:void(0);"> <h3>'+key
        table_content = table_content + '</h3></td> <td>'+str(table_date[key][0])+'</td><td>'+str(table_date[key][1])+'</td>   <td>'+str(table_date[key][2])+'</td></tr>\n'

    #print(table_content)

    table_footer='''
      </table>


      </body>
      </html>
    '''
    with open('templates/switchList.html', 'w') as the_file:
        the_file.write(table_header+table_content+table_footer)
        print('Finish')


if __name__ == '__main__':
    main()
