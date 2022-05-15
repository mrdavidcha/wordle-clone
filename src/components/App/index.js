import { useEffect } from "react";
import Alert from '../Alert';
import Keyboard from '../Keyboard';
import Guess from '../Guess';
import { startInteraction } from '../../utils';


// import { handleKeyDown, handleMouseClick } from '../../utils';

import './index.css';

const App = () => {
  useEffect(() => {
    startInteraction();
    // document.addEventListener('keydown', handleKeyDown);
    // document.addEventListener('click', handleMouseClick);
    console.log('use effect');
  }, []);
  // startInteraction();

  return (
    <div className="App">
      <Alert />
      <Guess />
      <Keyboard />
    </div>
  );
}

export default App;
