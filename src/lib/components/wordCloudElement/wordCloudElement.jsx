import React, { Component } from "react";
import { PropTypes } from "prop-types";

import "./wordCloudElement.css";

export default class WordCloudElement extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired, // Text to render
    fontSize: PropTypes.number.isRequired, // Size of fint
    font: PropTypes.string, // Name of font
    x: PropTypes.number.isRequired, // x position
    y: PropTypes.number.isRequired, // y position
    col: PropTypes.string, // colour,
    opacity: PropTypes.number, //opacity
    growOnHover: PropTypes.bool,
    handleLeftClick: PropTypes.func,
    handleRightClick: PropTypes.func
  };

  static defaultProps = {
    col: "rgb(0,0,255)",
    opacity: 1.0,
    font: "roboto",
    growOnHover: true
  };

  constructor(props) {
    super(props);
    this.state = {
      hover: false
    };
  }

  render() {
    const text = this.props.text;
    const x = this.props.x;
    const y = this.props.y;
    const index = this.props.index;
    var fontSize = this.props.fontSize;
    var font = this.props.font;
    const col = this.props.col;
    const opacity = this.props.opacity;
    if (this.props.growOnHover && this.state.hover) {
      fontSize *= 1.15;
    }
    fontSize = fontSize.toString() + "px";
    const style = {
      fontSize: fontSize,
      fontFamily: font,
      fill: col,
      cursor: "pointer",
      opacity: opacity
    };
    return (
      <text
        id={"word-cloud-element-" + this.props.originalIndex}
        tabIndex={index}
        style={style}
        focusable="true"
        textAnchor="middle"
        alignmentBaseline="central"
        x={x}
        y={y}
        onFocus={() => this.props.updateCurrentFocusDescription(index, text)}
        onMouseOver={() => this.setState({ hover: true })}
        onMouseOut={() => this.setState({ hover: false })}
        onClick={this.props.handleLeftClick}
        onContextMenu={this.props.handleRightClick}>
        {text}
      </text>
    );
  }
}
