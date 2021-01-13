import React from 'react';

export default function StripeField({ placeholder, label, value, onChange, isValid, message }) {
    
    return (
      <div className='relative'>
        <label className='card-label-text'>
          {label}
        </label>
        <span className='validation-message' style={{display: isValid ? 'none' : 'inline'}} >{message}</span>
        <div className='StripeElementCustom' style={{border: isValid ? '1px solid #e8e8e8' : '1px solid red'}}>
          <input
              style={{width: '100%', border: 0, outline: 'none'}}
              placeholder={placeholder}
              value={value} onChange={onChange}
          />
        </div>
      </div>
    )
}