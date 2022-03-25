/** Arrays dos dados importantes para a aplicação **/
let produtos = [];
let produtosFaltantes = [];
let produtosSugeridos = [];

var chartHistoricoProduto;
var isNew = false;

onload = () => {
    carregarTabs();
    recuperarProdutos();
    montarElementsListaCompras();
    montarElementsProdutos();

    document.getElementById("img-input").addEventListener("change", readImage, false);
}

/** Carregamento das tabs da aplicação **/
const carregarTabs = () => {
    let tabs = document.querySelectorAll('.navBar .tab');

    const mostra = (elem) => {
        if (elem) {
            for (let i = 0; i < tabs.length; i++)
                tabs[i].classList.remove('active');
            
            elem.classList.add('active');
        }
  
        for (let i = 0; i < tabs.length; i++) {
            let comp = tabs[i].getAttribute('for');
            if (tabs[i].classList.contains('active'))
                document.querySelector('#' + comp).classList.remove('hidden');
            else 
                document.querySelector('#' + comp).classList.add('hidden');
        }
    };
  
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].onclick = (e) => {
            mostra(e.target);
        };
    }

    document.querySelector('#componente3').classList.add('hidden');
}

/** Recupera no localstorage os dados de produtos, produtos faltantes e produtos sugeridos **/
const recuperarProdutos = () => {
    const prodFaltanteLocalStorage = JSON.parse(localStorage.getItem('produtosFaltantes'));
    if(prodFaltanteLocalStorage) {
        produtosFaltantes = prodFaltanteLocalStorage;
    }
    
    const prodSugeridoLocalStorage = JSON.parse(localStorage.getItem('produtosSugeridos'));
    if(prodFaltanteLocalStorage) {
        produtosSugeridos = prodSugeridoLocalStorage;
    }

    const produtosLocalStorage = JSON.parse(localStorage.getItem('produtos'));
    if(produtosLocalStorage) {
        produtos = produtosLocalStorage;
    }
}

/** Monta a lista de compras **/
const montarElementsListaCompras = () => {
    montarElementsProdutosListaCompras();
    document.querySelector("#qtProdFaltante").innerHTML = produtosFaltantes.length;

    if(!produtosSugeridos || produtosSugeridos.length == 0) {
        document.querySelector("#divProdutosFaltantes").classList.add("hidden");
    } else {
        document.querySelector("#divProdutosFaltantes").classList.remove("hidden");
        montarElementsSugestoesListaCompras();
    }

    if(produtosFaltantes.length > 0) {
        document.querySelector("#compras").classList.remove("hidden");
        document.querySelector("#blank").classList.add("hidden");
    } else {
        document.querySelector("#compras").classList.add("hidden");
        document.querySelector("#blank").classList.remove("hidden");
    }
}

/** Monta a table de produtos faltantes da lista de compras **/
const montarElementsProdutosListaCompras = () => {
    const produtosFaltantesRow = document.querySelector("#produtosFaltantesRow");
    produtosFaltantesRow.innerHTML = '';

    produtosFaltantes.forEach((produto) => {
        let tableRow = document.createElement("tr");
        tableRow.innerHTML = '';

        let nameProdutoElement = document.createElement("td");
        nameProdutoElement.innerHTML = produto.descricao;
        tableRow.appendChild(nameProdutoElement);

        let qtdProdutoElement = document.createElement("td");
        qtdProdutoElement.innerHTML = produto.quantidade + " - " + produto.tipoQuantidade;
        tableRow.appendChild(qtdProdutoElement);

        let acaoElement = document.createElement("td");
        let divAcaoElement = document.createElement("div");
        divAcaoElement.classList.add("formButtonGroup");

        let inputComprar = document.createElement('input');
        inputComprar.id = "inputComprar" + produto.id;
        inputComprar.type = 'checkbox';
        inputComprar.checked = produto.comprado

        divAcaoElement.appendChild(inputComprar);
        acaoElement.appendChild(divAcaoElement);
        
        tableRow.appendChild(acaoElement);
        
        produtosFaltantesRow.appendChild(tableRow);
    });
}

