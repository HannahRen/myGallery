require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
// Get photo data
//var imageDatas = require('../data/imageDatas.json');
// Transfer photo information from name to URL
// imageDatas = (function genImageURL(imageDatasArr) {
//   for (var i = 0, j = imageDatasArr.length; i < j; i++) {
//     var singleImageData = imageDatasArr[i];
//     singleImageData.imageURL = require('../images/' + singleImageData.fileName);
//     imageDatasArr[i] = singleImageData
//   }
//   return imageDatasArr;
// })(imageDatas);

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec"></section>
        <nav className="controller-nav"></nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
