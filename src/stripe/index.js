import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { CheckoutForm } from './checkoutForm';
import Description from './description';
import GooglePay from './paymentReqButton';
import config from './config';
import './styles.css';

const stripePromise = loadStripe(config.stripePk);

function Stripe() {
  const [clientSecret, setClientSecret] = useState(true);
  const [amount] = useState(200)

  useEffect(() => {
    const body = JSON.stringify({
      currency: 'usd',
      amount,
    })
    fetch(config.clientSecretUrl, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    })
      .then((res) => res.json())
      .then((res) => setClientSecret(res.clientSecret))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Elements stripe={stripePromise}>
      {
        clientSecret 
          ? <div className='description-form-wrapper'>
              <div className='main-container'>
                <GooglePay
                  clientSecret={clientSecret}
                  amount={amount}
                />              
                <CheckoutForm
                  clientSecret={clientSecret}
                  amount={amount}
                />
              </div>
              <Description/>
            </div>
          : <div>Your action by loading payment intent</div>
      }
    </Elements>  
  );
}

export default Stripe;