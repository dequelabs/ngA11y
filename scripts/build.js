const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

const root = path.join(__dirname, '..');
const banner = [
  '/*!',
  '* Angular Directives For Accessible Applications',
  '*',
  '* Copyright (C) 2015-2017 Deque Systems Inc., All Rights Reserved',
  '*',
  '* See the project LICENSE file for usage - https://github.com/dequelabs/ngA11y/blob/master/LICENSE',
  '*/\n'
].join('\n');

const files = {
  'nga11ymodal.min.js': ['nga11ymodal.js'],
  'nga11yforms.min.js': ['nga11yforms.js'],
  'editableGrid.min.js': ['editableGrid.js'],
  'nga11yfocus.min.js': ['nga11yfocus.js'],
  'nga11yannounce.min.js': ['nga11yannounce.js'],
  'nga11y.min.js': ['nga11ymodal.js', 'editableGrid.js', 'nga11yforms.js', 'nga11yfocus.js', 'nga11yannounce.js']
};

(async () => {
  fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
  for (const [out, srcs] of Object.entries(files)) {
    const code = {};
    srcs.forEach(s => (code[s] = fs.readFileSync(path.join(root, 'src', s), 'utf8')));
    const result = await minify(code, { format: { comments: false, preamble: banner } });
    fs.writeFileSync(path.join(root, 'dist', out), result.code + '\n');
  }
})().catch(e => { console.error(e); process.exit(1); });
