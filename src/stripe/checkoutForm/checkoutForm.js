import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {CardNumberElement, CardExpiryElement, CardCvcElement, useElements, useStripe} from '@stripe/react-stripe-js';
import StripeField from './stripeField';
import StripeSelect from './stripeSelect';
import countriesList from './countriesList';
import local from '../local';
import cvcIcon from '../images/cvv.svg';
import warning from '../images/warning.svg';
import lockIcon from '../images/lock.svg';

const defaultState = {
  email: '',
  name: '',
  address: {
    country: ''
  }
};
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      outline: 'none',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  }
};

function CheckoutForm({ clientSecret, amount }) {
  const [lang] = useState('en');
  const history = useHistory();

  const [billingDetails, setBillingDetails] = useState({ ...defaultState });
  const [cardComplete, setCardComplete] = useState({
    cardNumber: {},
    cardExpiry: {},
    cardCvc: {},
  });
  const [cardFieldsValidation, setCardFieldsValidation] = useState({
    cardNumber: {
      state: true,
      message: ''
    },
    cardExpiry: {
      state: true,
      message: ''
    },
    cardCvc: {
      state: true,
      message: ''
    },
  });
  const [cardFieldErrorMessage, setCardFieldErrorMessage] = useState('');
  const [innerFieldsValidation, setInnerFieldsValidation] = useState({
    country: true,
    email: true,
    name: true,
  });

  const [isDisabled, setIsDisabled] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const validateInnerFields = () => {
    if (billingDetails.email && billingDetails.name && billingDetails.address.country) return true;
    return false
  }

  const validateCardFields = () => {
    if (cardFieldsValidation.cardNumber.state && cardFieldsValidation.cardExpiry.state && cardFieldsValidation.cardCvc.state) return true;
    return false
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    const innerValidation = {};
    const cardValidation = {...cardFieldsValidation};

    Object.keys(billingDetails).forEach((item) => {
      if (item === 'address') {
       return innerValidation.country = !!billingDetails.address.country;
      }
      innerValidation[item] = !!billingDetails[item];
    });

    Object.keys(cardComplete).forEach((item) => {
      if (!cardComplete[item].complete || cardComplete[item].empty) {
        cardValidation[item] = {
          state: false,
          message: cardComplete[item].error ? cardComplete[item].error.message : ''
        }
      } else {
        cardValidation[item] = {
          state: true,
          message: cardComplete[item].error ? cardComplete[item].error.message : ''
        }
        if (cardFieldsValidation[item].message === cardFieldErrorMessage) setCardFieldErrorMessage('')
      }
    })

    const isValidInnerFields = Object.values(innerValidation).includes(false);
    const isCardFields = Object.values(cardValidation).map((item) => item.state).includes(false);

    if (isValidInnerFields || isCardFields) {
      setInnerFieldsValidation(innerValidation);
      setCardFieldsValidation(cardValidation);
      return;
    }

    setInnerFieldsValidation(innerValidation);
    setCardFieldsValidation(cardValidation);

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
        console.log('error', result.error);
        setIsDisabled(false);
        
        return history.push('/error');
      };
      console.log('success');
      setBillingDetails(defaultState);
      setIsDisabled(false);
      return history.push('/success');
    }
  };

  return (
    <div className='checkout-form-container'>
      <form onSubmit={handleSubmit}>
        <div className='p-8'>
            <StripeField
              placeholder=""
              message={local[lang].validationMessage}
              isValid={innerFieldsValidation.email}
              label={local[lang].email}
              value={billingDetails.email}
              onChange={(event) => setBillingDetails({...billingDetails, email: event.target.value})}
            />
        </div>
        <div className='p-8 relative'>
          <label className='card-label-text card-info-label' >
            {local[lang].cardInfo}
          </label>
          <span className='validation-message' style={{display: !validateCardFields() && !cardFieldErrorMessage ? 'inline' : 'none', top: '10px', right: '10px'}} >{local[lang].validationMessage}</span>
          <span className='card-error-message' style={{display: !validateCardFields() && cardFieldErrorMessage ? 'inline' : 'none'}} >{cardFieldErrorMessage}</span>
          <div 
            className='relative StripeElementCustom'
            style={{borderRadius: '6px 6px 0 0', padding: '12px 12px', border: !validateCardFields() ? '0.5px solid red': '', borderBottom: !validateCardFields() ? '0px' : ''}}
          >
            <div className='card-number-icons-container' style={!cardFieldsValidation.cardNumber.state ?  { width: '35px', bottom: '15px'}: {}} >
              {!cardFieldsValidation.cardNumber.state ? 
                <img src={warning} alt='warning'/> 
                :
                <>
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
                </>
              }
            </div>
            <CardNumberElement
              options={CARD_ELEMENT_OPTIONS}
              onChange={(e) => {
                setCardComplete({...cardComplete, [e.elementType]: {...e}});
                if (e.error) setCardFieldErrorMessage(e.error.message);
            }}
            />
          </div>
          <div className='card-label-text card-expire-element' >
            <div 
              className='w-50 StripeElementCustom relative'
              style={{marginTop: '0', borderRadius: '0 0 0 6px', padding: '12px 12px', border: !validateCardFields() ? '1px solid red': ''}}
            >
              <div className='cvc-icon-container' style={!cardFieldsValidation.cardExpiry.state ? { right: '16px', bottom: '15px'} : {}} >
                {!cardFieldsValidation.cardExpiry.state 
                  ? 
                    <img src={warning} alt='warning'/> 
                  :
                    null
                }
              </div>
              <CardExpiryElement
                onChange={(e) => {
                  setCardComplete({...cardComplete, [e.elementType]: {...e}});
                  if (e.error) setCardFieldErrorMessage(e.error.message)
                }}
              /> 
            </div>
            <div
              className='w-50 StripeElementCustom'
              style={{marginTop: '0', borderRadius: '0 0 6px 0', padding: '12px 12px', border: !validateCardFields() ? '0.5px solid red': ''}}
            >
              <div className='cvc-icon-container' style={!cardFieldsValidation.cardCvc.state ? { right: '16px', bottom: '15px'} : {}} >
              {!cardFieldsValidation.cardCvc.state
                ? 
                  <img src={warning} alt='warning'/> 
                :
                  <img alt='cvc' src={cvcIcon}></img>
              }
              </div>
              <CardCvcElement
                onChange={(e) => {
                  setCardComplete({...cardComplete, [e.elementType]: {...e}});
                  if (e.error) setCardFieldErrorMessage(e.error.message)
                }}
              />
            </div>
          </div>
        </div>
        <div className='p-8'>
          <StripeField
            placeholder=""
            isValid={innerFieldsValidation.name}
            message={local[lang].validationMessage}
            label={local[lang].name}
            value={billingDetails.name}
            onChange={(event) => setBillingDetails({...billingDetails, name: event.target.value})}
          />
        </div>
        <div className='p-8'>
          <StripeSelect 
            data={countriesList}
            isValid={innerFieldsValidation.country}
            message={local[lang].validationMessage}
            label={local[lang].country}
            value={billingDetails.address.country}
            onChange={(country) => setBillingDetails({ ...billingDetails, address: { ...billingDetails.address, country } })}
          />
        </div>
        <div className='p-8 relative'>
          <button
            style={validateInnerFields() && !isDisabled ? {color: '#ffffff'} : {color: '#d1d1d1'} }
            className='SubmitButton SubmitButton--incomplete'
            disabled={isDisabled}
            type="submit">{`${local[lang].payButtonText} $${(amount / 100).toFixed(2)}`}
          </button>
          {validateInnerFields() && <img className='pay-button-lock-icon' alt='lock' src={lockIcon} />}
        </div>
      </form> 
    </div>
  );
};

export default CheckoutForm;
