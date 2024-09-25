# [IERAE CTF 2024](https://ierae-ctf.com/)に参加しました

今回もCrypto専門で解いたのですが, 2完であえなく撃沈.  
今回に限ってはflagを取得するまでのプロセスを考える方向性とスピードは比較的良かったものの, ソルバを書くところでだいぶ手間取ってしまったので反省です. 実装能力の低さが露呈したのでたくさんぷろぐらみんぐをしようと思いました.  
大学の後輩と2人で出ました. 後輩がめっちゃ頑張ってくれたので思ったより順位は高かったです.  
1071pt, 45/224（母数は正の得点を獲得しているチーム数）  
（Writeup賞的なものがあるので）Moris/総資産で出ました.  

## derangement(Crypto 106solves)

### Description
> I've made a secret magic string, perfectly encrypted!

### Consideration

<details><summary>challenge.py</summary>

  ```python:challenge.py
  #!/usr/bin/env python
  
  from os import getenv
  import random
  import string
  import sys
  
  FLAG = getenv("FLAG", "TEST{TEST_FLAG}")
  
  LENGTH = 15
  CHAR_SET = string.ascii_letters + string.digits + string.punctuation
  
  
  def generate_magic_word(length=LENGTH, char_set=CHAR_SET):
      return ''.join(random.sample(char_set, length))
  
  
  def is_derangement(perm, original):
      return all(p != o for p, o in zip(perm, original))
  
  
  def output_derangement(magic_word):
      while True:
          deranged = ''.join(random.sample(magic_word, len(magic_word)))
          if is_derangement(deranged, magic_word):
              print('hint:', deranged)
              break
  
  
  def guess_random(magic_word, flag):
      print('Oops, I spilled the beans! What is the magic word?')
      if input('> ') == magic_word:
          print('Congrats!\n', flag)
          return True
      print('Nope')
      return False
  
  
  def main():
      magic_word = generate_magic_word()
      banner = """
  /********************************************************\\
  |                                                        |
  |   Abracadabra, let's perfectly rearrange everything!   |
  |                                                        |
  \\********************************************************/
  """
      print(banner)
      connection_count = 0
  
      while connection_count < 300:
          print('type 1 to show hint')
          print('type 2 to submit the magic word')
          try:
              connection_count += 1
              user_input = int(input('> '))
  
              if user_input == 1:
                  output_derangement(magic_word)
              elif user_input == 2:
                  if guess_random(magic_word, FLAG):
                      break
                  sys.exit()
              else:
                  print('bye!')
                  sys.exit()
          except:
              sys.exit(-1)
  
      print('Connection limit reached. Exiting...')
  
  
  if __name__ == "__main__":
      main()
  ```

</details>

ascii印字可能文字からランダムに15文字を取ってきて, `magic_word`とします. hintをあげるから`magic_word`を当ててねという問題です.  
hintは`output_derangement`から与えられます.  
```python
def is_derangement(perm, original):
    return all(p != o for p, o in zip(perm, original))


def output_derangement(magic_word):
    while True:
        deranged = ''.join(random.sample(magic_word, len(magic_word)))
        if is_derangement(deranged, magic_word):
            print('hint:', deranged)
            break
```
`magic_word`の中身をランダムに入れ替えて`deranged`とし, 各文字が`magic_word`にある文字の場所と被っていなければ`deranged`をhintとして出力します.  
`deranged`で現れた場所にはその文字は絶対にこないので, 何回もhintを出力していけば次第に各文字の現れる場所が特定できるということになります.  

以下, ソルバです.
```python:solve.py
from pwn import *
import re
import time


HOST = "host"
PORT = 55555
r = remote(HOST, PORT)
time.sleep(5)
r.sendlineafter(b"> ", b"1")
chars = r.recvline()
print(chars)
pattern = r"[ -~]+"
match = re.search('hint: (?=[ -~]+)', chars.decode())
chars = chars[match.end():].decode()
chars = chars[:15]
cs = [c for c in chars]
print(chars)
flag = [[1 for j in range(16)] for i in range(15)]
index = 0
for c in chars:
    flag[index][0] = c
    index += 1
lists = []
for i in range(290):
    r.sendlineafter(b"> ", b"1")
    chars = r.recvline()
    match = re.search('hint: (?=[ -~]+)', chars.decode())
    chars = chars[match.end():].decode()
    lists.append(chars)
index = 0
for c in cs:
    for l in lists:
        ind = l.index(c)
        flag[index][ind+1] = 0
    index += 1

for i in range(15):
    print(flag[i])

text = ["a" for i in range(15)]
for i in flag:
    num = i.index(1)
    text[num-1] = i[0]
print(text)
send_text = ''.join(text)
r.sendlineafter(b"> ", b"2")
r.sendlineafter(b"> ", send_text.encode())
_ = r.recvline()
flag = r.recvline()
print(flag)
```
初めてpwntoolsを使って解いたので, ソルバを書くことが大変でした. 正規表現の勉強もし直さないとだめですね.  
解いた時のソルバそのままなので意味のない行が何行かあるけどごめんして...

## Weak PRNG(Crypto 54solves)

