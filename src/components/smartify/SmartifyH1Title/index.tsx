// src/components/smartify/SmartifyTitle/index.tsx
import React from 'react';
import H1Title from '../../vanilla/H1Title';

type Props = {
    title?: string;
};

export default (props: Props) => {
    const {title} = props;

    return (
        <div style={{ marginTop: '18px' }}>
            <H1Title title={title} />
        </div>
    );
};

// export default (props: Inputs) => {
//     const {title} = props;

//     return <H1Title title={title} />
    
// }