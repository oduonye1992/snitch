#!/usr/bin/env bash

# Install project dependencies
echo "Install project dependencies..."
npm install

# Install git submodules
# echo "Fetching submodules..."
# git submodule init && git submodule update

cd lib/jobs

# For each task project, install/update its dependencies
for d in */ ; do
    echo "Initializing submodule $d ..."
    cd $d
    npm install
    cd ..
done

cd ..
cd ..

# Copying environmental variables
cp .env-example .env
cp ./pipeline.example.js ./pipeline.js
# export $(cat .env | xargs)

echo "All set. Now run 'npm start' in your root folder.\n Make sure you have your configured pipeline by editing the pipeline.json file in your root directory"

