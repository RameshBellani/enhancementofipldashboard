// In your main routing component (e.g., App.js)
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import TeamMatches from './components/TeamMatches';
import NotFound from './components/NotFound';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/team-matches/:id" element={<TeamMatches />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
