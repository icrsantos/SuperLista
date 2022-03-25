# SUPER LISTA

**Isabela Carolina Ribeiro Santos**

O objetivo desta aplicação é automatizar o processo de criação de listas de compras para o mercado. A ideia é permitir que ao longo do mês, à medida que os alimentos forem acabando, o usuário registre essa informação. Com isso, no dia da compra o cliente possuirá sua lista completa, sem a necessidade de verificar o que ainda há na despensa. 


## 1. Interfaces

### Tela principal

Nesta tela, o usuário verá sua lista de compras, que conterá o grupo de produtos registrados como faltantes. Nela, há um checklist que possibilitará durante as compras que o mesmo indique quais produtos já foram selecionados no mercado. Ao final do processo o mesmo também poderá finalizar a lista, indicando que os produtos já foram comprados.

### Tela de produtos

Nesta outra tela, o usuário verá a lista de produtos cadastrados no sistema. Nela, ele poderá indicar os produtos faltantes.

### Tela de cadastro e edição de produtos

Nesta outra tela, o usuário poderá cadastrar e editar as informações como nome, marca, valor, quantidade, etc do produto. Além disso, também é possível deletar o produto e ver relatórios de compras e alteração de preços do mesmo. 


## 2. Dados do usuário

Nesta aplicação, os dados do usuário são armazenados no localstorage. Não foi necessário guardar dados pessoais do usuário, mas sim informações sobre os produtos que o mesmo usa. Para isso, criou-se três keys para o armazenamento. Os produtos são todos os produtos cadastrados e contém informações de nome, marca, última compra, periodicidade de compra, quantidade, imagem e uma lista de consumo e preço durante o ano. Já os produtos faltantes contém apenas os produtos marcados como acabados, sua estrutura é similar à de produtos. Os produtos sugeridos contém os produtos que a aplicação identifica como importantes para o usuário, para isso é necessário analisar o histórico de utilização do cliente por um determinado período.   


## 3. Checklist de implementação

- A aplicação é original e não uma cópia da aplicação de um colega ou de uma aplicação já existente? **Sim**
- A aplicação tem pelo menos duas interfaces (telas ou páginas) independentes? **Sim**
- A aplicação armazena e usa de forma relevante dados complexos do usuário? **Sim**
- A aplicação possui um manifesto para instalação no dispositivo do usuário? **Sim**
- A aplicação possui um _service worker_ que permite o funcionamento off-line? **Sim**
- O código da minha aplicação possui comentários explicando cada operação? **Sim**
- A aplicação está funcionando corretamente? **Sim**
- A aplicação está completa? **Sim**


## 4. Observações
A aplicação contém na pasta node_modules as bibliotecas moment e chart. Tais são utilizadas apenas para a manipulação de datas e geração de gráficos do sistema. Reitero que conforme solicitado **não foram utilizadas tecnologias extras como frameworks para frontend**