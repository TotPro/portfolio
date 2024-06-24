# [WaniCTF 2024](https://wanictf.org/jp.html)に参加しました

解ける問題数は多くなってきたかもしれないと思いつつ, solve数が多い問題を選んで解いている感が否めないので, solve数が少ない問題から逃げないようにしたい...（主にCryptoの話）  
今回は大学の先輩と後輩の３人で出ました. 自分が解いた問題の解法を残します.  
1163pt, 264/1022（母数は正の得点を獲得しているチーム数）

## beginners_rsa(Crypto 530solves)

### Description
> Do you know RSA?

### Consideration
$n$が$p, q, r, s, a$の5つの素数の積で与えられています. いずれも$[2^{63}, 2^{64})$の間にあるので素因数分解ができると判断しました.  
思ってたより早く素因数分解が終わったのでいつも通りに復号します.  
```python:solve.py
from output import *
import sympy


fac = sympy.factorint(n)
print(fac)
p = 17129880600534041513
q = 13079524394617385153
r = 11771834931016130837
s = 9953162929836910171
a = 12109985960354612149

assert n == p*q*r*s*a

phi = (p-1)*(q-1)*(r-1)*(s-1)*(a-1)
d = pow(e, -1, phi)
m = pow(enc, d, n)
flag = m.to_bytes((m.bit_length()-1)//8+1, 'big')
print(flag)
```

## beginners_aes(Crypto 453solves)

### Description
> AES is one of the most important encryption methods in our daily lives.

### Consideration
ブロック暗号のAESをCBCモードで使用しています.  
keyとivがそれぞれ
```python
key = b'the_enc_key_is_'
iv = b'my_great_iv_is_'
key += urandom(1) # ランダムな1byteを足している
iv += urandom(1)
```
で与えられます.  
つまり, 高々$2^8 * 2$回でkeyとivの総組数がわかるので総当たりします.
```python
flag_hash = hashlib.sha256(FLAG).hexdigest()
```
でハッシュ値が取られているので, 合っているかどうかはハッシュ値で確かめます.
```python
from Crypto.Util.Padding import unpad
from Crypto.Cipher import AES
# from os import urandom
import hashlib
from output import enc, flag_hash


def solve():
    for i in range(2**8):
        add_key = i.to_bytes(1, 'big')
        key = b'the_enc_key_is_'
        key += add_key
        for j in range(2**8):
            add_iv = j.to_bytes(1, 'big')
            iv = b'my_great_iv_is_'
            iv += add_iv

            try:
                cipher = AES.new(key, AES.MODE_CBC, iv)
                msg = unpad(cipher.decrypt(enc), 16)
                if flag_hash == hashlib.sha256(msg).hexdigest():
                    print(msg)
                    return 1
            except ValueError as e:
                continue


solve():solve.py
```

## replacement(Crypto 431solves)

### Description
> No one can read my diary!

### Consideration
一文字ずつハッシュ値をとって`my_diary_11_8_Wednesday.txt`に保存しています.  
ascii印字可能文字全てのハッシュ値をとって一致するascii印字可能文字を出力するという方法を取りました.
```python:solve.py
from my_diary_11_8_Wednesday import enc
import hashlib
from string import printable


def solve():
    table = {}
    for c in printable:
        x = ord(c)
        x = hashlib.md5(str(x).encode()).hexdigest()
        x = int(x, 16)
        table[x] = c
    # print(table)
    for e in enc:
        print(table[e], end="")


solve()
```

## tiny_usb(Forensic 731solves)

### Description
> USBが狭い

> What a small usb!

### Consideration
isoファイルの中身にflagが置いてあった.

## Surveillance_of_sus(Forensic 431solves)

### Description
> 悪意ある人物が操作しているのか、あるPCが不審な動きをしています。
> 
> そのPCから何かのキャッシュファイルを取り出すことに成功したらしいので、調べてみてください！
> 
> A PC is showing suspicious activity, possibly controlled by a malicious individual.
> 
> It seems a cache file from this PC has been retrieved. Please investigate it!
### Consideration
RDPビットマップキャッシュファイルというものが渡されます.  
[https://github.com/ANSSI-FR/bmc-tools](https://github.com/ANSSI-FR/bmc-tools)で解析できるらしいのでこれに投げてみます.  
大量のbmpファイルが抽出できました. が, 一つも開けない. 私の環境(M1mac, ArchLinux)だとダメなのかなと思いWindowsを使用している知人に頼んだところ開けたらしいのでスクショを送ってもらいました.  
![bmp](/articles/post_4th/assets/re_image.png)  
上の画像で頑張ってflagを読み取ったら, 当たってました.  
[https://github.com/BSI-Bund/RdpCacheStitcher](https://github.com/BSI-Bund/RdpCacheStitcher)で, 抽出したbmpファイルをパズルみたいに配置していけるらしいのですが, これも私の環境では使えなさそうだった...(知人に頼んでやってもらったら綺麗なflagが出てきました)

さすがにArchLinuxにWine導入すべき？？？

## codebreaker(Forensic 268solves)

### Description
> I, the codebreaker, have broken the QR code!

### Consideration
今回一番時間をかけてしまった気がします.  
以下の読み込み不可なQRコードが渡されます.  
![QRcode](/articles/post_4th/assets/re_chal_codebreaker.png)  
このQRコードがflagのエンコード結果だろうと信じてこのQRコードの復旧作業を始めます.  
[https://en.wikipedia.org/wiki/QR_code](https://en.wikipedia.org/wiki/QR_code)や過去にQRコードを扱ったCTFのwrtieupをみながら復旧を行いました. macのプレビューを使って1セルずつチマチマ白塗りしてたら時間が過ぎてた...  
1. 29 x 29のversion3のQRコードであることが最初に分かりました.  
2. 角の3個の正方形と残った角側にある小さい正方形を直します.  
3. 左から7列目の一部と上から7行目の一部に白と黒が交互になる部分があるので直します.  
4. おそらくここは白だったんだろうなっていうところを白にします.  

そして完成したQRコードが以下です.  
![MyQRcode](/articles/post_4th/assets/re_complete.png)  
これを[Decoder](https://zxing.org/w/decode.jspx)に投げたらflagを取得できました.
