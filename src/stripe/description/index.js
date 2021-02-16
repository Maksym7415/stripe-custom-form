import React from 'react';
import './styles.css'

function Description() {
  return (
    <div className='description'>
      <p>
        This is custom stripe payment form with GooglePay/ApplePay button.
        GooglePay/ApplePay button couldn't appear if you have not relevant browser or version of it, if you hadn't payment account in your google or apple account
      </p>
      <p>To check successfully payment you should use data below:</p>
      <ul>
        <li><b>Email:</b> any valid email</li>
        <li><b>Card Number:</b> 4242 4242 4242 4242</li>
        <li><b>Exp. date:</b> any future date</li>
        <li><b>CVC:</b> any three numbers</li>
        <li><b>Name:</b> any name</li>
        <li><b>Country:</b> any country from select</li>
      </ul>
      <p>To check error payment you should use data below:</p>
      <ul>
        <li><b>Email:</b> any valid email</li>
        <li><b>Card Number:</b> 4000 0000 0000 0069</li>
        <li><b>Exp. date:</b> any future date</li>
        <li><b>CVC:</b> any three numbers</li>
        <li><b>Name:</b> any name</li>
        <li><b>Country:</b> any country from select</li>
      </ul>
      <p>To check GooglePay/ApplePay you should add fake payment account for USA country for card 4242 4242 4242 4242.</p>
    </div>
  )
};

export default Description;