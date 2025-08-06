import React from "react";
import ReactDOM from "react-dom/client";
import "modern-normalize";
import "./index.css";
// import { createRoot } from "react-dom/client";
import App from "./components/App/App";
// 1. Імпортуємо провайдер
import { Provider } from "react-redux";
// 2. Імпортуємо створений раніше стор, який зберігається в файлі redux/filters/store
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../src/redux/store";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
