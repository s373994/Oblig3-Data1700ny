$(function() {
    hentAlleBilletter();
});
let ticketArray = [];
function kjopBillett() {
    let film = document.getElementById("filmValg").value;
    let antall = document.getElementById("antall").value;
    let fnavn = document.getElementById("fnavn").value;
    let enavn = document.getElementById("enavn").value;
    let epost = document.getElementById("epost").value;
    let telefonNr = document.getElementById("telefonNr").value;
    let feilmelding = false;

    if (film === "0") {
        document.getElementById("ikkeGyldigF").innerHTML = " Vennligst velg en film";
        feilmelding = true;
    }

    if (antall === "" || antall <= 0) {
        document.getElementById("ikkeGyldigAntall").innerHTML = "Vennligst velg gyldig antall billetter";
        feilmelding = true;
    }

    if (fnavn === "") {
        document.getElementById("ikkeGyldigFornavn").innerHTML = " Vennligst fyll ut fornavn";
        feilmelding = true;
    }

    if (enavn === "") {
        document.getElementById("ikkeGyldigEpost").innerHTML = " Vennligst fyll ut etternavn";
        feilmelding = true;
    }

    if (epost === "" || !epost.includes('@')) {
        document.getElementById("ikkeGyldigEpost").innerHTML = "Dette er ikke en gyldig epost";
        feilmelding = true;
    }

    if (telefonNr === "") {
        document.getElementById("ikkeGyldigTlf").innerHTML = "Dette er ikke et gyldig telefonnummer";
        feilmelding = true;
    }

    if (!feilmelding) {
        let billettData = {
            film: film,
            antallBilletter: antall,
            fnavn: fnavn,
            enavn: enavn,
            epost: epost,
            telefonNr: telefonNr
        };

        $.ajax({
            url: '/lagre',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(billettData),
            success: function(response) {
                console.log('Lagring vellykket: ', response);
                tomInputFelter();
                hentAlleBilletter();
            },
            error: function(error) {
                console.log('Lagring feilet: ', error);
            }
        });
    }
}

function tomInputFelter() {
    document.getElementById("filmValg").value = "0";
    document.getElementById("antall").value = "";
    document.getElementById("fnavn").value = "";
    document.getElementById("enavn").value = "";
    document.getElementById("epost").value = "";
    document.getElementById("telefonNr").value = "";
    tomFeilmeldinger();
}

function tomFeilmeldinger() {
    document.getElementById("ikkeGyldigF").innerHTML = "";
    document.getElementById("ikkeGyldigAntall").innerHTML = "";
    document.getElementById("ikkeGyldigFornavn").innerHTML = "";
    document.getElementById("ikkeGyldigEtternavn").innerHTML = "";
    document.getElementById("ikkeGyldigEpost").innerHTML = "";
    document.getElementById("ikkeGyldigTlf").innerHTML = "";
}

function hentAlleBilletter() {
    $.ajax({
        url: '/hentAlleSammen',
        type: 'GET',
        contentType: 'application/json',
        success: function(billetter) {
            visBillettTabell(billetter);
        },
        error: function(error) {
            console.log('Feil ved henting av billetter: ', error);
        }
    });
}

function visBillettTabell(billetter) {
    let ut = "<table class='table table-striped'><tr>" +
        "<th>Film</th><th>Billetter</th><th>Fornavn</th><th>Etternavn</th><th>Epost</th><th>TelefonNr</th><th>Handlinger</th></tr>";
    billetter.forEach(function(billett) {
        ut += "<tr>" +
            "<td>" + billett.film + "</td>" +
            "<td>" + billett.antallBilletter + "</td>" +
            "<td>" + billett.fnavn + "</td>" +
            "<td>" + billett.enavn + "</td>" +
            "<td>" + billett.epost + "</td>" +
            "<td>" + billett.telefonNr + "</td>" +
            "<td>" +
            "<button onclick='slettEn(" + billett.id + ")' class='btn btn-danger'>Slett</button></td></tr>";
    });
    document.getElementById("billettTabell").innerHTML = ut;
}

function slettAlle() {
    $.ajax({
        url: "/slettAlleBilletter",
        type: "DELETE",
        success: function () {
            // Rens tabellen og input-felter etter vellykket sletting
            $("#billettTabell").html(""); // Pass på at dette IDet matcher IDet i din HTML for billett-tabellen
            $("#filmValg").val("0"); // Setter tilbake til default verdi
            $("#antall").val("");
            $("#fnavn").val("");
            $("#enavn").val("");
            $("#epost").val("");
            $("#telefonNr").val("");
            console.log("Alle billetter er slettet.");
        },
        error: function (error) {
            console.error("Feil ved sletting av alle billetter: ", error);
        }
    });
}
function slettEn(id) {
    const url = "/slettEn?id=" + id;
    $.get(url, function () {
        hentAlleBilletter();
    });
}