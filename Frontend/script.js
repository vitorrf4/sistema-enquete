async function loadEnquetes() {
    const enquetes = await fetch('http://localhost:3000/enquetes')
        .then(async r => await r.json());

    for (let enquete of enquetes) {
        createEnqueteHTML(enquete);
    }
}

function createEnqueteHTML(enquete) {
    const container = document.getElementById("flex-container");
    const div = document.createElement('div');
    const table = document.createElement('table');

    div.insertAdjacentHTML('afterbegin', `<p>${enquete.titulo}</p>`);

    for (let opcao of enquete.opcoes) {
        table.insertAdjacentHTML('afterbegin', `
            <tr>
                 <td><label for="opcao1">${opcao.titulo}</label></td>
                 <td>${opcao.votos} votos</td> 
                 <td><input type="radio" name="opcao" id="opcao_${opcao.id}"></td>
            </tr>
        `);
    }
    div.append(table);

    div.insertAdjacentHTML('beforeend', `
            <p>Inicio: ${enquete.dataInicio}</p>
            <p>Fim: ${enquete.dataFim}</p>
            <p>Status: ${enquete.status}</p>

            <button>Votar</button>
    `);
    div.classList.add('enquetes-div');

    container.appendChild(div);
}

async function saveEnquete() {
    const titulo = document.getElementById("titulo").value;
    const dataInicio = document.getElementById("dataInicio").value;
    const dataFim = document.getElementById("dataFim").value;
    const opcao = document.getElementById("opcoes").value;

    const enquete = JSON.stringify({
        titulo: titulo,
        dataInicio: dataInicio,
        dataFim: dataFim,
        opcoes: [{titulo: opcao}]
    });

    console.log(enquete);

    const res = await fetch("http://localhost:3000/enquetes", {
        method: "POST",
        body: enquete,
        headers: {
            "Content-Type": "application/json"
        },
    });
    const json = await res.json();

    console.log(json);
}