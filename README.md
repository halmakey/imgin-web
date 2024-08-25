This is a [Next.js](https://nextjs.org/) project bootstrapped with [`c3`](https://developers.cloudflare.com/pages/get-started/c3).

## セットアップ

1. `npm install` で依存パッケージをインストール (Windowsの場合はWSL上で実行)
2. `npx wrangler login` でCloudflareにログイン
3. `npx wrangler r2 bucket create imgin-data` でR2バケットを作成する
3. `npx wrangler d1 create imgin-db` でDBを作成する
4. DBの作成に成功すると `wrangler.toml` の `[[d1_database]]` 設定が出力されるので `wrangler.toml` の該当部分を更新する

