import ReactDOM from 'react-dom';
import './global.scss';
import router from './router';

const container = document.getElementById('app');

if (!container) {
  throw new Error('当前页面不存在 <div id="app"></div> 节点.');
}

ReactDOM.render(router, container);
