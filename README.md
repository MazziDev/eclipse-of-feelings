# Eclipse de Sentimentos

Experiência imersiva em React, Tailwind, GSAP e React Three Fiber mostrando a jornada de duas luas que se encontram. Desenvolvida para rodar 100% em front-end e pronta para deploy no GitHub Pages.

## Tecnologias
- React 18 + Vite
- TailwindCSS
- GSAP
- Framer Motion
- React Three Fiber + Three.js

## Scripts
- `npm run dev` — inicia o ambiente local em `http://localhost:5173/eclipse-of-feelings/`
- `npm run build` — gera a versão de produção em `dist/`
- `npm run deploy` — monta o build e publica no branch `gh-pages`

## Deploy no GitHub Pages
1. Ajuste o repositório remoto (`git remote add origin https://github.com/MazziDev/eclipse-of-feelings.git`).
2. Faça commit das alterações (`git commit -am "mensagem"`).
3. Suba para o GitHub com `git push origin main`.
4. Execute `npm run deploy` para atualizar o branch `gh-pages`.
5. Em *Settings → Pages*, deixe a fonte em `Deploy from a branch`, selecionando `gh-pages` / root.

O site ficará disponível em `https://MazziDev.github.io/eclipse-of-feelings/`.
