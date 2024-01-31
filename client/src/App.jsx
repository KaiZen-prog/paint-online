import './styles/app.scss';
import Toolbar from './components/Toolbar';
import SettingsPanel from './components/SettingsPanel';
import Canvas from './components/Canvas';

const App = () => (
  <div className="app">
    <Toolbar/>
    <SettingsPanel/>
    <Canvas/>
  </div>
);

export default App;
