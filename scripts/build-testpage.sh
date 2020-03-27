#!/bin/bash

source scripts/loggin.sh

export PKG=$(cat ./package.json)

export MODULE_NAME="Iframe Test Page"

node_modules/.bin/rollup -c rollup/test-module.rollup.js

loggin "Grab new iframe JS"
TEST_PAGE_JS_FILENAME=$(echo $PKG | jq -r '.testFile')

loggin "iframe file name: $TEST_PAGE_JS_FILENAME"
export INSERTED_SCRIPT=$(cat "$TEST_PAGE_JS_FILENAME")

loggin "Implant iframe JS into iframe HTML"
envsubst '\$INSERTED_SCRIPT $MODULE_NAME' < $(echo $PKG | jq -r '.iframeShellSrc') > $(echo $PKG | jq -r '.testHtml')

loggin "Remove iframe script after it's consumption"
rm $TEST_PAGE_JS_FILENAME

ts-node --project ./tsconfig.json './test-iframe'
