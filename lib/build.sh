#!/bin/bash
echo Now,building....
export NODE_ENV=production
# You need to be in `root` in order to use `next build` command
cd /home/crypto/mysitenext
# Build next app.
npx next build
# Restart server. `nextblog` is the app name set to PM2.
pm2 restart nextblog