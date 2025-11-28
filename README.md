# 🎨 CallQuality AI - Frontend Web

Interface visual moderna e responsiva para o sistema de auditoria de qualidade **CallQuality AI**.

Este projeto é uma **Single Page Application (SPA)** construída com **React** e **Vite**, focada em oferecer uma experiência de usuário (UX) fluida para Supervisores e Analistas de Call Center.

🔗 **Backend Repository:** [CallQuality Backend](https://github.com/AgathaKarenne32/CallQuality)

---

## 🚀 Stack Tecnológica

* **Core:** React 18 + Vite (Build ultra-rápido)
* **Estilização:** Tailwind CSS (Design System moderno)
* **Roteamento:** React Router Dom v6
* **Gerenciamento de Estado:** Context API (Autenticação Global)
* **Comunicação API:** Axios (com Interceptors para JWT)
* **Visualização de Dados:** Recharts (Gráficos dinâmicos)
* **Ícones:** Lucide React

---

## ✨ Funcionalidades Implementadas

### 📊 Dashboard Inteligente (BI)
* **KPIs em Tempo Real:** Total de chamadas, Nota Média da equipe e Alertas Críticos calculados dinamicamente com base nos dados do backend.
* **Gráficos Interativos:**
    * *Rosca (Donut):* Distribuição de sentimentos (Positivo vs Negativo).
    * *Linha (Trend):* Evolução da nota de qualidade ao longo do tempo.

### 📞 Gestão de Chamadas
* **Tabela Avançada:** Listagem com paginação automática.
* **Filtros Combinados:** Busca textual + Filtro de Status + Filtro de Sentimento + Intervalo de Datas.
* **Exportação:** Geração de relatórios em **CSV** diretamente pelo navegador.
* **Upload Visual:** Modal intuitivo para envio de áudios (.mp3, .wav, .ogg) com seleção de analista via lista dinâmica.

### 🔍 Drill Down (Detalhes)
* **Gaveta de Auditoria:** Visualização detalhada da chamada sem sair da tela principal.
* **Feedback da IA:** Exibição da transcrição completa e das notas atribuídas critério a critério.

### 🛡️ Segurança & Acesso
* **Autenticação JWT:** Login seguro com persistência de sessão (LocalStorage).
* **Proteção de Rotas:** Redirecionamento automático para Login se não houver token.
* **Controle de Interface (UI/UX):** O menu "Configurações" e botões de administração desaparecem automaticamente para usuários com perfil `ANALISTA`.

### ⚙️ Configurações Dinâmicas
* **CRUD de Critérios:** Interface para criar e excluir regras de avaliação (pesos e instruções para a IA).

---

## 📂 Estrutura do Projeto

```
src/
├── components/       # Peças reutilizáveis (UI)
│   ├── DrawerDetalhes.jsx   # Gaveta de visualização da chamada
│   ├── GraficoSentimentos.jsx
│   ├── ModalUpload.jsx      # Upload de arquivo
│   ├── Sidebar.jsx          # Menu lateral responsivo
│   └── TabelaLigacoes.jsx   # Tabela com filtros
├── contexts/         # Estado Global
│   └── AuthContext.jsx      # Lógica de Login/Logout
├── pages/            # Telas da Aplicação
│   ├── Dashboard.jsx
│   ├── Ligacoes.jsx
│   ├── Relatorios.jsx
│   ├── Configuracoes.jsx
│   └── Login.jsx
└── services/
    └── api.js        # Configuração do Axios e URL do Backend
```

---

## 🛠️ Como Rodar Localmente

### Pré-requisitos
* Node.js 18+
* Backend do CallQuality rodando (porta 8081)

### Passos

1.  **Instalar Dependências:**
    ```bash
    npm install
    ```

2.  **Configurar API:**
    Verifique o arquivo `src/services/api.js`. Se estiver rodando localmente, a URL deve ser:
    `baseURL: 'http://localhost:8081'`
    *(Se estiver no Codespaces, use a URL pública da porta 8081)*

3.  **Iniciar o Servidor de Desenvolvimento:**
    ```bash
    npm run dev
    ```

4.  **Acessar:**
    Abra `http://localhost:5173` no navegador.

---

## 🔐 Credenciais de Teste

Para acessar o sistema em ambiente de desenvolvimento (se o banco foi populado com o seed padrão):

* **Admin:** `agatha@callquality.com` / `123456`
* **Analista:** `joao@cq.com` / `123456`

---

Desenvolvido por **Agatha Karenne**.