### Description
> Do you understand the traits of that famous PRNG?

### Consideration

<details><summary>challenge.py</summary>

  ```python:challenge.py
  #!/usr/bin/env python
  
  from os import getenv
  import random
  import secrets
  
  FLAG = getenv("FLAG", "TEST{TEST_FLAG}")
  
  
  def main():
      # Python uses the Mersenne Twister (MT19937) as the core generator.
      # Setup Random Number Generator
      rng = random.Random()
      rng.seed(secrets.randbits(32))
  
      secret = rng.getrandbits(32)
  
      print("Welcome!")
      print("Recover the initial output and input them to get the flag.")
  
      while True:
          print("--------------------")
          print("Menu")
          print("1. Get next 16 random data")
          print("2. Submit your answer")
          print("3. Quit")
          print("Enter your choice (1-3)")
          choice = input("> ").strip()
  
          if choice == "1":
              print("Here are your random data:")
              for _ in range(16):
                  print(rng.getrandbits(32))
          elif choice == "2":
              print("Enter the secret decimal number")
              try:
                  num = int(input("> ").strip())
  
                  if num == secret:
                      print("Correct! Here is your flag:")
                      print(FLAG)
                  else:
                      print("Incorrect number. Bye!")
                  break
              except (ValueError, EOFError):
                  print("Invalid input. Exiting.")
                  break
          elif choice == "3":
              print("Bye!")
              break
          else:
              print("Invalid choice. Please enter 1, 2 or 3.")
              continue
  
  
  if __name__ == "__main__":
      main()
  ```

</details>

問題タイトルや
`# Python uses the Mersenne Twister (MT19937) as the core generator.`
`# Setup Random Number Generator`
からわかる通り擬似乱数生成器であるメルセンヌツイスタ（MT19937）を扱った問題です.  
32bits整数である`secret`を当てるという問題で手掛かりになりそうな情報は, `secret`以降に順に生成された32bits整数の乱数くらいしかありません.  
[random --- 疑似乱数を生成する](https://docs.python.org/ja/3/library/random.html)でも
> メルセンヌツイスタは、現存する中で最も広範囲にテストされた乱数生成器のひとつです。しかしながら、メルセンヌツイスタは完全に決定論的であるため、全ての目的に合致しているわけではなく、暗号化の目的には全く向いていません。

とあるため, 乱数（を作る漸化式の内部状態（という言い回しであっているのかはわからない））を復元する方向で進めます.  
調べたらすぐに出てきました.  
1. https://6715.jp/posts/5/
2. https://zenn.dev/hk_ilohas/articles/mersenne-twister-previous-state

上記の記事1. でメルセンヌツイスタの雰囲気を理解し*
上記の記事2. からそのまま動くコードをいただいて（スクリプトキディで）解きました. （ありがとうございます）

MT19937はN=624なので624(=16*39)個の乱数を使って`secret`の復元をします.  

最後の数行変更加えた程度のソルバです.  
```python:solve.py
import random
from pwn import *
HOST = "host"
PORT = 19937
r = remote(HOST, PORT)


def untemper(x):
    x = unBitshiftRightXor(x, 18)
    x = unBitshiftLeftXor(x, 15, 0xefc60000)
    x = unBitshiftLeftXor(x, 7, 0x9d2c5680)
    x = unBitshiftRightXor(x, 11)
    return x


def unBitshiftRightXor(x, shift):
    i = 1
    y = x
    while i * shift < 32:
        z = y >> shift
        y = x ^ z
        i += 1
    return y


def unBitshiftLeftXor(x, shift, mask):
    i = 1
    y = x
    while i * shift < 32:
        z = y << shift
        y = x ^ (z & mask)
        i += 1
    return y


def get_prev_state(state):
    for i in range(623, -1, -1):
        result = 0
        tmp = state[i]
        tmp ^= state[(i + 397) % 624]
        if ((tmp & 0x80000000) == 0x80000000):
            tmp ^= 0x9908b0df
        result = (tmp << 1) & 0x80000000
        tmp = state[(i - 1 + 624) % 624]
        tmp ^= state[(i + 396) % 624]
        if ((tmp & 0x80000000) == 0x80000000):
            tmp ^= 0x9908b0df
            result |= 1
        result |= (tmp << 1) & 0x7fffffff
        state[i] = result
    return state


N = 624  # 状態ベクトルのサイズ
xs1 = []
for i in range(39):
    r.sendlineafter(b"> ", b"1")
    r.recvline()
    for j in range(16):
        num = r.recvline()
        num = num.decode()
        num = int(num[:-1])
        xs1.append(num)


mt_state = [untemper(x) for x in xs1]
prev_mt_state = get_prev_state(mt_state)
random.setstate((3, tuple(prev_mt_state + [0]), None))

predicted = [random.getrandbits(32) for _ in range(N)]
# print(predicted)
ans = str(predicted[-1])
r.sendlineafter(b"> ", b"2")
r.sendlineafter(b"> ", ans.encode())
_ = r.recvline()
flag = r.recvline()
print(flag)
```
時間に余裕があれば, 自分で1からちゃんと実装したい...

\* ちゃんと理解しないといけない
