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
      .join('\n'), 'utf8', (e, done)=>{
        if (e){
          console.log(e);
        }
        console.log(done);
      });
