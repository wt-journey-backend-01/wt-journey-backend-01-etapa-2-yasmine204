<sup>Esse é um feedback gerado por IA, ele pode conter erros.</sup>

Você tem 2 créditos restantes para usar o sistema de feedback AI.

# Feedback para yasmine204:

Nota final: **87.4/100**

# Feedback para a yasmine204 🚨👮‍♀️

Olá, Yasmine! Que jornada incrível você fez construindo essa API para o Departamento de Polícia! 🚀 Quero começar parabenizando você pela organização do seu projeto e pela maioria dos endpoints funcionando muito bem! 🎉 Você estruturou sua API com rotas, controllers e repositories, usou validações com o Zod, tratamento de erros personalizado e até implementou filtros e ordenação para agentes e casos. Isso mostra um ótimo domínio dos conceitos e uma preocupação com a qualidade do código. Mandou muito bem! 👏

---

## O que está funcionando muito bem 👏

- **Endpoints básicos para agentes e casos estão implementados** com todos os métodos HTTP esperados (GET, POST, PUT, PATCH, DELETE).
- **Validação dos dados com Zod** está presente e bem aplicada, garantindo payloads corretos.
- **Tratamento de erros personalizado** com ApiError e middleware de erro, retornando status 400 e 404 quando necessário.
- **Filtros para casos e agentes** (por cargo, status, agente_id, e ordenação por dataDeIncorporacao) foram implementados com sucesso.
- **Filtros de busca por palavras-chave** no título e descrição de casos estão no código, embora com problemas que vamos detalhar.
- **Endpoint para buscar o agente responsável pelo caso (`/casos/:id/agente`) está declarado no router e no controller.**

Você já conquistou muitos bônus, como filtros e mensagens de erro customizadas para agentes inválidos. Isso é excelente e mostra que você foi além do básico! 🎖️

---

## Pontos que precisam da sua atenção e que vão destravar sua API para o próximo nível! 🕵️‍♂️

### 1. **Filtros de busca por palavras-chave no título e descrição dos casos não funcionam corretamente**

Você implementou o filtro de busca por query param `q` no controller de casos:

```js
if (q) {
    const term = normalizeText(q)

    casos = casos.filter((caso) => {
        const titulo = normalizeText(caso.titulo);
        const descricao = normalizeText(caso.descricao);

        return (titulo.includes(term) || descricao.includes(term));
    });
}
```

Essa lógica parece correta à primeira vista, mas percebi que o filtro não está funcionando como esperado nos testes. O problema mais provável é que a função `normalizeText` pode não estar tratando corretamente os textos para busca (por exemplo, removendo acentos, convertendo para minúsculas, etc), ou que o filtro não está sendo aplicado no array correto, talvez por alguma inconsistência nos dados.

**Dica:** Verifique se a função `normalizeText` está importada corretamente e se ela faz o que você espera. Também valide se os dados de `casos` têm os campos `titulo` e `descricao` preenchidos corretamente e sem erros de digitação.

Se quiser, aqui vai um exemplo simples de `normalizeText` para normalizar strings para buscas:

```js
function normalizeText(text) {
    return text.toLowerCase()
               .normalize('NFD') // separa os acentos
               .replace(/[\u0300-\u036f]/g, '') // remove os acentos
               .trim();
}
```

Caso queira, você pode testar essa função isoladamente para garantir que está funcionando.

---

### 2. **O endpoint `/casos/:id/agente` está declarado, mas não está funcionando corretamente**

Você declarou a rota e implementou o controller para buscar o agente dado o ID do caso:

```js
router.get('/:id/agente', controller.getAgenteByCasoId);
```

No controller:

```js
const getAgenteByCasoId = (req, res, next) => {
    try {
        const { id } = req.params;

        if(!isValidUuid(id)) {
            return next(new ApiError('ID inválido.', 400));
        }

        const caso = casosRepository.findById(id);
        if(!caso) {
            return next(new ApiError('Caso não encontrado.', 404));
        }

        const agente = agentesRepository.findById(caso.agente_id);
        if(!agente) {
            return next(new ApiError('Agente não encontrado.', 404));
        }

        res.status(200).json(agente);
    } 
    catch (error) {
        return next(new ApiError(error.message, 400));    
    }
};
```

A lógica está correta, porém, percebi que esse endpoint não está passando nos testes de filtro bônus. Isso pode indicar que a rota está sendo registrada corretamente, mas talvez a ordem das rotas esteja conflitando ou o middleware `express.json()` não está corretamente aplicado (mas no seu `server.js` vi que está tudo certo).

**Sugestão:** Uma causa comum para problemas em rotas que têm parâmetros dinâmicos é a ordem das rotas. Como você tem essas duas rotas no `casosRoutes.js`:

```js
router.get('/:id/agente', controller.getAgenteByCasoId);
router.get('/:id', controller.getCasoById);
```

O Express pode interpretar `:id` da primeira rota como o parâmetro para a segunda rota, dependendo da ordem. Mas no seu código, a rota `/casos/:id/agente` está antes de `/casos/:id`, o que está correto. Então, isso não deveria ser um problema.

Outro ponto: Verifique se no `server.js` você está usando o `casosRouter` corretamente e que não há nenhum middleware que bloqueie essa rota.

Você pode tentar adicionar um `console.log` dentro do controller para garantir que a requisição está chegando lá.

---

### 3. **Ordenação por dataDeIncorporacao dos agentes não funciona corretamente**

No controller de agentes, você implementou ordenação com base no query param `sort`:

