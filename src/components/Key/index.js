import './index.css';

const Key = ({className, keyText}) => {
  return (
    <button className={className} data-key={keyText}>
      {keyText}
    </button>
  );
}

export default Key;
