import React from 'react';

export default function StripeField({ placeholder, label, value, onChange }) {
    
    return (
      <div>
        <label className='card-label-text'>
          {label}
        </label>
        <div className='StripeElementCustom'>
          <input
              style={{width: '100%', border: 0, outline: 'none'}}
              placeholder={placeholder}
              value={value} onChange={onChange}
          />
        </div>
      </div>
    )
}