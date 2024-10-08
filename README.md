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

## ご注意

本リポジトリはハッカソンで制作して発表した成果物です。
今後、機能拡張等を行う予定はありません。
実際の運用にあたってはCloudflare Access等で認証機能をつけるようにしてください。

## セットアップと使い方

[Wiki](https://github.com/halmakey/imgin-web/wiki) を参照してください
