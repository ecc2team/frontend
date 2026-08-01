import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import mark from "../assets/zeropick-mark.png";
import wordmark from "../assets/zeropick-wordmark.png";

const items = [["카테고리","/categories"],["추천","/recommendations"],["랭킹","/ranking"],["비교함","/compare"],["공구","/group-buy"],["기록","/records"]];
const Shell = styled.header`height:177px;background:#fff;position:relative;z-index:5;@media(max-width:900px){height:104px;}`;
const Inner = styled.div`max-width:1440px;height:100%;margin:auto;padding:0 38px 0 25px;display:flex;align-items:center;@media(max-width:900px){padding:0 20px;}`;
const Brand = styled(Link)`display:flex;align-items:center;flex:0 0 266px;text-decoration:none;img:first-of-type{width:129px;height:129px}img:last-of-type{width:161px;height:77px;margin-left:-24px}@media(max-width:900px){flex:auto;img:first-of-type{width:76px;height:76px}img:last-of-type{width:128px;height:61px;margin-left:-14px}}`;
const Nav = styled.nav`display:flex;justify-content:center;gap:40px;flex:1;a{color:#000;font-size:25px;text-decoration:none;white-space:nowrap}@media(max-width:1180px){gap:24px;a{font-size:21px}}@media(max-width:900px){display:none}`;
const Actions = styled.div`display:flex;gap:30px;margin-left:24px;@media(max-width:1180px){gap:12px}@media(max-width:900px){display:none}`;
const Action = styled(Link)`height:64px;padding:0 34px;border:1px solid #df6bff;border-radius:50px;display:flex;align-items:center;background:${p=>p.$primary?"#df69ff":"#fff"};color:${p=>p.$primary?"#fff":"#000"};font-size:25px;font-weight:700;text-decoration:none;white-space:nowrap;`;

export default function Header(){return <Shell><Inner><Brand to="/"><img src={mark} alt=""/><img src={wordmark} alt="ZeroPick"/></Brand><Nav>{items.map(([l,p])=><Link key={p} to={p}>{l}</Link>)}</Nav><Actions><Action to="/login">로그인</Action><Action to="/signup" $primary>회원가입</Action></Actions></Inner></Shell>}
