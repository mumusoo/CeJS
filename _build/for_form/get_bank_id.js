/*	2008/7/26 2:7:49
	get bank id

	for net.form.bank_account
	running under work.hta

http://www.fisc.com.tw/FISCWeb/Main.aspx?No=&FC=B0900
財金資訊股份有限公司 資料下載 > 通匯系統

http://forum.andy88club.com.tw/showthread.php?t=404
http://www.trdo.gov.tw/html/finance_3.asp
https://www.myb2b.com.tw/ebank/RemitBankID.asp
http://59.120.154.177/bigeing/bank.htm
http://www.tpay.gov.tw/tpay/query_bank/query_bank.asp
http://www.post.gov.tw/post/internet/i_location/aon_list.jsp?search_type=prsb_no&keyword=&topage=1
http://www.post.gov.tw/post/internet/i_location/aon_list.jsp?search_type=prsb_no&keyword=&topage=50

財金資訊股份有限公司 便利查詢 通匯銀行代號查詢
http://www.fisc.com.tw/FISCWeb/ConvenientSearch/rm.asp?No=&FC=F0115
金融機構代號

金融機構類別性質
國內銀行
外商銀行
郵局
信用合作社
共用中心
農會
漁會
票卷金融公司
其他單位

http://www.fisc.com.tw/FISCWeb/ConvenientSearch/banklist.asp?BanKID=004



上面 data 是舊的，不過新的沒有帳號長度
setIEA();
IE.go('http://www.fisc.com.tw/FISCWeb/EasyQuery/RM_1Query.aspx?FC=F0117');

IE.fillForm({_txtQry:'000'},'btnQry1');
IE.getE('tb1')

"金融機構總代號","金融機構分支代號","總機構名稱","分支機構名稱","地址"

財政部臺北區支付處
http://www.trdo.gov.tw/mtn201/mtn201.asp


*/

//	parse table
function parseTable(h,l){
 if(!l)l=[];
 var d=document.createElement('div'),i=0,t,L,I;
 d.innerHTML=h;

 for(t=d.getElementsByTagName('tr');i<t.length;i++){
  L=[],I=t[i].firstChild;
  while(I)L.push(I.innerHTML.replace(/<\/?font[^>]*>/gi,'\n').replace(/<br\/?>/gi,'\n').replace(/[　\s\n]+$/g,'').replace(/^[　\s\n]+/g,'').replace(/\n/g,'\\n')),I=I.nextSibling;
  //sl('['+i+'/'+t.length+'] '+L);
  l.push(L);
 }

 return l;
}



var id=0,dir='bank',htm,l=[];

if(!fso.FolderExists(dir))fso.CreateFolder(dir);


for(;id<1000;id++){

htm=getPage('http://www.fisc.com.tw/FISCWeb/ConvenientSearch/banklist.asp?BanKID='+(id>99?'':id>9?'0':'00')+id,'big5');

//	總單位資訊
var a,b,c=htm.indexOf('代號'),d=[];
a=htm.slice(0,c).lastIndexOf('<table');
b=htm.indexOf('</table>',c)+'</table>'.length;
//sl(htm.slice(a,b).replace(/</g,'&lt;'),1);

a=htm.slice(a,b),htm=htm.slice(b);

parseTable(a,d);

a=d[d.length-1];
if(a.length==1&&a[0]=='查無相關資料')d.length-=2;
else l.push(d[d.length-1]);

//	相關分支單位資訊
c=htm.indexOf('代號');
a=htm.slice(0,c).lastIndexOf('<table');
b=htm.indexOf('</table>',c)+'</table>'.length;
//sl(htm.slice(a,b).replace(/</g,'&lt;'));


parseTable(htm.slice(a,b),d);

a=d[d.length-1];
if(a.length==1&&a[0]=='查無相關資料')d.length-=2;


if(d.length)
 a=l[l.length-1],sl(a[0]+' '+a[1]+': '+d.length+' lines.'),
 simpleWrite(dir+'/id'+(id>99?'':id>9?'0':'00')+id+'.csv',toCSV(d),'utf-8');

}

simpleWrite(dir+'/id.csv',toCSV(l),'utf-8');
