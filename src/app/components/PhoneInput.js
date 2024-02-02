import { defaultCountries, parseCountry, usePhoneInput } from 'react-international-phone';
import React, { useRef, useState, useEffect } from 'react';

const customCountries = [
    { iso2: 'bf', name: 'Burkina Faso', dialCode: '+226', phoneLength: 8 },
    { iso2: 'us', name: 'United States', dialCode: '+1', phoneLength: 10 },
    // Ajoutez d'autres pays ici avec leur phoneLength respectif
];


const PhoneInput = ({ value, onChangePhone, onChangeCountrie, disabled, ...restProps }) => {
    const [selectedCountry, setSelectedCountry] = useState('bf'); // État local pour le pays
    const [localPhone, setLocalPhone] = useState(''); // État local pour le numéro de téléphone

    const handlePhoneChange = (e) => {
        const filteredValue = e.target.value.replace(/[^0-9]/g, '');
        setLocalPhone(filteredValue);    
    };

    const handleCountryChange = (e) => {
        setSelectedCountry(e.target.value);
    };

    useEffect(() => {
        // Trouver les données du pays sélectionné dans la liste personnalisée
        const countryData = customCountries.find(c => c.iso2 === selectedCountry);
        onChangeCountrie(countryData.phoneLength+countryData.dialCode.length);
        const fullPhoneNumber = `${countryData.dialCode}${localPhone}`;
        onChangePhone(fullPhoneNumber);
    }, [selectedCountry, localPhone, customCountries]);
    



    return (
        <div>
            <select 
                disabled={disabled}
                className="bg-transparent outline-none country-select"
                value={selectedCountry}
                onChange={handleCountryChange}
            >
                {customCountries.map((country) => (
                    <option key={country.iso2} value={country.iso2}>
                        {country.name} ({country.dialCode})
                    </option>
                ))}
            </select>
            <input 
                disabled={disabled}
                type="tel"
                placeholder="Phone number"
                value={localPhone}
                onChange={handlePhoneChange}
                {...restProps}
            />
        </div>
    );
};

export default PhoneInput