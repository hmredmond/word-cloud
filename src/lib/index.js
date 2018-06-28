/*
  Here is a list a of a few things I would like to sort out / experiment with.
  1) How do I pass left click, right click and hover functions through.
   - Currently left click removes a word. This is just for demo purposes.
   - Not sure how best to handle removing words. It is a props thing or a state thing?
   - Right click should display a dropdown menu.
  2) Pass through a list of words to highlight somehow.
  3) Use a rectangular spiral so we do not waste space in the corners.
  4) Data consists of a list of pairs (text, score). Would like multiple versions of
   text so we can display translations.
*/

import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import WordCloudElement from './components/wordCloudElement/wordCloudElement';
import { computeLayout } from './services/layout.service';
import {isEqual} from 'lodash';

class WordCloud extends Component {

    static propTypes = {
        data: PropTypes
            .arrayOf(PropTypes.shape({
            word: PropTypes.string.isRequired,
            score: PropTypes
                .oneOfType([
                PropTypes.number, PropTypes.objectOf(PropTypes.number)
            ])
                .isRequired,
            translation: PropTypes.objectOf(PropTypes.string)
        }))
            .isRequired,
        scoreKey: PropTypes.string, //Can be set to one of the keys in score
        textKey: PropTypes.string, //Can be set to one of the keys in translations
        width: PropTypes.number,
        height: PropTypes.number,
        padding: PropTypes.number,
        font: PropTypes.string,
        minFontSize: PropTypes.number,
        highlightWords: PropTypes.arrayOf(PropTypes.string),
        highlightWordsIndexes: PropTypes.arrayOf(PropTypes.number),
        handleLeftClick: PropTypes.func,
        handleRightClick: PropTypes.func
    }

    static defaultProps = {
        scoreKey: null,
        textKey: null,
        width: 700,
        height: 600,
        padding: 1,
        font: 'roboto',
        minFontSize: 8,
        highlightWords: null,
        highlightWordsIndexes: null
    }

    constructor(props) {
        super(props);
        this.state = {
            layout: {},
            isMeasured: {},
            scores: [],
            accessibleContentDescription: ''
        };

        this.updateFocusDescription = this.updateFocusDescription.bind(this);
    }

    shouldHighlightWord = (index) => {
        const word = this.props.data[index].word
        if (this.props.highlightWords === null && this.props.highlightWordsIndexes === null) {
            return true
        }
        if (this.props.highlightWords !== null) {
            return (this.props.highlightWords.indexOf(word) >= 0)
        } else {
            return (this.props.highlightWordsIndexes.indexOf(index) >= 0)
        }
    }

    /*Function to measure the bounding boxes of all the child svg's*/
    measure = () => {
        const childElements = Array.from(this.svg.children);
        const dimensions = childElements
            .map(element => element.getBoundingClientRect())
            .map(({width, height}) => ({width, height}));
        return dimensions;
    }

    storeSvgReference = svg => {
        if (svg !== null) {
            this.svg = svg;
        }
    };

    getTextAndScoreKey = (props) => {
        let textKey
        let scoreKey
        if (props.textKey == null) {
            textKey = '__text__'
        } else {
            textKey = props.textKey
        }
        if (props.scoreKey == null) {
            scoreKey = '__default__'
        } else {
            scoreKey = props.scoreKey
        }
        return {textKey, scoreKey}
    }

    getWordsAndScores = (props) => {
        /*Which list of words with scores should we render*/
        let {textKey, scoreKey} = this.getTextAndScoreKey(props)
        let text
        let scores
        if (props.textKey == null) {
            textKey = '__text__'
            text = props
                .data
                .map(x => x['word'])
        } else {
            textKey = props.textKey
            text = props
                .data
                .map(x => x.translation[textKey])
        }
        if (props.scoreKey == null) {
            scoreKey = '__default__'
            scores = props.scores
        } else {
            scores = props
                .data
                .map(x => x.score[props.scoreKey])
        }
        return {textKey, scoreKey, text, scores}
    }

    computeLayoutFromDimensions = (props, dimensions) => {
        let {textKey, scoreKey, text, scores} = this.getWordsAndScores(props)
        var layout = {
            ...this.state.layout
        }
        if (!layout.hasOwnProperty(textKey)) {
            layout[textKey] = {}
        }
        layout[textKey][scoreKey] = text.map((w, i) => ({text: w, index : i, value: scores[i], 
            width: dimensions[i]['width'], height: dimensions[i]['height'], visible: props.data[i].visible 
        }));
        layout[textKey][scoreKey] = layout[textKey][scoreKey].filter(x => props.data[x.index].visible)
        layout[textKey][scoreKey] = computeLayout(layout[textKey][scoreKey], props.width, props.height, props.padding);
        var isMeasured = {
            ...this.state.isMeasured
        }
        if (!isMeasured.hasOwnProperty(textKey)) {
            isMeasured[textKey] = {}
        }
        isMeasured[textKey][scoreKey] = true
        this.setState({layout, isMeasured});
    }

