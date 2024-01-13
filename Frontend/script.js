async function saveEnquete() {
    const titulo = document.getElementById("titulo").value;
    const dataInicio = document.getElementById("dataInicio").value;
    const dataFim = document.getElementById("dataFim").value;
    const opcao = document.getElementById("opcoes").value;

    const enquete = JSON.stringify({
        titulo: titulo,
        dataInicio: dataInicio,
        dataFim: dataFim,
        opcoes: opcao
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