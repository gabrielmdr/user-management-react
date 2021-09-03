import { BrowserRouter, Route } from 'react-router-dom';
import EditUser from './pages/EditUser';
import Home from './pages/Home';
import NewUser from './pages/NewUser';

export default function Routes() {
  return (
    <BrowserRouter>
      <Route path="/" component={Home} exact />
      <Route path="/user/new" component={NewUser} />
      <Route path="/user/:id/edit" component={EditUser} />
    </BrowserRouter>
  );
}