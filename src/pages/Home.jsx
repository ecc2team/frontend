import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import hero from "../assets/zeropick-hero.png";

const Page=styled.div`min-height:100vh;background:#f9f4fd;color:#000`;
const Main=styled.main`max-width:1440px;margin:auto;padding:14px 9.1% 118px`;
const Hero=styled.section`display:grid;grid-template-columns:1fr 1.18fr;@media(max-width:760px){grid-template-columns:1fr}`;
const Copy=styled.div`padding-top:78px;h1{margin:0;font-size:64px;line-height:1.15;letter-spacing:-2.6px}h1 span{color:#df69ff}p{color:#5c5454;font-size:24px;font-weight:700;line-height:1.25}@media(max-width:760px){padding-top:20px;h1{font-size:44px}}`;
const Visual=styled.img`width:100%;height:450px;object-fit:cover;@media(max-width:760px){height:auto}`;
const Categories=styled.nav`margin-top:94px;min-height:157px;padding:28px 6%;border:1px solid #cb71ff;border-radius:30px;background:#ffffffcc;display:flex;align-items:center;justify-content:space-between;gap:20px;a{color:#000;font-size:25px;text-decoration:none;white-space:nowrap}@media(max-width:760px){display:grid;grid-template-columns:repeat(2,1fr);a{text-align:center;font-size:20px}}`;
const cats=[["음료수","/categories?type=drinks"],["단백질 바","/categories?type=protein-bars"],["간식류","/categories?type=snacks"],["냉동식품","/categories?type=frozen"],["소스류","/categories?type=sauces"],["기타","/categories?type=other"]];
export default function Home(){return <Page><Header/><Main><Hero><Copy><h1>성분을 알면,<br/><span>선택</span>이 바뀝니다.</h1><p>나에게 맞는 제로 식품을 찾고<br/>건강한 선택을 시작해보세요!</p></Copy><Visual src={hero} alt="다양한 제로 식품"/></Hero><Categories>{cats.map(([l,p])=><Link key={p} to={p}>{l}</Link>)}</Categories></Main></Page>}
