#!/bin/sh

set -xe

mkdir -p out

KEY_FILE=$(cat temp/keys.txt)

tsc -p tsconfig.json

sed -i "s|const firebaseConfig = {};|$KEY_FILE|" out/home.js

chromium http://0.0.0.0:5050/home.html && python3 -m http.server 5050