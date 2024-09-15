# [AlpacaHack Round3(crypto)](https://alpacahack.com/ctfs/round-3)に参加しました

Cryptoを頑張りたい人間なのでそれなりに気合いを入れましたがなかなか上手くはいかないもので...  
久々にwriteupを書きます.  
と思っていたのですが, writeupではなくただの感想になりました.  
104pt, 80/239

## qrime(91 solves)

### Description
> not crime and prime

### Consideration
以下, 問題ファイルです.
```python:chall.py
import os
from Crypto.Util.number import bytes_to_long, getRandomNBitInteger, isPrime


def nextPrime(n):
    while not isPrime(n := n + 1):
        continue
    return n


def gen():
    while True:
        q = getRandomNBitInteger(256)
        r = getRandomNBitInteger(256)
        p = q * nextPrime(r) + nextPrime(q) * r
        if isPrime(p) and isPrime(q):
            return p, q, r


flag = os.environ.get("FLAG", "fakeflag").encode()
m = bytes_to_long(flag)

p, q, r = gen()
n = p * q

phi = (p - 1) * (q - 1)
e = 0x10001
d = pow(e, -1, phi)
c = pow(m, e, n)

print(f"{n=}")
print(f"{e=}")
print(f"{c=}")
print(f"{r=}")
```
RSA暗号の形をしていますが, $p, q$の取り方が特徴的です. 他に変な箇所がないので$p, q$を特定する方向で進めます.  
まず`chall.txt`で$r$がわかることに気づかず（一敗）, 小一時間くらい溶かします.  
$q, r$がそれぞれ$2^{255} \le q, r \le 2^{256}-1$（だと思っていた）で, $q$を二分探索で求めようとしましたが$q = 2^{255}$となっても$p, q$の積が$n$より大きくなりなぜか上手くいかず.  
そして唸ること1時間.  
$p, q$がそれぞれ素数でなければならないことに気づき, `q = nextPrime(q)`じゃん（二敗）となりまた1時間を浪費します.  
$$$
p = q*(r+k) + q*r \\
n = q^2 * (2r+k) \\
q = \sqrt{n/(2r+k)}
$$$
だと確信してソルバーを書き爆死（$n\%(2r+k)$で余りが出ていることに気づいきちゃんとコードを読んだら`q = nextPrime(q)`じゃなかった）.  
ここで$r < 2^{255}$になっていることに気づき, $q$の二分探索の範囲を$[2^{254}, 2^{255}-1]$としたところ上手くいきました. 

以下, ソルバーです.
```python:solve.py
import output as ot
from Crypto.Util.number import bytes_to_long, getRandomNBitInteger, isPrime


def nextPrime(n):
    while not isPrime(n := n + 1):
        continue
    return n


def main():
    nextr = nextPrime(ot.r)
    p = 0
    q = 0
    max = 2**255-1
    min = 2**254
    while True:
        q = (max+min)//2
        p = q * nextr + nextPrime(q) * ot.r
        n = p * q
        if isPrime(p) and isPrime(q):
            break
        if ot.n == n:
            break
        elif ot.n > n:
            min = q
        else:
            max = q
    print(ot.n == n)
    phi = (p-1)*(q-1)
    d = pow(ot.e, -1, phi)
    m = pow(ot.c, d, ot.n)
    flag = m.to_bytes((m.bit_length()-1)//8+1, 'big')
    print(flag)


main()
```
[getRandomNBitIntegerのdoc](https://pythonhosted.org/pycrypto/Crypto.Util.number-module.html#getRandomNBitInteger)にも
> a random number between 2**(N-1) and (2**N)-1.

とあるので???でした.
