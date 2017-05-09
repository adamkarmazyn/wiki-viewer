import React from 'react';
import Result from './Result';

export default class ResultList extends React.Component {
    render() {
        var results = this.props.results[1].map((title, idx) => {
            return (
                <Result key={idx} title={title} url={this.props.results[3][idx]} description={this.props.results[2][idx]} src={this.props.results[4][idx]}/>
            )
        })

        return (<div className="result-list">{results}</div>)
    }
}