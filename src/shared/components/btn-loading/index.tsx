import React from 'react'

export interface IButtonLoader {
    className?:string
}
const ButtonLoader = ({className}:IButtonLoader) => {
    return (
        <span className={`w-5 h-5 border-4 border-white border-dotted rounded-full border-t-transparent animate-spin ${className}`}></span>
    )
}

export default ButtonLoader