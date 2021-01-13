import React, { useState, useRef, useEffect } from 'react';
import BottomArrow from '../images/bottomArrow.svg'

export default function StripeSelect({ data, label, value, onChange }) {

    const ref = useRef(null)
    const [show, setShow] = useState(false);

    const blurHandler = (event) => {
        if (event.currentTarget.contains(event.relatedTarget)) return;
        setShow(false)
    }

    const open = () => {
        setShow(true);
    }

    const getCountry = (code) => {
        setShow(false);
        const currentCountry = data.find((el) => el.code === code)
        onChange(currentCountry.code)
    }

    useEffect(() => {
        ref?.current?.focus();
    }, [show])

    return (
        <div className='relative pointer'>
            <label className='card-label-text'>
                {label}
            </label>
            <div className='StripeElementCustom' >
                <div style={{padding: '3px'}}>
                    <div onClick={open} style={{display: 'flex', justifyContent: data.find((el) => el.code === value)?.name ? 'space-between' : 'flex-end'}}>
                    <span style={{fontSize: '13px'}}>{data.find((el) => el.code === value)?.name}</span>
                    <img
                        alt='arrow'
                        src={BottomArrow}
                    />
                    </div>
                </div>
                {show && <div className='country-options-container' onBlur={blurHandler} tabIndex={1} ref={ref}>
                    <div  style={{padding: '0px 0px 0px 12px'}}>
                        {data.map(({ code, name }) => <p key={code} className='country' onClick={() => getCountry(code)}>{name}</p>)}
                    </div>
                </div>}
            </div>
        </div>
    )
}