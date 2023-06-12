# Next.js版サイト
github repo: mysitenext  [link](https://github.com/zenryokukun/mysitenext)  
github repo: mysiteのNext.js移行版

## 記事更新方法
/adminページでアップロードすると、サーバ側に自動アップロードされ、ビルドも実行される。ローカルでも同じファイルが置かれるように、記事は
**/public/posts**に格納すること。  
アップロード時、DBにサムネファイルやフォルダのパス等の情報を挿入している。/blogページはこの情報からSSGしているので、
public/postsのフォルダ構成とDBの値は一致している必要がある。表示がおかしくなったらここを疑うこと。

## アプリの更新方法
1. pm2を止める（任意？）
2. git pull
3. ビルド
4. pm2再起動

```bash
git pull
# ビルド＆pm2 restart `app-name` --time
./lib/build.sh
```


## フォルダ構成

- **/component**  
  pagesで使うReact Componentを格納。Component内で使うcssはここに保存する。

- **/data**  

  データ類。今のところupdateページ用のpage.mdしか入っていない。blog用のmdは画像ファイルと一緒にpublicのほうに入れてある。  
- **/lib**  
  サーバ側の、api以外の処理を入れる。mongodbを使った処理など。  

- **/pages,/styles**    
  Next.js標準のフォルダ。page内で使うcssは/stylesに保存する。

- **pages/api/_フォルダ名_**  
  直下のフォルダは各ページごとに利用しているapiを入れてる。

- **pages/test/**  
  開発環境のみ。テスト用スクリプト。*/md*ページで、*/public/posts/test/page.md*の
  記事の見た目の確認が出来る。

- **/pages/post/**  
  ブログ記事のdynamicルート

- **/public/_フォルダ名_**
  各ページで使う画像とか。  

  - **html**フォルダにはNext.js外の自作サイトのクライアント側（html,css,js）を格納。
  - **posts**フォルダにはブログのmdファイルや画像ファイルを格納。

## ファイル名規則
- /Component直下のComponentはPascal Case
- /Component直下のcss名は、Component名.(module).css
- /page　直下のページComponentは、lowercase-with-hyphen
- /styles　直下のcss名は、対応するページのdefault Component名.(module).css、もしくはページ名の大文字.(module).css...あまり統一されていない、、、、

## サムネ補足

ロード時間短縮のため小さいサムネを追加。

### blog

blog一覧ページ用のサムネ、サイドバーやhome画面の一覧(FancyBlogLinksコンポーネント)に表示するサムネの２種類ある。

#### blog一覧

サムネはmongodbの`thumb`フィールドで指定。**最適化未実施。** next/imageのsrcsetで対応予定。せめてアスペクト比を揃えておく。
横1.6:縦1(228px:140px)に揃える。

#### FancyBlogLinks

各記事フォルダの直下に`thumb-small.png`の名前で保存。最適化済。必ず**95px×95px**で作成。

サムネが無い記事（ロゴで代替）もあるので、片方だけ存在している状態にはしないこと。
（dbのthumbを設定している場合は、必ずthumb-small.pngを作成すること。設定していない場合、作成しないこと。）

### production

production一覧ページ、サイドバーやhome画面の一覧(FancyBlogLinksコンポーネント)に表示するサムネの２種類ある。
production.jsonの`imgPath`が前者のサムネ、`imgPathSmall`が後者に対応。
 
## コマンド

開発環境

```bash
npm run dev
```

本番環境

```bash
# ------------------------------------------
# 手動実行の場合
# export NODE_ENV=production　されている前提
# ------------------------------------------
npx next build # ビルド
npm run start # 起動

# ------------------------------------------
# PM2を使って起動する場合
# ------------------------------------------
# 初回は名前をつけて起動。startの前に半角スペース必要
NODE_ENV=production pm2 start npm --name nextblog -- start
# 再起動。環境変数はいらない
pm2 restart "your file name" 
```

## 関連コマンド

### PM2
```bash
pm2 show "your file name"
pm2 status
pm2 stop "your file name"
pm2 restart "your file name"
NODE_ENV=production pm2 "your file name" #環境変数付きで起動
pm2 save # 初回起動後に実施。ターミナルで促されるので従っておく
pm2 restart "your file name" #restart時は環境変数不要
# npmコマンドの場合
pm2 start npm --name "app name" -- start
```

### Nginx

- config fileのパス  
/etc/nginx/sites-available/default

- ステータス確認  
sudo service nginx status

- restart　config変えたらnginxを再起動が必要
```bash
sudo service nginx restart
```

### mongosh
```bash
# dbの一覧を表示
show dbs

# dbを使う
use `dbname`

# 現在のdbを表示
db

# collectionの一覧を表示
show collections

# collectionのdocumentを全表示
db.`collection-name`.find()

# 条件付き検索
db.`collection-name`.find({`field-name`:`field-value`})
db.`collection-name`.find({`field-name`:{$gt:0}},`field-name2`:{$lte:9})

```