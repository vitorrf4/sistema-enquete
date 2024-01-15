async function loadEnquetes() {
    const enquetes = await fetch('http://localhost:3000/enquetes')
        .then(async r => await r.json());

    for (let enquete of enquetes) {
        createEnqueteHTML(enquete);
    }
}

function createEnqueteHTML(enquete) {
    const container = document.getElementById("enquetes_list_container");
    const div = document.createElement('div');

    const form = document.createElement('form');
    form.id = `enquete_${enquete.id}`;

    const table = document.createElement('table');
    for (let opcao of enquete.opcoes) {
        table.insertAdjacentHTML('afterbegin', `
            <tr>
                 <td><label for="opcao1">${opcao.titulo}</label></td>
                 <td>${opcao.votos} votos</td> 
                 <td><input type="radio" name="opcao" id="opcao_${opcao.id}"></td>
            </tr>
        `);
    }
    form.append(table);

    form.insertAdjacentHTML('afterbegin', `<p>${enquete.titulo}</p>`);
    form.insertAdjacentHTML('beforeend', `
            <p>Inicio: ${enquete.dataInicio}</p>
            <p>Fim: ${enquete.dataFim}</p>
            <p>Status: ${enquete.status}</p>
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
    const opcoes = getOpcoesFromHTML();

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

function getOpcoesFromHTML() {
    const opcoesClass = document.getElementsByClassName('opcoes_form');
    const opcoes = [];

    for (let opcao of opcoesClass) {
        if (opcao.value) {
            opcoes.push({titulo: opcao.value});
        }
    }

    return opcoes;
}