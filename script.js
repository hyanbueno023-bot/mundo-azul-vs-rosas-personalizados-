const K="MAVR_produtos";const $=id=>document.getElementById(id);$("ano").textContent=new Date().getFullYear();function abrir(){$("modal").classList.add("show")}function fechar(){$("modal").classList.remove("show")}function esc(x){return String(x).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}function dados(){return JSON.parse(localStorage.getItem(K)||"[]")}function render(){
  let a=dados();
  $("catalogo").innerHTML="";
  $("vazio").style.display=a.length?"none":"block";
  a.forEach((p,i)=>{
    $("catalogo").innerHTML+=`<article class="product">
      <img src="${p.foto}" alt="${esc(p.nome)}">
      <div>
        <h3>${esc(p.nome)}</h3>
        ${p.preco?`<p class="price">${esc(p.preco)}</p>`:""}
        <p class="details">${esc(p.detalhes)}</p>
        <button class="btn pink" onclick="adicionarCarrinho(${i})">🛒 Adicionar ao carrinho</button>
      </div>
    </article>`;
  });
  atualizarCarrinho();
}
function del(i){if(confirm("Excluir produto?")){let a=dados();a.splice(i,1);localStorage.setItem(K,JSON.stringify(a));render()}}let carrinho=JSON.parse(localStorage.getItem("MAVR_carrinho")||"[]");

function adicionarCarrinho(i){
  const produtos=dados();
  const p=produtos[i];
  if(!p) return;
  const item=carrinho.find(x=>x.nome===p.nome && x.foto===p.foto);
  if(item) item.qtd++;
  else carrinho.push({nome:p.nome,preco:p.preco||"Preço a consultar",foto:p.foto,qtd:1});
  salvarCarrinho();
  abrirCarrinho();
}
function salvarCarrinho(){
  localStorage.setItem("MAVR_carrinho",JSON.stringify(carrinho));
  atualizarCarrinho();
}
function atualizarCarrinho(){
  const total=carrinho.reduce((s,x)=>s+x.qtd,0);
  const el=$("cartCount");
  if(el) el.textContent=total;
  const lista=$("cartItems");
  if(!lista) return;
  if(!carrinho.length){
    lista.innerHTML='<p class="empty-cart">Seu carrinho está vazio.</p>';
    $("cartTotal").textContent="0";
    return;
  }
  lista.innerHTML=carrinho.map((x,i)=>`<div class="cart-item">
    <img src="${x.foto}" alt="${esc(x.nome)}">
    <div class="cart-info"><strong>${esc(x.nome)}</strong><small>${esc(x.preco)}</small>
      <div class="qty"><button onclick="mudarQtd(${i},-1)">−</button><span>${x.qtd}</span><button onclick="mudarQtd(${i},1)">+</button><button class="remove" onclick="removerCarrinho(${i})">🗑️</button></div>
    </div>
  </div>`).join("");
  $("cartTotal").textContent=String(carrinho.reduce((s,x)=>s+x.qtd,0));
}
function mudarQtd(i,n){
  carrinho[i].qtd+=n;
  if(carrinho[i].qtd<=0)carrinho.splice(i,1);
  salvarCarrinho();
}
function removerCarrinho(i){carrinho.splice(i,1);salvarCarrinho();}
function abrirCarrinho(){$("cartModal").classList.add("show");atualizarCarrinho();}
function fecharCarrinho(){$("cartModal").classList.remove("show");}
function finalizarPedido(){
  if(!carrinho.length){alert("Adicione pelo menos um produto ao carrinho.");return;}
  const texto="Olá! Quero fazer um pedido:%0A%0A"+carrinho.map(x=>`• ${x.nome} — quantidade: ${x.qtd}`).join("%0A");
  window.open("https://wa.me/5500000000000?text="+texto,"_blank");
}
window.adicionarCarrinho=adicionarCarrinho;window.abrirCarrinho=abrirCarrinho;window.fecharCarrinho=fecharCarrinho;window.mudarQtd=mudarQtd;window.removerCarrinho=removerCarrinho;window.finalizarPedido=finalizarPedido;

$("foto").onchange=()=>{let f=$("foto").files[0];if(f){let r=new FileReader;r.onload=()=>{$("preview").innerHTML=`<img src="${r.result}">`};r.readAsDataURL(f)}};$("form").onsubmit=e=>{e.preventDefault();let f=$("foto").files[0],r=new FileReader;r.onload=()=>{let a=dados();a.push({nome:$("nome").value,preco:$("preco").value,detalhes:$("detalhes").value,foto:r.result});try{localStorage.setItem(K,JSON.stringify(a))}catch(x){alert("A foto é muito grande. Escolha uma foto menor.");return}$("form").reset();$("preview").textContent="Prévia da foto";fechar();render()};r.readAsDataURL(f)};render();atualizarCarrinho();