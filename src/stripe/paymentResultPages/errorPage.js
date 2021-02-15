import React from 'react';
import './styles.css'

function ErrorPayment() {
  return (
    <div className='payment-result-container'>
      <img className='checked-icon' alt='success' src='./close.svg' />
      <p className='error-message'>Your payment failed</p>
      <a href='/'>Back to payment form</a>
    </div>
  )
};

export default ErrorPayment;