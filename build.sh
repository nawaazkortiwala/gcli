#! /bin/sh

echo "Building Guix"
rm -rf ./dist
tsc
# && cp .npmrc ./build/.npmrc && cp ./package.json ./build/package.json

# echo "Bulding package-map.json"
# node ./build/make-map.js
# # echo 'ola'

# echo "Build complete"
