let produtos = [];
let produtosFaltantes = [];
let produtosSugeridos = [];

onload = () => {
    carregarTabs();
    recuperarProdutos();
    mostraListaCompras();
    mostrarProdutos();
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
        produtosFaltantes = [];
        produtosSugeridos = [];

        localStorage.setItem('produtosFaltantes', JSON.stringify(produtosFaltantes));
        localStorage.setItem('produtosSugeridos', JSON.stringify(produtosSugeridos));

        mostraListaCompras();
        alert("Compras finalizadas com sucesso!");
    }
}

const novoProduto = () => {
    document.querySelector('#componente3').classList.remove('hidden');
    document.querySelector('#componente2').classList.add('hidden');

    document.querySelector('#divImagemProduto').classList.add('hidden');
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

    mostrarProdutos();
}

const salvarProduto = () => {
    let produto = {
        id: (produtos.length + 1),
        descricao: document.getElementById("descricao").value, 
        marca: document.getElementById("marca").value, 
        ultimaCompra: document.getElementById("ultimaCompra").value,
        periodicidade: document.getElementById("periodicidade").value,
        ultimoValorPago: document.getElementById("ultimoValorPago").value,
        tipoQuantidade: document.getElementById("tipoQuantidade").value, 
        quantidade: document.getElementById("quantidade").value,
        imagem: document.getElementById("imagem")
    }

    produtos.push(produto);
    localStorage.setItem('produtos', JSON.stringify(produtos));
    cancelarFormProduto();
}

const mostrarProdutos = () => {
    const produtosRow = document.querySelector("#produtosRow");
    produtosRow.innerHTML = '';

    produtos.forEach((produto) => {
        let tableRow = document.createElement("tr");
        tableRow.innerHTML = '';

        let nameProdutoElement = document.createElement("td");
        nameProdutoElement.innerHTML = produto.descricao;
        nameProdutoElement.onclick = function() { editarProduto(produto) };
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
        inputAcabou.onclick = function() { adicionarProdutoFaltante(produto) }

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

const adicionarProdutoFaltante = (produto) => {
    produto.acabou = true;
    produtosFaltantes.push(produto);
    localStorage.setItem('produtosFaltantes', JSON.stringify(produtosFaltantes));

    mostraListaCompras();
}

const editarProduto = (produto) => {
    document.querySelector('#componente3').classList.remove('hidden');
    document.querySelector('#componente2').classList.add('hidden');

    document.getElementById("descricao").value = produto.descricao; 
    document.getElementById("marca").value = produto.marca; 
    document.getElementById("ultimaCompra").value = produto.ultimaCompra;
    document.getElementById("periodicidade").value = produto.periodicidade;
    document.getElementById("ultimoValorPago").value = produto.ultimoValorPago;
    document.getElementById("tipoQuantidade").value = produto.tipoQuantidade;
    document.getElementById("quantidade").value = produto.quantidade;

    document.querySelector('#divImagemProduto').classList.remove('hidden');
    document.querySelector('#inputImagemProduto').classList.add('hidden');
    
    let imagemElement = document.createElement("img");
    imagemElement.src = produto.imagem;
    document.querySelector('#divImagemProduto').appendChild(imagemElement);
}