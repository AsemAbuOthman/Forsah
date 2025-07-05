import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";


export default function CountryMenu({ formData, setFormData, errors, setCountries, countries }) {

        const [isLoading, setIsLoading] = useState({});

    useEffect(()=>{

        const fetchCountries = async  () => {
            try {
    
                const res = await axios.get('/api/countries');
                
                setCountries(await res.data[0]);
    
            } catch (error) {
                console.error("Failed to fetch countries:", error);
                setCountries([]); // Fallback to empty array
            } finally {
                setIsLoading(false);
            }
        };

        fetchCountries();
    }, [])


    return (
        <>
            <label className="block text-sm font-medium text-gray-700">Country</label>
                <Select
                options={countries}
                value={formData.country}    
                onChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
                className={errors.country ? 'border-red-500' : ''}
                isLoading={countries.length === 0} // Show loading state if empty
                />
            {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
        </>
    )
}
