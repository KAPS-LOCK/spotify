import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Landing from './landing/Landing';
import { ThemeTransitionProvider } from './landing/ThemeTransition';
import ChromeTheme from './themes/chrome';
import AeroTheme from './themes/aero';
import ScrapbookTheme from './themes/scrapbook';

function App() {
  return (
    <BrowserRouter>
      <ThemeTransitionProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/chrome" element={<ChromeTheme />} />
          <Route path="/aero" element={<AeroTheme />} />
          <Route path="/scrapbook" element={<ScrapbookTheme />} />
        </Routes>
      </ThemeTransitionProvider>
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
