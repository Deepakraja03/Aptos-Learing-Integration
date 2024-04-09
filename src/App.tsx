import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './Pages/Home';
import Form from './Pages/Form';
import Navbar from './Components/Navbar';

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Form' element={<Form />} />
        </Routes>
      </Router>
      {/* <WalletSelector  /> */}
    </div>
  );
}

export default App;