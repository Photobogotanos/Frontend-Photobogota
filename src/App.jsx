import { BrowserRouter } from "react-router-dom";
import AppRouter from "@/routes/AppRouter";
import ScrollToTop from "@/components/common/ScrollToTop";

function App() {
  return (
   <BrowserRouter basename="/PhotoBogota">
      <ScrollToTop />
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
