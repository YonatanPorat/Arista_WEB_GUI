#!/usr/bin/env python
# -*- coding: utf-8 -*-
# encoding: utf-8

"""

Written by: yoni@arista.com

"""
__author__      = "Yonatan Porat"



import os,sys
from flask import Flask,render_template, request,json,jsonify,redirect, url_for,session
from flask import send_file, send_from_directory, safe_join, abort
from werkzeug.utils import secure_filename
from jsonrpclib import Server
import requests
import requests.packages.urllib3
import re
import logging
import create_html #file name create_html.py
from natsort import natsorted #pip3 install natsort
import subprocess
import time
import datetime
import io
import os.path
from flask import abort
import base64 #For password encription
import hashlib #For password encription
import smtplib
import yaml
import pprint
import zipfile
import requests
import random
import ssl
ssl._create_default_https_context = ssl._create_unverified_context
requests.packages.urllib3.disable_warnings()

ts = time.time()
st = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S') #Formatted timestamp for logger

#ALLOWED_EXTENSIONS for FE
ALLOWED_EXTENSIONS = set(['txt', 'db','png'])

#Global Params
tmp =''
logfile = "templates/logs.html"
sw_cred = ['',''] #Switch login updated by the swConfig() func

#Main
app = Flask(__name__)

#Functions

def write2log(txt):
    ts = time.time()
    st = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S') #Formatted timestamp for logger
    with open(logfile, 'a') as log:
        log.write(st+"   |   "+txt)
        log.write("<br>")

def swConfig():
    #read user/pass from config.yaml file
    try:
        with open(r'config.yaml') as file:
            cred_from_yaml = yaml.load(file, Loader=yaml.FullLoader)
            sw_cred[0] = cred_from_yaml['swCred'][0]
            decoded64=base64.b64decode(cred_from_yaml['swCred'][1])
            decodedUTF8=decoded64.decode("utf-8") 
            sw_cred[1] = decodedUTF8
    except Exception as e:
        print("ERROR Reading config.yaml file: "+str(e))
        write2log(str(e))
    return sw_cred

@app.route('/getIntStatus', methods=['POST','GET']) # 
def getIntStatus ():
    sw_cred=swConfig()
    #connect the sw via API and build interface dict
    # read the posted values from the UI
    rcv_dict = list(request.form.keys())      #Dict as reciveds from
    json_input = json.loads(rcv_dict[0]) #convert rcv_dict[0] into JSON based dict
    print("Values as recived from port_config page: ")
    print (str(datetime.datetime.now()))
    print ("Connecting: "+sw_cred[0]+"@"+json_input+" to get interface list ")
    moreInfo = {"moreInfo":{"showVer":{},"switchports":{},"interfaces":{},"hostName":{}}}
    ts = time.time()
    st = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S') #Formatted timestamp for logger
    a = datetime.datetime.now()        
    try:
        write2log("Connecting: "+sw_cred[0]+"@"+json_input+" to get interface list ")
        switch = Server ( 'https://'+sw_cred[0]+':'+sw_cred[1]+'@'+json_input+'/command-api' )
        isLLDPenabled = switch.runCmds( 1, ["show running-config section lldp"],"text")
        #print (isLLDPenabled[0]['output'])
        cmd1 = "show interfaces status"
        cmd2 = "show interfaces switchport"
        cmd3 = "show ip interface brief"
        cmd4 = "show hostname"
        cmd5 = "show version"
        #Check if lldp is enabled
        if isLLDPenabled[0]['output'] == 'no lldp run\n':
            cmd6 = 'show version' #if not enabled than use just dummy command
        else:
            cmd6 = "show lldp neighbors"
        cmd7 = "show clock"

        response = switch.runCmds( 1, [cmd1,cmd2,cmd3,cmd4,cmd5,cmd6,cmd7])
        if isLLDPenabled[0]['output'] == 'no lldp run\n':
            intLLDPnei = ''
        else:
            intLLDPnei = response[5]['lldpNeighbors']

        intStatus = response[0]['interfaceStatuses']
        intSwitchPort = response[1]
        intIPbrie = response[2]
        swHostname = response[3]
        swVer = response[4]
        swClock = response[6]['localTime']
        moreInfo["moreInfo"]["showVer"] = swVer
        moreInfo["moreInfo"]["switchports"] = intSwitchPort
        moreInfo["moreInfo"]["interfaces"] = intIPbrie
        moreInfo["moreInfo"]["hostName"] = swHostname
        moreInfo["moreInfo"]["lldp"] = intLLDPnei
        moreInfo["moreInfo"]["currentTime"] = swClock
        
        intStatus.update(moreInfo)

        pprint.pprint (intStatus)
        print (str(moreInfo["moreInfo"]["currentTime"]["hour"])+":"+str(moreInfo["moreInfo"]["currentTime"]["min"])+":"+str(moreInfo["moreInfo"]["currentTime"]["sec"]))
        ts = time.time()
        st = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S') #Formatted timestamp for logger
        b = datetime.datetime.now()
        print("Time to get all API calls:")
        print(b-a)
        return jsonify(intStatus)
    except Exception as e:
        print("ERR SW:")
        print(str(e))
        write2log(str(e))
        response = {'data':'Error: '+json_input+"\n"+ str(e)}
        return jsonify(response)

