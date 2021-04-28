# mokuroku-to-mbtiles

https://cyberjapandata.gsi.go.jp/xyz/experimental_bvmap/{z}/{x}/{y}.pbf で配信されているベクトルタイルから、`.mbtiles` を生成する
スクリプト。

## スクリプト

### (A) `bin/download-pbfs.js`

https://cyberjapandata.gsi.go.jp/xyz/experimental_bvmap/{z}/{x}/{y}.pbf で配信されているベクトルタイルをダウンロードします。

使い方

```
$ bin/download-pbfs.js
```

ディレクトリーに `latest_download.csv` を出力します。

* `latest_download.csv` に 不動産共通ID発行フォームで申し込んだユーザーのデータが入っています。
* `credentials.json` をルートディレクトリに配置する必要があります。認証情報の作成は、GoogleCloudConsoleにログイン後、[OAuth 2.0 クライアント ID > prop-id-user-provisioning](https://console.cloud.google.com/apis/credentials?authuser=1&project=fetch-propid-user-sheet)より取得して下さい。
* 初回のみ、ターミナルに表示されるURLにアクセスして認証コードを取得&貼り付けする必要があります。

