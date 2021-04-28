#!/usr/bin/env node

const csv = require('csv-parser')
const fs = require('fs')
const axios = require('axios');
const file = './mokuroku.csv'

if ( !fs.existsSync(file) ) {
  console.error("mokuroku.csvがルートディレクトリに存在しません。https://cyberjapandata.gsi.go.jp/xyz/std/mokuroku.csv.gz からダウンロードして下さい。")
  process.exit(1)
}

fs.createReadStream(file)
  .pipe(csv({ headers: false }))

  .on('data', async (data) => {

    const zxy = data[0]
    .replace( /.png/g , '')
    .split('/')

    const z = zxy[0]
    const x = zxy[1]
    const y = zxy[2]
    const url = `https://cyberjapandata.gsi.go.jp/xyz/experimental_bvmap/${z}/${x}/${y}.pbf`
    const outputFilePath = `./tiles/${z}/${x}/`
    const outputFilneName = `${y}.pbf`

    if(z >= 10 && z <= 16 ) {

      try {
        const response = await axios({
          method: 'GET',
          url,
          responseType: 'stream',
        });

        if (!fs.existsSync(outputFilePath)) {
          fs.mkdirSync(outputFilePath, { recursive: true });
        }

        if('data' in response){
          const w = response.data.pipe(fs.createWriteStream(`${outputFilePath}${outputFilneName}`));
          w.on('finish', () => {
            console.log('Successfully downloaded file!');
          });
          w.on('error', (error) => {
            console.log(`${error}`)
          })
        }

      } catch (error) {

        let status;
        let reqUrl;

        if('response' in error ){
          if(error.response != undefined && 'status' in error.response){
            status = error.response.status
          } else {
            status = error
          }
        }

        if('config' in error){
          if(error.config != undefined && 'url' in error.config) {
            reqUrl = error.config.url
          }
        }

        const stream = fs.createWriteStream("error.txt", { flags: "a" });
        stream.write(`${status}, ${reqUrl}\n`, "utf8");
      }

    }
  })
  .on('end', () => {
    console.log("Done!")
  })
