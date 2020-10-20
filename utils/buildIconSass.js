const fs = require('fs');

const files = fs.readdirSync('./assets/svg')
  .sort()
  .map(f=>
    f.split('.svg')[0]);

fs
  .writeFileSync(`./scss/icons.scss`,
    files
      .filter(f=>f)
      .filter(f=>f[0]!=='.')
      .map((f,i) =>
        `$${f}: '${
          String
            .fromCharCode(0xEA01 + (i))
          }' !global`)
      .join('\n') + `
            @font-face {
            font-family: "icons";
            src: url("/eot");
            src: url("/iconfont.eot?#iefix") format("embedded-opentype"),
                 url("/iconfont.woff") format("woff"),
                 url("/iconfont.ttf") format("truetype"),
                 url("/iconfont.svg#iconfont") format("svg");
            font-weight: normal;
            font-style: normal;
          }
          .icon::before{
            vertical-align: middle;
            font-family: "icons"!important;
            display: inline-block;
            font-style: normal;
            font-weight: normal;
            font-variant: normal;
            padding: 0 4px;
            line-height: 1;
            font-size: 18px;
            text-decoration: inherit;
            text-rendering: optimizeLegibility;
            text-transform: none;
            -moz-osx-font-smoothing: grayscale;
            -webkit-font-smoothing: antialiased;
            font-smoothing: antialiased;
          }
        `, 'utf8', (e, done)=>{
        if (e){
          console.log(e);
        }
        console.log(done);
      });
