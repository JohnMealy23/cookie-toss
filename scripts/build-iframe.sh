#!/bin/bash

source scripts/loggin.sh

export PKG=$(cat ./package.json)

export MODULE_NAME=$(echo $PKG | jq -r '.name')
node_modules/.bin/rollup -c rollup/iframe.rollup.js

loggin "Grab new iframe JS"
IFRAME_JS_FILENAME=$(echo $PKG | jq -r '.htmlScript')

loggin "iframe file name: $IFRAME_JS_FILENAME"
export INSERTED_SCRIPT=$(cat "$IFRAME_JS_FILENAME")

loggin "Implant iframe JS into iframe HTML"
envsubst '\$INSERTED_SCRIPT $MODULE_NAME' < src/iframe/shell.html > dist/iframe.html

loggin "Remove iframe script after it's consumption"
rm $IFRAME_JS_FILENAME
