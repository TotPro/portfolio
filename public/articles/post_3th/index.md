# [SECCON Bginners CTF 2024](https://score.beginners.seccon.jp/) に参加しました

SECCON Beginners CTFは今回が初めての参加でした. CTFを始めてから自分がどれくらい成長したのかを知れる良い機会だったのかなと思います.（思っていたほど成長はしていませんでした...）  
今回は大学の後輩と二人で出ました. 後輩がpwnを3問解いてくれました.   
393pt, 230/962 (217 / 936 domestic teams). 

## Safe Prime(Crypto 362solves)

### Description
> Using a [safe prime](https://en.wikipedia.org/wiki/Safe_prime) makes RSA secure, doesn't it? 

### Consideration
RSA暗号そのままの問題です. $n = p * q$の$n$と暗号文$c$と$e$の数値がわかっています.  
素数$p, q$は$p$を素数として$q = 2 * p + 1$としたときに$q$が素数になるような選び方をしています. この時の$p$をソフィー・ジェルマン素数, $q$を安全素数と言うらしいです.  
$n$から$p$をうまいこと取り出せないか悩んで時間をだいぶ溶かしてしまいました.  
$2^{511} \le p < 2^{512}$なので$p$を全探索しても全然いけることに気づいたので$p$を総当たりして, $q$を求めて復号してflag取得.
```python
e = 0x10001
n = 2929273...
c = 4079147...

p = 0
q = 0
p_max = 2**512
p_min = 2**511

while True:
    p = (p_max+p_min)//2
    q = 2 * p + 1
    N_mine = p * q
    if n == N_mine:
        break
    elif n > N_mine:
        p_min = p
    else:
        p_max = p

assert p*q == n

phi = (p-1)*(q-1)
d = pow(e, -1, phi)
m = pow(c, d, n)
flag = m.to_bytes((m.bit_length()-1)//8+1, 'big')
print(flag)
```

## getRank(Misc 369solves)

### Description
> https://getrank.beginners.seccon.games/

### Consideration
リンク先に飛ぶと以下の画面  
![index](/articles/post_3th/assets/re-seccon4b-misc-getrank_1.png)  
数字を推測→スコア獲得→ランクづけ
![rank](/articles/post_3th/assets/re-seccon4b-misc-getrank_2.png)
のような流れで, ランクが1になればflagが取得できる.  
以下がランクをつける処理  
```TypeScript
function ranking(score: number): Res {
  const getRank = (score: number) => {
    const rank = RANKING.findIndex((r) => score > r);
    return rank === -1 ? RANKING.length + 1 : rank + 1;
  };

  const rank = getRank(score);
  if (rank === 1) {
    return {
      rank,
      message: process.env.FLAG || "fake{fake_flag}",
    };
  } else {
    return {
      rank,
      message: `You got rank ${rank}!`,
    };
  }
}
```
送るスコアは以下のような処理がされる.  
```TypeScript
function chall(input: string): Res {
  if (input.length > 300) {
    return {
      rank: -1,
      message: "Input too long",
    };
  }

  let score = parseInt(input);
  if (isNaN(score)) {
    return {
      rank: -1,
      message: "Invalid score",
    };
  }
  if (score > 10 ** 255) {
    // hmm...your score is too big?
    // you need a handicap!
    for (let i = 0; i < 100; i++) {
      score = Math.floor(score / 10);
    }
  }

  return ranking(score);
}
```
score $> 10^{255}$の時にrank=1となるので, そのようなpostリクエストを送ればいい.  
制約として送れるスコアの長さは300未満, score $> 10^{255}$の時はscoreが$10^{100}$で割られる.  
scoreが$10^{n-100} > 10^{255}$となるスコアを以下のようにして送れば`input.length > 300`も通る.  
```json
{
  input:[
    "100......00",
    "hoge"
  ]
}
```
![flag](/articles/post_3th/assets/re-seccon4b-misc-getrank.png)
