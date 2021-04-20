#!/bin/bash

if [ ! -f ".env" ]; then
  cp .env.exemple .env
fi

yarn install 

yarn run start:dev