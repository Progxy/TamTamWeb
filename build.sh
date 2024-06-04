#!/bin/sh

set -xe

mkdir -p out

tsc home.ts --outDir out

chromium http://0.0.0.0:5050/home.html && python3 -m http.server 5050