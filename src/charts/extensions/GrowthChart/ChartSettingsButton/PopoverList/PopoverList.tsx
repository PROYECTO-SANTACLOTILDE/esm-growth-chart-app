import React from 'react';

type PopoverListProps = {
    setPopperElement: (element: HTMLUListElement | null) => void;
    style: any;
    popoverAttributes: any;
    children: React.ReactNode;
};

export const PopoverList = ({
    setPopperElement, style, popoverAttributes, children,
}: PopoverListProps): JSX.Element => (
    <div
        ref={setPopperElement}
        style={style}
        {...popoverAttributes}
        className='bg-white border rounded border-gray-300 shadow-md z-10 absolute'
    >
        {children}
    </div>
);
