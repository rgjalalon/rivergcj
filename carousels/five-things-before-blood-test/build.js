const fs=require('fs'),juice=require('juice').default;
const BASE='https://raw.githubusercontent.com/rgjalalon/rivergcj/claude/eager-wozniak-lex3fo/carousels/five-things-before-blood-test/';
let h=fs.readFileSync(__dirname+'/src.html','utf8');
let out=juice(h,{removeStyleTags:true});
fs.writeFileSync(__dirname+'/index.html',out.replace(/src="([\w-]+\.(?:png|jpg))"/g,(m,f)=>`src="${BASE}${f}"`));
const ff=`<style>@font-face{font-family:'DM Sans';src:url(../fonts/dm-sans-latin-300-normal.woff2);font-weight:300}@font-face{font-family:'DM Sans';src:url(../fonts/dm-sans-latin-400-normal.woff2);font-weight:400}@font-face{font-family:'DM Sans';src:url(../fonts/dm-sans-latin-500-normal.woff2);font-weight:500}body{background:#777}.page{margin-bottom:30px}</style>`;
fs.writeFileSync(__dirname+'/preview.html',out.replace('</head>',ff+'</head>'));
