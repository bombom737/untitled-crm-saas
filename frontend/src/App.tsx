import { Route, Routes } from "react-router-dom"
import { Authentication } from './views/Authentication';
import Base from "./views/Base";
import Dashboard from './views/Dashboard'
import Customers from './views/Customers'
import Sales from './views/Sales'
import Tasks from './views/Tasks'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Authentication />} />
      <Route path='/dashboard' element={<Base viewComponent={<Dashboard/>}/>}/>
      <Route path='/customers' element={<Base viewComponent={<Customers/>}/>}/>
      <Route path='/sales' element={<Base viewComponent={<Sales/>}/>}/>
      <Route path='/tasks' element={<Base viewComponent={<Tasks/>}/>}/>
    </Routes>
  );
}

export default App;
