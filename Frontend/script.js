const source = new EventSource('http://localhost:3000/connect');

// SSE
source.addEventListener('open', () => {
    console.log("Connection opened");
});
source.addEventListener('voto', (event) => {
    const opcao = JSON.parse(event.data);
    updateVotoElement(opcao);
});
source.addEventListener('status', (event) => {
    const enquete = JSON.parse(event.data);
    updateStatusElement(enquete);
});
source.addEventListener('enquete', (event) => {
    const enquete = JSON.parse(event.data);
    createEnqueteElement(enquete);
});


// Functions
async function loadEnquetes() {
    const enquetes = await fetch('http://localhost:3000/enquetes')
        .then(async r => await r.json());

    for (let enquete of enquetes) {
        createEnqueteElement(enquete);
    }
}

function createEnqueteElement(enquete) {
    const container = document.getElementById("enquetes_list_container");
    const div = document.createElement('div');

    const form = document.createElement('form');
    form.id = `enquete_${enquete.id}`;

    const table = document.createElement('table');
    for (let opcao of enquete.opcoes) {
        table.insertAdjacentHTML('afterbegin', `
            <tr>
                 <td><label for="opcao_${opcao.id}">${opcao.titulo}</label></td>
                 <td id="votos_opcao_${opcao.id}">${opcao.votos} votos</td> 
                 <td><input type="radio" name="opcao" id="opcao_${opcao.id}"></td>
            </tr>
        `);
    }
    form.append(table);

    form.insertAdjacentHTML('afterbegin', `<p>${enquete.titulo}</p>`);
    form.insertAdjacentHTML('beforeend', `
            <p>Inicio: ${enquete.dataInicio}</p>
            <p>Fim: ${enquete.dataFim}</p>
            <p id="status_enquete_${enquete.id}">Status: ${enquete.status}</p>
    `);

    const button = document.createElement('button');
    button.innerHTML = 'Votar';
    button.onclick = async (Event) => {
        Event.preventDefault();
        await addVoto(form.id);
    };
    form.append(button);

    div.append(form);
    div.classList.add('enquetes-div');

    container.appendChild(div);
}

function updateVotoElement(opcao) {
    const opcaoElement = document.getElementById(`votos_opcao_${opcao.id}`);
    opcaoElement.innerHTML = `${opcao.votos} votos`;
}

function updateStatusElement(enquete) {
    const enqueteElement = document.getElementById(`status_enquete_${enquete.id}`);
    enqueteElement.innerHTML = `Status: ${enquete.status}`;
}

async function addVoto(formId) {
    const enquete = document.getElementById(formId);

    let opcaoId;
    for (let opcao of enquete) {
        if (opcao.checked) {
            opcaoId = opcao.id.substring(6, opcao.id.length);
            break;
        }
    }

    await fetch(`http://localhost:3000/opcoes/${opcaoId}`, {
        method: "POST"
    });
}

async function saveEnquete() {
    const titulo = document.getElementById("titulo").value;
    const dataInicio = document.getElementById("dataInicio").value;
    const dataFim = document.getElementById("dataFim").value;
    const opcoes = getOpcoesOnForm();

    const enquete = JSON.stringify({
        titulo: titulo,
        dataInicio: dataInicio,
        dataFim: dataFim,
        opcoes: opcoes
    });

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

function getOpcoesOnForm() {
    const opcoesClass = document.getElementsByClassName('opcoes_form');
    const opcoes = [];

    for (let opcao of opcoesClass) {
        if (opcao.value) {
            opcoes.push({titulo: opcao.value});
        }
    }
    opcoes.reverse();

    return opcoes;
}