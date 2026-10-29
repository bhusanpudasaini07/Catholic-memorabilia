import React, { FC, useEffect, useState } from 'react';


interface IProps{
    note: string;
    setNote:(arg1: any) => void;
}
const OrderNote:FC<IProps> = ({note, setNote}) => {
    return (
        <>
            <textarea
                  className="textarea w-full rounded-none focus:outline-none border-[1px] border-gray-1200"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                >
                </textarea>
        </>
        
    )
}

export default OrderNote