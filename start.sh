#!/bin/bash
rm -r /home/kormit/develop/stouneChat/IDE/peer10 /home/kormit/develop/stouneChat/IDE/peer11 /home/kormit/develop/stouneChat/IDE/peer12 /home/kormit/develop/stouneChat/IDE/peer13;
cp -r /home/kormit/develop/stouneChat/IDE/peer1  /home/kormit/develop/stouneChat/IDE/peer10 &
cp -r /home/kormit/develop/stouneChat/IDE/peer1  /home/kormit/develop/stouneChat/IDE/peer11 &
cp -r /home/kormit/develop/stouneChat/IDE/peer1  /home/kormit/develop/stouneChat/IDE/peer12 &
cp -r /home/kormit/develop/stouneChat/IDE/peer1  /home/kormit/develop/stouneChat/IDE/peer13 ;
konsole --hold -e node /home/kormit/develop/stouneChat/IDE/server &
sleep 1
konsole --hold -e node /home/kormit/develop/stouneChat/IDE/peer10 &
sleep 1
konsole --hold -e node /home/kormit/develop/stouneChat/IDE/peer11 &
sleep 1
konsole --hold -e node /home/kormit/develop/stouneChat/IDE/peer12 &
sleep 1
konsole --hold -e node /home/kormit/develop/stouneChat/IDE/peer13 &
# konsole --hold -e node /home/kormit/develop/stouneChat/IDE/peer1
