const https = require('https');
const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, 'assets', 'profile');
const items = [
  { name:'ulos-ragidup-hd.jpg', url:'https://upload.wikimedia.org/wikipedia/commons/6/66/Ulos_Ragidup_%28ceremonial_Shoulder_Cloth%29_%28Indonesia%29%2C_19th_century_%28CH_18437533%29.jpg' },
  { name:'tenun-ulos-hutaraja-hd.jpg', url:'https://upload.wikimedia.org/wikipedia/commons/0/07/Tenun_Ulos.jpg' }
];
const get = (url, redirects=0) => new Promise((resolve,reject)=>{
 if(redirects>6) return reject(new Error('Terlalu banyak redirect'));
 const req=https.get(url, {headers:{'User-Agent':'NusaLinguaMediaDownloader/1.0 (educational prototype; contact via Wikimedia Commons)','Accept':'image/jpeg,image/*'}},res=>{
  if([301,302,303,307,308].includes(res.statusCode)){res.resume();return resolve(get(new URL(res.headers.location,url).toString(), redirects+1));}
  if(res.statusCode!==200){res.resume();return reject(new Error('HTTP '+res.statusCode));}
  const chunks=[];let size=0;
  res.on('data',chunk=>{size+=chunk.length;if(size>30*1024*1024){req.destroy(new Error('File lebih besar dari 30 MB'));return;}chunks.push(chunk);});
  res.on('end',()=>resolve(Buffer.concat(chunks)));
 });
 req.on('error',reject);req.setTimeout(45000,()=>req.destroy(new Error('Timeout')));
});
(async()=>{
 fs.mkdirSync(target,{recursive:true});let errors=0;
 for(const item of items){
  console.log('Mengunduh '+item.name+' ...');
  try {
   const bytes=await get(item.url);
   if(bytes.length<50000||bytes[0]!==0xff||bytes[1]!==0xd8) throw new Error('Konten bukan JPEG valid');
   fs.writeFileSync(path.join(target,item.name),bytes);
   console.log('OK: '+item.name+' ('+(bytes.length/1048576).toFixed(2)+' MB)');
  } catch(err){ errors++;console.error('GAGAL:',item.name,err.message); }
 }
 if(errors){console.error('Ada '+errors+' unduhan gagal. Foto cadangan tetap ditampilkan.');process.exitCode=1;}
 else console.log('Selesai. Jalankan npm start dan refresh Ctrl+Shift+R.');
})();