/** Monta a table de produtos sugeridos na lista de compras **/
const montarElementsSugestoesListaCompras = () => {
    const sugestaoProdutosRow = document.querySelector("#produtosSugeridos");
    sugestaoProdutosRow.innerHTML = '';

    
    produtosSugeridos.forEach((produto, index) => {
        let tableRow = document.createElement("tr");
        tableRow.innerHTML = '';

        let nameProdutoElement = document.createElement("td");
        nameProdutoElement.innerHTML = produto.descricao;
        tableRow.appendChild(nameProdutoElement);

        let acaoElement = document.createElement("td");

        let labelAdicionarLista = document.createElement("label")
        labelAdicionarLista.innerHTML = "Adicionar a lista";
        labelAdicionarLista.id = index;

        labelAdicionarLista.addEventListener('click', function() { adicionarProdutoSugeridoALista(index) });
        labelAdicionarLista.classList.add("italicText");
        acaoElement.appendChild(labelAdicionarLista);

        tableRow.appendChild(acaoElement);
        
        sugestaoProdutosRow.appendChild(tableRow);
    });
}

/** Pesquisa produtos faltantes por nome **/
const pesquisar = () => {
    recuperarProdutos();

    let filtro = document.getElementById("fieldPesquisa").value;
    let produtosFiltrados = [];
    produtosFaltantes.forEach((produto) => {
        if(produto.descricao.toLowerCase().includes(filtro.toLowerCase())) {
            produtosFiltrados.push(produto);
        }
    })
    
    produtosFaltantes = produtosFiltrados;
    montarElementsListaCompras();
}

/** Adiciona um produto sugerido a lista de compras **/
const adicionarProdutoSugeridoALista = (index) => {
    produtosFaltantes.push(produtosSugeridos[index]);
    produtosSugeridos.splice(index, 1);

    localStorage.setItem('produtosFaltantes', JSON.stringify(produtosFaltantes));
    localStorage.setItem('produtosSugeridos', JSON.stringify(produtosSugeridos));

    montarElementsListaCompras();
}

/** Finaliza uma lista de compras indicando que os produtos foram comprados **/
const finalizarLista = () => {
    var resultado = confirm("Deseja realmente finalizar esta lista de compras?");
    if (resultado) {
        produtos.filter(produto => produto.acabou).forEach((produto) => {
            produto.acabou = false
            produto.ultimaCompra = moment().format('YYYY-MM-DD');

            if(!produto.historicoCompras) {
                produto.historicoCompras = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            }

            produto.historicoCompras[parseInt(moment().format('M'))] += parseInt(produto.quantidade);
        });

        produtosFaltantes = [];
        produtosSugeridos = [];

        localStorage.setItem('produtos', JSON.stringify(produtos));
        localStorage.setItem('produtosFaltantes', JSON.stringify(produtosFaltantes));
        localStorage.setItem('produtosSugeridos', JSON.stringify(produtosSugeridos));

        montarElementsListaCompras();
        montarElementsProdutos();
        alert("Compras finalizadas com sucesso!");
    }
}

/** Habilita a tela de novo produto **/
const novoProduto = () => {
    this.isNew = true;
    document.querySelector('#componente3').classList.remove('hidden');
    document.querySelector('#componente2').classList.add('hidden');

    document.querySelector('#divGraficosProduto').classList.add('hidden');
    document.querySelector('#inputImagemProduto').classList.remove('hidden');
}

/** Cancela o formulário de novo produto **/
const cancelarFormProduto = () => {
    document.getElementById("descricao").value = null; 
    document.getElementById("ultimaCompra").value = null;
    document.getElementById("ultimoValorPago").value = null;
    document.getElementById("quantidade").value = null;
    document.getElementById("marca").value = null;
    
    document.querySelector('#componente3').classList.add('hidden');
    document.querySelector('#componente2').classList.remove('hidden');
    document.querySelector('#btnRemov').classList.add('hidden');
    document.querySelector('#tituloProduto').innerHTML = 'Novo produto';
    document.querySelector('#imagem-preview').src = '';

    montarElementsProdutos();
}

