'use strict';
/* globals process, module */
// woff fonts need windows metrics reworked
// in os/2 table
// don't ask me why, i don't understand the format either
const fs = require('fs');
const Font = require('fonteditor-core').Font;

let EditFontPlugin = function(){};
EditFontPlugin.prototype.apply = (compiler) => {
  compiler.plugin('emit', (compiler, callback) => {
    var buffer = fs
      .readFileSync('./built/static/iconfont.woff');

    var font = Font.create(buffer, {
      type: 'woff',
      hinting: true,
      compound2simple: true
    });

    var fontObject = font.get();
    fontObject['OS/2']['usWinDescent'] = 1;
    fontObject['OS/2']['usWinAscent'] = 400;
    // fontObject['hhea']['ascent'] = 1300;
    // fontObject['hhea']['descent'] = -123;

    const newBuff = font.write({
      type: 'woff',
      hinting: true,
      compound2simple: true
    });

    setTimeout(() => {
      fs.writeFileSync(
        './built/static/iconfont.woff', newBuff);
    }, 1000);
    callback();
  });
};
module.exports = EditFontPlugin;
