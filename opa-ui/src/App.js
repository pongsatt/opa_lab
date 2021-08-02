import { useState } from 'react';
import './App.css';
import useOpaWasm from './useOpaWasm';

function App() {
  // load wasm from the bundle server
  const { policy } = useOpaWasm("http://localhost:8182");

  // store evaluation result
  const [info, setInfo] = useState({ text: '', color: '', input: {} });

  // check permission against requested input
  const check = (role, action, object) => {
    const input = {
      subject: {
        roles: [role],
      },
      action,
      object,
    };
    const result = policy.evaluate(input);

    const allow = result[0].result;
    if (allow) {
      setInfo({ text: `As ${role} you can ${action} ${object}`, color: 'green', input });
    } else {
      setInfo({ text: `As ${role} you cannot ${action} ${object}`, color: 'red', input });
    }
  }

  return (
    <div className="App">
      <div style={{ color: info.color }}>{info.text}</div>
      <div><button onClick={() => check('admin', 'create', 'order')}>Can Admin create order?</button></div>
      <div><button onClick={() => check('admin', 'read', 'order')}>Can Admin read order?</button></div>
      <div><button onClick={() => check('user', 'create', 'order')}>Can User create order?</button></div>
      <div><button onClick={() => check('user', 'read', 'order')}>Can User read order?</button></div>
      <pre style={{textAlign: 'left'}}>input: {JSON.stringify(info.input, null, 4)}</pre>
    </div>
  );
}

export default App;
