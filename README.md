# imgin-web

## 概要

ImginはVRChatのワールド上で任意の画像を展示することができるクライアントサーバシステムです。

Imginは次のリポジトリで構成されます。

* [imgin-web](https://github.com/halmakey/imgin-web) - ウェブ上で展示する画像をアップロードしてVRChat向けに配信する
* [imgin-vrc](https://github.com/halmakey/imgin-vrc) - ウェブから配信された画像をVRChatのワールドに展開する

## 動作環境

* Mac / Windows (WSL2)
* Node.js 20
* Cloudflare Pages
* Cloudflare D1
* Cloudflare R2

## セットアップ

Wikiを参照

1. `npm install` で依存パッケージをインストール (Windowsの場合はWSL上で実行)
2. `npx wrangler login` でCloudflareにログイン
3. `npx wrangler r2 bucket create imgin-data` でR2バケットを作成する
3. `npx wrangler d1 create imgin-db` でDBを作成する
4. DBの作成に成功すると `wrangler.toml` の `[[d1_database]]` 設定が出力されるので `wrangler.toml` の該当部分を更新する

