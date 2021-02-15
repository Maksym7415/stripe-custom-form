import React from 'react';
import './styles.css'

function SuccessPayment() {
  return (
    <div className='payment-result-container'>
      <img className='checked-icon' alt='success' src='./checked.svg' />
      <p className='success-message'>Your payment successfully</p>
      <a href='/'>Back to payment form</a>
    </div>
  )
};

export default SuccessPayment;