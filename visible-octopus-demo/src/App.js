import logo from './logo.svg';
import './App.css';
import { Radio, Input, RadioChangeEvent, message, Switch, Button } from 'antd';

function App() {
  const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <div style={{backgroundColor: '#777'}}>
        <div style={{height: 100, width: 100, margin: 10, backgroundColor: '#eee'}}>233</div>
        <div style={{height: 100, width: 100, margin: 10, backgroundColor: '#eee'}}>244</div>
      </div>
      <a href="http://www.baidu.com" target="_blank">测试a标签跳转链接</a>

      <div id='a' style={{height: 100, width: 100, margin: 10, backgroundColor: '#eee'}}>我是a</div>
      <div id='a' style={{height: 100, width: 100, margin: 10, backgroundColor: '#eee'}}>我也是a</div>
      <Button>test</Button>
      {list.map(item => <div key={item} style={{height: 100, width: 100, margin: 10, backgroundColor: '#eee'}}>{item}</div>)}
      
    </div>
  );
}

export default App;
