
/**
 * @name	CeL file function for Windows
 * @fileoverview
 * 本檔案包含了 Windows 的 file functions。
 * @since	2009/12/1
 */

/*
 * TODO
 * http://www.comsharp.com/GetKnowledge/zh-CN/It_News_K869.aspx
 */

if (typeof CeL === 'function')
CeL.setup_module('application.OS.Windows.file',
function(library_namespace, load_arguments) {
'use strict';

//	nothing required


/**
 * null module constructor
 * @class	Windows 下，檔案操作相關之 function。
 */
var _// JSDT:_module_
= function() {
	//	null module constructor
};

/**
 * for JSDT: 有 prototype 才會將之當作 Class
 */
_// JSDT:_module_
.prototype = {
};



/*
	JScript only	-------------------------------------------------------
*/

_// JSDT:_module_
.
/**
 * FileSystemObject Object I/O mode enumeration
 * @see	<a href="http://msdn.microsoft.com/en-us/library/314cz14s%28VS.85%29.aspx" accessdate="2009/11/28 17:42" title="OpenTextFile Method">OpenTextFile Method</a>
 * @_memberOf	_module_
 */
iomode = {
	// * @_description <a href="#.iomode">iomode</a>: Open a file for reading only. You can't write to this file.
	/**
	 * Open a file for reading only. You can't write to this file.
	 * @_memberOf	_module_
	 */
	ForReading : 1,
	/**
	 * Open a file for writing.
	 * @_memberOf	_module_
	 */
	ForWriting : 2,
	/**
	 * Open a file and write to the end of the file.
	 * @_memberOf	_module_
	 */
	ForAppending : 8
};

_// JSDT:_module_
.
/**
 * FileSystemObject Object file open format enumeration
 * @see	<a href="http://msdn.microsoft.com/en-us/library/314cz14s%28VS.85%29.aspx" accessdate="2009/11/28 17:42" title="OpenTextFile Method">OpenTextFile Method</a>
 * @_memberOf	_module_
 */
open_format = {
	/**
	 * Opens the file using the system default.
	 * @_memberOf	_module_
	 */
	TristateUseDefault : -2,
	/**
	 * Opens the file as Unicode.
	 * @_memberOf	_module_
	 */
	TristateTrue : -1,
	/**
	 * Opens the file as ASCII.
	 * @_memberOf	_module_
	 */
	TristateFalse : 0
};


var path_separator = library_namespace.env.path_separator, path_separator_RegExp = library_namespace.env.path_separator_RegExp, new_line = library_namespace.env.new_line, WshShell,
/**
 * FileSystemObject
 * @inner
 * @ignore
 * @see
 * <a href="http://msdn.microsoft.com/en-us/library/z9ty6h50%28VS.85%29.aspx" accessdate="2010/1/9 8:10">FileSystemObject Object</a>
 */
fso = typeof WScript=='object'?WScript.CreateObject("Scripting.FileSystemObject"):new ActiveXObject("Scripting.FileSystemObject"),
// XMLHttp,
WinShell // initialization_WScript_Objects
, args, ScriptHost;


/*	↑JScript only	-------------------------------------------------------
*/




/*

return {Object} report
	.list	files matched
	.succeed	success items
	.failed	failed items
	.log	log text
	.undo	undo data

usage example:
	move_file()	get file list array of current dir.
	move_file(0,0,'dir')	get file list array of dir.
	move_file('*.*','*.jpg','dir')	Error! Please use RegExp('.*\..*') or turnWildcardToRegExp('*.*')
	move_file(/file(\d+).jpg/,0,'dir')	get file list array of dir/file(\d+).jpg
	move_file(f1,move_file.f.remove)	delete f1
	move_file('f1','f2')	[f1]->[f2]
	move_file('f1','f2','.',move_file.f.copy|move_file.f.reverse)	copy [./f2] to [./f1]
	move_file(/file(\d+).jpg/,/file ($1).jpg/,'dir')	[dir/file(\d+).jpg]->[dir/file ($1).jpg]	can't use fuzzy or reverse in this time

prog example:
	function move_file_filter(fn){var n=fn.match(/0000(\d+)\(\d\)\.pdf/);if(!n)return true;n=n[1];if(n!=0&&n!=1&&n!=7&&n!=10&&n!=13&&n!=15&&n!=26&&n!=28)return true;try{n=fn.match(/(\d+)\(\d\)\.pdf/);FileSystemObject.MoveFile(n[1]+'('+(n[1]?vol-1:vol-2)+').pdf',n[1]+'.pdf');}catch(e){}return;}
	var vol=11,doMove=move_file(new RegExp('(\\d+)\\('+vol+'\\)\\.pdf'),'$1.pdf');
	write_file('move.log','-'.x(60)+new_line+doMove.log,open_format.TristateTrue,ForAppending);
	write_file('move.undo.'+vol+'.txt',doMove.undo,open_format.TristateTrue),write_file('move.undo.'+vol+'.bat',doMove.undo);//bat不能用open_format.TristateTrue
	alert('Done '+doMove.succeed+'/'+doMove.list.length);

	for Win98, turn lower case:
	move_file(/^[A-Z\d.]+$/,function($0){return '_mv_tmp_'+$0.toLowerCase();},'.',move_file.f.include_folder|move_file.f.include_subfolder);
	alert(move_file(/^_mv_tmp_/,'','.',move_file.f.include_folder|move_file.f.include_subfolder).log);


for(var i=0,j,n,m;i<40;i++)
 if(!fso.FileExists(n='0000'+(i>9?'':'0')+i+'.pdf'))for(j=0;j<25;j++)
  if(fso.FileExists(m='0000'+(i>9?'':'0')+i+'('+j+').pdf')){try{fso.MoveFile(m,n);}catch(e){}break;}

TODO:
move newer	把新檔移到目的地，舊檔移到 bak。

*/
_// JSDT:_module_
.
/**
 * move/rename files, ** use RegExp, but no global flag **<br/>
 * 可用 move_file_filter() 來排除不要的<br/>
 * 本函數可能暫時改變目前工作目錄！
 * @param {String} from	from file
 * @param {String} to	to file
 * @param {String} base_path	base path
 * @param flag
 * @param {Function} filter	可用 filter() 來排除不要的
 * @return	{Object} report
 * @since	2004/4/12 17:25
 * @requires	path_separator,fso,WshShell,new_line,Enumerator
 * @_memberOf	_module_
 */
move_file = function move_file(from, to, base_path, flag, filter) {
	var _s = move_file.f ? move_file : _.move_file, _f = _s.f,
	// '.?': 一定會match
	default_from = new RegExp('.?'), t, CurrentDirectory, report = {};
	//library_namespace.debug(typeof from + ',' + from.constructor);
	if (flag & _f.reverse)
		//flag-=_f.reverse,
		t = from, from = to, to = t;
	if (!from)
		from = default_from;
	else if (typeof from !== 'string'
		&& (typeof from !== 'object' || !(from instanceof RegExp)
				&& !(from = '' + from)))
		from = default_from;
	report.list = [], report.succeed = report.failed = 0,
	report.undo = report.log = '';

	if (!base_path)
		base_path = '.' + path_separator;
	else if (typeof get_folder === 'function')
		base_path = get_folder(base_path);

	if ((base_path = '' + base_path).slice(
			// -1, or try: base_path.length-path_separator.length
			-1) != path_separator)
		base_path += path_separator;

	if (typeof fso === 'undefined')
		fso = new ActiveXObject("Scripting.FileSystemObject");
	else if (typeof fso !== 'object')
		throw new Error(1, 'FSO was already seted!');
	try {
		dir = fso.GetFolder(base_path);
	} catch (e) {
		throw new Error(e.number,
				'move_file(): 基準路徑不存在\n' + e.description);
	}

	// TODO: 對from不存在與為folder之處裡: fuzzy

	if (flag & _f.include_subfolder) {
		CurrentDirectory = WshShell.CurrentDirectory;
		for ( var i = new Enumerator(dir.SubFolders); !i.atEnd(); i
		.moveNext())
			_s(from, to, i.item(), flag);
		if (base_path)
			// 改變目前工作目錄
			WshShell.CurrentDirectory = base_path;
	}
	// if(flag&_f.include_folder){}
	var i, f = new Enumerator(dir.Files), use_exact = typeof from === 'string', overwrite = flag
	& _f.overwrite, not_test = !(flag & _f.Test), func = flag
	& _f.copy ? 'copy' : to === _f.remove || flag & _f.remove
			&& !to ? 'delete' : from !== default_from || to ? 'move'
					: 'list';
	// if(func=='delete')to=_f.remove; // 反正不是用這個判別的
	//library_namespace.debug('use_exact: ' + use_exact + '\nbase_path: ' + base_path + '\nfrom: ' + from);
	// BUG: 這樣順序會亂掉，使得 traverse (遍歷)不完全
	for (; !f.atEnd(); f.moveNext())
		if (i = f.item(), use_exact && i.Name === from || !use_exact
				&& from.test(i.Name)) {
			report.list.push(i.Name);

			if (typeof filter == 'function' && !filter(i.Name))
				continue;
			t = func === 'copy' || func === 'move' ? i.Name.replace(from,
					typeof to === 'object' ? to.source : to) : '';

			if (t)
				try {
					report.log += func + ' [' + i.Name + ']'
					+ (t ? ' to [' + t + '] ' : '');
					var u = '';
					t = (base_path === default_from ? base_path : '')
					+ t;
					if (func === 'delete') {
						if (not_test)
							i.Delete(overwrite);
					} else if (!fso.FileExists(t) || overwrite) {
						if (not_test) {
							if (overwrite && fso.FileExists(t))
								fso.DeleteFile(t, true);
							if (func === 'copy')
								//	Copy() 用的是 FileSystemObject.CopyFile or FileSystemObject.CopyFolder, 亦可用萬用字元(wildcard characters)
								i.Copy(t, overwrite);
							else
								i.Move(t);
						}
						u = 'move	' + t + '	' + i.Name + new_line;
					} else {
						report.log += ': target existing, ';
						throw 1;
					}
					report.log += 'succeed.' + new_line,
					report.undo += u, report.succeed++;
				} catch (e) {
					report.log += 'failed.' + new_line, report.failed++;
				}
				//library_namespace.debug(i.Name + ',' + t);
		}

	if (flag & _f.include_subfolder && CurrentDirectory)
		WshShell.CurrentDirectory = CurrentDirectory;
	report.log += new_line + (not_test ? '' : '(test)') + func + ' ['
				+ from + '] to [' + to + ']' + new_line
				+ (typeof gDate === 'function' ? gDate() + '	' : '')
				+ 'done ' + report.succeed + '/' + report.list.length
				+ new_line;
	return report;
};

//var move_file.f;
//setObjValue('move_file.f','none=0,overwrite=1,fuzzy=2,reverse=4,include_folder=8,include_subfolder=16,Test=32,copy=64,remove=128','int');
_// JSDT:_module_
.
/**
 * <a href="#.move_file">move_file</a> 的 flag enumeration
 * @constant
 * @_memberOf	_module_
 */
move_file.f = {
		/**
		 * null flag
		 * @_memberOf _module_
		 */
		none : 0,
		/**
		 * overwrite target
		 * @_memberOf _module_
		 */
		overwrite : 1,
		/**
		 * If source don't exist but target exist, than reverse.
		 * @deprecated	TODO
		 * @_memberOf _module_
		 */
		fuzzy : 2,
		/**
		 * reverse source and target
		 * @_memberOf _module_
		 */
		reverse : 4,
		/**
		 * include folder
		 * @_memberOf _module_
		 */
		include_folder : 8,
		/**
		 * include sub-folder
		 * @_memberOf _module_
		 */
		include_subfolder : 16,
		/**
		 * Just do a test
		 * @_memberOf _module_
		 */
		Test : 32,
		/**
		 * copy, instead of move the file
		 * @_memberOf _module_
		 */
		copy : 64,
		/**
		 * 當 target 指定此 flag，或包含此 flag 而未指定 target 時，remove the source。
		 * @_memberOf _module_
		 */
		remove : 128
};

_// JSDT:_module_
.
/**
 * move file
 * @requires	fso,get_folder,get_file_name,initialization_WScript_Objects
 * @_memberOf	_module_
 */
move_1_file = function(from, to, dir, only_filename, reverse) {
	if (!from || !to || from === to)
		return new Error(1, 'filename error.');

	var e;
	dir = get_folder(dir);

	if (reverse)
		e = from, from = to, to = e;
	e = function(_i) {
		return fso.FileExists(_i) ? _i : dir ? dir
				+ (only_filename ? get_file_name(_i) : _i) : null;
	};

	try {
		//library_namespace.debug('move_1_file:\n' + dir + '\n\n' + e(from) + '\n→\n' + e(to));
		fso.MoveFile(e(from), e(to));
		return;
	} catch (e) {
		e.message = 'move_1_file:\n' + from + '\n→\n' 
				+ to// +'\n\n'+e.message
				;
		return e;
	}
};


/*
function mv(from,to,dir,only_filename,reverse){
 var e,_f,_t;
 dir=get_folder(dir);

 if(reverse)e=from,from=to,to=e;
 _f=from;
 _t=to;
 to=0;
 e=function(_i){
  return fso.FileExists(_i)?_i:dir&&fso.FileExists(_i=dir+(only_filename?get_file_name(_i):_i))?_i:0;
 };

 try{
  if(!(_f=e(_f)))to=1;else if(!(_t=e(_t)))to=2;
  else{
   alert('mv():\n'+dir+'\n\n'+_f+'\n→\n'+_t);
   fso.MoveFile(_f,_t);
   return;
  }
 }catch(e){return e;}
 return e||new Error(to,(to==1?'移動するファイルは存在しない':'移動先が既存した')+':\n'+_f+'\n→\n'+_t);
}


function mv(from,to,dir,only_filename,reverse){
 var e,_f,_t;
 dir=get_folder(dir);

 if(reverse)e=from,from=to,to=e;
 _f=from,_t=to,to=e=0;

 try{
  if(!fso.FileExists(_f)&&(!dir||!fso.FileExists(_f=dir+(only_filename?get_file_name(_f):_f))))to=1;
  else if(fso.FileExists(_t)&&(!dir||fso.FileExists(_t=dir+(only_filename?get_file_name(_t):_t))))to=2;
  else{
   alert('mv():\n'+dir+'\n'+_f+'\n→\n'+_t);
   //fso.MoveFile(_f,_t);
   return;
  }
 }catch(e){}
 return e||new Error(to,(to==1?'移動するファイルは存在しない':'移動先が既存した')+':\n'+_f+'\n→\n'+_t);
}

*/


/*

下面一行調到檔案頭
var get_file_details_items,get_file_details_get_object=-62.262;
*/
_// JSDT:_module_
.
/**
 * get file details (readonly)
 * @example
 * get_file_details('path');
 * get_file_details('file/folder name',parentDir);
 * get_file_details('path',get_file_details_get_object);
 * @see	<a href="http://msdn.microsoft.com/en-us/library/bb787870%28VS.85%29.aspx" accessdate="2009/11/29 22:52" title="GetDetailsOf Method (Folder)">GetDetailsOf Method (Folder)</a>
 * @_memberOf	_module_
 */
get_file_details = function(fileObj, parentDirObj) {
	var i, n, r;
	// WinShell=new ActiveXObject("Shell.Application");
	if (typeof WinShell == 'undefined' || !fileObj)
		return;

	// deal with fileObj & parentDirObj
	if (parentDirObj === get_file_details_get_object)
		parentDirObj = 0, n = 1;
	// else n='';
	if (!parentDirObj) {
		// fileObj is path
		if (typeof fileObj != 'string')
			return;
		if (i = fileObj.lastIndexOf('/') + 1)
			parentDirObj = fileObj.slice(0, i - 1), fileObj = fileObj
			.slice(i);
		else
			return;
	}
	if (typeof parentDirObj == 'string')
		parentDirObj = WinShell.NameSpace(parentDirObj);
	if (typeof fileObj == 'string' && fileObj)
		fileObj = parentDirObj.ParseName(fileObj);
	if (n)
		// just get [(object)parentDirObj,(object)fileObj]
		return [ parentDirObj, fileObj ];

	// get item name
	if (typeof get_file_details_items != 'object') {
		get_file_details_items = [];
		for (i = 0, j; i < 99; i++)
			// scan cols
			if (n = WinShell.NameSpace(0).GetDetailsOf(null, i))
				get_file_details_items[i] = n;
	}

	// main process
	//for(i=0,r=[];i<get_file_details_items.length;i++)
	r = [];
	for (i in get_file_details_items) {
		//if(get_file_details_items[i])
		r[get_file_details_items[i]] = r[i] = parentDirObj
		.GetDetailsOf(fileObj, i);
	}

	return r;
};


_// JSDT:_module_
.
/**
 * FileSystemObject Object Attributes Property
 * @see
 * <a href="http://msdn.microsoft.com/en-us/library/5tx15443%28VS.85%29.aspx" accessdate="2010/1/9 8:11">Attributes Property</a>
 * @_memberOf	_module_
 * @since	2010/1/9 08:33:36
 */
fso_attributes = {
	/**
	 * Default. No attributes are set.
	 * @_memberOf	_module_
	 */
	none : 0,
	/**
	 * Normal file. No attributes are set.
	 * @_memberOf	_module_
	 */
	Normal : 0,
	/**
	 * Read-only file. Attribute is read/write.
	 * @_memberOf	_module_
	 */
	ReadOnly : 1,
	/**
	 * Hidden file. Attribute is read/write.
	 * @_memberOf	_module_
	 */
	Hidden : 2,
	/**
	 * System file. Attribute is read/write.
	 * @_memberOf	_module_
	 */
	System : 4,
	/**
	 * Disk drive volume label. Attribute is read-only.
	 * @_memberOf	_module_
	 */
	Volume : 8,
	/**
	 * Folder or directory. Attribute is read-only.
	 * @_memberOf	_module_
	 */
	Directory : 16,
	/**
	 * File has changed since last backup. Attribute is read/write.
	 * @_memberOf	_module_
	 */
	Archive : 32,
	/**
	 * Link or shortcut. Attribute is read-only.
	 * @_memberOf	_module_
	 */
	Alias : 1024,
	/**
	 * Compressed file. Attribute is read-only.
	 * @_memberOf	_module_
	 */
	Compressed : 2048
};

//	reverse map
_.fso_attributes_reverse=[];
for (i in _.fso_attributes)
	if (i !== 'none')
		_.fso_attributes_reverse[_.fso_attributes[i]] = i;

/*
TODO
	未來：change_attributes(path,'-ReadOnly&-Hidden&-System')

下面調到檔案頭
setObjValue('Attribute','Normal=0,none=0,ReadOnly=1,Hidden=2,System=4,Volume=8,Directory=16,Archive=32,Alias=64,Compressed=128','int');
setObjValue('AttributeV','0=Normal,1=ReadOnly,2=Hidden,4=System,8=Volume,16=Directory,32=Archive,64=Alias,128=Compressed');
*/
_// JSDT:_module_
.
/**
 * 改變檔案之屬性。
 * chmod @ UNIX
 * @param	F	file path
 * @param	A	attributes, 屬性
 * @example
 * change_attributes(path,'-ReadOnly');
 * @_memberOf	_module_
 */
change_attributes = function(F, A) {
	if (!F)
		return -1;

	if (typeof F === 'string')
		try {
			F = fso.GetFile(F);
		} catch (e) {
			return -2;
		}

	var a;
	try {
		a = F.Attributes;
	} catch (e) {
		return -3;
	}

	if (typeof A === 'undefined')
		A = a;
	else if (A === '' || A == 'Archive')
		A = 32;
	else if (A == 'Normal')
		A = 0;
	else if (isNaN(A))
		if (A.charAt(0) === 'x' || A.charAt(0) === '-')
			if (A = -_.fso_attributes[A.substr(1)], A && a % (A << 2))
				A = a + A;
			else
				A = a;
		else if (A = _.fso_attributes[A], A && a % (A << 2) == 0)
			A = a + A;
		else
			A = a;
	else if (_.fso_attributes_reverse[A])
		if (a % (A << 2) == 0)
			A = a + A;
		else
			A = a;
	else if (_.fso_attributes_reverse[-A])
		if (a % (A << 2))
			A = a + A;
		else
			A = a;

	if (a != A)
		try {
			F.Attributes = A;
		} catch (e) {
			//popErr(e);
			library_namespace.err(e);
			//	70：防寫（沒有使用權限）
			return 70 == (e.number & 0xFFFF) ? -8 : -9;
		}
	return F.Attributes;
};





_// JSDT:_module_
.
/**
 * 開檔處理<br/>
 * 測試是否已開啟資料檔之測試與重新開啟資料檔
 * @param FN	file name
 * @param NOTexist	if NOT need exist
 * @param io_mode	IO mode
 * @return
 * @requires	fso,WshShell,iomode
 * @_memberOf	_module_
 */
openDataTest = function(FN, NOTexist, io_mode) {
	if (!FN)
		return 3;
	if (NOTexist && !fso.FileExists(FN))
		return 0;
	if (!io_mode)
		io_mode = _.iomode.ForAppending;
	for (;;)
		try {
			var Fs = fso.OpenTextFile(FN, ForAppending);
			Fs.Close();
			break;
		} catch (e) {
			// 對執行時檔案已經開啟之處理
			//if(typeof e=='object'&&e.number&&(e.number&0xFFFF)==70)
			if ((e.number & 0xFFFF) != 70) {
				return pErr(e, 0,
						'開啟資料檔 [<green>' + FN + '<\/>] 時發生錯誤！'),
						6 == alert(
								'開啟資料檔 [' + FN + ']時發生不明錯誤，\n	是否中止執行？',
								0, ScriptName + ' 測試是否已開啟資料檔：發生不明錯誤！',
								4 + 48) ? 1 : 0;
			}
			if (2 == WshShell.Popup(
					'★資料檔：\n\	' + FN + '\n	無法寫入！\n\n可能原因與解決方法：\n	①資料檔已被開啟。執行程式前請勿以其他程式開啟資料檔！\n	②資料檔被設成唯讀，請取消唯讀屬性。',
					0, ScriptName + '：資料檔開啟發生錯誤！', 5 + 48))
				return 2;
		}
	return 0;
};

_// JSDT:_module_
.
/**
 * 
 * @param FN
 * @param format
 * @param io_mode
 * @return
 */
open_template = function(FN, format, io_mode) {
	/**
	 * file
	 * @inner
	 * @ignore
	 */
	var F,
	/**
	 * file streams
	 * @inner
	 * @ignore
	 */
	Fs;
	if (!io_mode)
		io_mode = _.iomode.ForReading;
	if (!format)
		//format=autodetectEncode(FN);
		format = _.open_format.TristateUseDefault;// TristateTrue
	try {
		F = fso.GetFile(FN);
		//Fs=_.open_file(FN,format,io_mode);
		Fs = F.OpenAsTextStream(io_mode, format);
	} catch (e) {
		// 指定的檔案不存在?
		pErr(e);
		// quit();
	}
	return Fs;
};

//var openOut.f;	//	default format
function openOut(FN,io_mode,format){
 var OUT,OUTs,_f=openOut.f;
 if(!io_mode)io_mode=_.iomode.ForWriting;
 if(!format)format=_f=='string'&&_f?_f:_.open_format.TristateUseDefault;
 try{
  OUT=fso.GetFile(FN);
 }
 catch(e){try{
  //指定的檔案不存在
  var tmp=fso.CreateTextFile(FN,true);
  tmp.Close();
  OUT=fso.GetFile(FN);
 }catch(e){pErr(e);}}

 try{OUTs=OUT.OpenAsTextStream(io_mode,format);}catch(e){pErr(e);}

 return OUTs;
};







//	2007/5/31 21:5:16
compressF.tool={
	WinRAR:{path:'"%ProgramFiles%\\WinRAR\\WinRAR.exe"',ext:'rar'
		,c:{cL:'$path $cmd $s $archive -- $files',cmd:'a'	//	cL:command line, c:compress, s:switch
			,s:'-u -dh -m5 -os -r -ts'	// -rr1p -s<N> -ap -as -ep1 -tl -x<f> -x@<lf> -z<f>  -p[p] -hp[p]	//	rar等
			//,l:'-ilog logFN'
		}
		,u:{cL:'$path $cmd $archive $eF $eTo',cmd:'e'}	//	uncompress
		,t:{cL:'$path $cmd $archive',cmd:'t'}	//	test
	}
	,'7-Zip':{path:'"%ProgramFiles%\\7-Zip\\7zg.exe"',ext:'7z'
		,c:{cL:'$path $cmd $s $archive $files',cmd:'u',s:'-mx9 -ms -mhe -mmt -uy2'}	//	compress
		,u:{cL:'$path $cmd $archive $eF $_e',cmd:'e',_e:function(fO){return fO.eTo?'-o'+fO.eTo:'';}}	//	uncompress
		,t:{cL:'$path $cmd $archive',cmd:'t'}	//	test
	}
};
/*
test:
var base='C:\\kanashimi\\www\\cgi-bin\\program\\misc\\';
compress(base+'jit','_jit.htm',{tool:'7-Zip',s:''});
uncompress(base+'jit',base,{tool:'7-Zip'});


fO={
	tool:'WinRAR'	//	or '7-Zip'
	,m:'c'	//	method
	,s:''	//	switch
	,archive:''	//	archive file
	,files=''	//	what to compress
	,eTo=''	//	where to uncompress
	,eF=''	//	what to uncompress
	,rcL=1	//	rebuild command line
}
*/
// solid, overwrite, compressLevel, password
function compressF(fO){	//	flags object
	// 參數檢查: 未完全
	if(!fO)fO={};
	if(typeof fO!='object')return;
	if(!fO.tool)fO.tool='WinRAR';
	//if(!fO.m)fO.m='c';//method
	if(!fO.m||!fO.archive&&(fO.m!='c'||fO.m=='c'&&!fO.files))return;
	if(fO.m=='c'){
		if(typeof fO.files!='object')fO.files=fO.files?[fO.files]:fO.archive.replace(/\..+$/,'');
		if(!fO.archive)fO.archive=fO.files[0].replace(/[\\\/]$/,'')+_t.ext;
		fO.files='"'+fO.files.join('" "')+'"';
	}
	var i,_t=compressF.tool[fO.tool],_m,_c;
	if(!_t||!(_m=_t[fO.m]))return;
	else if(!/\.[a-z]+$/.test(fO.archive))fO.archive+='.'+_t.ext;
	//if(fO.bD)fO.archive=fO.bD+(/[\\\/]$/.test(fO.bD)?'':'\\')+fO.archive;	//	base directory, work directory, base folder
	if(!/["']/.test(fO.archive))fO.archive='"'+fO.archive+'"';
	//alert('compressF(): check OK.');
	// 構築 command line
	if(_m._cL&&!fO.rcL)_c=_m._cL;	//	rebuild command line
	else{
		_c=_m.cL.replace(/\$path/,_t.path);
		for(i in _m)if(typeof fO[i]=='undefined')_c=_c.replace(new RegExp('\\$'+i),typeof _m[i]=='function'?_m[i](fO):_m[i]||'');
		_m._cL=_c;
		//alert('compressF():\n'+_c);
	}
	for(i in fO)_c=_c.replace(new RegExp('\\$'+i),fO[i]||'');
	if(_c.indexOf('$')!=-1){alert('compressF() error:\n'+_c);return;}
	alert('compressF() '+(_c.indexOf('$')==-1?'run':'error')+':\n'+_c);
	// run
	WshShell.Run(_c,0,true);
};
//compress[generateCode.dLK]='compressF';
function compress(archive,files,fO){	//	compress file path, what to compress, flags object
	if(!fO)fO={};else if(typeof fO!='object')return;
	if(!fO.m)fO.m='c';
	if(archive)fO.archive=archive;
	if(files)fO.files=files;
	return compressF(fO);
};
//uncompress[generateCode.dLK]='uncompressF';
/**
 * uncompress archive
 * @param archive	compressed file path
 * @param eTo	where to uncompress/target
 * @param {Object} flag	flags
 * @returns
 */
function uncompress(archive, eTo, flag) {
	if (!flag)
		flag = {};
	else if (typeof flag != 'object')
		return;

	if (!flag.m)
		flag.m = 'u';

	if (!flag.eF)
		flag.eF = '';

	if (archive)
		flag.archive = archive;

	if (eTo)
		flag.eTo = eTo;

	return compressF(flag);
};







/*
	轉換捷徑, 傳回shortcut的Object. true path
	http://msdn2.microsoft.com/en-us/library/xk6kst2k.aspx
	http://yuriken.hp.infoseek.co.jp/index3.html
*/
var p;
//dealShortcut[generateCode.dLK]='initialization_WScript_Objects';//,parseINI
function dealShortcut(path,rtPath){
 if(typeof path!='string')path='';
 else if(/\.(lnk|url)$/i.test(path)){
  var sc=WshShell.CreateShortcut(path),p=sc.TargetPath,_i;
  //	檔名有可能是不被容許的字元（不一定總是有'?'），這時只有.url以文字儲存還讀得到。
  if(/*(''+sc).indexOf('?')!=-1*/!p&&/\.url$/i.test(path)&&typeof parseINI=='function'){
   p=parseINI(path,0,1);
   sc={_emu:p};
   sc.TargetPath=(p=p.InternetShortcut).URL;
   for(_i in p)sc[_i]=p[_i];
/*
URL File Format (.url)	http://www.cyanwerks.com/file-format-url.html
[DEFAULT]
BASEURL=http://so.7walker.net/guide.php
[DOC#n(#n#n#n…)]
[DOC#4#5]
BASEURL=http://www.someaddress.com/frame2.html
[DOC_adjustiframe]
BASEURL=http://so.7walker.net/guide.php
ORIGURL=http://so.7walker.net/guide.php
[InternetShortcut]
URL=http://so.7walker.net/guide.php
Modified=50A8FD7702D1C60106
WorkingDirectory=C:\WINDOWS\
ShowCommand=	//	規定Internet Explorer啟動後窗口的初始狀態：7表示最小化，3表示最大化；如果沒有ShowCommand這一項的話則表示正常大小。
IconIndex=1	//	IconFile和IconIndex用來為Internet快捷方式指定圖標
IconFile=C:\WINDOWS\SYSTEM\url.dll
Hotkey=1601

Hotkey:
下面加起來: Fn 單獨 || (Fn || base) 擇一 + additional 擇2~3
base:
0=0x30(ASCII)
9=0x39(ASCII)
A=0x41(ASCII)
Z=0x5a(ASCII)
;=0xba
=
,
-
.
/
`=0xc0
[=0xdb
\
]
'=0xde

Fn:
F1=0x70
..
F12=0x7b

additional:
Shift=0x100
Ctrl=0x200
Alt=0x400

*/
   p=p.URL;
  }
  if(!rtPath)return sc;
  path=/^file:/i.test(p)?p.replace(/^[^:]+:\/+/,'').replace(/[\/]/g,'\\'):p;	//	/\.url$/i.test(path)?'':p;
 }
 return rtPath?path:null;
};

//filepath=OpenFileDialog();	基於安全，IE無法指定初始值或型態
//OpenFileDialog[generateCode.dLK]='IEA';
function OpenFileDialog() {
	var IE = new IEA, o;
	if (!IE.OK(1))
		return null;

	IE.write('<input id="file" type="file"/>');// value="'+dP+'"	useless

	o = IE.getE('file');
	o.focus();
	o.click();
	o = o.value || null;

	// IE.setDialog(200,400).show(1);
	IE.quit();

	return o;
};


/**
 * 是否為檔案
 * @param path	file path
 * @param create	create if not exist
 * @returns
 */
function is_file(path, create) {
	if (!path)
		return 0;
	if (typeof fso == 'undefined')
		fso = new ActiveXObject("Scripting.FileSystemObject");
	if (fso.FileExists(path))
		return true;

	//	doesn't exist
	path = get_file_name(path);
	if (create)
		try {
			create = fso.CreateTextFile(path, true);
			create.Close();
		} catch (e) {
		}
	return fso.FileExists(path);
};

/**
 * 是否為目錄
 * @param path	file path
 * @param create	create if not exist
 * @returns	0:not folder, 1:absolute, 2:relative path
 */
function is_folder(path, create) {
	if (!path)
		return 0;
	if (fso.FolderExists(path = turnToPath(path)))
		return isAbsPath(path) ? 1 : 2;
	if (create)
		try {
			fso.CreateFolder(path);
			return isAbsPath(path) ? 1 : 2;
		} catch (e) {
		}
	return 0;
};

/**
 * get directory name of a path
 * @param folder_path
 * @param mode	0:path, 1:filename
 * @returns
 */
function get_folder(folder_path, mode) {
	if (typeof folder_path == 'object' && typeof folder_path.Path == 'string')
		if (typeof folder_path.IsRootFolder != 'undefined')
			return folder_path.Path;
		else
			folder_path = folder_path.Path;
	if (typeof folder_path != 'string')
		return '';
	//else if(/^[a-z]$/i.test(folder_path))folder_path+=':\\';

	// if(folder_path.slice(-1)!='\\')folder_path+='\\';
	var i = folder_path.lastIndexOf('\\');
	if (i == -1)
		i = folder_path.lastIndexOf('/');
	return i == -1 ? folder_path : mode ? folder_path.substr(i + 1) : folder_path.slice(0, i + 1);
};



/**
 * 取得下一個序號的檔名，如輸入pp\aa.txt將嘗試pp\aa.txt→pp\aa[pattern].txt
 * @param file_path	file path
 * @param begin_serial	begin serial
 * @param pattern	增添主檔名的模式，包含Ser的部分將被轉換為序號
 * @returns
 */
function getNextSerialFN(file_path, begin_serial, pattern) {
	if (!file_path)
		return;
	if (isNaN(begin_serial))
		if (!fso.FileExists(file_path))
			return file_path;
		else
			begin_serial = 0;

	var i = file_path.lastIndexOf('.'), base, ext, Ser = ':s:';
	if (i == -1)
		base = file_path, ext = '';
	else
		base = file_path.slice(0, i), ext = file_path.substr(i); // fso.GetBaseName(filespec);fso.GetExtensionName(path);fso.GetTempName();

	if (!pattern)
		pattern = '_' + Ser;
	i = pattern.indexOf(Ser);

	if (i == -1)
		base += pattern;
	else
		base += pattern.slice(0, i), ext = pattern.substr(i + Ser.length) + ext;

	for (i = begin_serial || 0; i < 999; i++)
		if (!fso.FileExists(base + i + ext))
			return base + i + ext;

	return;
};


_// JSDT:_module_
.
/**
 * 轉換以 adTypeBinary 讀到的資料
 * @example
 * //	較安全的讀檔：
 * t=translate_AdoStream_binary_data(read_file(FP,'binary'));
 * write_file(FP,t,'iso-8859-1');
 * @see
 * <a href="http://www.hawk.34sp.com/stdpls/dwsh/charset_adodb.html">Hawk&apos;s W3 Laboratory : Disposable WSH : 番外編：文字エンコーディングとADODB.Stream</a>
 * @_memberOf	_module_
 */
translate_AdoStream_binary_data = function translate_AdoStream_binary_data(data, len, type) {
	var _s = translate_AdoStream_binary_data,_i=0,charArray,val,DOM=_s.XMLDOM,pos,txt;
 if(!DOM)
  try{
	DOM=_s.XMLDOM=(new ActiveXObject("Microsoft.XMLDOM")).createElement('tmp');	//	要素名は何でも良い
	DOM.dataType='bin.hex';
  }catch(e){return;}
 if(data!==0)DOM.nodeTypedValue=data,txt=DOM.text,pos=0;//binary data
 else pos=_s.pos,txt=_s.text;
 if(isNaN(len)||len>txt.length/2)len=txt.length/2;

 if(type){
  for(val=0;_i<len;i++)val=0x100*val+parseInt(txt.substr(pos,2),16),pos+=2;
  _s.pos=pos;
  return val;
 }

/*
 if(!(len>0)||len!=parseInt(len))
  alert(pos+','+_i+'==0~len='+len+','+txt.slice(0,8));
*/
 charArray=new Array(parseInt(len));	//	Error 5029 [RangeError] (facility code 10): 陣列長度必須是一有限的正整數
 for(;_i<len;_i++)	//	極慢！用charString+=更慢。
  try{
   //if(_i%100000==0)alert(i);
   //if(_i==40)alert(String.fromCharCode(parseInt(txt.substr(pos,2),16))+'\n'+charArray.join(''));
   charArray.push(String.fromCharCode(parseInt(txt.substr(pos,2),16))),pos+=2;
   //charArray[_i]=String.fromCharCode((t.charCodeAt(_i<<1)<<8)+t.charCodeAt((_i<<1)+1));
  }catch(e){
   e.description='translate_AdoStream_binary_data: 輸入了錯誤的資料:\n'+e.description;
   throw e;
  }
 if(!data)_s.pos=pos;
 return charArray.join('');
};

_// JSDT:_module_
.
/**
 * 轉換以 adTypeBinary 讀到的資料
 * @param	data	以 adTypeBinary 讀到的資料
 * @param	pos	position
 * @since	2007/9/19 20:58:26
 * @_memberOf	_module_
 */
Ado_binary = function(data, pos) {
	this.newDOM();

	if (typeof data == 'string') {
		if (!data || typeof getFP == 'function'
			&& !(data = getFP(data)))
			return;
		this.newFS(data);
		this.setPos(pos || 0);
	} else
		this.setData(data, pos);
};
_// JSDT:_module_
.
/**
 * @_memberOf	_module_
 */
Ado_binary.prototype={
/**
 * 設定 data
 * 
 * @param data	binary data
 * @param pos
 * @return
 * @_memberOf	_module_
 */
setData : function(data, pos) {
	this.DOM.nodeTypedValue = data,// binary data
	this.bt = this.DOM.text;// binary text
	if (!this.AdoS)
		this.len = this.bt.length / 2;
	this.setPos(pos || 0);
},
setPos : function(p) {
	if (!isNaN(p)) {
		if (p < 0)
			p = 0;
		else if (p > this.len)
			p = this.len;
		this.pos = p;
	}
	return this.pos;
},
testLen : function(len) {
	if (!len || len < 0)
		len = this.len;
	if (this.pos + len > this.len)
		len = this.len - this.pos;
	return len;
},
/**
 * read data
 * @private
 * @param len	length
 * @return
 * @_memberOf	_module_
 */
readData : function(len) {
	this.AdoS.Position = this.pos;
	var _data = this.AdoS.Read(len);
	//	讀 binary data 用 'iso-8859-1' 會 error encoding.
	this.setData(_data, this.AdoS.Position);
},
read : function(len) {
	var charArray = new Array(len = this.testLen(len)), _i = 0;
	this.readData(len);
	for (; _i < len; _i++)
		try {
			charArray.push(String.fromCharCode(parseInt(this.bt
					.substr(2 * _i, 2), 16)));
			// charArray[i]=String.fromCharCode((t.charCodeAt(i<<1)<<8)+t.charCodeAt((i<<1)+1));
		} catch (e) {
			this.retErr(e);
		}
		return charArray.join('');
},
readNum : function(len) {
	len = this.testLen(len);
	this.readData(len);
	var val = 0, _i = len;
	for (; _i > 0;)
		try {
			val = 0x100 * val
			+ parseInt(this.bt.substr(2 * (--_i), 2), 16);
		} catch (e) {
			this.retErr(e);
		}
		return val;
},
readHEX : function(len) {
	len = this.testLen(len);
	this.readData(len);
	return this.bt;
},
retErr : function(e) {
	e.description = 'translate_AdoStream_binary_data: 輸入了錯誤的資料:\n' + e.description;
	throw e;
},
/**
 * @private
 * @return
 * @_memberOf	_module_
 */
newDOM : function() {
	this.DOM = null;
	//try{
	this.DOM = (new ActiveXObject("Microsoft.XMLDOM")).createElement('tmp' + Math.random()); // 要素名は何でも良い
	//}catch(e){return;}
	this.DOM.dataType = 'bin.hex';
},
/**
 * @private
 * @param FP
 * @return
 * @_memberOf	_module_
 */
newFS : function(FP) {
	if (FP)
		this.FP = FP;
	else if (!(FP = this.FP))
		return;
	var _i = _.open_file.returnADO;
	_.open_file.returnADO = true;
	this.AdoS = _.open_file(FP, 'binary');
	_.open_file.returnADO = _i;
	if (!this.AdoS)
		return;
	this.AdoS.LoadFromFile(FP);
	this.len = this.AdoS.Size;
},
/**
 * 實際上沒多大效用。實用解決法：少用 AdoStream.Write()
 * @return
 * @_memberOf	_module_
 */
renew : function() {
	this.bt = this.data = 0;
	this.newDOM();
	if (this.AdoS && this.FP) {
		this.pos = this.AdoS.Position;
		this.AdoS.Close();
		this.AdoS = null;
		this.newFS();
	}
},
destory : function(e) {
	if (this.AdoS)
		this.AdoS.Close();
	this.AdoS = this.pos = this.bt = this.data = 0;
}
}; //	Ado_binary.prototype={


/*
//	速度過慢，放棄。
//_.open_file.returnADO=true;
function dealBinary(FP,func,interval){
 var t,fs=_.open_file(FP,'binary',ForReading);
 if(!fs)return;
 AdoStream.LoadFromFile(FP);
 if(!interval)interval=1;
 //alert(fs.size)
 while(!fs.EOS)
  if(func(translate_AdoStream_binary_data(fs.Read(interval))))return;
 func();
 fs.Close();
}
*/

/*	配合simple系列使用
http://thor.prohosting.com/~mktaka/html/utf8.html
http://www.andrewu.co.uk/webtech/comment/?703
http://www.blueidea.com/bbs/NewsDetail.asp?id=1488978
http://www.blueidea.com/bbs/NewsDetail.asp?GroupName=WAP+%BC%BC%CA%F5%D7%A8%C0%B8&DaysPrune=5&lp=1&id=1524739
C#	http://www.gotdotnet.com/team/clr/bcl/TechArticles/TechArticles/IOFAQ/FAQ.aspx
http://www.sqlxml.org/faqs.aspx?faq=2
http://www.imasy.or.jp/~hir/hir/tech/js_tips.html

ADODB.Stream	最大問題：不能append
http://msdn2.microsoft.com/en-us/library/ms808792.aspx
http://msdn.microsoft.com/library/en-us/ado270/htm/mdmscadoenumerations.asp
http://study.99net.net/study/web/asp/1067048121.html	http://www.6to23.com/s11/s11d5/20031222114950.htm
http://blog.csdn.net/dfmz007/archive/2004/07/23/49373.aspx
*/
var AdoStream,AdoEnums;	//	ADO Enumerated Constants	http://msdn.microsoft.com/library/en-us/ado270/htm/mdmscadoenumerations.asp
/*	搬到前面
setObjValue('AdoEnums','adTypeBinary=1,adTypeText=2'	//	StreamTypeEnum
+',adReadAll=-1,adReadLine=-2'	//	StreamReadEnum	http://msdn2.microsoft.com/en-us/library/ms806462.aspx
+',adSaveCreateNotExist=1,adSaveCreateOverWrite=2'	//	SaveOptionsEnum
+',adCR=13,adCRLF=-1,adLF=10'	//	LineSeparatorsEnum
,'int');
*/
AdoEnums = {
	adTypeBinary : 1,
	adTypeText : 2,
	adReadAll : -1,
	adReadLine : -2,
	adSaveCreateNotExist : 1,
	adSaveCreateOverWrite : 2,
	adCR : 13,
	adCRLF : -1,
	adLF : 10
};


//_.open_file[generateCode.dLK]='AdoEnums,simpleFileErr,ForReading,ForWriting,ForAppending,TristateUseDefault';//AdoStream
_// JSDT:_module_
.
/**
 * 提供給 <a href="#.read_file">read_file</a>, <a href="#.write_file">write_file</a> 使用的簡易開檔函數
 * @param FN	file path
 * @param format	open format, e.g., open_format.TristateUseDefault
 * @param io_mode	open mode, e.g., iomode.ForWriting
 * @_memberOf	_module_
 */
open_file = function open_file(FN, format, io_mode) {
 //if(!FN||typeof isAbsPath=='function'&&typeof get_file_name=='function'&&!isAbsPath(FN)&&!(FN=get_file_name(FN)))return;
 //if(!FN||typeof getFP=='function'&&!(FN=getFP(FN)))return;
	var _s = open_file;
 if(typeof format=='string'){
  if(!_s.returnADO&&typeof AdoStream!='undefined')
   try{AdoStream.Close();AdoStream=null;}catch(e){}
  try{
   AdoStream=new ActiveXObject("ADODB.Stream");//var objStream=Server.CreateObject("ADODB.Stream");	//	ASPの場合,Err.Number=-2147221005表不支援
  }catch(e){simpleFileErr=e;AdoStream=null;}
  if(AdoStream){
   //AdoStream.Mode=3;	//	read write
   if(format=='binary')AdoStream.Type=AdoEnums.adTypeBinary;	//	以二進位方式操作
   else{
    AdoStream.Type=AdoEnums.adTypeText;
    try{AdoStream.Charset=format;}catch(e){throw new Error(e.number,'open_file: Error format:\n	('+typeof format+') ['+format+']\n'+e.description);}	//	UTF-8,unicode,shift_jis,Big5,GB2312,ascii=iso-8859-1,_autodetect,_autodetect_all..	HKEY_CLASSES_ROOT\MIME\Database\Charset
   }
   AdoStream.Open();
   //AdoStream.Position=0,AdoStream.LineSeparator=AdoEnums.adLF;
   if(_s.returnADO){var _A=AdoStream;AdoStream=null;return _A;}
   return 0;
  }
  format=0;
 }
 var fs;
 //	使用某些防毒軟體(如諾頓 Norton)時，.OpenTextFile() 可能會被攔截，因而延宕。
 try{
  if(io_mode==_.iomode.ForAppending&&!fso.FileExists(FN))io_mode=_.iomode.ForWriting;	//	無此檔時改 writing
  fs=fso.OpenTextFile(FN,io_mode||_.iomode.ForReading,io_mode==_.iomode.ForWriting/*create*/,format||_.open_format.TristateUseDefault);
 }catch(e){
  simpleFileErr=e;
  try{fs.Close();}catch(e){}
  return -1;
 }
 return fs;
};
_// JSDT:_module_
.open_file.returnADO=false;
_// JSDT:_module_
.open_file.error;

//	若是僅使用普通的開檔方法（_.open_format.TristateTrue/_.open_format.TristateFalse等，不使用ADODB.Stream），直接引用下兩函數與fso段定義即可。否則還需要引入_.open_file(),setObjValue(),dQuote()
var simpleFileErr,
	//_autodetect	autodetectEncode(file)
	simpleFileAutodetectEncode=-5.4,
	simpleFileDformat=
	_// JSDT:_module_
	.open_format.TristateUseDefault;

//_.read_file[generateCode.dLK]=_.write_file[generateCode.dLK]='simpleFileErr,simpleFileAutodetectEncode,simpleFileDformat,initialization_WScript_Objects';//_.open_file,autodetectEncode,getFP,_.open_format.TristateUseDefault
//_.read_file[generateCode.dLK]+=',ForReading';_.write_file[generateCode.dLK]+=',ForWriting';
//_.read_file[generateCode.dLK]+=',translate_AdoStream_binary_data';	//	for _.read_file(FP,'binary')
_// JSDT:_module_
.
/**
 * 讀取檔案
 * @param FN	file path
 * @param format	open encode = simpleFileDformat
 * @param io_mode	open IO mode = ForReading
 * @param func	do this function per line, or [func, maxsize] (TODO)
 * @return {String} 檔案內容
 * @_memberOf	_module_
 */
read_file = function(FN, format, io_mode, func) {
 simpleFileErr=0;if(format==simpleFileAutodetectEncode)
  format=typeof autodetectEncode=='function'?autodetectEncode(FN):simpleFileDformat;
 if(!FN||typeof getFP=='function'&&!(FN=getFP(FN)))return;
 //var a,fs;try{fs=fso.OpenTextFile(FN,io_mode||_.iomode.ForReading,false,format||simpleFileDformat),a=fs.ReadAll(),fs.Close();}catch(e){simpleFileErr=e;return;}
 var a,fs;//,i,s=0,t;
 if(typeof _.open_file!='function')
  //{if(!FN||typeof getFP=='function'&&!(FN=getFP(FN)))return;
  try{fs=fso.OpenTextFile(FN,io_mode||_.iomode.ForReading,false/*create*/,format||simpleFileDformat);}
  catch(e){simpleFileErr=e;return;}
 else if(fs=_.open_file(FN,format||simpleFileDformat,io_mode||_.iomode.ForReading),fs===-1)return;

 //if(func instanceof Array)s=func[1],func=func[0];
 if(fs!==0)try{
  if(func)
   while(!fs.AtEndOfStream)func(fs.ReadLine());
/*
   while(!fs.AtEndOfStream){
    for(t='',i=0;!fs.AtEndOfStream&&(!t||i<s);i++)
     t+=fs.ReadLine();
    a+=func(t);
   }
*/
  else a=fs.ReadAll();
  fs.Close();
 }catch(e){simpleFileErr=e;try{fs.Close();}catch(e){}return;}
 else if(typeof AdoStream!='undefined'&&AdoStream)
  try{
   AdoStream.LoadFromFile(FN);
   if(AdoStream.Type==AdoEnums.adTypeBinary){
    a=AdoStream.Read(AdoEnums.adReadAll);	//	讀 binary data 用 'iso-8859-1' 會 error encoding.
    if(_.read_file.turnBinToStr&&typeof translate_AdoStream_binary_data=='function')a=translate_AdoStream_binary_data(a);
   }else if(func)
    while(!AdoStream.EOS)func(AdoStream.ReadText(AdoEnums.adReadLine));
/*
    while(!AdoStream.EOS){
     for(t='',i=0;!AdoStream.AtEndOfStream&&(!t||i<s);i++)
      t+=AdoStream.ReadText(AdoEnums.adReadLine);
     a+=func(t);
    }
*/
   else a=AdoStream.ReadText(AdoEnums.adReadAll);
   AdoStream.Close();
  }catch(e){
   simpleFileErr=e;
   try{AdoStream.Close();}catch(e){}
   return;
  }
 else simpleFileErr=new Error(1,'unknown error!'),simpleFileErr.name='unknownError';
 return a;
};
_// JSDT:_module_
.read_file.turnBinToStr=true;


_// JSDT:_module_
.
/**
 * 將 content 寫入 file
 * ** ADODB.Stream does not support appending!
 * @param FN	file path
 * @param content	content to write
 * @param format	open format = simpleFileDformat
 * @param io_mode	write mode = ForWriting, e.g., ForAppending
 * @param N_O	DO NOT overwrite
 * @return error No.
 * @_memberOf	_module_
 */
write_file = function(FN, content, format, io_mode, N_O) {
	simpleFileErr = 0;
	if (format == simpleFileAutodetectEncode)
		format = typeof autodetectEncode == 'function' ? autodetectEncode(FN)
				: simpleFileDformat;
		if (!FN || typeof getFP == 'function' && !(FN = getFP(FN)))
			return 2;
		//var fs;try{fs=fso.OpenTextFile(FN,iomode||ForWriting,true,format||TristateUseDefault);}catch(e){return 2;}if(!fs)return 3;
		//try{fs.Write(content);}catch(e){return e.number&0xFFFF==5?5:4;}	//	5:content中有此local無法相容的字元，例如在中文中寫入日文假名
		var fs;
		if (typeof _.open_file != 'function')
			// {if(!FN||typeof getFP=='function'&&!(FN=getFP(FN)))return 2;
			try {
				fs = fso.OpenTextFile(FN, io_mode || _.iomode.ForWriting,
						true/* create */, format || simpleFileDformat);
				if (!fs)
					return 3;
			} catch (e) {
				simpleFileErr = e;
				return 2;
			}
			else if (fs = _.open_file(FN, format || simpleFileDformat, io_mode
					|| _.iomode.ForWriting), fs === -1)
				return 3;
			else if (!fs && isNaN(fs))
				return 2;
		if (fs !== 0)
			try {
				fs.Write(content);
				fs.Close();
			} catch (e) {
				simpleFileErr = e;
				try {
					fs.Close();
				} catch (e) {
				}
				return simpleFileErr.number & 0xFFFF == 5 ? 5 : 4;
			}
			// AdoStream.SaveToFile()需在AdoStream.Write之後！
			else if (typeof AdoStream != 'undefined' && AdoStream)
				try {
					if (AdoStream.Type == AdoEnums.adTypeText)
						AdoStream.WriteText(content);
					else
						AdoStream.Write(content);
					AdoStream.SaveToFile(FN, io_mode
							|| AdoEnums.adSaveCreateOverWrite);
					AdoStream.Close();
				} catch (e) {
					simpleFileErr = e;
					try {
						AdoStream.Close();
					} catch (e) {
					}
					return 6;
				}
				else {
					simpleFileErr = new Error(1, 'unknown error!'),
					simpleFileErr.name = 'unknownError';
					return 1;
				}
};

//	TODO: unfinished
//simpleDealFile[generateCode.dLK]='autodetectEncode,_.read_file,_.write_file';
_// JSDT:_module_
.
simpleDealFile = function(inFN, func, outFN, format, io_mode, N_O) {
	if (!inFN)
		return;
	if (!outFN)
		outFN = inFN;
	var e = autodetectEncode(inFN), i = _.read_file(inFN, e), o = _.read_file(
			outFN, e), t = func(i, inFN);
	if (typeof t == 'string' && o != t)
		return _.write_file(outFN, t, e, N_O);
};

/*
var autodetectEncodeSP,autodetectEncodeCode;	//	特殊字元，各種編碼及判別所需最短長度
setObjValue('autodetectEncodeSP','3005=J,3006=J,3402=J,3447=C,3468=J,3473=C,359e=C,360e=C,361a=C,3918=C,396e=C,39cf=C,39d0=C,39df=C,3a73=C,3b4e=C,3b77=J,3c6e=C,3ce0=C,3f57=J,4056=C,415f=C,42c6=J,4302=J,4337=C,43ac=C,43b1=C,43dd=C,44be=J,44d4=J,44d6=C,464c=C,4661=C,4723=C,4729=C,477c=C,478d=C,4947=C,497a=C,497d=C,'
+'4982=C,4983=C,4985=C,4986=C,499b=C,499f=C,49b0=J,49b6=C,49b7=C,4c77=C,4c9f=C,4ca0=C,4ca1=C,4ca2=C,4ca3=C,4d13=C,4d14=C,4d15=C,4d16=C,4d17=C,4d18=C,4d19=C,4dae=C,4e12=J,4e13=C,4e1a=C,4e1b=C,4e1c=C,4e1d=C,4e24=C,4e25=C,4e27=C,4e28=J,4e2a=C,4e34=C,4e3a=C,4e3c=J,4e3d=C,4e3e=C,4e49=C,'
+'4e4c=C,4e50=C,4e54=C,4e60=C,4e61=C,4e62=J,4e66=C,4e70=C,4e71=C,4e8f=C,4e9a=C,4ea7=C,4ea9=C,4eb2=C,4eb5=C,4ebf=C,4ec5=C,4ece=C,4ed0=J,4ed1=C,4ed3=C,4eea=C,4eec=C,4f17=C,4f1b=C,4f1d=J,4f1e=C,4f1f=C,4f20=C,4f24=C,4f25=C,4f26=C,4f27=C,4f2a=C,4f65=C,4f66=J,4fa0=C,4fa1=J,4fa4=J,4fa5=C,'
+'4fa6=C,4fa7=C,4fa8=C,4fa9=C,4faa=C,4fac=C,4fb0=J,4fe3=J,4fe4=J,4fe5=J,4fe6=C,4fe7=J,4fe8=C,4fe9=C,4fea=C,4fed=C,5039=J,503a=C,503b=J,503e=C,5051=J,507b=C,507e=C,507f=C,50a5=C,50a7=C,50a8=C,50a9=C,50cd=J,50de=C,50f2=J,5170=C,5173=C,5174=C,517b=C,517d=C,5181=C,5188=C,5199=C,519b=C,'
+'519c=C,51af=C,51b2=C,51bb=C,51e4=C,51e7=J,51e9=J,51ea=J,51eb=C,51ed=C,51ee=J,51ef=C,51fb=C,51ff=C,520d=C,5218=C,5219=C,521a=C,521b=C,522b=C,522c=C,522d=C,523d=C,523f=C,5240=C,5242=C,5250=C,5251=C,5257=C,5267=C,5273=C,529d=C,529e=C,52a1=C,52a8=C,52b1=C,52b2=C,52b3=C,52bf=C,52cb=C,'
+'52da=C,5301=J,5302=J,5307=J,5326=C,532e=C,533b=C,534e=C,534f=C,5355=C,5356=C,5362=C,5364=C,536b=C,5385=C,5386=C,5389=C,538b=C,538c=C,538d=C,5395=C,53a0=C,53a3=C,53bf=C,53c2=C,53c6=C,53c7=C,53cc=C,53d1=C,53d8=C,53f6=C,53f7=C,53f9=C,53fa=J,53fd=C,540b=J,5413=C,5417=C,542f=C,544e=J,'
+'544f=J,5452=C,5453=C,5455=C,5456=C,5457=C,5458=C,545b=C,545c=C,5484=J,5491=J,5499=C,549b=C,549c=J,549d=C,54cd=C,54d1=C,54d2=C,54d3=C,54d4=C,54d5=C,54d7=C,54d8=J,54d9=C,54dd=C,54df=C,54e9=J,5500=J,551b=C,551d=C,5520=C,5521=C,5522=C,5553=C,5567=C,556c=C,556d=C,556e=C,5570=C,5578=C,'
+'55b0=J,55b7=C,55bd=C,55be=C,55eb=C,55f3=C,5624=C,5631=C,565c=C,565d=C,5678=J,567a=J,56a3=C,56c9=J,56ce=J,56e2=C,56ed=C,56f2=J,56f4=C,56f5=C,56fe=C,5706=C,5715=J,5726=J,5737=J,5738=J,5739=C,573a=C,5746=J,5757=C,575a=C,575b=C,575c=C,575d=C,575e=C,575f=C,5760=C,5784=C,5786=C,5788=J,'
+'5789=J,5792=C,57a4=J,57a6=C,57a9=C,57ab=C,57ac=J,57ad=C,57b0=J,57b2=C,57b3=J,57d6=J,57d8=C,57d9=C,57da=C,5811=C,5815=C,5840=J,5870=J,5899=C,58b8=J,58b9=J,58d7=J,58e5=J,58ee=C,58f0=C,58f3=C,58f6=C,58f8=C,5904=C,5907=C,5934=C,5939=C,593a=C,5941=C,594b=C,5956=C,5986=C,5987=C,5988=C,'
+'598b=J,599b=J,59a9=C,59aa=C,59ab=C,59c9=J,5a04=C,5a05=C,5a06=C,5a07=C,5a08=C,5a32=C,5a34=C,5a47=J,5a72=J,5a73=C,5a74=C,5a75=C,5a76=C,5aac=J,5ad2=C,5ad4=C,5af1=C,5b00=C,5b36=J,5b59=C,5b66=C,5b6a=C,5b93=J,5b9e=C,5ba0=C,5ba1=C,5baa=C,5bbd=C,5bbe=C,5bc9=J,5bdd=C,5bf9=C,5bfb=C,5bfc=C,'
+'5bff=C,5c06=C,5c14=C,5c18=C,5c1d=C,5c27=C,5c34=C,5c3d=C,5c42=C,5c5e=C,5c61=C,5c66=C,5c76=J,5c7f=C,5c81=C,5c82=C,5c96=C,5c97=C,5c98=C,5c9a=C,5c9b=C,5cbc=J,5cbd=C,5cbe=J,5cbf=C,5cc3=C,5cc4=C,5cc5=J,5ce0=J,5ce1=C,5ce3=C,5ce4=C,5ce6=C,5d02=C,5d03=C,5d10=C,5d2c=C,5d2d=C,5d58=C,5d59=J,'
+'5d5a=C,5d5d=C,5d76=J,5dc5=C,5de9=C,5def=C,5e01=C,5e05=C,5e08=C,5e0f=C,5e10=C,5e1c=C,5e26=C,5e27=C,5e2e=C,5e3b=C,5e3c=C,5e7f=C,5e83=J,5e86=C,5e90=C,5e91=C,5e93=C,5e94=C,5e99=C,5e9e=C,5e9f=C,5ebc=C,5f00=C,5f03=C,5f16=J,5f20=C,5f25=C,5f2f=C,5f39=C,5f41=J,5f45=J,5f52=C,5f53=C,5f55=C,'
+'5f7b=C,5f84=C,5f95=C,5fa4=J,5fc6=C,5fdc=J,5fe7=C,5ff0=J,5ffe=C,6001=C,6002=C,6003=C,6004=C,6005=C,6006=C,603a=J,603b=C,603c=C,603f=C,604b=C,6073=C,6076=C,6077=J,6078=C,6079=C,607a=C,607b=C,607c=C,607d=C,60ab=C,60ac=C,60ad=C,60af=C,60e7=C,60e8=C,60e9=C,60eb=C,60ec=C,60ed=C,60ee=C,'
+'60ef=C,6124=C,6126=C,6151=C,6164=C,61d1=C,61d2=C,6206=C,620b=C,620f=C,6217=C,6218=C,6256=J,6267=C,6268=J,6269=C,626a=C,626b=C,626c=C,629a=C,629f=C,62a0=C,62a1=C,62a2=C,62a4=C,62a5=C,62c5=C,62df=C,62e2=C,62e3=C,62e5=C,62e6=C,62e7=C,62e8=C,62e9=C,630a=J,6317=J,6318=J,631a=C,631b=C,'
+'631c=C,631d=C,631e=C,631f=C,6320=C,6321=C,6322=C,6324=C,6325=C,6326=C,6327=J,635e=C,635f=C,6361=C,6363=C,6364=J,6386=C,63b3=C,63b4=C,63b5=J,63b7=C,63b8=C,63ba=C,63bc=C,63fd=C,63ff=C,6400=C,6401=C,6402=C,6405=C,643e=J,6444=C,6445=C,6446=C,6448=C,644a=C,6484=C,64b5=C,64b7=C,64ba=C,'
+'64d3=C,64de=C,6512=C,654c=C,655b=C,6570=C,658b=C,6593=C,65a9=C,65ad=C,65e0=C,65e7=C,65f6=C,65f7=C,65f8=C,6619=C,663c=C,663d=C,663e=C,6653=C,6654=C,6655=C,6682=C,6683=J,66a7=C,66fb=J,6722=J,672f=C,6740=C,6741=J,6742=C,6743=C,6761=C,6762=J,6763=J,6764=J,6765=C,6766=J,6768=C,678c=J,'
+'679e=C,67a0=J,67a1=J,67a2=C,67a3=C,67a5=C,67a6=J,67a7=C,67a8=C,67a9=J,67aa=C,67ab=C,67ad=C,67d5=J,67e0=C,67fd=C,67fe=J,6802=J,6803=J,6807=C,6808=C,6809=C,680a=C,680b=C,680c=C,680d=J,680e=C,680f=C,6811=C,682c=J,6837=C,683e=C,685b=J,685c=J,685d=J,6861=C,6862=C,6863=C,6864=C,6865=C,'
+'6866=C,6867=C,6868=C,6869=C,6898=C,68a6=C,68ba=J,68bb=J,68c0=C,68c2=C,6917=J,6919=J,691a=J,691b=J,691f=C,6920=C,6921=J,6923=J,6924=C,6925=J,6926=J,6928=J,692a=J,692d=C,693f=J,697c=C,697e=J,697f=J,6980=J,6981=J,6984=C,6987=C,6988=C,6989=C,698a=J,69c7=J,69da=C,69db=C,69dd=J,69df=C,'
+'69e0=C,6a2b=J,6a2e=J,6a2f=C,6a30=J,6a31=C,6a3b=J,6a67=J,6a72=J,6a73=J,6a78=J,6a79=C,6a7c=C,6ab0=J,6ae4=J,6b1f=J,6b22=C,6b24=C,6b27=C,6b7c=C,6b87=C,6b8b=C,6b92=C,6b93=C,6b9a=C,6ba1=C,6ba8=C,6bb4=C,6bbb=C,6bc2=C,6bd5=C,6bd9=C,6bdf=J,6be1=C,6bee=J,6bf5=C,6c07=C,6c17=J,6c22=C,6c29=C,'
+'6c47=C,6c49=C,6c62=J,6c64=C,6c9f=C,6ca3=C,6ca4=C,6ca5=C,6ca6=C,6ca7=C,6ca8=C,6ca9=C,6caa=C,6cea=C,6cf7=C,6cf8=C,6cfa=C,6cfb=C,6cfc=C,6cfd=C,6cfe=C,6d43=C,6d45=C,6d46=C,6d47=C,6d48=C,6d49=C,6d4a=C,6d4b=C,6d4d=C,6d4e=C,6d4f=C,6d50=C,6d51=C,6d52=C,6d53=C,6d54=C,6d55=C,6d9b=C,6d9c=J,'
+'6d9d=C,6d9e=C,6d9f=C,6da0=C,6da1=C,6da2=C,6da4=C,6da6=C,6da7=C,6da8=C,6da9=C,6e0a=C,6e0d=C,6e0e=C,6e10=C,6e11=C,6e14=C,6e17=C,6e7e=C,6e7f=C,6e82=J,6e83=C,6e85=C,6e87=C,6ed7=C,6ede=C,6edf=C,6ee0=C,6ee1=C,6ee4=C,6ee5=C,6ee6=C,6ee8=C,6ee9=C,6eea=C,6f47=C,6f4b=C,6f4d=C,6f57=J,6f59=C,'
+'6f76=J,6f9c=C,6fbe=C,6fd1=C,6fd2=C,6ff9=J,704f=C,7067=C,706d=C,706f=C,7075=C,707e=C,707f=C,7080=C,7089=C,709c=C,709d=C,70b9=C,70bb=J,70bc=C,70bd=C,70c1=C,70c2=C,70c3=C,70db=C,70e6=C,70e7=C,70e8=C,70e9=C,70eb=C,70ec=C,70ed=C,7116=C,7118=C,7144=J,7173=J,7194=J,7195=J,71f5=J,7231=C,'
+'7232=C,7237=C,7240=C,724d=C,7275=C,727a=C,728a=C,72b6=C,72b7=C,72b8=C,72b9=C,72c6=J,72c8=C,72de=C,72ec=C,72ed=C,72ee=C,72ef=C,72f1=C,72f2=C,7303=C,730e=C,7315=C,7321=C,732b=C,732e=C,7341=C,736d=C,7391=C,739b=C,73ae=C,73af=C,73b0=C,73b1=C,73ba=C,73c6=J,73d1=C,73f2=C,740e=C,740f=C,'
+'7410=C,7411=J,743c=C,7443=J,7477=C,748e=C,74d2=C,74e7=J,74e9=J,74ea=J,74ef=C,74f0=J,74f1=J,74f2=J,74f8=J,74fc=J,7505=J,7523=C,7535=C,753b=C,753c=J,7545=C,7551=J,7560=J,7569=J,7573=J,7574=C,757d=J,7596=C,7597=C,759f=C,75a0=C,75a1=C,75ac=C,75ae=C,75af=C,75c7=J,75c8=C,75c9=C,75e8=C,'
+'75eb=C,7605=C,7606=C,7617=C,7618=C,762a=C,762b=C,762e=C,763b=C,763e=C,763f=C,764c=J,765e=C,7663=C,7667=C,766a=J,766b=C,7691=C,76b1=C,76b2=C,76cf=C,76d0=C,76d1=C,76d6=C,76d8=C,770d=C,7750=C,7751=C,7792=C,7798=C,77a9=C,77eb=C,77f6=C,77fe=C,77ff=C,7800=C,7801=C,7816=C,7817=C,781a=C,'
+'781c=C,783a=C,783b=C,783e=C,7840=C,7855=C,7856=C,7857=C,7859=C,785a=C,7872=J,7874=J,7877=C,788d=C,7897=J,789b=C,789c=C,78b5=J,78b8=C,7935=J,793c=C,794e=C,7962=C,796f=C,7977=C,7978=C,7985=C,79ef=C,79f0=C,79fd=C,7a23=C,7a2d=C,7a33=C,7a43=J,7a51=C,7a5d=J,7a77=C,7a83=C,7a8d=C,7a8e=C,'
+'7a9c=C,7a9d=C,7aa5=C,7aa6=C,7aad=C,7ac8=C,7acd=J,7acf=J,7ad3=J,7ad5=J,7ad6=C,7ade=C,7ae1=J,7aea=C,7af0=J,7b02=J,7b03=C,7b0b=C,7b14=C,7b15=C,7b39=J,7b3a=C,7b3c=C,7b3d=J,7b3e=C,7b5a=C,7b5b=C,7b79=C,7b7e=C,7b80=C,7b93=C,7ba5=J,7ba6=C,7ba7=C,7ba8=C,7ba9=C,7baa=C,7bab=C,7bcf=J,7bd1=C,'
+'7bd3=C,7bee=C,7c13=J,7c16=C,7c17=J,7c31=J,7c41=C,7c4f=J,7c74=C,7c75=J,7c7b=C,7c7e=J,7c81=J,7c82=J,7c8d=J,7c8f=J,7c90=J,7c9c=C,7c9d=C,7ca0=J,7ca8=J,7caa=C,7cab=J,7cad=J,7cae=C,7cc0=J,7cc1=C,7cce=J,7cd8=J,7d25=C,7d26=J,7d27=C,7d5d=C,7d76=C,7d77=C,7d89=C,7d9b=J,7dab=C,7db3=C,7dd1=C,'
+'7dd5=J,7dfc=C,7e05=J,7e27=C,7e28=J,7e4a=J,7e67=J,7e6e=C,7e83=J,7e90=J,7ea0=C,7ea1=C,7ea2=C,7ea3=C,7ea4=C,7ea5=C,7ea6=C,7ea7=C,7ea8=C,7ea9=C,7eaa=C,7eab=C,7eac=C,7ead=C,7eaf=C,7eb0=C,7eb1=C,7eb2=C,7eb3=C,7eb4=C,7eb5=C,7eb6=C,7eb7=C,7eb8=C,7eb9=C,7eba=C,7ebc=C,7ebd=C,7ebe=C,7ebf=C,'
+'7ec0=C,7ec1=C,7ec2=C,7ec3=C,7ec4=C,7ec5=C,7ec6=C,7ec7=C,7ec8=C,7ec9=C,7eca=C,7ecb=C,7ecc=C,7ecd=C,7ece=C,7ecf=C,7ed0=C,7ed1=C,7ed2=C,7ed3=C,7ed4=C,7ed5=C,7ed6=C,7ed7=C,7ed8=C,7ed9=C,7eda=C,7edb=C,7edc=C,7edd=C,7ede=C,7edf=C,7ee0=C,7ee1=C,7ee2=C,7ee3=C,7ee5=C,7ee6=C,7ee7=C,7ee8=C,'
+'7ee9=C,7eea=C,7eeb=C,7eed=C,7eee=C,7eef=C,7ef0=C,7ef2=C,7ef3=C,7ef4=C,7ef5=C,7ef6=C,7ef7=C,7ef8=C,7efa=C,7efb=C,7efc=C,7efd=C,7efe=C,7eff=C,7f00=C,7f01=C,7f02=C,7f03=C,7f04=C,7f05=C,7f06=C,7f07=C,7f08=C,7f09=C,7f0a=C,7f0c=C,7f0e=C,7f11=C,7f12=C,7f13=C,7f14=C,7f15=C,7f16=C,7f17=C,'
+'7f18=C,7f19=C,7f1a=C,7f1b=C,7f1c=C,7f1d=C,7f1e=C,7f1f=C,7f20=C,7f21=C,7f22=C,7f23=C,7f24=C,7f25=C,7f26=C,7f27=C,7f28=C,7f29=C,7f2a=C,7f2b=C,7f2c=C,7f2d=C,7f2e=C,7f2f=C,7f30=C,7f31=C,7f32=C,7f33=C,7f34=C,7f35=C,7f3c=J,7f42=C,7f4e=C,7f57=C,7f5a=C,7f62=C,7f74=C,7f81=C,7f9f=C,7faa=J,'
+'7fd8=C,7fda=C,8022=C,8027=C,802e=C,8038=C,8042=C,804b=C,804c=C,804d=C,8054=C,8062=J,8069=C,806a=C,8083=C,80a0=C,80a4=C,80be=C,80bf=C,80c0=C,80c1=C,80c6=C,80e7=C,80e8=C,80ea=C,80eb=C,80f1=J,80f6=C,8109=C,810d=C,810f=C,8110=C,8111=C,8113=C,8114=C,8135=J,8136=C,8138=C,8156=C,8158=C,'
+'817a=J,817b=C,817e=C,8191=C,81a4=J,81b5=J,81cd=J,81dc=C,8206=C,8220=J,822e=J,8230=C,8231=C,823b=C,8249=J,825d=J,8260=J,8270=C,8273=C,827a=C,8282=C,8297=C,829c=C,82a6=C,82c1=C,82c5=J,82c7=C,82c8=C,82cb=C,82cd=C,82cf=C,830e=C,830f=C,8311=C,8314=C,8315=C,834e=J,835a=C,835b=C,835c=C,'
+'835e=C,835f=C,8360=C,8361=C,8363=C,8364=C,8365=C,8366=C,8367=C,8368=C,8369=C,836a=C,836b=C,836c=C,836d=C,836e=C,836f=C,83b1=C,83b2=C,83b3=C,83b4=C,83b7=C,83b8=C,83b9=C,83ba=C,83bc=C,8419=J,841a=C,841d=C,8421=J,8422=J,8424=C,8425=C,8426=C,8427=C,8428=C,8429=J,8464=C,8485=J,8487=C,'
+'8489=C,848b=C,848c=C,8493=C,84d9=J,84da=J,84dc=J,84dd=C,84df=C,84e3=C,84e6=C,8534=C,8536=J,8537=C,8539=C,853a=C,853c=C,8552=C,8572=C,8574=C,85ae=C,85d3=C,85f4=C,8612=J,8630=J,8645=J,864f=C,8651=C,8672=J,867d=C,867e=C,867f=C,8680=C,8681=C,8682=C,86ab=J,86ac=C,86ca=C,86ce=C,86cf=C,'
+'86ee=C,86ef=J,86f0=C,86f1=C,86f2=C,86f3=C,86f4=C,8717=C,8747=C,8748=C,8749=C,877c=C,877e=C,87a7=J,87a8=C,87a9=J,87cf=C,87d0=J,87f5=J,8845=C,8846=C,8854=C,8865=C,886c=C,8884=C,8885=C,889c=C,88ad=C,88b0=J,88c3=J,88c4=J,88c5=C,88c6=C,88e2=C,88e3=C,88e4=C,88e5=C,8902=J,8904=J,891b=C,'
+'891c=J,8934=C,8947=C,8977=J,898e=C,89c1=C,89c2=C,89c3=C,89c4=C,89c5=C,89c6=C,89c7=C,89c8=C,89c9=C,89ca=C,89cb=C,89cc=C,89ce=C,89cf=C,89d0=C,89d1=C,89de=C,8a29=C,8a33=J,8a5f=C,8a89=C,8a8a=C,8aac=C,8aad=J,8aae=J,8ada=J,8b21=C,8b2d=C,8ba1=C,8ba2=C,8ba3=C,8ba4=C,8ba5=C,8ba6=C,8ba7=C,'
+'8ba8=C,8ba9=C,8baa=C,8bab=C,8bad=C,8bae=C,8baf=C,8bb0=C,8bb2=C,8bb3=C,8bb4=C,8bb5=C,8bb6=C,8bb7=C,8bb8=C,8bb9=C,8bba=C,8bbb=C,8bbc=C,8bbd=C,8bbe=C,8bbf=C,8bc0=C,8bc1=C,8bc2=C,8bc3=C,8bc4=C,8bc5=C,8bc6=C,8bc7=C,8bc8=C,8bc9=C,8bca=C,8bcb=C,8bcc=C,8bcd=C,8bce=C,8bcf=C,8bd1=C,8bd2=C,'
+'8bd3=C,8bd4=C,8bd5=C,8bd6=C,8bd7=C,8bd8=C,8bd9=C,8bda=C,8bdb=C,8bdd=C,8bde=C,8bdf=C,8be0=C,8be1=C,8be2=C,8be3=C,8be4=C,8be5=C,8be6=C,8be7=C,8be8=C,8be9=C,8beb=C,8bec=C,8bed=C,8bee=C,8bef=C,8bf0=C,8bf1=C,8bf2=C,8bf3=C,8bf4=C,8bf5=C,8bf6=C,8bf7=C,8bf8=C,8bf9=C,8bfa=C,8bfb=C,8bfc=C,'
+'8bfd=C,8bfe=C,8bff=C,8c00=C,8c01=C,8c02=C,8c03=C,8c04=C,8c05=C,8c06=C,8c07=C,8c08=C,8c09=C,8c0a=C,8c0b=C,8c0c=C,8c0d=C,8c0e=C,8c0f=C,8c10=C,8c11=C,8c12=C,8c13=C,8c14=C,8c15=C,8c16=C,8c17=C,8c18=C,8c19=C,8c1a=C,8c1b=C,8c1c=C,8c1d=C,8c1e=C,8c1f=C,8c20=C,8c21=C,8c22=C,8c23=C,8c24=C,'
+'8c25=C,8c26=C,8c27=C,8c28=C,8c29=C,8c2a=C,8c2b=C,8c2c=C,8c2d=C,8c2e=C,8c2f=C,8c30=C,8c31=C,8c32=C,8c33=C,8c34=C,8c35=C,8c36=C,8c6e=C,8cae=J,8ceb=C,8cec=J,8d0b=C,8d1c=C,8d1d=C,8d1e=C,8d1f=C,8d21=C,8d22=C,8d23=C,8d24=C,8d25=C,8d26=C,8d27=C,8d28=C,8d29=C,8d2a=C,8d2b=C,8d2c=C,8d2d=C,'
+'8d2e=C,8d2f=C,8d30=C,8d31=C,8d32=C,8d33=C,8d34=C,8d35=C,8d36=C,8d37=C,8d38=C,8d39=C,8d3a=C,8d3b=C,8d3c=C,8d3d=C,8d3e=C,8d3f=C,8d41=C,8d42=C,8d43=C,8d44=C,8d45=C,8d46=C,8d48=C,8d49=C,8d4a=C,8d4b=C,8d4c=C,8d4d=C,8d4e=C,8d4f=C,8d50=C,8d52=C,8d53=C,8d54=C,8d55=C,8d56=C,8d57=C,8d58=C,'
+'8d59=C,8d5a=C,8d5b=C,8d5c=C,8d5d=C,8d5e=C,8d60=C,8d61=C,8d62=C,8d63=C,8d6a=C,8d71=J,8d75=C,8d8b=C,8db1=C,8db8=C,8dc3=C,8dc4=C,8def=J,8df4=J,8df5=C,8df7=C,8df8=C,8df9=C,8dfb=C,8e0c=C,8e2c=C,8e2f=C,8e51=C,8e52=C,8e7f=C,8e8f=C,8e9c=C,8eae=J,8eaf=C,8eb5=J,8ebb=J,8ebe=J,8ec5=J,8ec8=J,'
+'8ee4=C,8ef2=C,8f4c=J,8f66=C,8f67=C,8f68=C,8f69=C,8f6b=C,8f6c=C,8f6d=C,8f6e=C,8f6f=C,8f70=C,8f71=C,8f72=C,8f73=C,8f74=C,8f76=C,8f77=C,8f78=C,8f79=C,8f7a=C,8f7b=C,8f7c=C,8f7d=C,8f7e=C,8f7f=C,8f82=C,8f83=C,8f84=C,8f85=C,8f86=C,8f87=C,8f88=C,8f89=C,8f8a=C,8f8b=C,8f8d=C,8f8e=C,8f8f=C,'
+'8f90=C,8f91=C,8f93=C,8f94=C,8f95=C,8f96=C,8f97=C,8f98=C,8f99=C,8f9a=C,8f9e=C,8fa9=C,8fab=C,8fb7=J,8fb9=C,8fbb=J,8fbc=J,8fbd=C,8fbe=C,8fc1=C,8fc7=C,8fc8=C,8fd0=C,8fd8=C,8fd9=C,8fda=J,8fdb=C,8fdc=C,8fdd=C,8fde=C,8fdf=C,8fe9=C,8ff9=C,9009=C,900a=C,9012=C,9026=C,9027=J,903b=C,9056=J,'
+'9057=C,9093=C,909d=C,90ac=C,90ae=C,90b9=C,90ba=C,90bb=C,90cf=C,90d0=C,90d1=C,90d2=J,90d3=C,90e6=C,90e7=C,90f8=C,915b=J,915d=C,9171=C,917d=C,917e=C,917f=C,9196=C,91ca=C,91d7=J,91fa=C,91fb=J,91fe=C,9208=C,920e=C,9225=J,9226=J,9228=J,9229=J,922c=J,9239=J,923e=J,9255=C,9262=C,926b=J,'
+'9274=C,9286=J,92ab=J,92ae=C,92af=J,92b1=C,92c5=J,92e5=C,92ed=C,92f2=J,9307=C,9332=C,9335=J,933a=J,933e=C,9340=C,9341=C,9344=J,9369=C,9384=C,9386=J,9387=C,93b8=C,93b9=J,93bf=C,93e5=J,93f0=C,941d=C,9420=J,9421=J,9426=C,9427=C,942f=C,9453=J,9454=C,9465=C,9479=C,9486=C,9487=C,9488=C,'
+'9489=C,948a=C,948b=C,948c=C,948d=C,948e=C,948f=C,9490=C,9492=C,9493=C,9494=C,9495=C,9496=C,9497=C,9498=C,9499=C,949a=C,949b=C,949d=C,949e=C,949f=C,94a0=C,94a1=C,94a2=C,94a4=C,94a5=C,94a6=C,94a7=C,94a8=C,94a9=C,94aa=C,94ab=C,94ac=C,94ad=C,94ae=C,94af=C,94b0=C,94b1=C,94b2=C,94b3=C,'
+'94b4=C,94b5=C,94b6=C,94b7=C,94b9=C,94ba=C,94bb=C,94bc=C,94bd=C,94be=C,94bf=C,94c0=C,94c1=C,94c2=C,94c3=C,94c4=C,94c5=C,94c6=C,94c8=C,94c9=C,94ca=C,94cb=C,94cc=C,94cd=C,94ce=C,94cf=C,94d0=C,94d1=C,94d2=C,94d3=C,94d5=C,94d7=C,94d9=C,94db=C,94dc=C,94dd=C,94de=C,94df=C,94e0=C,94e1=C,'
+'94e2=C,94e3=C,94e4=C,94e5=C,94e7=C,94e8=C,94e9=C,94ea=C,94eb=C,94ec=C,94ed=C,94ee=C,94ef=C,94f0=C,94f1=C,94f2=C,94f3=C,94f5=C,94f6=C,94f7=C,94f8=C,94f9=C,94fa=C,94fc=C,94fd=C,94fe=C,94ff=C,9500=C,9501=C,9502=C,9503=C,9504=C,9505=C,9506=C,9507=C,9508=C,9509=C,950b=C,950c=C,950e=C,'
+'950f=C,9510=C,9511=C,9512=C,9513=C,9514=C,9515=C,9517=C,9518=C,9519=C,951a=C,951b=C,951d=C,951e=C,951f=C,9521=C,9522=C,9523=C,9524=C,9525=C,9526=C,9527=C,9528=C,952b=C,952d=C,952e=C,952f=C,9530=C,9531=C,9532=C,9534=C,9535=C,9536=C,9537=C,9538=C,9539=C,953b=C,953c=C,953e=C,953f=C,'
+'9540=C,9541=C,9542=C,9543=C,9544=C,9545=C,9547=C,9549=C,954a=C,954b=C,954c=C,954d=C,954e=C,954f=C,9550=C,9551=C,9552=C,9553=C,9554=C,9556=C,9557=C,9558=C,955a=C,955b=C,955c=C,955d=C,955e=C,9562=C,9563=C,9564=C,9565=C,9566=C,9567=C,9568=C,9569=C,956a=C,956b=C,956c=C,956d=C,956e=C,'
+'956f=C,9570=C,9571=C,9572=C,9573=C,9574=C,9576=C,957f=C,9584=J,9587=J,958a=J,9596=J,95a0=J,95a7=C,95aa=J,95b2=C,95b8=J,95e6=J,95e8=C,95e9=C,95ea=C,95ed=C,95ee=C,95ef=C,95f0=C,95f1=C,95f2=C,95f4=C,95f5=C,95f7=C,95f8=C,95f9=C,95fa=C,95fb=C,95fc=C,95fd=C,95fe=C,95ff=C,9600=C,9601=C,'
+'9602=C,9603=C,9604=C,9605=C,9606=C,9608=C,9609=C,960a=C,960b=C,960c=C,960d=C,960e=C,960f=C,9610=C,9611=C,9612=C,9614=C,9615=C,9616=C,9617=C,9619=C,961a=C,961f=C,9633=C,9634=C,9635=C,9636=C,9645=C,9646=C,9647=C,9648=C,9649=C,9655=C,9668=C,9669=C,968f=C,9690=C,96b6=C,96be=C,96cf=C,'
+'96e0=C,96eb=J,96f3=C,96fe=C,9701=C,972d=C,974d=J,974e=J,974f=J,9753=C,9765=C,9779=J,9786=J,9790=J,9791=C,9792=C,979c=J,97af=C,97bd=C,97e6=C,97e7=C,97e8=C,97e9=C,97ea=C,97eb=C,97ec=C,97f5=C,983d=C,9854=C,986c=C,9875=C,9876=C,9877=C,9878=C,9879=C,987a=C,987b=C,987c=C,987d=C,987e=C,'
+'987f=C,9880=C,9881=C,9882=C,9883=C,9884=C,9885=C,9886=C,9887=C,9888=C,9889=C,988a=C,988b=C,988c=C,988d=C,988f=C,9890=C,9891=C,9893=C,9894=C,9896=C,9897=C,9898=C,9899=C,989b=C,989c=C,989d=C,989e=C,989f=C,98a0=C,98a1=C,98a2=C,98a4=C,98a5=C,98a6=C,98a7=C,98aa=J,98ce=C,98d2=C,98d3=C,'
+'98d4=C,98d5=C,98d7=C,98d8=C,98d9=C,98de=C,98e8=C,98ff=C,9904=C,990d=C,990e=C,990f=C,9919=J,991c=C,9936=C,9937=C,9942=J,994a=C,9962=C,9965=C,9966=C,9967=C,9968=C,9969=C,996a=C,996b=C,996c=C,996d=C,996e=C,996f=C,9970=C,9971=C,9972=C,9973=C,9974=C,9975=C,9976=C,9977=C,9978=C,9979=C,'
+'997a=C,997b=C,997c=C,997d=C,997f=C,9981=C,9983=C,9984=C,9985=C,9986=C,9987=C,9988=C,9989=C,998a=C,998b=C,998d=C,998e=C,998f=C,9990=C,9991=C,9992=C,9993=C,9994=C,9995=C,99e1=C,99f2=J,9a6b=J,9a6c=C,9a6d=C,9a6e=C,9a6f=C,9a70=C,9a71=C,9a73=C,9a74=C,9a75=C,9a76=C,9a77=C,9a78=C,9a79=C,'
+'9a7a=C,9a7b=C,9a7c=C,9a7d=C,9a7e=C,9a7f=C,9a80=C,9a81=C,9a82=C,9a84=C,9a85=C,9a86=C,9a87=C,9a88=C,9a8a=C,9a8b=C,9a8c=C,9a8e=C,9a8f=C,9a90=C,9a91=C,9a92=C,9a93=C,9a96=C,9a97=C,9a98=C,9a9a=C,9a9b=C,9a9c=C,9a9d=C,9a9e=C,9a9f=C,9aa0=C,9aa1=C,9aa2=C,9aa4=C,9aa5=C,9aa7=C,9ac5=C,9acb=C,'
+'9acc=C,9aea=J,9b13=C,9b47=C,9b49=C,9b5d=J,9b5e=J,9b6c=J,9b74=J,9b78=J,9b79=J,9b81=C,9b84=J,9b8d=C,9b8e=C,9b95=J,9b96=J,9b97=J,9b98=J,9b9d=C,9b9f=J,9ba3=C,9bb1=J,9bb4=J,9bba=C,9bce=J,9bcf=J,9bd0=J,9bd1=J,9bd2=J,9be1=J,9bf0=J,9bf1=J,9bf2=J,9bf3=J,9bff=C,9c02=C,9c04=J,9c0c=C,9c10=C,'
+'9c12=J,9c18=J,9c1f=C,9c21=J,9c27=C,9c2e=J,9c2f=J,9c30=J,9c35=C,9c39=J,9c45=C,9c47=J,9c48=J,9c5a=J,9c69=J,9c6a=J,9c6b=J,9c70=J,9c7c=C,9c7d=C,9c7f=C,9c81=C,9c82=C,9c85=C,9c86=C,9c87=C,9c88=C,9c8a=C,9c8b=C,9c8d=C,9c8e=C,9c8f=C,9c90=C,9c91=C,9c92=C,9c94=C,9c96=C,9c97=C,9c99=C,9c9a=C,'
+'9c9b=C,9c9c=C,9c9d=C,9c9e=C,9c9f=C,9ca0=C,9ca1=C,9ca2=C,9ca3=C,9ca4=C,9ca5=C,9ca6=C,9ca7=C,9ca8=C,9ca9=C,9cab=C,9cad=C,9cae=C,9cb0=C,9cb1=C,9cb2=C,9cb3=C,9cb5=C,9cb6=C,9cb7=C,9cb8=C,9cbb=C,9cbd=C,9cbf=C,9cc1=C,9cc3=C,9cc4=C,9cc5=C,9cc6=C,9cc7=C,9cca=C,9ccc=C,9ccd=C,9cce=C,9ccf=C,'
+'9cd1=C,9cd2=C,9cd3=C,9cd4=C,9cd5=C,9cd6=C,9cd7=C,9cd8=C,9cd9=C,9cdb=C,9cdc=C,9cdd=C,9cde=C,9cdf=C,9ce2=C,9ce3=C,9cec=C,9cf0=J,9cfe=C,9d2b=J,9d30=J,9d34=C,9d46=J,9d47=J,9d48=J,9d64=J,9d6e=C,9d93=C,9da5=C,9dab=J,9dc0=C,9dc4=C,9dc9=C,9e0a=C,9e1f=C,9e20=C,9e21=C,9e22=C,9e23=C,9e25=C,'
+'9e26=C,9e27=C,9e28=C,9e29=C,9e2a=C,9e2b=C,9e2c=C,9e2d=C,9e2e=C,9e2f=C,9e30=C,9e31=C,9e32=C,9e33=C,9e35=C,9e36=C,9e37=C,9e38=C,9e39=C,9e3a=C,9e3b=C,9e3c=C,9e3d=C,9e3e=C,9e3f=C,9e41=C,9e42=C,9e43=C,9e44=C,9e45=C,9e46=C,9e47=C,9e48=C,9e49=C,9e4a=C,9e4b=C,9e4c=C,9e4f=C,9e50=C,9e51=C,'
+'9e52=C,9e55=C,9e56=C,9e57=C,9e58=C,9e59=C,9e5a=C,9e5b=C,9e5c=C,9e5e=C,9e61=C,9e63=C,9e64=C,9e65=C,9e66=C,9e67=C,9e68=C,9e69=C,9e6a=C,9e6b=C,9e6c=C,9e6d=C,9e6f=C,9e70=C,9e73=C,9e7e=C,9e91=J,9ea6=C,9eaf=C,9eb8=C,9ebd=C,9ebf=J,9ec9=C,9ee1=C,9ee9=C,9efe=C,9f0b=C,9f0d=C,9f21=J,9f50=C,'
+'9f51=C,9f7f=C,9f80=C,9f83=C,9f84=C,9f85=C,9f86=C,9f87=C,9f88=C,9f89=C,9f8a=C,9f8b=C,9f8c=C,9f99=C,9f9a=C,9f9b=C,9f9f=C,fa0f=J,fa13=J,fa20=J,fa21=J,fa24=J,fa29=J',1,16);
//	HKEY_CLASSES_ROOT\MIME\Database\Charset
//	將gb排在Big5前面是因為gb常用字在Big5中常常是0x8000之後的常用字，Big5常用字卻常常是gb中奇怪字碼與罕用字
setObjValue('autodetectEncodeCode','GB2312=3000,Big5=3000,shift_jis=900,iso-8859-1=2000',1);


TODO:
只檢測常用的幾個字，無法判別才廣泛測試。
*/
//var FN='I:\\Documents and Settings\\kanashimi\\My Documents\\kanashimi\\www\\cgi-bin\\game\\sjis.txt',enc=autodetectEncode(FN);alert('['+enc+'] '+FN+'\n'+_.read_file(FN,enc).slice(0,900));
/*	自動判別檔案（或字串）之編碼	文字エンコーディング判定を行う
	http://www.hawk.34sp.com/stdpls/dwsh/charset_adodb.html
	http://www.ericphelps.com/q193998/
	http://hp.vector.co.jp/authors/VA003334/ado/adostream.htm
*/
//autodetectEncode[generateCode.dLK]='is_file,simpleFileDformat,_.open_file,autodetectStringEncode,autodetectHTMLEncode';
_// JSDT:_module_
.
autodetectEncode=function(FN,isHTML){
 var t,code;
 if(typeof ActiveXObject=='undefined'){alert("autodetectEncode: Can't find ActiveXObject!");return;}
 //if(typeof autodetectHTMLEncode!='function')isHTML=false;
 if(!is_file(FN))return FN.length<64?simpleFileDformat:(t=autodetectStringEncode(FN))?t:(isHTML||typeof isHTML=='undefined')&&(t=autodetectHTMLEncode(FN))?t:simpleFileDformat;
 _.open_file(FN,'iso-8859-1');	//	讀 binary data 用 'iso-8859-1' 會 error encoding.
 if(!AdoEnums||!AdoStream)return simpleFileDformat;
 AdoStream.LoadFromFile(FN);
 t=AdoStream.ReadText(3);//Read(3);//
 //alert(FN+'\n'+t.charCodeAt(0)+','+t.charCodeAt(1)+','+t.charCodeAt(2));

 //if(typeof t!='string')return simpleFileDformat;//t=''+t;	//	此時type通常是unknown，不能用+=
 //	Unicode的Byte Order Mark(BOM)在UTF-16LE(little endian)裏，它是以FF-FE這兩個bytes表達，在BE(big endian)裏，是FEFF。而在UTF-8裏，它是以EF-BB-BF這三個bytes表達。
 if(t.slice(0,2)=='\xFF\xFE')code='unicodeFFFE';
 else if(t.slice(0,2)=='\xFE\xFF')code='unicode';
 else if(t=='\xEF\xBB\xBF')code='UTF-8';
 else{
  // 即使是用OpenTextFile(_.open_format.TristateFalse)，UTF-8還是會被轉換而判別不出來。
  //	from http://www.hawk.34sp.com/stdpls/dwsh/charset_adodb.html
  var l,codes={},reg=new RegExp(),stream=new ActiveXObject("ADODB.Stream");
  codes['iso-8859-1']='[\\x09\\x0a\\x0d\\x20-\\x7e]';
  codes['big5']=codes['iso-8859-1']+
	'|[\\xa4-\\xc6\\xc9-\\xf9][\\x40-\\xfe]';	//	http://www.cns11643.gov.tw/web/word/big5/index.html
  codes['shift_jis']=codes['iso-8859-1']+
	'|[\\x81-\\x9f\\xe0-\\xef\\xfa-\\xfc][\\x40-\\x7e\\x80-\\xfc]|[\\xa1-\\xdf]';	//	http://hp.vector.co.jp/authors/VA013241/misc/shiftjis.html
  codes['euc-jp']=codes['iso-8859-1']+
	'|\\x8f[\\xa1-\\xfe][\\xa1-\\xfe]|[\\xa1-\\xfe][\\xa1-\\xfe]|\\x8e[\\xa1-\\xdf]';
  codes['utf-8']=codes['iso-8859-1']+
	'|[\\xc0-\\xdf][\\x80-\\xbf]|[\\xe0-\\xef][\\x80-\\xbf]{2}|[\\xf0-\\xf7][\\x80-\\xbf]{3}'+
	'|[\\xf8-\\xfb][\\x80-\\xbf]{4}|[\\xfc-\\xfd][\\x80-\\xbf]{5}';
  codes['gb2312']=codes['iso-8859-1']+	//	GBK
	'|[\\xa1-\\xf7][\\xa1-\\xfe]';	//	http://zh.wikipedia.org/wiki/GB_18030	http://zh.wikipedia.org/wiki/GB_2312

  stream.type=AdoEnums.adTypeBinary;
  stream.open();
  stream.loadFromFile(FN);
  stream.position=0;
  t=stream.read();
  stream.close();
  stream=null;

  t=translate_AdoStream_binary_data(t,4e3);

  for(var _e in codes){
   reg=new RegExp('^(?:'+codes[_e]+')');
   var l=0,s=t;
   while(l!=s.length)l=s.length,s=s.replace(reg,"");
   if(s==""){code=_e;break;}
  }

 }
 //sl('autodetectEncode: coding: ['+code+'] in parse 1.');

 //	假如是HTML檔，判斷是否有charset設定。這個判別放在unicode之後，其他自動判別之前。
 if(isHTML||typeof isHTML=='undefined'&&/\.s?html?$/i.test(FN)){
  if(AdoStream.Type==AdoEnums.adTypeBinary)_.open_file(FN,'iso-8859-1');
  AdoStream.Position=0,AdoStream.Charset='iso-8859-1';	//	讀 binary data 用 'iso-8859-1' 會 error encoding.
  if(t=autodetectHTMLEncode(AdoStream.ReadText(4e3)))code=t;
 }
 //sl('autodetectEncode: coding: ['+code+'] in parse 2.');

 //autodetectEncodeCode.GB2312=900000;	// 4 test
 if(!code)for(var i in autodetectEncodeCode){
  if(AdoStream.Type==AdoEnums.adTypeBinary)_.open_file(FN,'iso-8859-1');
  if(AdoStream.Position=0,i==autodetectStringEncode(AdoStream.ReadText(autodetectEncodeCode[AdoStream.Charset=i]))){code=i;break;}
 }

 AdoStream.Close();
 return code||simpleFileDformat;	//	ascii=iso-8859-1,_autodetect,_autodetect_all
};

/**
 * 判斷HTML檔是否有charset設定
 * @param file_contents	file contents
 * @returns
 */
function autodetectHTMLEncode(file_contents) {
	var m;
	if ((m = file_contents.match(/<meta\s+([^>]+)>/i))
			&& (m = m[1].match(/content="([^"]+)"/i) || m[1].match(/content=([^\w]+)/i))
			&& (m = m[1].match(/charset=([\w-]{2,})/i))
			|| (m = file_contents.match(/<\?xml\s[^>]+\sencoding\s*=\s*["']([a-z\d\-]+)["']/i)))
		return m[1];
};

_// JSDT:_module_
.
/**
 * 靠常用字自動判別字串之編碼	string,預設編碼
 */
autodetectStringEncode=function(str){
 if(typeof str!='string'||!(str=str.replace(/\s+/g,'')))return;
 var len=str.length,i=0,c,a,kana=0,jianhuazi=0,halfwidthKatakana=0,Hangul=0,ascii=0,asciiHigh=0,kanji=0,kokuji=0,symbol=0,unknown=0;
 //if(len>9000)len=9000;
 //var unknownC='';

 //	char分類
 for(;i<len;i++)
  if(c=str.charCodeAt(i),c<0x80)ascii++;
  else if(c<0x100)asciiHigh++;
  else if(c>0x3040&&c<0x30ff)kana++;
  else if(c==0x30fb||c>0xff65&&c<0xff9e)halfwidthKatakana++;
  else if(c>=0x1100&&c<0x11fa||c>=0xac00&&c<0xad00||c>=0xd700&&c<0xd7a4)Hangul++;
  else if(c>0x4dff&&c<0x9fa6){kanji++,a=autodetectEncodeSP[c];if(a=='C')jianhuazi++;else if(a=='J')kokuji++;}
  else if(c>0xfa00&&c<0xfa6b){if(autodetectEncodeSP[c]=='J')kokuji++;}
  else if(c>0x2010&&c<0x2610||c>=0xfe30&&c<0xfe70||c>0xff00&&c<0xff5f)symbol++;
  else if(c>=0x3000&&c<0x3400||c>0x33ff&&c<0x4db6)
   if(autodetectEncodeSP[c]=='J')kokuji++;else symbol++;
  else unknown++;//,unknownC+=str.charAt(i);

 //alert('len='+len+'\nkana='+kana+'\nkokuji='+kokuji+'\njianhuazi='+jianhuazi+'\nhalfwidthKatakana='+halfwidthKatakana+'\nHangul='+Hangul+'\nascii='+ascii+'\nasciiHigh='+asciiHigh+'\nkanji='+kanji+'\nsymbol='+symbol+'\nunknown='+unknown);
 //if(unknownC)alert('unknown:\n'+unknownC.slice(0,200));//alert(unknownC.slice(0,200)+'\n'+str.slice(0,1000));
 //	依各種常用字母之條件判別
 return ascii+asciiHigh==len?'iso-8859-1'
	:unknown>.05*(len-ascii)?''//unicode	//	unknown不能太多
	:kana>.2*len&&kanji+kana+symbol>3*halfwidthKatakana?'shift_jis'
	:kanji+symbol>.7*(len-ascii)&&kana<.05*(len-ascii)?	jianhuazi>.1*kanji?'GB2312':'Big5'
	:Hangul+symbol>.7*(len-ascii)?'korean'//ks_c_5601
	:kanji>.2*(len-ascii)?	jianhuazi>.1*kanji?kokuji>.02*kanji?'unicode':'GB2312':kokuji>.02*kanji?'shift_jis':'Big5'
	:'';//unicode
};

/*
http://bbs.ee.ntu.edu.tw/boards/Linux/7/9/58.html	http://libai.math.ncu.edu.tw/~shann//Chinese/big5.html	http://wiki.debian.org.tw/index.php/Big5Variants	http://leoboard.cpatch.org/cgi-bin/topic.cgi?forum=20&topic=64&changemode=1
http://www.theorem.ca/~mvcorks/cgi-bin/unicode.pl.cgi?start=F900&end=FAFF	http://homepage1.nifty.com/nomenclator/unicode/normalization.htm

Unicode的漢字大致是以康熙部首排序，不過間中有部分字排錯部首筆劃
第一批在1993年加進Unicode的，
於中國內地、台灣、南韓及日本已有字集的漢字，
編碼於U+4E00至U+9FA5，
亦有部分南韓重覆漢字被編到U+F900至U+FA0B、
兩個Big-5重覆漢字被編到U+FA0C至U+FA0D、
日本廠商漢字被編到U+FA0E至U+FA2D

全形符號（只限鍵盤上那94個）位於U+FF01至U+FF5E
中日韓專用符號放到了U+3000至U+33FF內，
其餘有部分符號放到了U+2XXX及U+FE30至U+FE6F

第二批在1999年加進Unicode的，
加進了新加坡用漢字、南韓PKS C 5700-2 1994、
部分CNS11643第三、四、十五字面等用字、
未包括在第一批字的數個GB字集用字，
被編入U+3400至U+4DB5

第三批在2001年加進Unicode的，
加進了CNS11643第三、四、五、六、七、十五字面所有字、
香港增補字集用字、四庫全書、辭海、辭源、康熙字典、
漢語大字典、漢語大詞典內的所有用字，
被編入U+20000至U+2A6D6
JIS-X0213漢字被加到U+FA30至U+FA6A
CNS11643重覆漢字被加到U+2F800至U+2FA1D

简化字总表	http://cdns.twnic.net.tw/cjktable/	http://www.sxyw.cn/YuWenGongZuo/gfzs22.htm	http://huayuqiao.org/articles/xieshiya/Simplified/6_XinJiaPoTiaoZhengJianTiZi-XP.htm	http://www.hk-place.com/vp.php?board=2&id=333-9
简化字分布似乎並無規範，只好以array判斷:

<div id="dataGB">
http://cdns.twnic.net.tw/cjktable/simtab.html
簡化字總表之 UNICODE 碼表
</div>
<div id="dataJP">
http://homepage2.nifty.com/TAB01645/ohara/index_j2.htm
JIS区点索引
</div>

<script type="text/javascript">
var i=0,c=0,autodetectEncodeSP=[],m=document.getElementById('dataGB').innerHTML.match(/\([0-9A-F]{4},\w*\)/g),t="setObjValue('autodetectEncodeSP','";
for(;i<m.length;i++)//if(m[i].indexOf('C')!=-1&&m[i].slice(m[i].indexOf(',')+1).indexOf('T')==-1)t+=m[i].substr(1,5);
 if(m[i].indexOf('T')==-1)autodetectEncodeSP[parseInt(m[i].substr(1,4),16)]='C';
for(i=0,m=document.getElementById('dataJP').innerHTML.match(/【.】/g);i<m.length;i++)
 autodetectEncodeSP[parseInt(m[i].charCodeAt(1))]=autodetectEncodeSP[parseInt(m[i].charCodeAt(1))]?0:'J';

m=[];for(i in autodetectEncodeSP)m.push(parseInt(i));m.sort();
for(i=0;i<m.length;i++)if(autodetectEncodeSP[m[i]]){t+=m[i].toString(16)+'='+autodetectEncodeSP[m[i]]+',',c++;if(c%40==0)t+="'<br/>+'";}
alert(c+'字');
document.getElementById('dataJP').innerHTML='';
document.getElementById('dataGB').innerHTML=t.slice(0,-1)+"',1,16);";
</script>


和製漢字(国字)は、和語(ﾔﾏﾄｺﾄﾊﾞ)に相当する漢字が無い場合に新規につくられたもので、奈良時代から作られた。ほとんどは訓読みしかない。魚篇や木篇が多い。
http://homepage2.nifty.com/TAB01645/ohara/index.htm
http://zh.wiktionary.org/wiki/%E8%BE%BB
http://www.unicode.org/cgi-bin/GetUnihanData.pl?codepoint=8fbb
http://jprs.jp/doc/rule/saisoku-1-wideusejp-furoku-4.html
http://m2000.idv.tw/informer/zhi/char-root.htm
http://www.ajisai.sakura.ne.jp/~dindi/chrc/ref/wincode2.txt
http://cs-people.bu.edu/butta1/personal/hkscs/hkscs-oct.html
http://www.nobi.or.jp/i/kotoba/kanji/wasei-kanji.html
http://www.melma.com/mag/52/m00011552/a00000066.html


韓語字母/諺文
http://www.sinica.edu.tw/~cytseng/Korean%20reader/hangul.htm
http://www.unicode.org/charts/normalization/

old:
//	自動判別檔案（或字串）之編碼
function autodetectEncode(FN){
 if(!is_file(FN))return FN.length>64?autodetectStringEncode(FN):simpleFileDformat;
 _.open_file(FN,'iso-8859-1');
 if(!AdoEnums)return simpleFileDformat;
 //AdoStream.Type=AdoEnums.adTypeBinary;
 AdoStream.LoadFromFile(FN);
 var t=AdoStream.ReadText(3),code;
 //	Unicode的Byte Order Mark(BOM)在UTF-16LE(little endian)裏，它是以FF-FE這兩個bytes表達，在BE(big endian)裏，是FEFF。而在UTF-8裏，它是以EF-BB-BF這三個bytes表達。
 if(t.slice(0,2)=='\xFF\xFE')code='unicodeFFFE';
 if(t.slice(0,2)=='\xFE\xFF')code='unicode';
 if(t=='\xEF\xBB\xBF')code='UTF-8';
 if(code){AdoStream.Close();return code;}

 if(!code){
  //	將sjis排在gb與Big5前面是因為sjis常符合gb，且sjis之判定相當嚴。
  if(!code)AdoStream.Position=0,AdoStream.Charset='shift_jis',code=autodetectStringEncode(AdoStream.ReadText(900),AdoStream.Charset);
  //	將gb排在Big5前面是因為gb常用字在Big5中常常是0x8000之後的常用字，Big5常用字卻常常是gb中奇怪字碼與罕用字
  if(!code)AdoStream.Position=0,AdoStream.Charset='GB2312',code=autodetectStringEncode(AdoStream.ReadText(2000),AdoStream.Charset);
  if(!code)AdoStream.Position=0,AdoStream.Charset='Big5',code=autodetectStringEncode(AdoStream.ReadText(2000),AdoStream.Charset);
 }

 AdoStream.Close();
 return code||simpleFileDformat;	//	ascii=iso-8859-1,_autodetect,_autodetect_all
}
//	靠常用字自動判別字串之編碼	string,預設編碼
function autodetectStringEncode(str,dcode){
 var code;
 if(str.length>9000)str=str.slice(0,9000);

 //	將sjis排在gb與Big5前面是因為sjis常符合gb，且sjis之判定相當嚴。
 if(dcode=='shift_jis'||!dcode&&!code){
  //	http://www.asahi-net.or.jp/~hc3j-tkg/unicode/	http://www.unicode.org/Public/UNIDATA/DerivedCoreProperties.txt
  var i=0,c,k=0,u=0,h=0;//h_=u_=k_='';
  for(;i<str.length;i++)if(c=str.charCodeAt(i),c>0xFF)
	if(c==0x30FB||c>0xFF65&&c<0xFF9E)h++;//,h_+=str.charAt(i);//||c==0xE134	//	HALFWIDTH KATAKANA LETTER等可能不是日文文件中會出現的char
	else if(c>0x3040&&c<0x30FF)k++;//,k_+=str.charAt(i);	//	kana
	else u++;//,u_+=str.charAt(i);	//	unknown kanji
  //alert(k+','+u+','+h+'\n*'+k_+'\n*'+u_+'\n*'+h_);//alert(u_.charCodeAt(2));
  if(k+u>2*h)code='shift_jis';	//	HALFWIDTH KATAKANA LETTER數目比漢字少時判別為shift_jis
 }

//	將gb排在Big5前面是因為gb常用字在Big5中常常是0x8000之後的常用字，Big5常用字卻常常是gb中奇怪字碼與罕用字
 if(dcode=='Big5'||dcode=='GB2312'||!dcode&&!code){
  var i=0,c,k=0,u=0;//k_=u_='';
  for(;i<str.length;i++)if(c=str.charCodeAt(i),c>0xFF)
	if(c>0x4DFF&&c<0x9FA6||c>0xFF00&&c<0xFF5F||c>0x33ff&&c<0x4DB6||c==0x2605||c==0x2606)k++;//,k_+=str.charAt(i);	//	2605,6:★☆
	else u++;//,u_+=str.charAt(i);
  //alert(k+','+u+'\n'+k_+'\n*'+u_);
  if(k>5*u)code=dcode||'Big5';	//	漢字比不認識的字多時判定
 }

 if(dcode=='iso-8859-1'||dcode=='ascii'||!dcode&&!code){
 }

 return code;
}
*/


/*	將 iso-8859-1 轉成utf-8
To use:
..
translated=turnBinStr(original);
..
translated=turnBinStr();	//	delete temp file
*/
turnBinStr.temp_file = 'turnBinStr.tmp'; // temp file name
function turnBinStr(t, _enc) {
	if (typeof t != 'undefined') {
		if (!turnBinStr.tmpF)
			turnBinStr.tmpF = getFP(turnBinStr.temp_file, 1);

	//t+='';
	//if(t.replace(/[^\x00-\x7f]+/g,''))return t;
	//var _q=t.replace(/[^?]+/g,'').length,_t,_j=0;
	_.write_file(turnBinStr.tmpF,''+t,'iso-8859-1');
	//alert(turnBinStr.tmpF+'\n'+simpleFileErr.description+'\n'+t+'\n'+_.read_file(turnBinStr.tmpF,'utf-8'));
	return _.read_file(turnBinStr.tmpF,'utf-8');
/*
  if(!_enc)_enc='utf-8,Big5,shift_jis,euc-jp,GB2312'.split(',');
  else if(!(_enc instanceof Array))_enc=[_enc];
  for(;_j<_enc.length;_j++)
   if((_t=_.read_file(turnBinStr.tmpF,_enc[_j])).replace(/[^?]+/g,'').length==_q)
    return _t;//'['+_enc[_j]+']'+
  return t;
*/
	}
	// 有時會出錯
	try {
		fso.DeleteFile(turnBinStr.tmpF);
	} catch (e) {
	}
}





//folder_info[generateCode.dLK]='initialization_WScript_Objects';
//	需同時修改if(traverseSubDirectory==folder_info.f.noNewObj)段落之return!

//setObjValue('folder_info.f','noNewObj=-1,files,dirs,fsize,size,Tsize=3,Tfiles,Tdirs',1);
_// JSDT:_module_
.
/**
 * Get the infomation of folder
 * @param folder_path	folder path
 * @param file_filter
 * @param traverseSubDirectory
 * @return
 * @example
 * var finfo=new folder_info(path or folder object,extFilter,0/1);
 * @deprecated	以 <a href="#.traverse_file_system">traverse_file_system</a> 代替
 * @_memberOf	_module_
 */
folder_info=function(folder_path,file_filter,traverseSubDirectory){
 var dir,filesCount,subDirectorysCount,total_size_of_files,total_size_of_this_folder,total_filesCount,total_subDirectorysCount;
 filesCount=subDirectorysCount=total_size_of_files=total_size_of_this_folder=total_filesCount=total_subDirectorysCount=0;
 if(typeof traverseSubDirectory=='undefined')traverseSubDirectory=1;

 if(typeof folder_path=='object')dir=folder_path;
 else if(folder_path){
  if(!folder_path.slice(-1)!=path_separator)folder_path+=path_separator;
  try{dir=fso.GetFolder(folder_path);}catch(e){dir=0;}
 }

 if(dir){
  total_subDirectorysCount=subDirectorysCount=dir.SubFolders.Count;
  var i,t,f=new Enumerator(dir.SubFolders);
  if(traverseSubDirectory||traverseSubDirectory==folder_info.f.noNewObj)for(;!f.atEnd();f.moveNext()){
   i=f.item();
   t=folder_info(i,file_filter,folder_info.f.noNewObj);
   //alert(i.path+'\n'+t[folder_info.f.size]+','+t[folder_info.f.Tfiles]+','+t[folder_info.f.Tdirs]);
   total_size_of_this_folder+=t[folder_info.f.size];
   total_filesCount+=t[folder_info.f.Tfiles];
   total_subDirectorysCount+=(t[folder_info.f.Tdirs]||0);
  }

  //alert(dir.files.Count+'\n'+total_filesCount);
  total_filesCount+=(filesCount=dir.files.Count);
  f=new Enumerator(dir.files);
  for(;!f.atEnd();f.moveNext()){
   i=f.item();
   if(file_filter&&!file_filter.test(i.name))continue;
   //if(traverseSubDirectory!=folder_info.f.noNewObj)alert(i.name+': '+i.size+' / '+total_size_of_files);
   total_size_of_files+=i.size;
  }

  total_size_of_this_folder+=total_size_of_files;
 }

 //alert(dir.path+'\nfile filter: '+file_filter+'\n'+filesCount+','+subDirectorysCount+','+total_size_of_files+','+total_size_of_this_folder+','+total_filesCount+','+total_subDirectorysCount);
 if(traverseSubDirectory==folder_info.f.noNewObj)
  return [filesCount,subDirectorysCount,total_size_of_files,total_size_of_this_folder,total_filesCount,total_subDirectorysCount];

 this.files=this[folder_info.f.files]=filesCount;
 this.dirs=this[folder_info.f.dirs]=subDirectorysCount;
 this.fsize=this[folder_info.f.fsize]=total_size_of_files;
 this.size=this[folder_info.f.size]=total_size_of_this_folder;
 this.Tfiles=this[folder_info.f.Tfiles]=total_filesCount;
 this.Tdirs=this[folder_info.f.Tdirs]=total_subDirectorysCount;
 return this;
};
_// JSDT:_module_
.
/**
 * <a href="#.folder_info">folder_info</a> 的 flag enumeration
 * @_memberOf	_module_
 * @constant
 */
folder_info.f = {
		noNewObj : -1,
		files : 0,
		dirs : 1,
		fsize : 2,
		size : 3,
		Tsize : 3,
		Tfiles : 4,
		Tdirs : 5
};


/*	list files of folder	改編自 folder_info()
	var files=new listFile(path or folder object,extFilter,flag);

*/
//listFile[generateCode.dLK]='initialization_WScript_Objects';
//	需同時修改if(flag==listFile.f.noNewObj)段落之return!

//setObjValue('listFile.f','ignoreCase=1',1);
listFile.f={
	ignoreCase:1
};

function listFile(folder_path, file_filter, flag) {
	var files = [];
	if (typeof flag == 'undefined')
		flag = 0;

	if (typeof folder_path == 'object')
		dir = folder_path;
	else if (folder_path) {
		if (!folder_path.slice(-1) != path_separator)
			folder_path += path_separator;
		try {
			dir = fso.GetFolder(folder_path);
		} catch (e) {
			dir = 0;
		}
	}

	if (dir) {
		var i, f = new Enumerator(dir.files);
		for (; !f.atEnd(); f.moveNext()) {
			i = f.item();
			if (file_filter && !file_filter.test(i.name))
				continue;
			files.push(i.name);
		}
	}

	return files;
};






/*
in UNIX:
iconv -l
iconv -c -f UTF-16 -t BIG5-HKSCS function.js

*/
_// JSDT:_module_
.
/**
 * 將編碼為fromCode之檔案fileName中所有不合編碼toCode之char以encodeFunction轉換
 * @param fileName
 * @param toCode
 * @param fromCode
 * @param encodeFunction
 * @return
 * @_memberOf	_module_
 */
iconv_file = function(fileName, toCode, fromCode, encodeFunction) {
	return iconv(_.read_file(fileName, fromCode), toCode,
			encodeFunction);
};

_// JSDT:_module_
.
/*	將string text中所有不合編碼toCode之char以encodeFunction轉換
convert string encoding<br/>

CeL.iconv('測試每個字元 abc あaいiうuえeおo','Big5')

TODO:
一次寫入多 bytes
*/
//var iconvError=[];
iconv=function(text, toCode, encodeFunction) {
	if (!text)
		return '';

	// alert('iconv: ['+toCode+']\n'+text.slice(0,200));
	if (/utf-?(8|16([bl]e)?)/i.test(toCode))
		//	skip Unicode
		return HTMLToUnicode(text, 1);

	if (_.open_file(0, toCode || simpleFileDformat) !== 0){
		//	error occurred
		iconvError = simpleFileErr;
		CeL.log(iconvError.message);
		return text;
	}

	// AdoStream.Type=AdoEnums.adTypeText;
	if (!encodeFunction)
		encodeFunction =
			// typeof toHTML ==='function' ? totoHTML:
			function(t) {
				return '\\u' + t.charCodeAt(0);
			};
	// iconvError=[];

	var charToSet, i = 0, t = '';
	//	測試每個字元
	for (; i < text.length; i++)
		try {
			charToSet = text.charAt(i);
			if (charToSet.charCodeAt(0) < 256) {
				//	對於 code 過小的，直接匯入以增加速度。
				t += charToSet;
				continue;
			}
			AdoStream.Position = 0;
			AdoStream.WriteText(charToSet);
			AdoStream.Position = 0;
			t += charToSet == AdoStream.ReadText(AdoEnums.adReadAll) ? charToSet
					: encodeFunction(charToSet);
		} catch (e) {
			//iconvError.push(e.description);
			t += encodeFunction(charToSet);
		}

	try {
		AdoStream.Close();
	} catch (e) {
	}
	return t;
};



//---------------------------------------------------


/*
var driverProperty,folderProperty,fileProperty;
setObjValue('driverProperty','AvailableSpace,DriveLetter,DriveType,FileSystem,FreeSpace,IsReady,Path,RootFolder,SerialNumber,ShareName,TotalSize,VolumeName',1,setObjValueFlag.array);
setObjValue('folderProperty','Attributes,DateCreated,DateLastAccessed,DateLastModified,Drive,Name,ParentFolder,Path,ShortName,ShortPath,Size,Type,Files,IsRootFolder,SubFolders',1,setObjValueFlag.array);//Files起為Folder property
fileProperty=folderProperty.slice(0,12);//folderProperty.sort();
*/


//var kkk='';_.traverse_file_system(function(fileItem,itemType){kkk+=(itemType==_.traverse_file_system.f.driver?fileItem.DriveLetter+':('+fileItem.VolumeName+')':fileItem.Name+(itemType==_.traverse_file_system.f.folder?path_separator:''))+'\n';},'I:\\Documents and Settings\\kanashimi\\My Documents\\kanashimi\\www\\cgi-bin\\program');_.write_file('tmp.txt',kkk,'unicode');
/*

_.traverse_file_system(FS_function_array)	省略path會當作所有Drives
_.traverse_file_system(FS_function_array,'c:')	c:→c:\→sub dir of c:\
_.traverse_file_system(FS_function_array,'c:\\')	c:\→sub dir of c:\
_.traverse_file_system(FS_function_array,'c:\\cc')	c:\cc,cc為dir→sub dir of c:\cc\
_.traverse_file_system(FS_function_array,'c:\\cc\\')	c:\cc\→sub dir of c:\cc\
_.traverse_file_system(FS_function_array,['c:\\cc\\','d:\\dd'])	c:\cc\→sub dir of c:\cc\→d:\dd→sub dir of d:\dd
_.traverse_file_system([,folderFunction],'.');


_.traverse_file_system([,folderFunction],basePath);
function folderFunction(folderItem){
 t=folderItem.Path.slice(same_length(basePath,folderItem.Path));
 //if(t==folderItem.Name)	//	僅單層subdir次目錄
 //if(t.indexOf(path_separator)==t.lastIndexOf(path_separator))	//	僅單層及次層subdir次目錄
 if(t.replace(new RegExp('[^'+path_separator_RegExp+']','g'),'').length<3)	//	僅3層subdir以下
  ;
}


//	itemType=0:file/1:folder/2:driver
function fsoFunction(fsi,itemType){if(!itemType){}}
function fileFunction(fileItem){}
function folderFunction(folderItem){}
function driverFunction(driverItem){}

filter:
	file_filter	僅單一 filter 時預設當作 file_filter, should has NO global flag.
	[file_filter,folder_filter]
file_filter	篩選檔案, should has NO global flag.
folder_filter	篩選資料夾, should has NO global flag.


tip:
使用相對路徑，如'..'開頭時需用getFP()調整過。
用folder.Size==0可判別是否為empty folder

TODO:
限定traverse深度幾層,sort=8,preOrder=0,widthFirst=0,postOrder=16,depthFirst=16
*/
//_.traverse_file_system.stop=false;

//_.traverse_file_system[generateCode.dLK]='initialization_WScript_Objects';
_// JSDT:_module_
.
/**
 * 巡覽 file system 的公用函數
 * @param FS_function_array	file system handle function array
 * @param path	target path
 * @param filter	filter
 * @param flag	see <a href="#.traverse_file_system.f">flag</a>
 * @return
 * @_memberOf	_module_
 * @see	<a href="http://msdn.microsoft.com/library/en-us/script56/html/0fa93e5b-b657-408d-9dd3-a43846037a0e.asp">FileSystemObject</a>
 */
traverse_file_system = function traverse_file_system(FS_function_array, path, filter, flag) {
	var _s = _.traverse_file_system, _f = _s.f;

	// initial
	// 預設 flag
	// if(isNaN(flag))flag=_f.traverse;

	//library_namespace.log('traverse_file_system:\n[' + path + ']');
	if (FS_function_array === _f.get_object)
		// or FS_function_array=[,,]:	可以使用 Array 常值中的空白元素來建立零星稀疏的陣列。
		FS_function_array = new Array(_f.func_length),
		flag = _f.get_object;
	else {
		/*
		if (FS_function_array instanceof Array && FS_function_array.length == 1)
			FS_function_array = FS_function_array[0];
		*/
		if (typeof FS_function_array === 'function') {
			var i = FS_function_array;
			FS_function_array = [ i, i, i ];
		}
	}
	//library_namespace.log('traverse_file_system: fso:\n[' + fso + ']');
	if (typeof fso !== 'object' || !(FS_function_array instanceof Array)
			|| !FS_function_array.length)
		return;
	//library_namespace.log('traverse_file_system: FS_function_array:\n[' + FS_function_array + ']');
	if (!filter)
		filter = [];
	else if (filter instanceof RegExp)
		// filter=[filter,filter]; 通常我們輸入的只會指定 file filter
		filter = [ filter, ];
	else if (typeof filter !== 'object')
		filter = [ filter, ];

	//library_namespace.log('traverse_file_system: FS_function_array:\n[' + FS_function_array + ']');
	var item, iType, fc, i, traverse = !(flag & _f.no_traverse), objBuf = [], typeBuf = [], folder_filter = filter[1], testFilter = function(
			f) {
		try {
			// f instanceof RegExp
			f.test('');
		}
		catch (e) {
			// throw new Error(e.number,'traverse_file_system: 錯誤的 filter:\n'+f+'\n'+e.description);
			e.description = 'traverse_file_system: 錯誤的 filter:\n' + f + '\n'
			+ e.description;
			throw e;
		}
	};
	if (filter = filter[0])
		if (typeof filter === 'string')
			filter = new RegExp(filter);
		else
			testFilter(filter);
	if (folder_filter)
		if (typeof folder_filter === 'string')
			folder_filter = new RegExp(folder_filter);
		else
			testFilter(folder_filter);
	// if(flag!=_f.get_object)alert(filter+'\n'+folder_filter);
	// 至此 filter 代表 file_filter, vs. folder_filter


	// 轉換輸入之各項成fso object
	if (!path) { // 取得各個driver code
		if (flag === _f.get_object)
			return;
		for ( var drivers = new Enumerator(fso.Drives); !drivers.atEnd(); drivers
		.moveNext())
			objBuf.push(drivers.item()), typeBuf
			.push(_f.driver);
		objBuf.reverse(), typeBuf.reverse();
	} else if (typeof path === 'object')
		if (path.length) {
			for (i = 0; i < path.length; i++)
				if (item = _s(_f.get_object,
						'' + path[i], filter, flag))
					objBuf.push(item[0]), typeBuf.push(item[1]);
		} else {
			item = typeof path.IsReady !== 'undefined' ? _f.driver
					: typeof path.IsRootFolder !== 'undefined' ? _f.folder
							: typeof path.Path !== 'undefined' ? _f.file
									: _f.NULL;
			if (_f.NULL != -1)
				objBuf.push(path), typeBuf.push(item);
		}
	else {
		i = true; // fault
		if (i)
			try {
				objBuf.push(fso.GetFolder(path)), typeBuf
				.push(_f.folder), i = false;
			} catch (e) {
			}// fso.FolderExists()
			if (i)
				try {
					objBuf.push(fso.GetFile(path)), typeBuf
					.push(_f.file), i = false;
				} catch (e) {
				}// fso.FileExists()
				if (i && path == fso.GetDriveName(path))
					try {
						objBuf.push(fso.GetDrive(path)), typeBuf
						.push(_f.driver), i = false;
					} catch (e) {
					}
	}
	if (flag == _f.get_object)
		return objBuf[0] ? [ objBuf[0], typeBuf[0] ] : 0;

		// FS_function_array.length=_f.func_length;
		for (i = 0; i < _f.func_length; i++)
			// 可以安排僅對folder或是file作用之function
			if (typeof FS_function_array[i] !== 'function')
				FS_function_array[i] = function() {};
			//alert(objBuf.length+','+typeBuf.length+'\n'+typeBuf);
			// main loop
			while (!_s.stop && objBuf.length)
				if (item = objBuf.pop()) // fsoFunction執行途中可能將此項目刪除
					switch (iType = typeBuf.pop()) {
					case _f.folder:
						if (!folder_filter || folder_filter.test(item.Name))
							FS_function_array[iType](item, iType);
						// if(traverse||traverse!==0){
						// if(!traverse)traverse=0; // 加上次一層: 會連這次一層之檔案都加上去。
						if (traverse)
							for (fc = new Enumerator(item.SubFolders); !fc.atEnd(); fc
							.moveNext())
								if (i = fc.item(), !folder_filter
										|| folder_filter.test(i.Name))
									objBuf.push(i), typeBuf
									.push(_f.folder);
						// }
						// try 以防item已經被刪除
						try {
							fc = new Enumerator(item.Files);
						} catch (e) {
							fc = 0;
						}
						if (fc) {
							// for(;!fc.atEnd();fc.moveNext())if(i=fc.item(),!filter||filter.test(i.Name))FS_function_array[_f.file](i,_f.file);
							// 因為檔案可能因改名等改變順序，因此用.moveNext()的方法可能有些重複，有些漏掉未處理。
							for (item = []; !fc.atEnd(); fc.moveNext())
								item.push(fc.item());
							for (i in item)
								if (i = item[i], !filter || filter.test(i.Name))
									FS_function_array[_f.file](i,
											_f.file);
						}
						break;
					case _f.file:
						if (!filter || filter.test(item.Name))
							FS_function_array[iType](item, iType);
						break;
					case _f.driver:
						if (!item.IsReady)
							break;
						FS_function_array[iType](item, iType);
						if (traverse)
							objBuf.push(item.RootFolder), typeBuf
							.push(_f.folder);
						// break;
						//default:break;
					}

};


//setObjValue('traverse_file_system.f','get_object=-2,NULL=-1,file,folder,driver,func_length,traverse=0,no_traverse=4',1);//,sort=8,preOrder=0,widthFirst=0,postOrder=16,depthFirst=16
_// JSDT:_module_
.
/**
 * <a href="#.traverse_file_system">traverse_file_system</a> 的 flag enumeration
 * @_memberOf	_module_
 * @constant
 */
traverse_file_system.f =
traverse_file_system.f = {
		/**
		 * return object
		 * @_memberOf	_module_
		 */
		get_object : -2,
		/**
		 * null flag
		 * @private
		 * @_memberOf	_module_
		 */
		NULL : -1,
		/**
		 * 用於指示 file
		 * @private
		 * @_memberOf	_module_
		 */
		file : 0,
		/**
		 * 用於指示 folder
		 * @private
		 * @_memberOf	_module_
		 */
		folder : 1,
		/**
		 * 用於指示 driver
		 * @private
		 * @_memberOf	_module_
		 */
		driver : 2,
		/**
		 * handle function 應有的長度
		 * @private
		 * @_memberOf	_module_
		 */
		func_length : 3,
		/**
		 * 深入下層子目錄及檔案
		 * @_memberOf	_module_
		 */
		traverse : 0,
		/**
		 * 不深入下層子目錄及檔案
		 * @_memberOf	_module_
		 */
		no_traverse : 4
};




return (
	_// JSDT:_module_
);
}


);

