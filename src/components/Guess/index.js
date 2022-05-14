import GuessTile from '../GuessTile';
import './index.css'

const Guess = () => {
  const guessTiles = 30; // 6 rows with 5 letters each.
  const className = 'tile';
  const dataState = '';

  return (
    <div className="guess-grid" data-guess-grid="">
      {
        [...Array(guessTiles)].map((tile, i) => <GuessTile className={className} dataState={dataState} key={i}/>)
      }
    </div>
  );
}

export default Guess;
