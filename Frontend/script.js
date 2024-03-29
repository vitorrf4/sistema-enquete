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
    div.id = `div_enquete_${enquete.id}`;

    const formattedStatus = getFormattedStatus(enquete.status);
    const formattedDateInicio = formatDate(enquete.dataInicio);
    const formatedDateFim = formatDate(enquete.dataFim);

    const form = createFormTable(enquete);

    form.insertAdjacentHTML('afterbegin', `<p class="bold">${enquete.titulo}</p>`);
    form.insertAdjacentHTML('beforeend', `
            <p>Inicio: ${formattedDateInicio}</p>
            <p>Fim: ${formatedDateFim}</p>
            <p id="status_enquete_${enquete.id}">Status: ${formattedStatus}</p>
    `);

    const button = createButtons(enquete);
    form.append(button);

    div.append(form);
    div.classList.add('enquetes-div', enquete.status.toLowerCase());

    container.appendChild(div);
}

function formatDate(date) {
    const dateObject = new Date(date);

    const dateString =  dateObject.toLocaleDateString();
    const timeString =  dateObject.toLocaleTimeString().substring(0, 5);

    return `${dateString} ${timeString}`;
}

function getFormattedStatus(status) {
    switch (status) {
        case "NAO_INICIADA": return "Não Iniciada";
        case "EM_ANDAMENTO": return "Em Andamento";
        case "FINALIZADA": return "Encerrada";
        default: return "";
    }
}

function createFormTable(enquete) {
    const form = document.createElement('form');
    form.id = `enquete_${enquete.id}`;

    const table = document.createElement('table');

    for (let opcao of enquete.opcoes) {
        const votoOuVotos = (opcao.votos === 1) ? 'voto' : "votos";

        const tr = document.createElement('tr');
        tr.insertAdjacentHTML('afterbegin', `
             <td><label for="opcao_${opcao.id}">${opcao.titulo}</label></td>
             <td id="votos_opcao_${opcao.id}">${opcao.votos} ${votoOuVotos}</td> 
        `);

        let input = `<td><input type="radio" name="opcao" id="opcao_${opcao.id}"`;

        const estaEmAndamento = enquete.status === "EM_ANDAMENTO";
        if (!estaEmAndamento) {
            input += `disabled`;
        }
        input += `></td>`

        tr.insertAdjacentHTML('beforeend', input);
        table.append(tr);
    }
    form.append(table);

    return form;
}

function createButtons(enquete) {
    const button = document.createElement('button');
    button.innerHTML = 'Votar';
    button.id = `votar_enquete_${enquete.id}`;

    if (enquete.status !== "EM_ANDAMENTO") {
        button.disabled = true;
    }
    button.onclick = async (Event) => {
        Event.preventDefault();
        await addVoto(`enquete_${enquete.id}`);
    };

    return button;
}

function updateVotoElement(opcao) {
    const opcaoElement = document.getElementById(`votos_opcao_${opcao.id}`);

    const votoOuVotos = (opcao.votos === 1) ? 'voto' : "votos";
    opcaoElement.innerHTML = `${opcao.votos} ${votoOuVotos}`;
}

function updateStatusElement(enquete) {
    const enqueteElement = document.getElementById(`status_enquete_${enquete.id}`);
    const formattedStatus = getFormattedStatus(enquete.status);
    enqueteElement.innerHTML = `Status: ${formattedStatus}`;

    const div = document.getElementById(`div_enquete_${enquete.id}`);
    div.classList = [];
    div.classList.add('enquetes-div', enquete.status.toLowerCase());

    const botaoVotar = document.getElementById(`votar_enquete_${enquete.id}`);
    const shouldBeDisabled = enquete.status !== "EM_ANDAMENTO";
    botaoVotar.disabled = shouldBeDisabled;

    const form = document.getElementById(`enquete_${enquete.id}`);
    for (let opcao of form) {
        opcao.disabled = shouldBeDisabled;
    }
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

    if (!opcaoId) {
        alert("Nenhuma opção selecionada");
        return;
    }

    await fetch(`http://localhost:3000/opcoes/${opcaoId}`, {
        method: "POST"
    }).then(() => {
        disableEnquete(formId);
    });
}

function disableEnquete(formId) {
    const button = document.getElementById(`votar_${formId}`);
    button.disabled = true;
    button.insertAdjacentHTML('afterend', ' Voto enviado!');

    const enquete = document.getElementById(formId);
    for (let opcao of enquete) {
        opcao.disabled = true;
    }

}

async function saveEnquete() {
    const titulo = document.getElementById("titulo").value;
    const dataInicio = document.getElementById("dataInicio").value;
    const dataFim = document.getElementById("dataFim").value;
    const opcoes = getOpcoesFromForm();

    if (!validateForm(titulo, dataInicio, dataFim, opcoes)) {
        return;
    }

    const enquete = JSON.stringify({
        titulo: titulo,
        dataInicio: dataInicio,
        dataFim: dataFim,
        opcoes: opcoes
    });

    await fetch("http://localhost:3000/enquetes", {
        method: "POST",
        body: enquete,
        headers: {
            "Content-Type": "application/json"
        },
    }).then(() => alert("Enquete criada com sucesso!"));
}

function getOpcoesFromForm() {
    const opcoesClass = document.getElementsByClassName('opcoes_form');
    const opcoes = [];

    for (let opcao of opcoesClass) {
        if (opcao.value) {
            opcoes.push({titulo: opcao.value});
        }
    }

    return opcoes;
}

function validateForm(titulo, dataInicio, dataFim, opcoes) {
    if (!titulo || !dataInicio || !dataFim || !opcoes ) {
        alert("Preencha todos os campos");
        return false;
    }

    if (dataFim <= dataInicio) {
        alert("A data fim deve ser maior que a data de inicio");
        return false;
    }

    const dateFim = new Date(dataFim);

    if (dateFim < new Date(Date.now())) {
        alert("A data de fim não pode ser menor que a data atual");
        return false;
    }

    if (opcoes.length < 3) {
        alert("A enquete deve possuir no mínimo 3 opções");
        return false;
    }

    return true;
}