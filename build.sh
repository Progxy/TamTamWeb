#!/bin/sh

set -xe

mkdir -p out

KEY_FILE=$(cat temp/keys.txt)

sed -i "s|const firebaseConfig : Object = {};|$KEY_FILE|" home.ts

tsc home.ts --outDir out

chromium http://0.0.0.0:5050/home.html && python3 -m http.server 5050