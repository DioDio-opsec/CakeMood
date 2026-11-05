import { supabase } from "./supabase.js";
const $=s=>document.querySelector(s);
let mode="login";
function update(){ $("#heading").textContent=mode==="login"?"Entrar na sua conta":"Criar sua conta";$("#submit").textContent=mode==="login"?"Entrar":"Cadastrar";$("#toggle").textContent=mode==="login"?"Criar uma conta":"Já tenho uma conta";$("#reset").classList.toggle("hidden",mode!=="login");}
$("#toggle").addEventListener("click",()=>{mode=mode==="login"?"signup":"login";update()});
$("#auth-form").addEventListener("submit",async e=>{
 e.preventDefault();const email=$("#email").value.trim(),password=$("#password").value;
 $("#submit").disabled=true;$("#status").textContent="Aguarde…";
 let result;
 if(mode==="signup")result=await supabase.auth.signUp({email,password});
 else result=await supabase.auth.signInWithPassword({email,password});
 $("#submit").disabled=false;
 if(result.error){$("#status").textContent=result.error.message;return}
 if(mode==="signup")$("#status").textContent="Cadastro iniciado. Verifique seu e-mail para confirmar a conta, se a confirmação estiver habilitada.";
 else window.location.href="index.html";
});
$("#reset").addEventListener("click",async()=>{
 const email=$("#email").value.trim();if(!email){$("#status").textContent="Informe seu e-mail primeiro.";return}
 const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:location.origin+"/login.html"});
 $("#status").textContent=error?error.message:"Se o endereço estiver cadastrado, você receberá instruções para redefinir a senha.";
});
update();
