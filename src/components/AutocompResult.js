import React from 'react';

const AutocompResult = (props) => {
    return (
        <li className={props.className}>{props.title}</li>
    )
}

export default AutocompResult;