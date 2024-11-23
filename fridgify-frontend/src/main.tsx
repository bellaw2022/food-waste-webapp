import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.tsx";
import "./index.css";
import { AppProvider } from "./AppContext.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import APIClient from "@/api";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={APIClient}>
      <GoogleOAuthProvider clientId="647856339439-ch1qle9m7uqdu41f5fsen6soqd019cua.apps.googleusercontent.com">
        <AppProvider>
          <App />
        </AppProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
    {/*// <GoogleOAuthProvider clientId="802780030815-677uu3ip7m02mbgvvuu2d25t61nsun8r.apps.googleusercontent.com">*/}
    {/*//   <AppProvider>*/}
    {/*//     <App />*/}
    {/*//   </AppProvider>*/}
    {/*// </GoogleOAuthProvider>*/}
  </StrictMode>
);
