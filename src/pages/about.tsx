import { Link } from "react-router-dom";
import "./about.css";

export const About = () => {
  return (
    <>
      <img className="icon" src="/icon.png" alt="icon" />
      <nav>
        <Link to="/"> About</Link>
        <Link to="/blog"> Blog</Link>
      </nav>
      <Basic />
      <Hobby />
      <Career />
      <Skill />
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
        大学 : 会津大学 学部4年
        <br />
        所属サークル : Zli
      </p>
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
      <h3>Coming soon...</h3>
    </>
  );
};
