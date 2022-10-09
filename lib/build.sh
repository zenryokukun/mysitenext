#!/bin/bash
export NODE_ENV=production
npx next build
# `nextblog` is the app name set to PM2.
pm2 restart nextblog