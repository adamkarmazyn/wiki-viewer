import Result from 'components/Result';
import createComponent from 'helpers/shallowRenderHelper';

describe('ResultTest', function () {
    var testingProps = {
      url: 'https://en.wikipedia.org/wiki/REACT',
      title: 'React',
      description: 'From other capitalisation: This is a redirect from a title with another method of capitalisation. It leads to the title in accordance with the Wikipedia naming conventions for capitalisation, or it leads to a title that is associated in some way with the conventional capitalisation of this redirect title.',
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/ReactOS_logo.svg/250px-ReactOS_logo.svg.png',
      defaultSrc: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Article_icon_cropped.svg/512px-Article_icon_cropped.svg.png'
    };

  beforeEach(function () {
    this.ResultComponent = createComponent(Result, testingProps);
    this.DivImage = this.ResultComponent.props.children.props.children[0];
    this.DivStacked = this.ResultComponent.props.children.props.children[1];
  });

  it('Result is "a" tag ', function() {
    expect(this.ResultComponent.type).to.equal('a');
  });

  it('"a" tag has href attribute equal to props.url', function(){
    expect(this.ResultComponent.props.href).to.equal(testingProps.url);
  });

  it('Result "a" has target="_blank" attribute', function() {
    expect(this.ResultComponent.props.target).to.equal('_blank');
  });

  it('Result has div children with className="result"', function() {
    expect(this.ResultComponent.props.children.props.className).to.equal('result');
  });

  it('Result has two siblings in div with className="result"', function(){
    expect(this.ResultComponent.props.children.props.children).to.have.lengthOf(2);
  });

  it('first from sibling has className="image"', function() {
    expect(this.DivImage.props.className).to.equal('image');
  });

  it('first from sibling has url backgroundImage equal to props.src', function () {
    expect(this.DivImage.props.style).to.have.property('backgroundImage').equal('url('+testingProps.src+')');
  });

  it('default backgroundImage is equal to testingProps.defaultSrc', function(){
    //create component without props.src
    var ResultComponent = createComponent(Result);
    var DivImage = ResultComponent.props.children.props.children[0];
    expect(DivImage.props.style).to.have.property('backgroundImage').equal('url('+testingProps.defaultSrc+')');
  });

  it('second from siblings has className="stacked"', function() {
    expect(this.DivStacked.props.className).to.equal('stacked');
  });

  it('second from siblings has child h3', function(){
    expect(this.DivStacked.props.children[0].type).to.equal('h3');
  });

  it('h3 tag innerHtml is equal to props.title', function() {
    expect(this.DivStacked.props.children[0].props.children).to.equal(testingProps.title);
  });

  it('second from siblings has child p tag', function(){
    expect(this.DivStacked.props.children[1].props.children[0].props.children.type).to.equal('p');
  });

  it('p tag has className="truncate"', function() {
    expect(this.DivStacked.props.children[1].props.children[0].props.children.props.className).to.equal('truncate');
  });

  it('p tag innerHTML is equal to props.url ', function() {
    expect(this.DivStacked.props.children[1].props.children[0].props.children.props.children).to.equal(testingProps.url);
  });

  it('second from siblings has child div tag', function(){
    expect(this.DivStacked.props.children[1].props.children[1].type).to.equal('div');
  });

  it('div tag has className="description"', function() {
    expect(this.DivStacked.props.children[1].props.children[1].props.className).to.equal('description');
  });

  it('div tag innerHTML is equal to props.description ', function() {
    expect(this.DivStacked.props.children[1].props.children[1].props.children).to.equal(testingProps.description);
  });


});