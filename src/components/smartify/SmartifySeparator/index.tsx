import React from 'react';
import { Inputs } from './SmartifySeparator.emb';

// If you want to extend this component later to accept dynamic spacing or color, you can define props interface here
interface SpacingComponentProps {
}

export default (props: Inputs) => {
    const {thickness, spacing, color} = props;
    
    return (
        <div style={{ marginTop: `${spacing}px`, marginBottom: `${spacing}px`, borderBottom: `${thickness}px solid ${color || 'grey'}` }}></div>
    )
};