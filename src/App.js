import React from 'react';
import { BrowserRouter, Switch, Route, } from 'react-router-dom';
import Stripe from './stripe';
import SuccessPayment from './stripe/paymentResultPages/successPage';
import ErrorPayment from './stripe/paymentResultPages/errorPage';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' exact component={Stripe} />
        <Route path='/success' exact component={SuccessPayment} />
        <Route path='/error' exact component={ErrorPayment} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
