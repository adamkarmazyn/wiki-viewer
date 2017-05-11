import React from 'react';
import superagent from 'superagent';
import jsonp from 'superagent-jsonp';
import {debounce} from 'underscore';
import $ from 'jquery';


export default class SearchForm extends React.Component {
    constructor() {
        super();
        this.state = {
            autocompeteResults: [],
            hideList: true,
            highlightedIndex: -1,
            selected: null
        };
        this.debounceAuto = debounce(this.handleAuto, 1000);
    }

    onChange(event) {
        this.debounceAuto(event.target.value);
        this.props.handleInputChange(event);
    }

    onKeyDown(event) {
        var code = event.keyCode,
            highlightedIndex = this.state.highlightedIndex;

        switch (code) {
            case 13:
                this.selectItem(this.state.autocompeteResults[this.state.highlightedIndex]);
                break
            case 40:
                highlightedIndex < this.state.autocompeteResults.length - 1 && (highlightedIndex += 1);
                break
            case 38:
                highlightedIndex > -1 && (highlightedIndex -= 1);
                break
        }

        this.setState({ highlightedIndex: highlightedIndex });
        highlightedIndex > -1 && this.ensureHighlightedVisible();
    }

    ensureHighlightedVisible() {
        if (!this.refs.list || this.state.highlightedIndex < 0) return;

        var _list = $(this.refs.list)
        var _highlighted = _list.children().eq(this.state.highlightedIndex);

        return _list.scrollTop(_list.scrollTop() + _highlighted.position().top - _list.height() / 2 + _highlighted.height() / 2);
    }

    resetListScroll() {
        let list = this.refs.list;
        list.scrollTop = 0;
    }

    selectItem(item) {
        this.refs.searchInput.focus();
        this.resetListScroll();
        this.setState({ data: [], selected: item});

        if (item) {
            this.props.handleInputChange(item);
        }
        this.setState({hideList: true, highlightedIndex: -1});
        
    }

    handleOnClick(event) {
        this.selectItem(event.target.innerHTML);
    }

    handleAuto(searchTerm) {
        if (!searchTerm || searchTerm.length < 4 || this.props.stopAutocomp) return
        superagent.get('https://en.wikipedia.org/w/api.php') // Wikipedia API call
            .query({
                search: searchTerm,   // The search keyword passed by SearchForm
                action: 'opensearch', // You can use any kind of search here, they are all documented in the Wikipedia API docs
                format: 'json'        // We want JSON data back
                // limit: 10
            })
            .use(jsonp) // Use the jsonp plugin
            .end((error, response) => {
                if (!error) {
                    this.setState({
                        autocompeteResults: response.body[1] || [],
                        hideList: !(response.body && response.body[1].length),
                        highlightedIndex: -1
                    })
                    this.resetListScroll();
                }
            });
    }

    render() {
        var results = this.state.autocompeteResults.map((title, idx) => {
            let isActive = this.state.highlightedIndex === idx ? 'active': '';
            return (
                <li key={idx} className={isActive} onClick={this.handleOnClick.bind(this)}>{title}</li>
            )
        })

        var hideList = this.state.hideList ? ' hide' : '';

        return (
            <div className="search-box-container" >
                <form onSubmit={this.props.onSubmit}>
                    <input className="search-box-text" type="text" placeholder="Search for something..."
                        value={this.props.value}
                        onChange={this.onChange.bind(this)}
                        onKeyDown={this.onKeyDown.bind(this)}
                        ref='searchInput'
                    />
                </form>
                <div className={'autocomplete__result'+hideList}>
                    <ul ref='list'>{results}</ul>
                </div>
                <p className="random-text"><small>or visit a <a href="http://en.wikipedia.org/wiki/Special:Random" target="_blank">random article</a>.</small></p>
            </div>
        )
    }
}