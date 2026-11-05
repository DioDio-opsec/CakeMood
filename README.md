# Cake MOOD — versão com Supabase e Resend

## O que este projeto implementa
- Dois produtos: Oreo e bolo de cenoura com cobertura de chocolate.
- R$ 10,00 por pedaço, validado novamente no servidor.
- Login/cadastro pelo Supabase Auth (senha não é armazenada em tabela própria).
- Carrinho de visitante no navegador e carrinho de cliente salvo no Supabase.
- Pedido salvo no banco antes da notificação por e-mail.
- E-mail de notificação enviado pelo Resend para `bruno-ctrl-dev-web@outlook.com`.

## 1. Criar o projeto Supabase
1. Crie um projeto em https://supabase.com/.
2. Abra SQL Editor e execute `supabase/schema.sql`.
3. Em Project Settings → API, copie Project URL e a chave pública `anon`/`publishable`.
4. Cole esses dois valores em `supabase.js`.

## 2. Configurar autenticação
1. Em Authentication → URL Configuration, defina a URL do site publicado e a URL local de desenvolvimento.
2. Configure confirmação de e-mail conforme a necessidade da loja.
3. O Supabase Auth gerencia senhas e tokens; não crie nem armazene senhas manualmente.

## 3. Configurar Resend e a função
1. Crie uma conta em https://resend.com/ e configure/verifique um domínio de envio.
2. A função de exemplo usa `pedidos@resend.dev` como remetente de teste. Para produção, troque pelo remetente do seu domínio verificado.
3. Instale a Supabase CLI e faça login.
4. Configure secrets:
   - `RESEND_API_KEY`: chave secreta criada no Resend.
   - `ORDER_NOTIFICATION_EMAIL`: `bruno-ctrl-dev-web@outlook.com`
5. Publique a função `send-order-email` com a Supabase CLI.

Exemplo:
```bash
supabase login
supabase link --project-ref SEU_PROJECT_REF
supabase secrets set RESEND_API_KEY=re_xxxxxxxxx ORDER_NOTIFICATION_EMAIL=bruno-ctrl-dev-web@outlook.com
supabase functions deploy send-order-email
```

## 4. Publicar no GitHub Pages
Envie `index.html`, `login.html`, `app.js`, `auth.js` e `supabase.js` para o repositório configurado no GitHub Pages.
A pasta `supabase/` contém o SQL e a Edge Function para publicar/configurar no Supabase; ela não precisa ficar acessível publicamente pelo site.

## Segurança e pontos a finalizar antes de receber pedidos reais
- A política de pedidos impede leitura pública; a Edge Function usa a chave de serviço apenas no servidor.
- Nunca publique a `service_role key` nem `RESEND_API_KEY` no GitHub ou em arquivos JS.
- O código deve ser testado com compras de visitante e cliente autenticado.
- Para produção, configure um domínio/remetente verificado no Resend e revise as URLs de autenticação.
- Este esqueleto não inclui painel administrativo de pedidos nem fluxo de pagamento online.


## Fotografias provisórias dos produtos
- Bolo de Oreo: Nano Erdozain / Pexels, https://www.pexels.com/photo/close-up-of-a-slice-of-cake-with-an-oreo-cookie-19202778/
- Bolo de cenoura: Caio Niceas / Pexels, https://www.pexels.com/photo/delicious-brazilian-carrot-cake-with-chocolate-drizzle-37711037/
As imagens são carregadas diretamente do Pexels; é necessária conexão com a internet para visualizá-las. São ilustrativas, não fotos dos produtos reais.
