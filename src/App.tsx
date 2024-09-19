import {Tabs} from 'antd';
import {AuthForm} from './components/AuthForm.tsx';
import {EditForm} from './components/EditForm.tsx';

function App() {
  return <div style={{width:'400px',height:'300px'}}>
    <Tabs>
      <Tabs.TabPane tab='Auth' key='1'>
        <AuthForm/>
      </Tabs.TabPane>
      <Tabs.TabPane tab='form' key='2'>
        <EditForm/>
      </Tabs.TabPane>
    </Tabs>
  </div>
}

export default App;
