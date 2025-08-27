# Website Dinamus

Website da Igreja Dinamus construído com HTML, CSS e JavaScript, utilizando Tailwind CSS para estilização.

## Configuração do Tailwind CSS

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação das dependências
```bash
npm install
```

### Scripts disponíveis

#### Desenvolvimento (modo watch)
```bash
npm run dev
```
Este comando compila o CSS do Tailwind e fica observando mudanças nos arquivos.

#### Build de CSS
```bash
npm run build:css
```
Este comando compila o CSS do Tailwind com minificação para produção.

#### Build de JavaScript
```bash
npm run build:js
```
Este comando minifica todos os arquivos JavaScript da pasta `js/` em um único arquivo `scripts.min.js`.

#### Build completo (CSS + JS)
```bash
npm run build:all
```
Este comando executa tanto o build do CSS quanto do JavaScript para produção.

## Estrutura do projeto

```
dinamus/
├── css/
│   ├── styles.css          # Arquivo fonte com diretivas Tailwind
│   └── styles-min.css      # CSS compilado e minificado
├── js/                     # Arquivos JavaScript
├── img/                    # Imagens do site
├── *.html                  # Páginas HTML
├── tailwind.config.js      # Configuração do Tailwind CSS
├── postcss.config.js       # Configuração do PostCSS
└── package.json            # Dependências e scripts
```

## Cores personalizadas

O projeto utiliza as seguintes cores personalizadas definidas no Tailwind:

- `primary`: #72473e (marrom escuro)
- `secondary`: #f2ebdb (bege claro)
- `main`: #374233 (verde escuro)
- `accent`: #72473e (marrom escuro)

## Animações personalizadas

- `float`: Animação de flutuação de 6 segundos
- `float-small`: Animação de flutuação de 8 segundos

## Fontes

- **Display**: Caprasimo (serif)
- **Sans**: Poppins (sans-serif)

## Desenvolvimento

1. Instale as dependências: `npm install`
2. Execute o modo de desenvolvimento: `npm run dev`
3. Faça alterações nos arquivos HTML ou CSS
4. O Tailwind CSS será recompilado automaticamente

## Produção

1. Execute o build completo de produção: `npm run build:all`
2. Os arquivos serão gerados com minificação:
   - `css/styles-min.css` - CSS compilado e minificado
   - `js/scripts.min.js` - JavaScript minificado
   - `js/scripts.min.js.map` - Source map para debugging
3. Faça o deploy dos arquivos para o servidor

## Otimizações

### CSS
- **Tailwind CSS**: Compilação otimizada com apenas as classes utilizadas
- **PostCSS**: Autoprefixer para compatibilidade cross-browser
- **CSSNano**: Minificação avançada com preservação de funcionalidades

### JavaScript
- **UglifyJS**: Minificação com compressão e mangle
- **Source Maps**: Para debugging em produção
- **Bundle**: Todos os arquivos JS combinados em um único arquivo

### Performance
- **Tree Shaking**: Remove CSS não utilizado
- **Code Splitting**: Separação de CSS e JS para cache otimizado
- **Minificação**: Redução significativa no tamanho dos arquivos
