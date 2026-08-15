import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

async function enableMocking() {
  if (!import.meta.env.DEV || import.meta.env.VITE_ENABLE_MSW !== "true") {
    console.log("MSW 비활성화");
    return;
  }

  console.log("MSW 시작 시도");

  const { worker } = await import("./mocks/browser.js");

  await worker.start({
    onUnhandledRequest: "bypass",
  });

  console.log("MSW 시작 완료");
}

async function bootstrap() {
  try {
    await enableMocking();
  } catch (error) {
    console.error("MSW 시작 실패:", error);
  }

  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

bootstrap();
