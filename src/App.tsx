import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ModeSelectorPage from "./pages/ModeSelectorPage";
import SpinWheelPage from "./pages/SpinWheelPage";
import DiceRollPage from "./pages/DiceRollPage";
import ShuffleDeckPage from "./pages/ShuffleDeckPage";
import TargetLockPage from "./pages/TargetLockPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ModeSelectorPage />} />
          <Route path="/mode/spin-wheel" element={<SpinWheelPage />} />
          <Route path="/mode/dice-roll" element={<DiceRollPage />} />
          <Route path="/mode/shuffle-deck" element={<ShuffleDeckPage />} />
          <Route path="/mode/target-lock" element={<TargetLockPage />} />
          <Route path="/about" element={<AboutPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
