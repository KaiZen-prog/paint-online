import './styles/app.scss';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Toolbar from './components/Toolbar';
import SettingsPanel from './components/SettingsPanel';
import Canvas from './components/Canvas';

const App = () => (
  <BrowserRouter>
    <div className="app">
      <Routes>
        <Route
          path={'/:id'}
          element={
            <>
              <Toolbar/>
              <SettingsPanel/>
              <Canvas/>
            </>
          }
        />
        <Route path="/" element={<Navigate to={`f${(+new Date()).toString(16)}`} />} />
      </Routes>
    </div>
  </BrowserRouter>
);

export default App;
