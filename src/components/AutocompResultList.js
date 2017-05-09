import React from 'react';
import AutocompResult from './AutocompResult';

export default class AutocompResultList extends React.Component {
    render() {
        var results = this.props.autocompeteResults.map((title, idx) => {
            return (
                <AutocompResult key={idx} title={title}/>
            )
        })

        return (<div className="autocomp-result-list">{results}</div>)
    }
}