/** Salva um produto **/
salvarProduto = () => {
    let descricao = document.getElementById("descricao").value;

    if(!descricao) {
        alert("Não é possível inserir um produto sem nome");
        return;
    }

    let produtoInserido = produtos.filter(prod => prod.descricao.normalize('NFD').replace(/[^\w\s]/gi, '').toLowerCase() == descricao.normalize('NFD').replace(/[^\w\s]/gi, '').trim().toLowerCase());
    if(produtoInserido.length > 0 && this.isNew) {
        alert("Produto já inserido");
        return;
    }

    let produto = {
        id: null,
        descricao: descricao, 
        marca: document.getElementById("marca").value, 
        ultimaCompra: document.getElementById("ultimaCompra").value,
        periodicidade: document.getElementById("periodicidade").value,
        ultimoValorPago: document.getElementById("ultimoValorPago").value,
        tipoQuantidade: document.getElementById("tipoQuantidade").value, 
        quantidade: document.getElementById("quantidade").value,
        imagem: toBase64String(document.getElementById("imagem-preview")),
    }

    if(produtoInserido.length > 0) {
        let index = produtos.indexOf(produtoInserido[0]);
        produto.id = produtos[index].id;
        produto.acabou = produtos[index].acabou;
        produto.historicoPrecos = produtos[index].historicoPrecos;
        produto.historicoCompras = produtos[index].historicoCompras;

        produtos[index] = produto;
    } else {
        let id = 0;
        for(let i = 0; i < produtos.length; i++) {
            if(produtos[i].id > id) {
                id = produtos[i].id;
            }
        }
        
        produto.id = (id + 1);
        produtos.push(produto);
    }
    
    if(!produto.historicoPrecos) {
        produto.historicoPrecos = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    produto.historicoPrecos[parseInt(moment().format('M'))] = parseFloat(produto.ultimoValorPago);
    localStorage.setItem('produtos', JSON.stringify(produtos));
    cancelarFormProduto();
}

/** Lê uma imagem do campo input **/
function readImage() {
    if (this.files && this.files[0]) {
        var file = new FileReader();
        file.onload = function(e) {
            document.getElementById("imagem-preview").src = e.target.result;
        };

        file.readAsDataURL(this.files[0]);
    }
}

/** Realiza o tratamento da imagem para que a mesma seja salva no localstorage **/
function toBase64String (imagem) {
    if(imagem instanceof Image && imagem.src != 'data:,') {
        var canvas = document.createElement("canvas");
        canvas.width = imagem.width;
        canvas.height = imagem.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(imagem, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        return dataURL;
    }
}

/** Monta a tabela de produtos da tela Produtos **/
const montarElementsProdutos = () => {
    const produtosRow = document.querySelector("#produtosRow");
    produtosRow.innerHTML = '';

    produtos.forEach((produto, index) => {
        let tableRow = document.createElement("tr");
        tableRow.innerHTML = '';

        let nameProdutoElement = document.createElement("td");
        nameProdutoElement.innerHTML = produto.descricao;
        nameProdutoElement.onclick = function() { editarProduto(produto, index) };
        tableRow.appendChild(nameProdutoElement);

        let acaoElement = document.createElement("td");
        let divAcaoElement = document.createElement("div");
        divAcaoElement.classList.add("formButtonGroup");
        
        let labelAcabado = document.createElement("label");
        labelAcabado.classList.add("switch");

        let inputAcabou = document.createElement('input');
        inputAcabou.type = 'checkbox';
        inputAcabou.id = "checkAcabou" + produto.id;
        inputAcabou.checked = produto.acabou;
        inputAcabou.onclick = function() { adicionarProdutoFaltante(produto, index) }

        let spamAcabado = document.createElement("span");
        spamAcabado.classList.add("round");
        spamAcabado.classList.add("slider");

        labelAcabado.appendChild(inputAcabou);
        labelAcabado.appendChild(spamAcabado);
        
        divAcaoElement.appendChild(labelAcabado);
        acaoElement.appendChild(divAcaoElement);
        tableRow.appendChild(acaoElement);

        produtosRow.appendChild(tableRow);
    });

    if(produtos.length > 0) {
        document.querySelector("#divProdutos").classList.remove("hidden");
        document.querySelector("#blankProdutos").classList.add("hidden");
    } else {
        document.querySelector("#divProdutos").classList.add("hidden");
        document.querySelector("#blankProdutos").classList.remove("hidden");
    }
}

/** Adiciona um produto faltante a lista de compras **/
const adicionarProdutoFaltante = (produto, index) => {
    produto.acabou = document.querySelector("#checkAcabou" + produto.id).checked;
    if(produto.acabou) {
        produtosFaltantes.push(produto);
    } else {
        let produtoFaltante = produtosFaltantes.filter(p => p.id == produto.id);
        produtosFaltantes.splice(produtosFaltantes.indexOf(produtoFaltante), 1);
    }

    produtos[index] = produto;
    localStorage.setItem('produtos', JSON.stringify(produtos));
    localStorage.setItem('produtosFaltantes', JSON.stringify(produtosFaltantes));
    montarElementsListaCompras();
}

/** Habilita tela de edição do produto **/
const editarProduto = (produto, index) => {
    this.isNew = false;

    document.querySelector('#componente3').classList.remove('hidden');
    document.querySelector('#componente2').classList.add('hidden');
    document.querySelector('#btnRemov').classList.remove('hidden');
    document.querySelector('#btnRemov').classList.onclick = function() { removerProduto(produto) }
    document.querySelector('#tituloProduto').innerHTML = produto.descricao;

    document.getElementById("descricao").value = produto.descricao; 
    document.getElementById("marca").value = produto.marca; 
    document.getElementById("ultimaCompra").value = produto.ultimaCompra;
    document.getElementById("periodicidade").value = produto.periodicidade;
    document.getElementById("ultimoValorPago").value = produto.ultimoValorPago;
    document.getElementById("tipoQuantidade").value = produto.tipoQuantidade;
    document.getElementById("quantidade").value = produto.quantidade;

    document.querySelector('#divGraficosProduto').classList.remove('hidden');

    if(produto.imagem) {
        document.querySelector('#imagem-preview').src = produto.imagem;
    }

    if(!chartHistoricoProduto) {
        chartHistoricoProduto = new Chart(
            document.getElementById('chartHistoricoProduto'),
            configuracoesGraficoProdutos(index)
        );
    } else {
        chartHistoricoProduto = window.chartHistoricoProduto;
        chartHistoricoProduto.data.datasets[0].data = produtos[index].historicoCompras;
        chartHistoricoProduto.data.datasets[1].data = produtos[index].historicoPrecos;
        chartHistoricoProduto.update();
    }
}

/** Deleta um produto **/
const removerProduto = (produto) => {
    var resultado = confirm("Deseja realmente deletar este produto?");
    if (resultado) {
        produtos.splice(produtos.indexOf(produto), 1);
        localStorage.setItem('produtos', JSON.stringify(produtos));
        cancelarFormProduto();
    }
}

/** Seta as configurações do charts para a geração dos gráficos **/
const configuracoesGraficoProdutos = (index) => {
    const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    const data = {
        labels: labels,
        datasets: [{
            type: 'bar',
            label: 'Consumo',
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
            data: produtos[index].historicoCompras,
        }, 
        {
            type: 'line',
            label: 'Preço',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: false,
            data: produtos[index].historicoPrecos
        }],
    };
    
    return {
        type: 'bar',
        data: data,
        options: {}
    };
}

/** Registra o service-work **/
navigator.serviceWorker.register('./superlista-sw.js');