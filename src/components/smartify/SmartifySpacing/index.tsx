import React from 'react';

type Props = {
    spacing?: number;
};

export default (props: Props) => {
    const {spacing} = props;
    
    return (
        <div style={{ marginTop: `${spacing}px`, marginBottom: `${spacing}px`}}></div>
    )
};