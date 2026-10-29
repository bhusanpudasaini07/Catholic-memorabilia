import CaretDownIcon from '@/shared/icons/common/CaretDownIcon';
import React, { useState } from 'react';

export interface ISortDropdown {
    sortChange: (sortBy: string, sortOrder: string) => void;

}

const SortingDropdown: React.FC<ISortDropdown> = ({ sortChange }) => {
    const options = [
        {
            label: 'A to Z',
            value: 'name_asc',
            sortBy: 'name',
            sortOrder: 'asc'
        },
        {
            label: 'Z to A',
            value: 'name_desc',
            sortBy: 'name',
            sortOrder: 'desc'
        },
        {
            label: 'Price (Low > High)', 
            value: 'price_asc',
            sortBy: 'price',
            sortOrder: 'asc'
        },
        { label: 'Price (High > Low)', 
            value: 'price_desc',
            sortBy: 'price',
            sortOrder: 'desc'
         }
    ];

    const [selectedType, setSelectedType] = useState("Please Select");

    const handleTypeChange = (text: string) => {
        setSelectedType(text);
    };

    return (
        <div className="dropdown">
            <label
                tabIndex={0}
                className="rounded-[20px] bg-white border px-4 py-2 border-gray-350 min-w-[250px] whitespace-nowrap text-gray-50 text-sm font-medium flex gap-1 justify-between items-center"
            >
                <span className="capitalize">{selectedType}</span>
                <CaretDownIcon />
            </label>
            <ul
                tabIndex={0}
                className="dropdown-content menu shadow p-0 bg-base-100 rounded-sm w-full z-[60]"
            >
                <li className='pointer-events-none bg-slate-150 hover:bg-none'>
                    <span className='border-0 rounded-none bg-none hover:!bg-none opacity-25'>Please Select</span>
                </li>
                {options.map((option) => (
                    <li key={option.value} onClick={() => { 
                        handleTypeChange(option.label); 
                        sortChange(option.sortOrder, option.sortBy) }}
                         className={`hover:!bg-[#f5faff] ${option.label === selectedType ? 'bg-[#f5faff]' : ''}`}>
                        <span className='border-0 rounded-none bg-none hover:!bg-transparent'>{option.label}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SortingDropdown;