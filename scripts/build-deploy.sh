#!/bin/bash

export PKG=$(cat package.json)

# sh scripts/install-jq.sh
source scripts/loggin.sh
# npm install
loggin "Loaded dependencies"

loggin "Clean out old dist"
rm -rf dist 

loggin "Build app adapter"
sh scripts/build-app-adapter.sh

loggin "Build iframe"
sh scripts/build-iframe.sh

loggin "Build test page"
sh scripts/build-testpage.sh
