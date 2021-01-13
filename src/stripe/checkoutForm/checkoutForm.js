import React, { useState } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useElements, useStripe } from '@stripe/react-stripe-js';
import StripeField from './stripeField';
import StripeSelect from './stripeSelect';
import countriesList from './countriesList';
import local from '../local';
import cvcIcon from '../images/cvv.svg'

const defaultState = {
  email: '',
  name: '',
  address: {
    country: ''
  }
};

function CheckoutForm({ clientSecret, amount }) {
  const [lang] = useState('en');

  const [billingDetails, setBillingDetails] = useState({ ...defaultState });
  const [cardComplete, setCardComplete] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const validateFields = () => {
    if (billingDetails.email && billingDetails.name && billingDetails.address.country) return true;
    return false
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log('here')
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    let card = elements.getElement(CardNumberElement);
    let result;

    if (card) {
      setIsDisabled(true);
      result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: billingDetails
        }
      });
    }
    
    if (result) {
      if (result.error) {
        // Show error to your customer (e.g., insufficient funds)
        console.log('error', result.error)
        return setIsDisabled(false);
      };
      console.log('success');
      setBillingDetails(defaultState);
      setIsDisabled(false);
    }
  };

  return (
    <div className='checkout-form-container'>
      <form onSubmit={handleSubmit}>
        <div className='p-8'>
            <StripeField
              placeholder=""
              label={local[lang].email}
              value={billingDetails.email}
              onChange={(event) => setBillingDetails({...billingDetails, email: event.target.value})}
            />
        </div>
        <div className='p-8'>
          <label className='card-label-text card-info-label' >
            {local[lang].cardInfo}
          </label>
          <div 
            className='relative StripeElementCustom'
            style={{borderRadius: '6px 6px 0 0'}}
          >
            <div className='card-number-icons-container' >
              <img 
                src='https://js.stripe.com/v3/fingerprinted/img/visa-365725566f9578a9589553aa9296d178.svg'
                alt='visa'
              />
              <img
                src='https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg'
                alt='visa'
              />
              <img
                src='https://js.stripe.com/v3/fingerprinted/img/amex-a49b82f46c5cd6a96a6e418a6ca1717c.svg'
                alt='visa'
              />
            </div>
            <CardNumberElement
              onChange={(e) => {
                setCardComplete(e.complete);
            }}
            />
          </div>
          <div className='card-label-text card-expire-element' >
            <div 
              className='w-50 StripeElementCustom'
              style={{marginTop: '0', borderRadius: '0 0 0 6px'}}
            >
              <CardExpiryElement
                onChange={(e) => {
                  setCardComplete(e.complete);
                }}
              /> 
            </div>
            <div
              className='w-50 StripeElementCustom'
              style={{marginTop: '0', borderRadius: '0 0 6px 0'}}
            >
              <div className='cvc-icon-container' >
                <img alt='cvc' src={cvcIcon}></img>
              </div>
              <CardCvcElement
                onChange={(e) => {
                  setCardComplete(e.complete);
                }}
              />
            </div>
          </div>
        </div>
        <div className='p-8'>
          <StripeField
            placeholder=""
            label={local[lang].name}
            value={billingDetails.name}
            onChange={(event) => setBillingDetails({...billingDetails, name: event.target.value})}
          />
        </div>
        <div className='p-8'>
          <StripeSelect 
            data={countriesList}
            label={local[lang].country}
            value={billingDetails.address.country}
            onChange={(country) => setBillingDetails({ ...billingDetails, address: { ...billingDetails.address, country } })}
          />
        </div>
        <div className='p-8'>
          <button
            style={validateFields() && !isDisabled ? {color: '#ffffff'} : {color: '#d1d1d1'} }
            className='SubmitButton SubmitButton--incomplete'
            disabled={isDisabled}
            type="submit">{`${local[lang].payButtonText} $${(amount / 100).toFixed(2)}`}
          </button>
        </div>
      </form> 
    </div>
  );
};

export default CheckoutForm;