// src/components/smartify/SmartifyTitle/index.tsx
import React from 'react';
import H1Title from '../../vanilla/H1Title';
import { Inputs } from './SmartifyH1Title.emb';

// Define props structure
//interface TitleProps {
//  text: string;
//}

export default (props: Inputs) => {
    const {title} = props;

    return <H1Title title={title} />
    
}