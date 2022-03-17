let produtos = [];
let produtosFaltantes = [];
let produtosSugeridos = [];

onload = () => {
    carregarTabs();
    recuperarProdutos();
    mostraListaCompras();
    mostrarProdutos();

    document.getElementById("img-input").addEventListener("change", readImage, false);
}

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

const mostraListaCompras = () => {
    montarElementsListaProdutos();
    document.querySelector("#qtProdFaltante").innerHTML = produtosFaltantes.length;

    if(produtosSugeridos.length == 0) {
        document.querySelector("#divProdutosFaltantes").classList.add("hidden");
    } else {
        document.querySelector("#divProdutosFaltantes").classList.remove("hidden");
        montarElementsListaSugestoes();
    }

    if(produtosFaltantes.length > 0) {
        document.querySelector("#compras").classList.remove("hidden");
        document.querySelector("#blank").classList.add("hidden");
    } else {
        document.querySelector("#compras").classList.add("hidden");
        document.querySelector("#blank").classList.remove("hidden");
    }
}

const montarElementsListaProdutos = () => {
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

const montarElementsListaSugestoes = () => {
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

        labelAdicionarLista.addEventListener('click', function() { adicionarProdutoLista(index) });
        labelAdicionarLista.classList.add("italicText");
        acaoElement.appendChild(labelAdicionarLista);

        tableRow.appendChild(acaoElement);
        
        sugestaoProdutosRow.appendChild(tableRow);
    });
}

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
    mostraListaCompras();
}

const adicionarProdutoLista = (index) => {
    produtosFaltantes.push(produtosSugeridos[index]);
    produtosSugeridos.splice(index, 1);

    localStorage.setItem('produtosFaltantes', JSON.stringify(produtosFaltantes));
    localStorage.setItem('produtosSugeridos', JSON.stringify(produtosSugeridos));

    mostraListaCompras();
}

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

        mostraListaCompras();
        mostrarProdutos();
        alert("Compras finalizadas com sucesso!");
    }
}

const novoProduto = () => {
    document.querySelector('#componente3').classList.remove('hidden');
    document.querySelector('#componente2').classList.add('hidden');

    document.querySelector('#divGraficosProduto').classList.add('hidden');
    document.querySelector('#inputImagemProduto').classList.remove('hidden');
}

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

    mostrarProdutos();
}

const salvarProduto = () => {
    let descricao = document.getElementById("descricao").value;
    let produtoInserido = produtos.filter(prod => prod.descricao == descricao);

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

function readImage() {
    if (this.files && this.files[0]) {
        var file = new FileReader();
        file.onload = function(e) {
            document.getElementById("imagem-preview").src = e.target.result;
        };

        file.readAsDataURL(this.files[0]);
    }
}

function toBase64String(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL;
}

const mostrarProdutos = () => {
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
    mostraListaCompras();
}

const editarProduto = (produto, index) => {
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
    document.querySelector('#imagem-preview').src = produto.imagem;

    const chartHistoricoProduto = new Chart(
        document.getElementById('chartHistoricoProduto'),
        configuracoesGraficoProdutos(index)
    );
}

const removerProduto = (produto) => {
    var resultado = confirm("Deseja realmente deletar este produto?");
    if (resultado) {
        produtos.splice(produtos.indexOf(produto), 1);
        localStorage.setItem('produtos', JSON.stringify(produtos));
        cancelarFormProduto();
    }
}

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
