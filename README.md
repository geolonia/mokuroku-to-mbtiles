# mokuroku-to-mbtiles

https://cyberjapandata.gsi.go.jp/xyz/experimental_bvmap/{z}/{x}/{y}.pbf で配信されているベクトルタイルから、`.mbtiles` を作成した。

## 作成したmbtilesのURL
https://s3.console.aws.amazon.com/s3/object/gl-files-ap-northeast-1?region=ap-northeast-1&prefix=gsi.mbtiles

## 作業手順

**1. 目録ダウンロード**  
[https://cyberjapandata.gsi.go.jp/xyz/lcm25k_2012/mokuroku.csv.gz](https://cyberjapandata.gsi.go.jp/xyz/lcm25k_2012/mokuroku.csv.gz)  から、png形式タイルの目録をダウンロード

**2. ベクトルタイルのURLに置換**  
VSCodeで、[`https://cyberjapandata.gsi.go.jp/xyz/experimental_bvmap/z/x/y.pbf`](https://cyberjapandata.gsi.go.jp/xyz/experimental_bvmap/z/x/y.pbf)　形式に置換。

**3. pbfファイルダウンロード**  
mokuroku.csv の URL から pbfファイルをダウンロード

```bash
wget -i mokuroku.csv -m
```

**4. ダウンロードファイル数チェック**  
ダウンロードしたpbfファイル数が、mokuroku.csvの行数と一致するか確認

```bash
find ./cyberjapandata.gsi.go.jp/ -name "*pbf" | wc -l
  372558

wc -l ./mokuroku.csv
  372580 ./mokuroku.csv

echo $(( 372580 - 372558 ))
22
```

**5. ダウンロードできてないタイルのURLを抽出**  

- downloaded.txt：ダウンロードできたファイルのパス
- error.txt：ダウンロードできなかったファイルのパス

```bash
caffeinate cat mokuroku.csv | sed 's/https:\/\//\.\//g' | xargs -n 1 find 1> downloaded.txt 2> error.txt &
```

**6. error.txt の全てのURLが404になることを確認**  

- fetch_result_error.txt：標準エラー出力を保存

```bash
cat error.txt | awk '/cyberjapandata.+pbf/{print $2}' | sed 's/\.\//https:\/\//g' | sed 's/:$//g' | xargs -n 1 wget 2> fetch_result_error.txt
```

**7. mbtilesを生成**  

- mbtiles アップロード URL
- [https://drive.google.com/file/d/1wgSO0HrfBMS4h2gy5HjF03f-Oh5Q0c5y/view?usp=sharing](https://drive.google.com/file/d/1wgSO0HrfBMS4h2gy5HjF03f-Oh5Q0c5y/view?usp=sharing)

```bash
mb-util ./cyberjapandata.gsi.go.jp/xyz/experimental_bvmap/ gsi.mbtiles --image_format=pbf &
```
