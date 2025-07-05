import './App.css'
import Home from './pages/Home'
import Router from './routes/Router'
import UserProvider from './store/UserProvider'
import { StrictMode } from 'react';
import { Toaster } from 'react-hot-toast';


export default function App() {

  return (
    <>  
      <StrictMode>
        <Toaster />
          <Router/>
      </StrictMode>
    </>
  )
}
