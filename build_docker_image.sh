#!/bin/bash -x
# Copy the JSON Plotter dist to the TD dist so it's included in the Docker image
rm -rf ./dist/jsonplotter
cp -R ../json-plotter/dist ./dist/jsonplotter
sudo docker build -t rnadler/template-manager .