```js
if(sort) {
    const sortClean = sort.toLowerCase().replace(/\s+/g, '');
    const decreasing = sortClean.startsWith('-');
    const field = decreasing ? sortClean.slice(1) : sortClean;

    if(field === 'dataDeIncorporacao') {
        agentes = [...agentes].sort((a, b) => {
            const dateA = new Date(a.dataDeIncorporacao).getTime();
            const dateB = new Date(b.dataDeIncorporacao).getTime();
            
            return decreasing ? dateB - dateA : dateA - dateB;
        });
    }
}
```

A lógica está muito boa! Mas percebi que os testes de ordenação por data de incorporação, tanto crescente quanto decrescente, estão falhando.

Isso pode estar acontecendo porque você está aplicando o `.toLowerCase()` no valor do `sort` e comparando com `'dataDeIncorporacao'`, que tem letras maiúsculas. Como você está usando `field === 'dataDeIncorporacao'`, essa comparação nunca será verdadeira, porque `field` sempre estará em minúsculas.

**Como corrigir:**

Altere o if para comparar tudo em minúsculas, assim:

```js
if(field === 'datadeincorporacao') {
    agentes = [...agentes].sort((a, b) => {
        const dateA = new Date(a.dataDeIncorporacao).getTime();
        const dateB = new Date(b.dataDeIncorporacao).getTime();
        
        return decreasing ? dateB - dateA : dateA - dateB;
    });
}
```

Ou, para deixar mais legível e evitar confusão, você pode padronizar o nome do campo para minúsculas e alterar o acesso ao campo no objeto para corresponder:

```js
if(field === 'datadeincorporacao') {
    agentes = [...agentes].sort((a, b) => {
        const dateA = new Date(a['dataDeIncorporacao']).getTime();
        const dateB = new Date(b['dataDeIncorporacao']).getTime();
        
        return decreasing ? dateB - dateA : dateA - dateB;
    });
}
```

---

### 4. **Mensagens de erro customizadas para argumentos inválidos de casos não estão funcionando**

No controller de casos, você tem várias validações para o ID do agente e do caso, com mensagens customizadas usando `ApiError`. Porém, os testes indicam que as mensagens para argumentos inválidos de casos não estão sendo entregues corretamente.

Ao analisar seu código, percebi que a validação do UUID é feita com a função `isValidUuid`, que está sendo usada corretamente, e que as mensagens estão personalizadas. Então, o problema pode estar no middleware de tratamento de erros, que talvez não esteja formatando ou repassando a mensagem corretamente para o cliente.

No seu `server.js` você usa:

```js
app.use(errorHandler);
```

E o arquivo `errorHandler.js` está na pasta utils, mas você não enviou o conteúdo aqui. Verifique se o middleware está capturando o `ApiError` e enviando a mensagem personalizada no corpo da resposta, por exemplo:

```js
function errorHandler(err, req, res, next) {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({ error: err.message });
    }

    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
}
```

Se o seu middleware não estiver assim, ajuste para garantir que as mensagens personalizadas sejam enviadas.

---

## Resumo Rápido para você focar: 📋

- Corrija a comparação do campo `sort` para ordenar agentes por dataDeIncorporacao, tratando o nome do campo em minúsculas.
- Verifique o funcionamento da função `normalizeText` para o filtro de busca por palavras-chave nos casos, garantindo que ela normaliza corretamente os textos.
- Confirme que o endpoint `/casos/:id/agente` está sendo chamado corretamente e que o middleware de rotas não está bloqueando essa rota.
- Revise seu middleware `errorHandler` para garantir que mensagens customizadas de erro (como IDs inválidos) sejam enviadas corretamente no corpo da resposta.
- Teste localmente cada endpoint com ferramentas como Postman ou Insomnia para garantir que os filtros, ordenações e buscas estão retornando o esperado.

---

## Recursos para te ajudar a aprimorar! 📚✨

- Para entender melhor sobre **roteamento e organização das rotas** no Express.js, recomendo muito este vídeo:  
  https://expressjs.com/pt-br/guide/routing.html

- Para aprofundar no **fluxo de requisição e resposta**, incluindo status codes e métodos HTTP:  
  https://youtu.be/RSZHvQomeKE

- Para garantir que a **validação e tratamento de erros** estejam corretos e com status codes adequados:  
  https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status/400  
  https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status/404

- Para aprimorar a **manipulação de arrays e filtros** em JavaScript, que você usa bastante para os filtros e ordenações:  
  https://youtu.be/glSgUKA5LjE?si=t9G2NsC8InYAU9cI

- Para revisar a **normalização de texto para buscas**, que pode ser o ponto chave para o filtro por palavra-chave:  
  https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String/normalize

---

## Para finalizar...

Yasmine, seu código está muito bem estruturado e você já domina muitos conceitos essenciais para construir APIs robustas com Node.js e Express. 🎯 Com alguns ajustes finos, principalmente na parte de filtros, ordenação e mensagens de erro, sua API vai ficar redondinha e com uma experiência de uso excelente.

Continue nessa pegada! Você está no caminho certo, e esses detalhes que faltam são aqueles que fazem a diferença entre um projeto bom e um projeto excelente. 💪🚓

Se precisar de qualquer ajuda para entender melhor algum ponto, pode contar comigo! Vamos descomplicar juntos! 😉

Abraço forte e sucesso! 👊✨

> Caso queira tirar uma dúvida específica, entre em contato com o Chapter no nosso [discord](https://discord.gg/DryuHVnz).



---
<sup>Made By the Autograder Team.</sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Carvalho](https://github.com/ArthurCRodrigues)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Drumond](https://github.com/drumondpucminas)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Gabriel Resende](https://github.com/gnvr29)</sup></sup>