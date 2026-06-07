# Évora Serviços

Site que lista serviços locais em Évora: pesquisa, filtros por categoria e cartões com contacto e redes sociais. Os dados vêm de `services.json` e a página é montada com JavaScript.

## Site publicado

O site está oficialmente publicado em:

**https://www.evoraservicos.pt**

## Adicionar ao ecrã inicial

Pode guardar o site no telemóvel como uma aplicação — abre em ecrã completo, com o ícone de **Évora Serviços**.

### iPhone / iPad (Safari)

1. Abra **https://www.evoraservicos.pt** no **Safari** (noutros browsers esta opção pode não aparecer).
2. Toque no botão **Partilhar** (ícone de quadrado com seta para cima), na barra inferior ou superior.
3. Deslize para baixo e escolha **Adicionar ao Ecrã Principal**.
4. Confirme o nome **Évora Serviços** e toque em **Adicionar**.

O atalho fica no ecrã principal, ao lado das outras aplicações.

### Android (Chrome)

1. Abra **https://www.evoraservicos.pt** no **Chrome**.
2. Toque no menu **⋮** (três pontos), no canto superior direito.
3. Escolha **Adicionar ao ecrã inicial** ou **Instalar aplicação** (o texto pode variar consoante a versão do Chrome).
4. Confirme o nome **Évora Serviços** e toque em **Adicionar** ou **Instalar**.

O atalho fica no ecrã inicial ou na gaveta de aplicações.

## Como correr

Para correr num servidor local. 

```bash
clone repository
navegar até à pasta principal
http-server -p 8080
```

Abra `http://localhost:8080`.

## Ficheiros principais

| Ficheiro        | Função                                      |
|----------------|---------------------------------------------|
| `index.html`   | Estrutura, cabeçalho, filtros, rodapé       |
| `styles.css`   | Estilos e layout responsivo                 |
| `script.js`    | Carrega serviços, filtros e UI extra       |
| `services.json`| Lista de serviços (nome, categoria, etc.)  |
| `assets/`      | Imagem de fundo, favicon                    |

## Licença

Ver `LICENSE`.
