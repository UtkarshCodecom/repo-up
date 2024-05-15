import SignUp from './components/Signup';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import store from './utils/store';
import Admindashboard from './components/DashBoard/Admindashboard';
import { Provider } from 'react-redux';
import { Notfound } from './components/Notfound';
import {Empdashboard} from './components/Empdashboard/Empdashboard'
import Home from "./component/Home/Home"


function App() {

  return (
    <Provider store={store}>
      <div className='p-0 m-0 '>
        <Router>
          <Routes>
          <Route path="/" element={<Home />} />
            <Route path='/login' element={<SignUp />} />
         
            <Route path="/dashboard/admin" element={<Admindashboard />} />
            <Route path="/dashboard/user" element={< Empdashboard />} />
            {/* <Route path="*" element={<Notfound />} /> */}
          </Routes>
        </Router>
      </div>
    </Provider>
  );
}

export default App;
