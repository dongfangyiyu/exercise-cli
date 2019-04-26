#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

var program = require('commander');
program
	.version('1.0.0','-v, --version')
    .command('check [checkname]')
    .alias('c')
    .description('yo yo check now')
    .option('-a, --name [moduleName]', '模块名称')
    .action((checkname,option) => {
        console.log('指令 install 后面跟的参数值 checkname: ' + checkname);
		console.log(option);
		// 获得了参数，可以在这里做响应的业务处理
    })
	//自定义帮助信息
    .on('--help', function() {
        console.log('  下面我随便说两句:')
        console.log('')
        console.log('$ 人有多大胆，母猪多大产，i love xx')
        console.log('$ 广阔天地，大有作为，呱~')
    })
    
program.parse(process.argv)

// 复制文件
function copyTemplate (from, to) {
  from = path.join(__dirname, 'templates', from);
  console.log(from);
  write(to, fs.readFileSync(from, 'utf-8'))
}
function write (path, str, mode) {
  fs.writeFileSync(path, str)
}
// 新建目录
function mkdir (path, fn) {
  fs.mkdir(path, function (err) {
    fn && fn()
  })
}
// 复制目录
var copy=function(src,dst){
    let paths = fs.readdirSync(src); //同步读取当前目录(只能读取绝对路径，相对路径无法获取)
    paths.forEach(function(path){
        var _src=src+'/'+path;
        var _dst=dst+'/'+path;
        fs.stat(_src,function(err,stats){  //stats  该对象 包含文件属性
            if(err)throw err;
            if(stats.isFile()){ //如果是个文件则拷贝 
                let  readable=fs.createReadStream(_src);//创建读取流
                let  writable=fs.createWriteStream(_dst);//创建写入流
                readable.pipe(writable);
            }else if(stats.isDirectory()){ //是目录则 递归 
                checkDirectory(_src,_dst,copy);
            }
        });
    });
}
var checkDirectory=function(src,dst,callback){
    fs.access(dst, fs.constants.F_OK, (err) => {
        if(err){
            fs.mkdirSync(dst);
            callback(src,dst);
        }else{
            callback(src,dst);
        }
      });
};

var config = {};
process.argv.slice(2).forEach(item=>{
	if(item=="-l"){
		config.layer = true;
	}
})


var PATH = ".";
mkdir(PATH+'/public',function(){
	mkdir(PATH + '/public/js',function () {
		// copyTemplate("/js/vue.min.js", PATH + '/public/js/vue.min.js');
		checkDirectory('C:/Users/Administrator/Desktop/vue-3.0/nodeTest/exercise/templates/js',PATH+'/public/js',copy);
		if(config.layer){
			checkDirectory('C:/Users/Administrator/Desktop/exercise-cli/templates/layer',PATH+'/public/js',copy);
		}
	})
})
console.log('拷贝成功');
// console.log(process.argv);