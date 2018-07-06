#!/bin/bash

args="$@"

args="$@ -p 80"

file=/data/arabic.json
if [ -f $file ]; then
    echo "Found db.json, trying to open"
    args="$args db.json"
fi

file=/data/file.js
if [ -f $file ]; then
    echo "Found file.js seed file, trying to open"
    args="$args file.js"
fi

echo "Found file.js seed file, trying to open"

json-server $args