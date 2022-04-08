import Alert from '../Alert';
import Keyboard from '../Keyboard';
import Guess from '../Guess';
import './index.css';

const App = () => {
  return (
    <div className="App">
      <Alert />
      <Guess />
      <Keyboard />
    </div>
  );
}

export default App;
