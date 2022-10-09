#!/bin/bash

echo START:`date` -----------------------------
echo USER:`whoami`
npx next build
pm2 restart nextblog
echo END: --------------------------------
