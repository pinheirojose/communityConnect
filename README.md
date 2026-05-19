# Évora Serviços

Site que lista serviços locais em Évora: pesquisa, filtros por categoria e cartões com contacto e redes sociais. Os dados vêm de `services.json` e a página é montada com JavaScript.

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
