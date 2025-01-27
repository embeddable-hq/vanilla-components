import React from 'react';


type Props = {
    spacing?: number,
    thickness?: number,
    color?: string;
};

export default (props: Props) => {
    const {thickness, spacing, color} = props;
    
    return (
        <div style={{ marginTop: `${spacing}px`, marginBottom: `${spacing}px`, borderBottom: `${thickness}px solid ${color || 'grey'}` }}></div>
    )
};