@app.route('/setCfg', methods=['POST','GET']) # 
def setCfg ():
    #connect the sw via API and build interface dict
    # read the posted values from the UI
    rcv_dict = list(request.form.keys())      #Dict as reciveds from port_config.html ->main.js function port_config()
    json_input = json.loads(rcv_dict[0]) #convert rcv_dict[0] into JSON based dict
    print("Values as recived from interface table page: ")
    print (str(datetime.datetime.now()))
    sw_cred=swConfig()
    pprint.pprint(json_input)
    for key, value in json_input.items():
        switchIP=key
    write2log("Connecting: "+sw_cred[0]+"@"+switchIP+" to set new config ")
    switch = Server ( 'https://'+sw_cred[0]+':'+sw_cred[1]+'@'+switchIP+'/command-api' )
    for key, value in json_input[switchIP].items(): #iterate on all int
        interfaceX = key
        print (json_input[switchIP][interfaceX])
        write2log("Configuring Interface: "+interfaceX)
        if json_input[switchIP][interfaceX]["adminStatus"] == "SHUTDOWN":
            json_input[switchIP][interfaceX]["adminStatus"] = "shutdown"
        else:
            json_input[switchIP][interfaceX]["adminStatus"] = "no shutdown"
        
        try:
            #print("Connecting to switch "+json_input["switchIP"]+" to shut/no shut int "+int_name)
            if json_input[switchIP][interfaceX]['desc'] != "": #if desc flied on the GUI is empty
                response = switch.runCmds( 1, ["configure","interface "+interfaceX,"description "+json_input[switchIP][interfaceX]['desc']])
            else:
                response = switch.runCmds( 1, ["configure","interface "+interfaceX,"no description "])
            if json_input[switchIP][interfaceX]['intMode'] == "trunk":
                response = switch.runCmds( 1, ["configure","interface "+interfaceX,"switchport"])
                response = switch.runCmds( 1, ["configure","interface "+interfaceX,"no switchport access vlan"])
                response = switch.runCmds( 1, ["configure","interface "+interfaceX,"no ip address"])
                response = switch.runCmds( 1, ["configure","interface "+interfaceX,"switchport mode trunk "])
                response = switch.runCmds( 1, ["configure","interface "+interfaceX,"switchport trunk native vlan "+json_input[switchIP][interfaceX]['nativeVlan']])
                response = switch.runCmds( 1, ["configure","interface "+interfaceX,"switchport trunk allowed vlan "+json_input[switchIP][interfaceX]['accVlan']])
                print (json_input[switchIP][interfaceX]["phoneVlan"])
                if json_input[switchIP][interfaceX]["phoneVlan"] != 'no': #For platforms that do  support the phone vlan command
                    if json_input[switchIP][interfaceX]["phoneVlan"]:
                        response = switch.runCmds( 1, ["configure","interface "+interfaceX,"switchport phone vlan "+json_input[switchIP][interfaceX]['phoneVlan']])
                else:
                    response = switch.runCmds( 1, ["configure","interface "+interfaceX,"no switchport phone vlan "])                   
            elif json_input[switchIP][interfaceX]['intMode'] == "Routed": 
                response = switch.runCmds( 1, ["configure","interface "+interfaceX,"no switchport"])
                response = switch.runCmds( 1, ["configure","interface "+interfaceX,"no switchport mode trunk "])
                response = switch.runCmds( 1, ["configure","interface "+interfaceX,"no switchport mode access "])
                response = switch.runCmds( 1, ["configure","interface "+interfaceX,"no switchport trunk allowed vlan "])
                response = switch.runCmds( 1, ["configure","interface "+interfaceX,"ip address "+json_input[switchIP][interfaceX]['accVlan']])
            else:
                response = switch.runCmds( 1, ["configure","interface "+interfaceX,"switchport"])
                response = switch.runCmds( 1, ["configure","interface "+interfaceX,"no ip address"])
                response = switch.runCmds( 1, ["configure","interface "+interfaceX,"no switchport mode trunk "])
                response = switch.runCmds( 1, ["configure","interface "+interfaceX,"switchport mode access "])
                response = switch.runCmds( 1, ["configure","interface "+interfaceX,"switchport trunk native vlan "+json_input[switchIP][interfaceX]['nativeVlan']])
                response = switch.runCmds( 1, ["configure","interface "+interfaceX,"switchport access vlan "+json_input[switchIP][interfaceX]['accVlan']])
                if json_input[switchIP][interfaceX]["phoneVlan"] != 'no': #For platforms that do not support the phone vlan command
                    if json_input[switchIP][interfaceX]["phoneVlan"]:
                        response = switch.runCmds( 1, ["configure","interface "+interfaceX,"switchport phone vlan "+json_input[switchIP][interfaceX]['phoneVlan']])
                else:
                    response = switch.runCmds( 1, ["configure","interface "+interfaceX,"no switchport phone vlan "])                   
            response = switch.runCmds( 1, ["configure","interface "+interfaceX,json_input[switchIP][interfaceX]["adminStatus"]])
            response = response[0]
            write2log("Configuring Interface: "+interfaceX+' Done')

            #return jsonify(response)
        except Exception as e:
            print("ERR Connecting SW:")
            print(str(e))
            write2log(switchIP+"-"+str(e))
            response = {'data':'Error: Cannot connect to: '+switchIP+"\n"+ str(e)}
            return jsonify(response)
    response = {"data":[]}
    return jsonify(response)

