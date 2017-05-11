require('normalize.css/normalize.css');
require('styles/App.css');

import superagent from 'superagent';
import jsonp from 'superagent-jsonp';
import React from 'react';
import $ from 'jquery'
import {findWhere, debounce} from 'underscore';
// import Hello from './Hello';
import SearchForm from './SearchForm';
import ResultList from './ResultList'


// let wikiImage = require('../images/enwiki.png');

class AppComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      searchTerm: '',
      results: ['', [], [], [], []],
      autocompeteResults: [],
      hideList: true,
      highlightedIndex: -1,
      selected: null
    };
    this.debounceAuto = debounce(this.handleAuto, 1000);
  }

  handleInputChange(event) {
    this.debounceAuto(event.target.value);
    this.setState({
      searchTerm: event.target.value
    })
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
    };

    this.setState({ highlightedIndex: highlightedIndex });
    highlightedIndex > -1 && this.ensureHighlightedVisible();

    if (code === 13 || code === 40 || code === 38) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  ensureHighlightedVisible() {
    console.warn(this.refs.searchForm)
    console.warn(this.refs.searchForm.refs.list.refs.list)
    if (!this.refs.searchForm.refs.list.refs.list || this.state.highlightedIndex < 0) return;

    var _list = $(this.refs.searchForm.refs.list.refs.list)
    console.warn(_list)
    var _highlighted = _list.children().eq(this.state.highlightedIndex);
    console.warn(_highlighted)


    // var $list = $(this.refs.list.getDOMNode()),
    //   $highlighted = $list.children().eq(this.state.highlightedIndex);

    return _list.scrollTop(_list.scrollTop() + _highlighted.position().top - _list.height() / 2 + _highlighted.height() / 2);
  }

  resetListScroll() {
    console.warn('scrol top')
    console.warn(this.refs.searchForm.list)
    // this.refs.list && (this.refs.list.getDOMNode().scrollTop = 0);
  }

  selectItem(item) {
    this.resetListScroll();
    this.setState({ data: [], hideList: true, selected: item });

    if (item) {
      console.warn(item)
      console.warn('searh input = item.label')
      // this.refs.searchInput.getDOMNode().value = item.label;
    }

  }

  handleAuto(searchTerm) {
    if(!searchTerm || searchTerm.length < 4) return
    superagent.get('https://en.wikipedia.org/w/api.php') // Wikipedia API call
      .query({
        search: searchTerm,   // The search keyword passed by SearchForm
        action: 'opensearch', // You can use any kind of search here, they are all documented in the Wikipedia API docs
        format: 'json'        // We want JSON data back
        // limit: 10
      })
      .use(jsonp) // Use the jsonp plugin
      .end((error, response) => {
        if (error) {
          // console.error(error);
        } else {
          this.setState({autocompeteResults: response.body[1] || []})
          // this.setState({ results: response.body }); // Set the state once results are back
        }
      });
  }

  handleSubmit(event) {
    event.preventDefault();
    let searchTerm = this.state.searchTerm;
    if (!searchTerm) return //nothing to search
    this.handleSearch(searchTerm);
  }

  handleSearch(searchTerm) {
    superagent.get('https://en.wikipedia.org/w/api.php') // Wikipedia API call
      .query({
        search: searchTerm,   // The search keyword passed by SearchForm
        action: 'opensearch', // You can use any kind of search here, they are all documented in the Wikipedia API docs
        format: 'json'        // We want JSON data back
        // limit: 10
      })
      .use(jsonp) // Use the jsonp plugin
      .end((error, response) => {
        if (error) {
          // console.error(error);
        } else {
          // this.setState({ results: response.body }); // Set the state once results are back
          superagent.get('https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages%7Cpageterms&generator=prefixsearch&redirects=1&formatversion=2&piprop=thumbnail&pithumbsize=250&pilimit=20&wbptterms=description&gpslimit=20')
          .query({
            gpssearch: searchTerm
          })
          .use(jsonp)
          .end((error,newResopnse) => {
            if (error) {
              // console.error(error);
            } else {
              this.joinResponses(response.body, newResopnse.body.query.pages)
          }
          })
        }
      });
  }

  joinResponses(res1,res2) {
    let searchResults = res1;
    searchResults.push([])
    for(var x=0; x<res1[1].length; x++) {
      let img = findWhere(res2, {index: x+1});
      let src;
      if(img.hasOwnProperty('thumbnail') === true) {
        //image for this index
        src = img.thumbnail.source;
      }
      searchResults[4].push(src)
    }
    this.setState({ results: searchResults })
  }
  

  render() {
    return (
      <div className="index">
        {/*<img src={wikiImage} alt="Wikipedia" />*/}
        {/*<Hello name='Marcin' />*/}
        <SearchForm onSubmit={this.handleSubmit.bind(this)} value={this.state.searchTerm} onChange={this.handleInputChange.bind(this)}
        autocompeteResults={this.state.autocompeteResults}
        onKeyDown={this.onKeyDown.bind(this)}
        highlightedIndex={this.state.highlightedIndex}
        refSearchInput='searchInput'
        ref='searchForm'
        refList='list'
        />
        <ResultList results={this.state.results} />
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
