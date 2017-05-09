// import React, {PropTypes} from 'react';
import React from 'react';

export default class SearchForm extends React.Component {
    // static propTypes = {
    //     value: PropTypes.string.isRequired,
    //     onChange: PropTypes.func.isRequired
    // }

    render() {
        return (
            <div className="search-box-container" >
                <form onSubmit={this.props.onSubmit}>
                    <input className="search-box-text" type="text" placeholder="Search for something..."
                    value={this.props.value}
                    onChange={this.props.onChange}
                    />
                </form>
                <p className="random-text"><small>or visit a <a href="http://en.wikipedia.org/wiki/Special:Random" target="_blank">random article</a>.</small></p>
            </div>
        )
    }
}