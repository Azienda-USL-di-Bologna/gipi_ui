#!/bin/bash

ENVS="gdml"

#ENVS="102 102t 105 106 106t 109 109t 908 908t 909 909t 960 960t arena gdml"

export PATH=~/node/bin:$PATH
for e in $ENVS;do 
  echo "Buildo $e"
  #ng build --aot false --bh /firma_semplice_ui/ --target=production --environment=${e} -op dist/dist${e}
  . /root/proxy.sh
  npm install
  npm update
  node_modules/.bin/ng build --aot true --bh /gipi-ui/ --target=production --environment=${e} -op /var/www/html/gipi-ui
done