def password(oper,passwd):
    if oper=="encode":
        print("Encoding: "+passwd)
        passwd = passwd.encode("utf-8")
        encoded = base64.b64encode(passwd)
        print (encoded)
        #print(base64.b64decode(encoded))
        with open(r'config.yaml',encoding = 'utf-8', errors = 'ignore') as file:
            configYaml= yaml.load(file, Loader=yaml.FullLoader)
        #output = enccc.decode() #remove b
        return (encoded)
    if oper=="decode":
        print("Decoding: "+passwd)
        decoded=base64.b64decode(passwd)
        print (decoded)
        return (decoded)

@app.route('/update_yaml', methods=['POST','GET']) #Update adding SW\User
def update_yaml():
    rcv_dict = list(request.form.keys())      #Dict as reciveds from port_config.html ->main.js function port_config()
    json_input = json.loads(rcv_dict[0])      #convert rcv_dict[0] into JSON based dict
    print("Values as recived from edit.html page: ")
    print(json_input)
    if json_input['oper']== 'addSW':
        write2log("Adding new switch: "+json_input['hname']+" IP:"+json_input['ip'])
        return create_html.editSwitch(json_input['oper'],json_input['hname'],json_input['ip'],json_input['role'],json_input['desc'])
    elif json_input['oper']== 'login':
        write2log("Update user: "+json_input['user'])
        #tmp = {'swCred':[json_input['user'],json_input['pass']]}
        encodedPass=password("encode",json_input['pass'])
        tmp = {'swCred':[json_input['user'],encodedPass]}
        with open('config.yaml', 'w') as file:
            yaml.dump(tmp, file)
    elif json_input['oper']== 'delSW':
        try:
            with open(r'switches.yaml') as file:
                switch_dict = yaml.load(file, Loader=yaml.FullLoader)
                if json_input['delSWIP'] in switch_dict:
                    write2log("Deleting switch: "+json_input['delSWIP'])
                    print ("Deleting "+json_input['delSWIP'] )
                    del switch_dict[json_input['delSWIP']]
                    with open('switches.yaml', 'w') as file:
                        yaml.dump(switch_dict, file)
                    return jsonify({'data': json_input['delSWIP']+" Deleted"}) #this response will popup to the user
                else:
                    print ("No Such Hostname")
                    write2log("Deleting switch: No Such Hostname")
                    return jsonify({'data': "No Such Hostname"}) #this response will popup to the user
        except Exception as e:
            print("ERROR Reading switches.yaml file: "+str(e))
            write2log(str(e))
            return jsonify({'data': "ERROR Reading switches.ymal file: "+str(e)}) #this response will popup to the user

    else:
        return "ok"    
    return "ok"


@app.route('/viewUser', methods=['GET']) #View Existing User
def viewUser():
    print("View user")
    try:
        with open(r'config.yaml') as file:
            configYaml= yaml.load(file, Loader=yaml.FullLoader)
            #print (configYaml['swCred'])
    except Exception as e:
        print("ERROR Reading config.yaml file: "+str(e))
        write2log(str(e))
    return jsonify(configYaml['swCred'][0])


@app.route('/clearLogs') 
def clearLogs():
    try:
        write2log("Clearing log files")
        open(logfile, "w").close() #empty log file
    except Exception as e:
        print("ERROR clearing log file file: "+str(e))
        write2log(str(e))
    return render_template('logs.html')

#  http Pages
@app.route('/main', methods=['POST','GET'])
def main():
    return render_template('main.html')

@app.route('/switchList', methods=['GET'])
def switchList():
    create_html.main()
    return render_template('switchList.html')

@app.route('/edit', methods=['GET'])
def edit():
    return render_template('edit.html')

@app.route('/config', methods=['GET'])
def config():
    return render_template('config.html')

@app.route('/help', methods=['POST','GET'])
def help():
    return render_template('help.html')

@app.route('/interfaceStatus', methods=['POST','GET'])
def interfaceStatus():
    return render_template('interfaceStatus.html')

##### WEB PAGES ######

@app.route('/logs') #Sys info page
def logs():
    return render_template('/logs.html')

@app.route('/waiting')
def waiting():
    return render_template('waiting.html')


if __name__=="__main__":
      app.run(host='0.0.0.0', port=50099, debug=True)  #port and IP which webUI is listen to