    recomputeLayout = (props) => {
        let {textKey, scoreKey} = this.getTextAndScoreKey(props)
        var layout = {
            ...this.state.layout
        };
        layout[textKey][scoreKey] = layout[textKey][scoreKey].filter(x => props.data[x.index].visible)
        layout[textKey][scoreKey] = computeLayout(layout[textKey][scoreKey], props.width, props.height, props.padding);
        this.setState({layout});
    }

    componentDidMount() {
        /*We must measure the rendered components*/
        const dimensions = this.measure();
        this.computeLayoutFromDimensions(this.props, dimensions);
    }

    componentDidUpdate() {
        let {textKey, scoreKey} = this.getTextAndScoreKey(this.props)
        let isMeasured = this.state.isMeasured;
        if (!isMeasured.hasOwnProperty(textKey) || !isMeasured[textKey].hasOwnProperty(scoreKey) || isMeasured[textKey][scoreKey] === false) {
            const dimensions = this.measure()
            this.computeLayoutFromDimensions(this.props, dimensions)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!isEqual(this.props.data, nextProps.data)) {
            this.setState(prevState => ({layout: {}, isMeasured: {}}));
            return
        }
        if (nextProps.width !== this.props.width || nextProps.height !== this.props.height || nextProps.padding !== this.props.padding) {
            let {textKey, scoreKey} = this.getTextAndScoreKey(nextProps)
            let isMeasured = this.state.isMeasured;
            if (isMeasured.hasOwnProperty(textKey) && isMeasured[textKey].hasOwnProperty(scoreKey) && isMeasured[textKey][scoreKey] === true) {
                this.recomputeLayout(nextProps);
            }
        }
        else {
            /*Has any of the visibility changed*/
            let {textKey, scoreKey} = this.getTextAndScoreKey(nextProps)
            let isMeasured = this.state.isMeasured;
            if (isMeasured.hasOwnProperty(textKey) && isMeasured[textKey].hasOwnProperty(scoreKey) && isMeasured[textKey][scoreKey] === true) {
                let layout = this.state.layout[textKey][scoreKey]
                let flag = false
                for (let i = 0; i < layout.length; ++i) {
                    if (layout[i].visible != nextProps.data[layout[i].index].visible) {
                        flag = true
                        break
                    }
                }
                if (flag) {
                    this.recomputeLayout(nextProps);
                }
            }
        }
    }

    updateFocusDescription(index, text) {
        let current = this.state.layout.__text__.freq.find(item => item.text == text);

        let output = current.text + " with score " +  current.value;
        if (this.state !== undefined) {
            this.setState(prevState => ({accessibleContentDescription : output}))
        }

    }

    render() {
        let {textKey, scoreKey, text, scores} = this.getWordsAndScores(this.props)
        let isMeasured = this.state.isMeasured;
        
        if (!isMeasured.hasOwnProperty(textKey) || !isMeasured[textKey].hasOwnProperty(scoreKey) || isMeasured[textKey][scoreKey] === false) {
            /*Render all the text invisibly to the screen and mesure the size of the svg elements*/
            const elementsToMeasure = text.map((w, i) => <WordCloudElement
                key={i}
                fontSize={scores[i]}
                x={0}
                y={0}
                font={this.props.font}
                text={w}
                opacity={1.0}
                />);
            return (
                <svg width={0} height={0} tabIndex="1" ref={this.storeSvgReference}  role="presentation" aria-hidden="true">
                    {elementsToMeasure}
                </svg>
            );
        }
        /*Otherewise we have the layout and should render properly*/
        const width = this.props.width;
        const height = this.props.height;
        const layout = this.state.layout[textKey][scoreKey];

        const wordCloudElements = layout
            .filter(d => d.fontSize > this.props.minFontSize)
            .map((d, i) => {
                let opacity
                if (this.props.highlightWords.length === 0 || this.props.highlightWords[0].length === 0|| this.shouldHighlightWord(d.index)) {
                    opacity = 1.0
                }
                else {
                    opacity = 0.25
                }
                return <WordCloudElement
                    originalIndex={d.index}
                    index={i + 2}
                    key={i}
                    text={d.text}
                    x={d.x}
                    y={d.y}
                    fontSize={d.fontSize}
                    opacity={opacity}
                    handleLeftClick={this.props.handleLeftClick} 
                    handleRightClick={this.props.handleRightClick}
                    updateCurrentFocusDescription={this.updateFocusDescription}/>
            });
        return (
            <div>
            <svg width={width} height={height} aria-hidden="true" role="presentation">
                <title>Word cloud visualisation</title>
                <desc>Word cloud showing the importance of words in text. There are {layout.length}
                    words present. </desc>
                {wordCloudElements}
            </svg>
            <div className='sr-only_' hidden={this.state.accessibleContentDescription.length === 0} aria-live="polite">Focused word: {this.state.accessibleContentDescription}</div>
       </div> );
    }
    

}

export default WordCloud;
