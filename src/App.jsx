import { Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";

import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Industries from "./pages/Industries";
import Exhibition from "./pages/Exhibition";
import SliderImages from "./pages/SliderImages";
import TeamMembers from "./pages/TeamMembers";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white">

      <Navbar />

      <div className="lg:ml-64 pt-16 lg:pt-0 min-h-screen flex flex-col">
        <main className="flex-grow px-4 sm:px-6">
          <ScrollToTop />

          <Routes>
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/industries" element={<Industries />} />
            <Route path="/exhibition" element={<Exhibition />} />
            <Route path="/slider-images" element={<SliderImages />} />
            <Route path="/team" element={<TeamMembers />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
