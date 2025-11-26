# 🎨 CallQuality - Frontend

Interface visual do sistema de auditoria de chamadas, construída com React e Tailwind CSS.

## 🚀 Como Rodar

1. Instale as dependências:
   `npm install`

2. Rode o projeto:
   `npm run dev`

3. Acesse no navegador:
   `http://localhost:5173`


### Proximos Passos da Aplicação: 

### 🚀 Opção 1: O Botão "Nova Auditoria" (Fazer o Upload funcionar na tela)
Atualmente, o botão azul é apenas enfeite. Para criar uma ligação nova, você ainda precisa ir no terminal e rodar um comando `curl`.
* **A Missão:** Criar um **Modal (Janela Flutuante)** que abre quando clica no botão, permitindo arrastar um arquivo MP3 e enviar para o Backend de verdade.
* **Ganho:** Você nunca mais precisa abrir o terminal para testar.

### 📊 Opção 2: KPIs Reais (Chega de Mentiras)
Os cartões dizem "124 Ligações" e "Nota 8.5", mas sabemos que esses números estão fixos no código (`hardcoded`).
* **A Missão:** Calcular esses números dinamicamente com base nos dados que vêm do Backend.
    * Total = Tamanho da lista.
    * Alertas = Contar quantos têm sentimento "NEGATIVO".
* **Ganho:** O Dashboard vira um "termômetro" real da operação.

### 🔍 Opção 3: Detalhes da Chamada (O "Drill Down")
Na tabela, temos um botão de "Play" ▶️ que não faz nada.
* **A Missão:** Fazer com que, ao clicar na linha, abra uma tela (ou gaveta lateral) mostrando:
    * A transcrição completa do texto.
    * O feedback que a IA gerou.
    * A lista de critérios e notas individuais.
* **Ganho:** Transforma o sistema em uma ferramenta de auditoria completa.
Fazer o sistema funcionar de ponta a ponta pelo navegador é o marco final de um Full Stack.

**Qual você prefere atacar agora?**
