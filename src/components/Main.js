require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

// Get photo data
var imageDatas = require('../data/imageDatas.json');
// Transfer photo information from name to URL
imageDatas = (function genImageURL(imageDatasArr) {
  for (var i = 0, j = imageDatasArr.length; i < j; i++) {
    var singleImageData = imageDatasArr[i];
    singleImageData.imageURL = require('../images/' + singleImageData.fileName);
    imageDatasArr[i] = singleImageData
  }
  return imageDatasArr;
})(imageDatas);

function getRangeRandom(low, high) {
  return Math.ceil(Math.random()*(high - low) + low);
}

function get30DegRandom(){
  return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random()*30));
}

var ImgFigure = React.createClass({
  handleClick(e){
    e.stopPropagation();
    e.preventDefault();
    if(this.props.arrange.isCenter){
      this.props.inverse();
    } else {
      this.props.center();
    }
  },
  render(){
    var styleObj = {};
    if(this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }
    if (this.props.arrange.rotate) {
      (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function (value) {
        styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      }.bind(this));
    }
    if(this.props.arrange.isCenter) {
      styleObj.zIndex = 11;
    }
    var imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

    return(
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageURL} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    )
  }
});

var Controller = React.createClass({
  handleClick(e){
    e.preventDefault();
    e.stopPropagation();

    if(this.props.arrange.isCenter){
      this.props.inverse();
    } else {
      this.props.center();
    }
  },
  render(){
    var controllerClassName = 'controller-unit';
    if(this.props.arrange.isCenter){
      controllerClassName += ' is-center';
      if(this.props.arrange.isInverse) {
        controllerClassName += ' is-inverse';
      }
    }
    return(
      <span className={controllerClassName} onClick={this.handleClick}></span>
    );
  }
});

class AppComponent extends React.Component {

  rearrange(centerIndex) {
    var imgsArrangeArr = this.state.imgsArrangeArr,
        centerPos = this.state.Constant.centerPos,
        hPosRange = this.state.Constant.hPosRange,
        vPosRange = this.state.Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        imgsArrangeTopArr = [],
        topImgNum = Math.floor(Math.random() * 2),
        topImgSpliceIndex = 0,
        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
        imgsArrangeCenterArr[0] = {
          pos: centerPos,
          rotate: 0,
          isCenter: true
        };
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

    imgsArrangeTopArr.forEach((value, index) => {
        imgsArrangeTopArr[index] = {
          pos: {
              top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
              left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
          },
          rotate: get30DegRandom(),
          isCenter: false
        };
    });
      // 布局左右两侧的图片
    for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
        var hPosRangeLORX = null;

        // 前半部分布局左边， 右半部分布局右边
        if (i < k) {
            hPosRangeLORX = hPosRangeLeftSecX;
        } else {
            hPosRangeLORX = hPosRangeRightSecX;
        }

        imgsArrangeArr[i] = {
          pos: {
              top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
              left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
          },
          rotate: get30DegRandom(),
          isCenter: false
        };
    }
    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
        imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }
    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

    this.setState({
        imgsArrangeArr: imgsArrangeArr
    });
  }
  center(index) {
    return function() {
      this.rearrange(index);
    }.bind(this);
  }
  constructor() {
    super();
    this.state = {
      imgsArrangeArr: [
        /*{
            pos: {
                left: '0',
                top: '0'
            },
            rotate: 0,    // 旋转角度
            isInverse: false,    // 图片正反面
            isCenter: false,    // 图片是否居中
          }*/
      ],
      Constant: {
        centerPos: {
          left: 0,
          right: 0
        },
        hPosRange: {
          leftSecX: [0, 0],
          rightSecX: [0, 0],
          y: [0, 0]
        },
        vPosRange: {
          x: [0, 0],
          topY: [0, 0]
        }
      }
    }
  }
  inverse (index) {
    return function () {
      var imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState({
        imgsArrangeArr: imgsArrangeArr
      });
    }.bind(this)
  }
  componentDidMount() {
    var stageDom = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDom.scrollWidth,
        stageH = stageDom.scrollHeight,
        halfStageW = Math.ceil(stageW/2),
        halfStageH = Math.ceil(stageH/2);
    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW/2),
        halfImgH = Math.ceil(imgH/2);
    this.state.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };
    this.state.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.state.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW*3;
    this.state.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.state.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.state.Constant.hPosRange.y[0] = -halfImgH;
    this.state.Constant.hPosRange.y[1] = stageH - halfImgH;

    this.state.Constant.vPosRange.topY[0] = -halfImgH;
    this.state.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.state.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.state.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);

  }
  render() {
    var controllerUnits = [], imgFigures = [];
    imageDatas.forEach(function(value, index) {
      if(!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            right: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      }
      imgFigures.push(<ImgFigure data={value} key={index} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]}
                      inverse={this.inverse(index)} center={this.center(index)}/>);
      controllerUnits.push(<Controller key={index} arrange={this.state.imgsArrangeArr[index]}
                      inverse={this.inverse(index)} center={this.center(index)} />)
    }.bind(this));
    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
