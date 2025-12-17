import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {Header} from './components/Header';
import {Footer} from './components/Footer';
import {Main} from './components/Main';
import {MyProfile} from './components/MyProfile';
import {Info} from './components/Info';
import {Game} from './components/Game';
import {Login} from "./components/Login";
import {Logout} from "./components/Logout";
import {Congrats} from "./components/Congrats";
import {Register} from "./components/Register";

function App() {
    return (
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path='' element={<Main/>}></Route>
                <Route path='/info' element={<Info/>}></Route>
                <Route path='/profile' element={<MyProfile/>}></Route>
                <Route path='/games/:id' element={<Game/>}></Route>
                <Route path='/congrats' element={<Congrats/>}></Route>
                <Route path='/login' element={<Login/>}></Route>
                <Route path='/logout' element={<Logout/>}></Route>
                <Route path='/register' element={<Register/>}></Route>
            </Routes>
            <Footer/>
        </BrowserRouter>
    );
}

export default App;
