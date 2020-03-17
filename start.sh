#!/bin/bash
rm -r /home/user/DEVELOP/stoneChat/IDE/peer10 /home/user/DEVELOP/stoneChat/IDE/peer11 /home/user/DEVELOP/stoneChat/IDE/peer12 /home/user/DEVELOP/stoneChat/IDE/peer13;
cp -r /home/user/DEVELOP/stoneChat/IDE/peer1  /home/user/DEVELOP/stoneChat/IDE/peer10 &
cp -r /home/user/DEVELOP/stoneChat/IDE/peer1  /home/user/DEVELOP/stoneChat/IDE/peer11 &
cp -r /home/user/DEVELOP/stoneChat/IDE/peer1  /home/user/DEVELOP/stoneChat/IDE/peer12 &
cp -r /home/user/DEVELOP/stoneChat/IDE/peer1  /home/user/DEVELOP/stoneChat/IDE/peer13 ;
konsole --hold -e node /home/user/DEVELOP/IDE/server &
sleep 1
konsole --hold -e node /home/user/DEVELOP/stoneChat/IDE/peer10 &
sleep 1
konsole --hold -e node /home/user/DEVELOP/stoneChat/IDE/peer11 &
sleep 1
konsole --hold -e node /home/user/DEVELOP/stoneChat/IDE/peer12 &
sleep 1
konsole --hold -e node /home/user/DEVELOP/stoneChat/IDE/peer13 &
# konsole --hold -e node /home/user/DEVELOP/stoneChat/IDE/peer1
