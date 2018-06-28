import React, { Component } from 'react';
import SplitPane from 'react-split-pane';
import WordCloud from '../lib';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import 'typeface-roboto'

import { getRandomNumberFromLenghtOfData, getArrayOfKeywords } from './helpers/Util';

import french from './data/french.json';
import chinese from './data/chinese.json';

import arabic from './data/arabic.json';
import norwegian from './data/norwegian.json';

class App extends Component {

  wordCloudWidth = window.innerWidth - 200;
  wordCloudHeight = window.innerHeight - 300;
  constructor(props) {
    super(props);
    this.state = {
      data: french,
      tableData: [],
      availableLanguages: ['French', 'Chinese', 'Norwegian', 'Arabic'],
      availableThemes: ['default', 'yellow-on-black', 'inverted-grey', 'inverted-colour'],
      accessibiltyClass: '',
      arrHighlightWords: [],
      splitSize : window.innerWidth>>1
    };
    this.id = 0;

    this.handleDataSelectionChange = this.handleDataSelectionChange.bind(this);
    this.handleAccessibiltySelectionChange = this.handleAccessibiltySelectionChange.bind(this);
    this.handleRightClick = this.handleRightClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.removeWord = this.removeWord.bind(this);
    this.updateHighlightedWords = this.updateHighlightedWords.bind(this);
    this.clearHightlightedWords = this.clearHightlightedWords.bind(this);
    this.createData = this.createData.bind(this);

  }

  createData(keywords, currentId) {
    let id = this.id += 1;
    return { id, keywords };
  }

  componentDidMount() {
    this.Load();
  }

  Load() {
    let tableData = this.loadData();

    this.setState(state => ({ tableData: tableData }));
  }

  loadData() {
    let tableData = [];
    // Generate data for table
    for (let i = 0; i < getRandomNumberFromLenghtOfData(this.state.data); i++) {
      tableData.push(this.createData(getArrayOfKeywords(this.state.data), this.id));
    }
    return tableData;
  }

  clearHightlightedWords(){
    this.refs.wordsToHighlight.value = "";
    this.setState((prevState, props) => ({
      arrHighlightWords: [""]
    }));
  }
  handleDataSelectionChange() {

    switch (this.refs.dropdown.value.toLowerCase()) {
      case 'french':
        this.setState(prevState => ({ data: french }));
        break;
      case 'chinese':
        this.setState(prevState => ({ data: chinese }));
        break;
      case 'norwegian':
        this.setState(prevState => ({ data: norwegian }));
        break;
      case 'arabic':
        this.setState(prevState => ({ data: arabic }));
        break;
      default:
        this.setState(prevState => ({ data: french }));
        break;
    }

    setTimeout(() => {
      this.Load();
    })

  }

  handleLeftClick() {
    alert("Click!!");
  }

  handleRightClick = event => {
    event.preventDefault();
    this.setState({ anchorEl: event.currentTarget });
    return false;
  }

  handleClose = () => {
    this.setState({ anchorEl: null });
  }

  removeWord = () => {
    let index = this.state.anchorEl.id.split('-')[3];
    let newData = [...this.state.data];
    newData[index].visible = false;
    this.setState({data : newData});
    this.handleClose();
  }

  handleAccessibiltySelectionChange() {
    const accClass = this.refs.accessibilty.value.toLowerCase();
    this.setState((prevState, props) => ({
      accessibiltyClass: accClass
    }));
  }

  updateHighlightedWords() {
    let words = this.refs.wordsToHighlight.value.replace(',', ' ').split(' ');

    this.setState((prevState, props) => ({
      arrHighlightWords: words
    }));

  }

  updateHighlightedWordsFromTable(words) {
    this.setState((prevState, props) => ({
      arrHighlightWords: words
    }));

  }

  render() {
    let data = this.state.data
    const accClass = this.state.accessibiltyClass;
    const { anchorEl } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Word Cloud Demo - Prime 2018</h1>
          <span className='sub-heading'>by Dictionary Corner</span>

          <div className='control-bar' role="menubar">
            <h2>Demo Controls</h2>
            <section>
              <div>
                <label htmlFor="changeData">Select Data Set</label>
                <select id="changeData" className="" ref="dropdown" onChange={this.handleDataSelectionChange}>
                  {this.state.availableLanguages.map((item, index) => <option className="" key={index + '_' + item} value={item} >{item}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="accessClass">Accessibility Views</label>
                <select id="accessClass" className="" ref="accessibilty" onChange={this.handleAccessibiltySelectionChange}>
                  {this.state.availableThemes.map((item, index) => <option className="" key={index + '_' + item} value={item} >{item}</option>)}
                </select>
              </div>
              <div className="invertedControl">
                <label htmlFor="showWordsHighlighted">Enter words to highlight:</label>
                <input id="showWordsHighlighted" ref="wordsToHighlight" onChange={this.updateHighlightedWords} />
                <button onClick={this.clearHightlightedWords} >Clear</button>
              </div>
            </section>
          </div>
        </header>

        <SplitPane split="vertical" defaultSize={window.innerWidth >> 1} onChange={size => this.setState({ splitSize: size })}>
          <div>
            <div className={accClass}>
              <WordCloud data={data} width={this.state.splitSize} height={this.wordCloudHeight}
                scoreKey={"freq"} highlightWords={this.state.arrHighlightWords} handleLeftClick={this.handleLeftClick}
                handleRightClick={this.handleRightClick} />
            </div>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.handleClose}
            >
              <MenuItem onClick={this.removeWord}>Remove Word</MenuItem>
              <MenuItem onClick={this.handleClose}>Close</MenuItem>
            </Menu>
          </div>
          <div>
            <Paper
              style={{
                maxHeight: window.innerHeight - 100,
                overflow: 'auto'
              }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell>Keywords</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this
                    .state
                    .tableData
                    .map((item, index) => {
                      let rowStyle = {}
                      //rowStyle = {background : '#0066ff'}
                      return (
                        <TableRow key={index + '_' + item.id} style={rowStyle}
                        onClick={()=>this.updateHighlightedWordsFromTable(item.keywords)}>
                          <TableCell>{item.id}</TableCell>
                          <TableCell>{item
                            .keywords
                            .toString()}</TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </Paper>
          </div>
        </SplitPane>
      </div>
    );
  }
}

export default App;
