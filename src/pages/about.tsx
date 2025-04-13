import { Link } from "react-router-dom";
import "./about.css";

export const About = () => {
  return (
    <>
      <img className="icon" src="/icon.png" alt="icon" />
      <nav>
        <Link className="items" to="/">
          About
        </Link>
        <Link className="items" to="/blog">
          Blog
        </Link>
      </nav>
      <Basic />
      <Hobby />
      <Career />
      <Skill />
      <br />
      <Mylink />
    </>
  );
};

const Basic = () => {
  return (
    <>
      <h1>総資産's profile</h1>
      <p>
        HN : 総資産(JA) / TotPro(EN)
        <br />
        大学 : 会津大学 修士1年
        <br />
        所属サークル : Zli
      </p>
      <p>暗号の研究がしたい数学苦手大学生です. たまにCTFに出ています. Writeupという名の参加記を<Link className="item" to="/blog">Blog</Link>に載せています.</p>
    </>
  );
};

const Hobby = () => {
  return (
    <>
      <h2>趣味</h2>
      <p>
        アニメ
        <div className="animelist">
          <li>ツルネ</li>
          <li>平穏世代の韋駄天達</li>
          <li>3月のライオン</li>
          <li>氷菓</li>
          <li>その他、その時の覇権アニメとか昔のアニメとか</li>
        </div>
      </p>
      <p>ポーカー（2024/4から始めました）</p>
      <p>スノーボード（冬限定）</p>
    </>
  );
};

const Career = () => {
  return (
    <>
      <h2>経歴</h2>
      <div className="careerlist">
        <li>2021.3 普通科高校 卒業</li>
        <li>2021.4 会津大学コンピュータ理工学部コンピュータ理工学科 入学</li>
      </div>
    </>
  );
};

const Skill = () => {
  return (
    <>
      <h2>スキル</h2>
      <h3>Programming Language</h3>
      <div className="skillist">
        <li> Python(CTF)</li>
        <li> Rust(競プロ(練習中))</li>
        <li> C, Java, C++(大学の授業)</li>
        <li> Lua(wezterm, neovimのconfig)</li>
      </div>
      <h3>etc</h3>
      <div className="skillist">
        <li> Neovim</li>
        <li> ArchLinux</li>
        <li> Burpsuite</li>
        <li> Wireshark</li>
      </div>
    </>
  );
};

const Mylink = () => {
  return (
    <>
      <div className="mylink">
        <a href="https://twitter.com/tot_pro_" target="_blank">
          <img className="twitter-icon" src="/twitter.png" alt="twitter-icon" />
        </a>
        <a href="https://github.com/TotPro" target="_blank">
          <img
            className="github-icon"
            src="/github-mark/github-mark-white.svg"
            alt="github-icon"
          />
        </a>
      </div>
    </>
  );
};
