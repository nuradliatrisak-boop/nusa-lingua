// Download CC0 panoramic photo locally for instant subsequent loads.
const https=require('https'),fs=require('fs'),path=require('path');
const source='https://upload.wikimedia.org/wikipedia/commons/d/d4/Lake_Toba%2C_Indonesia_%28Unsplash%29.jpg';
const target=path.join(__dirname,'assets','editorial','story-lake-toba-hd.jpg');
function download(url, hops=0){if(hops>5)throw Error('Too many redirects');https.get(url,{headers:{'User-Agent':'NusaLinguaMedia/1.0 (local project demo)'}},r=>{
 if([301,302,303,307,308].includes(r.statusCode)){r.resume();return download(new URL(r.headers.location,url).href,hops+1)}
 if(r.statusCode!==200){r.resume();console.error('Download failed, HTTP',r.statusCode);process.exitCode=1;return}
 const tmp=target+'.part';const file=fs.createWriteStream(tmp);r.pipe(file);
 file.on('finish',()=>{file.close(()=>{const bytes=fs.statSync(tmp).size;if(bytes<100000){fs.unlinkSync(tmp);console.error('Download too small');process.exitCode=1;return}fs.renameSync(tmp,target);console.log('Saved HD photo:',target,'bytes:',bytes)})});
 file.on('error',e=>{console.error(e.message);process.exitCode=1})
 }).on('error',e=>{console.error('Network error:',e.message);process.exitCode=1})}
download(source);
