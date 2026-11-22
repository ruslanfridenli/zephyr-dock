const I18N={"en":{"editor":"Editor","preview":"Preview","sample":"sample","mdfile":".md","htmlfile":".html"},"de":{"editor":"Editor","preview":"Vorschau","sample":"beispiel","mdfile":".md","htmlfile":".html"}};
let lang=localStorage.getItem('lang')||'en';
const t=k=>I18N[lang][k]||k;
function applyLang(){document.documentElement.lang=lang;document.querySelectorAll('[data-i]').forEach(el=>el.textContent=t(el.dataset.i));document.querySelectorAll('.lang button').forEach(b=>b.classList.toggle('on',b.dataset.lang===lang));}
document.querySelectorAll('.lang button').forEach(b=>b.onclick=()=>{lang=b.dataset.lang;localStorage.setItem('lang',lang);applyLang();});

const $=id=>document.getElementById(id);
const F=String.fromCharCode(96);
const SAMPLE='# Hello markdown studio\n\nWrite **bold**, *italic*, ~~strike~~, '+F+'code'+F+', [links](https://example.com).\n\n## features\n\n- live preview\n- export .md or .html\n- tables, lists, quotes\n\n| col a | col b |\n|---|---|\n| 1 | 2 |\n\n> blockquote goes here\n\n'+F+F+F+'js\nconsole.log("code blocks too");\n'+F+F+F;
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function md(src){
  let h=esc(src);
  const fenceRe=new RegExp(F+F+F+'([\\w]*)\\n([\\s\\S]*?)'+F+F+F,'g');
  h=h.replace(fenceRe,(m,l,c)=>'<pre><code>'+c+'</code></pre>');
  const inlineRe=new RegExp(F+'([^'+F+']+)'+F,'g');
  h=h.replace(inlineRe,'<code>$1</code>');
  h=h.replace(/^###### (.*)$/gm,'<h6>$1</h6>').replace(/^##### (.*)$/gm,'<h5>$1</h5>').replace(/^#### (.*)$/gm,'<h4>$1</h4>').replace(/^### (.*)$/gm,'<h3>$1</h3>').replace(/^## (.*)$/gm,'<h2>$1</h2>').replace(/^# (.*)$/gm,'<h1>$1</h1>');
  h=h.replace(/^&gt; (.*)$/gm,'<blockquote>$1</blockquote>');
  h=h.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\*([^*]+)\*/g,'<em>$1</em>').replace(/~~([^~]+)~~/g,'<del>$1</del>');
  h=h.replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank">$1</a>');
  h=h.replace(/^\s*[-*] (.*)$/gm,'<li>$1</li>');
  h=h.replace(/(<li>[^<]*<\/li>\n?)+/g,m=>'<ul>'+m+'</ul>');
  h=h.replace(/\|(.+)\|\n\|[-| :]+\|\n((?:\|.*\|\n?)+)/g,(m,hdr,body)=>{
    const hs=hdr.split('|').filter(Boolean).map(c=>'<th>'+c.trim()+'</th>').join('');
    const rows=body.trim().split('\n').map(r=>'<tr>'+r.split('|').filter(Boolean).map(c=>'<td>'+c.trim()+'</td>').join('')+'</tr>').join('');
    return '<table><tr>'+hs+'</tr>'+rows+'</table>';});
  h=h.replace(/^---$/gm,'<hr>');
  h=h.split('\n\n').map(p=>/^<[a-z]/.test(p.trim())?p:'<p>'+p.replace(/\n/g,'<br>')+'</p>').join('\n');
  return h;
}
function render(){$('preview').innerHTML=md($('md').value);}
$('md').value=SAMPLE;$('md').addEventListener('input',render);
$('sample').onclick=()=>{$('md').value=SAMPLE;render();};
$('mdfile').onclick=()=>{const b=new Blob([$('md').value],{type:'text/markdown'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='document.md';a.click();};
$('htmlfile').onclick=()=>{const b=new Blob(['<!doctype html><meta charset="utf-8"><body style="font-family:sans-serif;max-width:760px;margin:40px auto">'+$('preview').innerHTML],{type:'text/html'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='document.html';a.click();};
render();applyLang();