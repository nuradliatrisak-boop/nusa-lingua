const https = require('https');
const fs = require('fs');
const path = require('path');
const url = 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Lake_Toba_and_the_surrounding_hills.jpg';
const target = path.join(__dirname,'assets','editorial','immersive-banner-hd.jpg');
function download(address, hops=0){
 if(hops>5) throw new Error('Too many redirects');
 https.get(address,{headers:{'User-Agent':'NUSA-LINGUA-educational-prototype/1.0'}}, res=>{
  if(res.statusCode>=300&&res.statusCode<400&&res.headers.location){res.resume(); return download(new URL(res.headers.location,address).href,hops+1);}
  if(res.statusCode!==200){res.resume(); console.error('Download failed: HTTP',res.statusCode);process.exitCode=1;return;}
  const tmp=target+'.part';const file=fs.createWriteStream(tmp);res.pipe(file);
  file.on('finish',()=>file.close(()=>{
    const size=fs.statSync(tmp).size;
    if(size<100000){fs.unlinkSync(tmp);console.error('Unexpected small file');process.exitCode=1;return;}
    fs.renameSync(tmp,target);console.log('HD photo saved:',target,'('+Math.round(size/1024)+' KB)');
  }));
  file.on('error',e=>{console.error(e.message);process.exitCode=1;});
 }).on('error',e=>{console.error('Could not download:',e.message);process.exitCode=1;});
}
download(url);
