import { supabase } from "./supabase.js";

const products = [
 {id:"oreo",name:"Bolo de Oreo",price:10,description:"Bolo de Oreo, com sabor marcante e cobertura cremosa.",image:"https://www.receiteria.com.br/wp-content/uploads/bolo-de-oreo.jpg"},
 {id:"cenoura",name:"Bolo de cenoura com cobertura de chocolate",price:10,description:"Bolo de cenoura macio com cobertura de chocolate.",image:"https://www.receiteria.com.br/wp-content/uploads/bolo-de-cenoura-com-cobertura-de-chocolate.jpg"}
];
const $ = s => document.querySelector(s);
const money = n => n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
let user = null, profile = null, cart = {};
const CART_KEY = "cakemood_guest_cart_v1";

function readGuestCart(){try{return JSON.parse(localStorage.getItem(CART_KEY)||"{}")}catch{return {}}}
function saveGuestCart(){localStorage.setItem(CART_KEY,JSON.stringify(cart))}
function product(id){return products.find(p=>p.id===id)}
function renderCatalog(){
 $("#catalog").innerHTML=products.map(p=>`<article class="card"><img src="${p.image}" alt="${p.name}" loading="lazy"><div class="info"><h3>${p.name}</h3><p>${p.description}</p><div class="linha"><strong>${money(p.price)} / pedaço</strong><button class="btn" data-add="${p.id}">Adicionar</button></div></div></article>`).join("");
 document.querySelectorAll("[data-add]").forEach(b=>b.addEventListener("click",()=>changeQty(b.dataset.add,1)));
}
function changeQty(id,delta){cart[id]=(cart[id]||0)+delta;if(cart[id]<=0)delete cart[id];persistCart();renderCart()}
function persistCart(){if(user){/* Authenticated carts are persisted in Supabase below. */}else saveGuestCart();$("#badge").textContent=Object.values(cart).reduce((a,b)=>a+b,0)}
function renderCart(){
 const ids=Object.keys(cart).filter(id=>product(id));
 $("#cart-items").innerHTML=ids.length?ids.map(id=>`<div class="item"><div>${product(id).name}<br><small>${money(10)} cada</small></div><div class="qtd"><button data-change="-1" data-id="${id}" aria-label="Diminuir">−</button> ${cart[id]} <button data-change="1" data-id="${id}" aria-label="Aumentar">+</button></div></div>`).join(""):"<p>Seu carrinho está vazio.</p>";
 const total=ids.reduce((sum,id)=>sum+cart[id]*10,0);$("#cart-total").textContent=ids.length?"Total: "+money(total):"";
 document.querySelectorAll("[data-change]").forEach(b=>b.addEventListener("click",()=>changeQty(b.dataset.id,Number(b.dataset.change))));
 $("#guest-name").required=!user;$("#guest-name").classList.toggle("hidden",!!user);
 $("#customer-note").textContent=user?`Conectado como ${user.email}. O pedido ficará associado à sua conta.`:"Sem login? Informe seu nome para identificar o pedido.";
 $("#place-order").disabled=!ids.length;
}
async function loadProfile(){
 const {data:{session}}=await supabase.auth.getSession();user=session?.user||null;
 if(user){
  const {data}=await supabase.from("profiles").select("full_name").eq("id",user.id).maybeSingle();profile=data;
  const {data:rows,error}=await supabase.from("carts").select("items").eq("user_id",user.id).maybeSingle();
  if(!error&&rows?.items)cart=rows.items;
  $("#login-link").textContent="Minha conta";
 }else{cart=readGuestCart();$("#login-link").textContent="Entrar";}
 persistCart();renderCart();
}
let saveTimer;
async function saveAccountCart(){
 if(!user)return;
 clearTimeout(saveTimer);saveTimer=setTimeout(async()=>{
  const {error}=await supabase.from("carts").upsert({user_id:user.id,items:cart,updated_at:new Date().toISOString()},{onConflict:"user_id"});
  if(error)console.error("Não foi possível salvar o carrinho:",error.message);
 },350);
}
const originalPersist=persistCart;
persistCart=function(){originalPersist();saveAccountCart()};
function openCart(){$("#cart-panel").classList.add("aberta");$("#veil").classList.add("on")}
function closeCart(){$("#cart-panel").classList.remove("aberta");$("#veil").classList.remove("on")}
$("#open-cart").addEventListener("click",openCart);$("#close-cart").addEventListener("click",closeCart);$("#veil").addEventListener("click",closeCart);
$("#clear-cart").addEventListener("click",()=>{cart={};persistCart();renderCart()});
$("#checkout-form").addEventListener("submit",async e=>{
 e.preventDefault();const ids=Object.keys(cart).filter(id=>product(id));if(!ids.length)return;
 const name=user?(profile?.full_name||user.user_metadata?.full_name||user.email):$("#guest-name").value.trim();
 if(!name){$("#checkout-status").textContent="Informe seu nome para continuar.";return}
 $("#place-order").disabled=true;$("#checkout-status").textContent="Registrando seu pedido…";
 const items=ids.map(id=>({product_id:id,name:product(id).name,quantity:cart[id],unit_price:10,subtotal:cart[id]*10}));
 const {data,error}=await supabase.functions.invoke("send-order-email",{body:{customer_name:name,items}});
 if(error||!data?.success){$("#checkout-status").textContent="Não foi possível confirmar o pedido. Tente novamente. "+(error?.message||data?.error||"");$("#place-order").disabled=false;return}
 $("#checkout-status").textContent=`Pedido #${data.order_number} confirmado! A loja foi notificada por e-mail.`;
 cart={};persistCart();renderCart();$("#guest-name").value="";
});
$("#year").textContent=new Date().getFullYear();
renderCatalog();loadProfile();
