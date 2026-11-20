const fs=require('fs'),cp=require('child_process');
for(const name of ['village','house','ulos']){
 const filename=`assets/documentary/${name}.mp4`;
 if(!fs.existsSync(filename)) throw new Error(filename+' tidak ada');
 const r=cp.spawnSync('ffprobe',['-v','error','-select_streams','v:0','-show_entries','stream=width,height','-of','csv=p=0',filename],{encoding:'utf8'});
 console.log(name+': '+(r.stdout.trim()||'File tersedia (ffprobe opsional)'));
}
