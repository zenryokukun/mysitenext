#!/bin/bash

echo START:`date`----------------------------------------
echo USER:`whoami`

# export NODE_ENV=production
# Stop pm2. The app name is `nextblog`.
# pm2 stop nextblog

# You need to be in `root` in order to use `next build` command
# cd /home/crypto/mysitenext

# Build next app.
npx next build

# Restart server. `nextblog` is the app name set to PM2.
pm2 restart nextblog --time

echo END:`date`------------------------------------------
