import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Categories from './Pages/Categories';
import CreateSell from './Pages/CreateSell';
import Error404 from './Pages/Error404';

function App() {
   return (
      <>
         <Header />
         <Switch>
            <Route path="/" exact component={Categories} />
            <Route path='/add-product' exact component={CreateSell} />;
            <Route component={Error404} />
         </Switch>
         <Footer />
      </>
   );
}

export default App;
