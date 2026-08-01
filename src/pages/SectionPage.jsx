import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import Header from "../components/Header";
const Main=styled.main`min-height:600px;padding:80px 20px;background:#f9f4fd;text-align:center;h1{font-size:50px}a{display:inline-flex;padding:16px 28px;border-radius:40px;background:#a032be;color:#fff;text-decoration:none}`;
export default function SectionPage({title}){return <><Header/><Main><h1>{title}</h1><p>상세 콘텐츠는 준비 중입니다.</p><Link to="/">홈으로 돌아가기</Link></Main></>}
