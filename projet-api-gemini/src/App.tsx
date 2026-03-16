
import './App.css'
// import DemanderGemini from './Content/monChatBot/monChatBot'
import LoginPage from './Content/login/login'
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import SignUpPage from './Content/signup/signup'
import HomePage from './Content/home/home'
import { useEffect, useState } from 'react';
import loadingHome from './Content/composants/chargementLogin'

interface User{
  user_Id:number;
  email?:string;
}
function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  const handlLogout = async():Promise<void> => {
    await fetch("http://localhost:5000/api/logout",{method:"POST", credentials:"include"})
    setUser(null);
  }
  useEffect(()=>{
    fetch("http://localhost:5000/api/moi",{ credentials:'include' })
    .then(res => res.ok ? res.json() : null)
    .then(data =>{
      if (data) setUser(data);
      console.log(data);
      setLoading(false);
    }).catch(()=>setLoading(false))
  }, []);

  if (loading) return loadingHome();
  return (
    <Router>
      <Routes>
        <Route path='/login' element={ !user ? <LoginPage onLoginSuccess={setUser}/> : <Navigate to = "/monChatBot" />} />
        <Route path='/signUpPage' element={ <SignUpPage/>} />
        <Route path='/ChatBotGG' element={ user ? <HomePage user={user} onLogout={handlLogout}/> : <Navigate to ="/login" /> } />
        <Route path='*' element={<Navigate to = {user ? '/ChatBotGG' : '/login'}/>} />
      </Routes>
    </Router>
    
  )
}

export default App
