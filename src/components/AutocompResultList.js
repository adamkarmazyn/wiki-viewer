import React from 'react';
import AutocompResult from './AutocompResult';

export default class AutocompResultList extends React.Component {
    render() {
        var results = this.props.autocompeteResults.map((title, idx) => {
            let isActive = this.props.highlightedIndex === idx ? 'active': '';
            return (
                <AutocompResult key={title} title={title} className={isActive}/>
            )
        })

        return (
        <div className='autocomplete__result'>
            <ul ref={this.props.refList}>{results}</ul>
        </div>)
    }
}