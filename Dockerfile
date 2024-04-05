FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
    else echo "Lockfile not found." && exit 1; \
    fi

# Use python3.9
FROM python:3.9-alpine as python
WORKDIR /app
COPY requirements.txt .

# パッケージインストール
RUN pip3 install -r requirements.txt

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ビルド前に日本時間を設定
RUN apk --no-cache add tzdata && \
    cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
    apk del tzdata


# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build

# delete conf files
RUN rm /app/lib/db/dbinfo.json /app/pages/api/genkidama/src/conf/conf.json /app/lib/cred/*

# backup用ファイルがpermissionエラーになるので、からファイル作成＆権限付与
RUN touch backup-assetsDir.json

# pythonのソース等をコピー
COPY py ./py

# If using npm comment out above and use below instead
# RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

# pip3が使うので入れる /usr/local/includeに入る
RUN apk add --no-cache expat

# sqlite3インストール
RUN apk add --no-cache sqlite

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /etc/localtime /etc/localtime

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# COPY python binary and libraries
COPY --from=python --chown=nextjs:nodejs /usr/local/bin /usr/local/bin
COPY --from=python --chown=nextjs:nodejs /usr/local/lib /usr/local/lib
# COPY --from=python --chown=nextjs:nodejs /usr/local/include /usr/local/include

# standaloneだとコピーされない一部のファイルをコピー
# COPY --from=builder --chown=nextjs:nodejs /app/pages/api/admin/conf.json /app/pages/api/admin
# COPY --from=builder --chown=nextjs:nodejs /app/pages/api/cropper/src/myzip.py /app/pages/api/cropper/src
# pythonのソースをコピー
COPY --from=builder --chown=nextjs:nodejs /app/py /app/py

# 日本時間をbuilderからコピー
COPY --from=builder --chown=nextjs:nodejs /etc/localtime /etc/localtime

# backupファイルをbuilderからコピー
COPY --from=builder --chown=nextjs:nodejs /app/backup-assetsDir.json ./

# /app直下にDBファイルを置くと、READONLYでエラーになる。appフォルダがroot権限にのみ書き込み権限があり、
# nextjsユーザにはないため。そのため、/app直下にdbfileを作成し、そこに書き込み権限を付与。
COPY  --chown=nextjs:nodejs ./dbfile/nextblog.db /app/dbfile/nextblog.db

USER nextjs

EXPOSE 5000

ENV PORT 5000

CMD ["node", "server.js"]