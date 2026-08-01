import React from 'react';
// 1. 라우팅을 위한 도구들을 불러옵니다.
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

function App() {
  return (
    // 2. BrowserRouter로 전체를 감싸줍니다.
    <BrowserRouter>
      <Routes>
        {/* 기본 주소('/')로 접속하면 Home 컴포넌트를 보여주라는 뜻입니다. */}
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
