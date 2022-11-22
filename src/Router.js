import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Search from "./Page/Search";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Search />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
