#!/bin/bash


echo "Choose install option:"
echo " [1]-Online install"
echo " [2]-Offline install"
echo "Use offline installation to install the GUI on the Switch (Or on any Offline server). supported version 4.26.X and above"
echo ""
read VAR



if [[ $VAR -eq 1 ]]
then
  echo "Online installation"
  echo "Installing Arista_Web_GUI... "

	sudo apt install python3-pip
	pip3 install Flask
	pip3 install natsort
	pip3 install jsonrpclib
	sudo tar -xf Arista_Web_GUI.tar.gz 
  echo " "
  echo "Done "
  cd  $PWD/Arista_Web_GUI
  echo "Run 'nohup python3 -u app3.py &' from the Arista_Web_GUI directory "
  echo "Then try to access http://sw_mngIP:50099/main "
  
elif [[ $VAR -eq 2 ]]
then

 echo "Offline installation"
 echo "Unzip Arista_Web_GUI.tar.gz into Arista_Web_GUI/"
 echo " "
 sudo tar -xzf /mnt/flash/Arista_Web_GUI.tar.gz -C /mnt/flash/ --no-same-owner
 echo " "
 echo "Installing Flask..."
 echo " "
 #sudo tar -xzf /mnt/flash/Arista_Web_GUI/InstallDir3/setuptools-60.5.0.tar.gz
 #sudo tar -xzf /mnt/flash/Arista_Web_GUI/InstallDir3/pip-21.3.1.tar.gz 
 #sudo python3 /mnt/flash/Arista_Web_GUI/setuptools-60.5.0/setup.py install
#sudo python3 /mnt/flash/Arista_Web_GUI/InstallDir3/pip-21.3.1/setup.py install

 sudo pip3 install /mnt/flash/Arista_Web_GUI/InstallDir3/click-7.1.2-py2.py3-none-any.whl
 sudo pip3 install /mnt/flash/Arista_Web_GUI/InstallDir3/MarkupSafe-2.0.1-cp37-cp37m-manylinux1_i686.whl
 sudo pip3 install /mnt/flash/Arista_Web_GUI/InstallDir3/Jinja2-3.0.3-py3-none-any.whl
 sudo pip3 install /mnt/flash/Arista_Web_GUI/InstallDir3/itsdangerous-2.0.1-py3-none-any.whl
 sudo pip3 install /mnt/flash/Arista_Web_GUI/InstallDir3/Werkzeug-2.0.2-py3-none-any.whl
 sudo pip3 install /mnt/flash/Arista_Web_GUI/InstallDir3/Flask-2.0.2-py3-none-any.whl
 sudo pip3 install /mnt/flash/Arista_Web_GUI/InstallDir3/natsort-8.0.2-py3-none-any.whl
 sudo pip3 install /mnt/flash/Arista_Web_GUI/InstallDir3/jsonrpclib-0.2.1-py3-none-any.whl
 echo " "
  cd  $PWD/Arista_Web_GUI
  echo "Run 'nohup python3 -u app3.py &' from the Arista_Web_GUI directory "
  echo "Then try to access http://sw_mngIP:50099/main "
  echo "If the mng interface is inside VRF XXX than use:"
  echo "cd /mnt/flash/Arista_Web_GUI "
  echo "sudo ip netns exec ns-MGMT nohup python3 app3.py &"
  
else
  echo "Please select 1 or 2"
fi


