# LP Barbearia — Guia de Deploy (Railway + Vercel)

## Visão geral

```
Cliente (celular)
       │
       ▼
┌─────────────────┐        ┌──────────────────────┐
│  Vercel          │──API──▶│  Railway              │
│  (Frontend React)│◀─res──│  (NestJS + PostgreSQL)│
└─────────────────┘        └──────────────────────┘
```

- **Vercel** → hospeda o site React (gratuito)
- **Railway** → hospeda o backend NestJS + banco PostgreSQL (gratuito até ~500h/mês)

---

## Pré-requisitos

- Conta no GitHub (gratuita) → https://github.com
- Conta no Railway (gratuita) → https://railway.app
- Conta na Vercel (gratuita) → https://vercel.com

---

## Passo 1 — Subir o código no GitHub

Dentro da pasta do projeto:

```bash
git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/SEU_USUARIO/lp-barbearia.git
git push -u origin main
```

---

## Passo 2 — Backend no Railway

1. Acesse https://railway.app → New Project → Deploy from GitHub repo
2. Selecione o repositório e defina Root Directory: `backend`
3. Clique em "+ New" → Database → Add PostgreSQL
   - A variável DATABASE_URL é preenchida AUTOMATICAMENTE ✅
4. Em "Variables" adicione:

| Variável        | Valor                              |
|----------------|-------------------------------------|
| NODE_ENV       | production                          |
| SENHA_PAINEL   | (senha do barbeiro, ex: lp2024)     |
| FRONTEND_URL   | (preencha depois com URL da Vercel) |

5. Copie a URL gerada: https://lp-barbearia-backend.railway.app

---

## Passo 3 — Frontend na Vercel

1. Acesse https://vercel.com → Add New Project → importe o repositório
2. Root Directory: `frontend`
3. Adicione a variável de ambiente:

| Variável      | Valor                                            |
|--------------|---------------------------------------------------|
| VITE_API_URL | https://lp-barbearia-backend.railway.app/api      |

4. Clique em Deploy → aguarde ~2 min
5. URL gerada: https://lp-barbearia.vercel.app

---

## Passo 4 — Atualizar FRONTEND_URL no Railway

Volte ao Railway → Variables → adicione:

| Variável      | Valor                              |
|--------------|-------------------------------------|
| FRONTEND_URL | https://lp-barbearia.vercel.app    |

---

## Resultado

- Site do cliente: https://lp-barbearia.vercel.app
- Painel do barbeiro: mesmo link → cadeado no menu → senha configurada

---

## Rodar localmente

```bash
# Backend
cd backend && cp .env.example .env
npm install && npm run start:dev

# Frontend (outro terminal)
cd frontend
npm install && npm run dev
```
Acesse: http://localhost:5173

---

## O que mudar / personalizar

| O que              | Onde                              |
|--------------------|-----------------------------------|
| WhatsApp, preços   | frontend/src/config.ts            |
| Fotos              | frontend/src/assets/images.ts     |
| Senha do painel    | Railway → Variables → SENHA_PAINEL|
