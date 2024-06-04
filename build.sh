#!/bin/sh

set -xe

mkdir -p out

KEY_FILE=$(cat temp/keys.txt)

tsc home.ts --outDir out

sed -i "s|var firebaseConfig = {};|$KEY_FILE|" out/home.js

chromium http://0.0.0.0:5050/home.html && python3 -m http.server 5050