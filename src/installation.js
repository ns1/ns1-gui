export default `## deps
\`\`\`js 
npm install --save-dev node-sass, style-loader, postcss-loader, sass-loader,
babel-loader, babel-preset-react, babel-preset-es2015, babel-preset-stage-0, 
babel-plugin-transform-decorators-legacy
\`\`\`

## add loaders to your webpack config
\`\`\`
  {
    test: /\.scss$/,
    loaders: ['style-loader', 'postcss-loader', 'sass-loader'],
    exclude: /node_modules/,
    include: [
      path.resolve(__dirname, 'node_modules/ns1-gui/scss'),
      path.resolve(__dirname, 'node_modules/ns1-gui/components')
    ]
  },
  {
    test: /\.css$/i,
    sideEffects: true,
    loaders: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          url: false
        }
      }
    ],
    exclude: /node_modules/,
    include: [
      path.resolve(__dirname, 'node_modules/ns1-gui/scss'),
      path.resolve(__dirname, 'node_modules/ns1-gui/components')
    ]
  },
  {test: /\.(woff|woff2|eot|ttf)$/, loader: 'file-loader'},
  {test: /\.(js|jsx)$/,
    include:[
      path.resolve(__dirname, 'node_modules/ns1-gui/scss'),
      path.resolve(__dirname, 'node_modules/ns1-gui/components')
    ],
    loader: 'babel-loader',
    query: {
      presets: ['react', 'es2015', 'stage-0'],
      plugins: ['transform-decorators-legacy']
    }
  },
\`\`\`
## add fonts
in your html, include
\`\`\`
<link href='//fonts.googleapis.com/css?family=Montserrat:200,300,400,500,600|Open+Sans:300,600&amp;subset=latin' rel='stylesheet' type='text/css'>
\`\`\`
# Usage
make a toplevel wrapper div with the class "theme-light",
then put all components in a div with the class 'bunder-container'
\`\`\`
import {Tabs, Tab} from 'ns1-gui';
<div className="theme-light">
  <div className="bunder-container">
    <Tabs ...props>
      <Tab ...props>Some Content</Tab>
    </Tabs>
    <Modal ...props>
      <Modal.Header ...props>
      </Modal.Header>
    </Modal>
  </div>
</div>
\`\`\`
`;
