/* Insertar despues de los scripts de NodeSpace y antes de cerrar body.
   Corrige la vista previa; no modifica las notas ni el almacenamiento. */
(function(){
  'use strict';
  const style=document.createElement('style');
  style.textContent=`
  #note-preview{width:300px;max-width:calc(100vw - 24px);max-height:min(240px,calc(100dvh - 24px));overflow:hidden;background:rgba(4,20,38,.98);box-sizing:border-box;}
  #note-preview strong{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  #note-preview p{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:6;line-clamp:6;max-height:108px;overflow:hidden;white-space:pre-line;overflow-wrap:anywhere;line-height:18px;font-size:12px;margin:0;}
  #note-preview .preview-footer{display:block;font-size:10px;color:#6ba8bd;margin-top:9px;line-height:14px;}
  #notes-modal{height:min(760px,92dvh);max-height:92dvh;}
  #notes-editor{min-height:0;max-height:none;flex:1 1 auto;overflow:auto;overflow-wrap:anywhere;}
  #notes-toolbar{max-height:28dvh;overflow-y:auto;}
  `;
  document.head.appendChild(style);
  function extractText(html){
    const doc=new DOMParser().parseFromString(String(html||''),'text/html');
    doc.querySelectorAll('script,style,iframe,object').forEach(el=>el.remove());
    doc.querySelectorAll('br').forEach(el=>el.replaceWith('\n'));
    doc.querySelectorAll('p,div,li,h1,h2,blockquote').forEach(el=>el.append('\n'));
    return (doc.body.textContent||'').replace(/\r/g,'').split('\n').map(line=>line.trim()).filter(Boolean).join('\n');
  }
  showNotePreview=function(node,x,y){
    const box=document.getElementById('note-preview');if(!box)return;
    const text=extractText(node.notes);if(!text){box.style.display='none';return;}
    let title=box.querySelector('strong'),content=box.querySelector('p'),footer=box.querySelector('.preview-footer');
    if(!title){title=document.createElement('strong');box.appendChild(title);}
    if(!content){content=document.createElement('p');box.appendChild(content);}
    if(!footer){footer=document.createElement('small');footer.className='preview-footer';box.appendChild(footer);}
    const lines=text.split('\n'),excerpt=lines.slice(0,6).join('\n');
    const truncated=lines.length>6||excerpt.length>320;
    title.textContent=node.name||'Nota';
    content.textContent=excerpt.slice(0,320)+(truncated?'…':'');
    footer.textContent='Vista previa · abre Notas para leer el contenido completo';
    box.style.display='block';
    const w=box.offsetWidth,h=box.offsetHeight;
    let left=x+18,top=y+18;
    if(left+w>innerWidth-12)left=x-w-18;
    if(top+h>innerHeight-12)top=y-h-18;
    box.style.left=Math.max(12,Math.min(left,innerWidth-w-12))+'px';
    box.style.top=Math.max(12,Math.min(top,innerHeight-h-12))+'px';
  };
  window.addEventListener('resize',()=>{const box=document.getElementById('note-preview');if(box)box.style.display='none';});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){const box=document.getElementById('note-preview');if(box)box.style.display='none';}});
})();
