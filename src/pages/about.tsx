import { Link } from "react-router-dom";

export const About = () => {
  return (
    <>
      <Link to="/">About</Link>
      <Link to="/blog">Blog</Link>
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
    </>
  );
};

const Career = () => {
  return (
    <>
      <h2>経歴</h2>
    </>
  );
};

const Skill = () => {
  return (
    <>
      <h2>スキル</h2>
    </>
  );
};
