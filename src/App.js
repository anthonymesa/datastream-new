import './App.css';
import Datashed from './Datashed/Datashed';
import Login from './Login/Login';
import backend from './utils/Backend';

const useUserValidation = () => {
  return backend.authStore.isValid
}

function App() {
  const userLoggedIn = useUserValidation()
  
  if (userLoggedIn) {
    return <Datashed />
  } else {
    return <Login />
  }
}

export default App;
