## フォルダ構成

- **/component**  
  pagesで使うReact Componentを格納。

- **/data**  

  データ類。今のところupdateページ用のpage.mdしか入っていない。blog用のmdは画像ファイルと一緒にpublicのほうに入れてある。  
- **/lib**  
  サーバ側の、api以外の処理を入れる。mongodbを使った処理など。  

- **/pages,/styles**    
  Next.js標準のフォルダ

- **pages/api/_フォルダ名_**  
  直下のフォルダは各ページごとに利用しているapiを入れてる。

- **pages/test/**  
  開発環境のみ。テスト用スクリプト。

- **/pages/post/**  
  ブログ記事のdynamicルート



- **/public/_フォルダ名_**
  各ページで使う画像とか。  

  - **html**フォルダにはNext.js外の自作サイトのクライアント側（html,css,js）を格納。
  - **posts**フォルダにはブログのmdファイルや画像ファイルを格納。

## コマンド

開発環境

```bash
npm run dev
```
