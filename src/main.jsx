import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

async function enableMocking() {
  // 로컬 개발 환경에서만 MSW 실행
  if (!import.meta.env.DEV || import.meta.env.VITE_ENABLE_MSW !== "true") {
    return;
  }

  const { worker } = await import("./mocks/browser.js");

  await worker.start({
    onUnhandledRequest: "bypass",
  });
}

async function bootstrap() {
  try {
    await enableMocking();
  } catch {
    // Mock 서버를 사용할 수 없어도 애플리케이션 자체는 렌더링한다.
  }

  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

bootstrap();
