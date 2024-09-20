const http = require("node:http");
const url = require("node:url");
const fs = require("node:fs");

let adatok = [];
fs.readFile("torna.csv", "utf8", (error, data) => {
    if (error) console.log(error);
    else {
        let sorok = data.split("\r\n");
        for (let sor of sorok) {
            let elem = sor.split(";");
            let a = { nev:elem[0], nem:elem[1], kor:elem[2]*1, magas:elem[3]*1, suly:elem[4]*1};
            adatok.push(a);
        }
    }
});

const server = http.createServer((request, response) => {
    rUrl = url.parse(request.url, true);
    pathname = rUrl.pathname;
    query = rUrl.query;

    response.writeHead(200, "OK", {
        "Content-Type" : "application/json",
        "Access-Control-Allow-Origin" : "*"
    });

    let json = errorMessage();

    if (pathname == "/adat" && query.nev) json = nev(query);
    if (pathname == "/adat" && query.nem) json = nem(query);
    if (pathname == "/adat" && query.kor) json = kor(query);
    if (pathname == "/adat" && query.magas) json = magas(query);
    if (pathname == "/adat" && query.suly) json = suly(query);
    if (pathname == "/magas" && query.fx) json = fx(query);
    if (pathname == "/magas" && query.fx) json = fx(query);
    if (pathname == "/magas" && query.fx) json = fx(query);

    response.end(JSON.stringify(json));
});

server.listen(88);

function errorMessage() {
    let urls = [
        "/adat?nev=nev -> { nev, nem, kor, magas, suly }",
        "/adat?nem=nem -> { nev, nem, kor, magas, suly }, ...",
        "/adat?kor=kor -> { nev, nem, kor, magas, suly }, ...",
        "/adat?magas=magas -> { nev, nem, kor, magas, suly }, ...",
        "/adat?suly=suly -> { nev, nem, kor, magas, suly }, ...",
        "/magas?fx=atlag -> { atlag }",
        "/magas?fx=min -> { min }",
        "/magas?fx=max -> { max }"
    ]

    let json = { Error: "Invalid Query", urls };

    return json;
}

function nev(query) {
    let data = [];
    for (let adat of adatok) {
        if (adat.nev == query.nev) {
            data.push(adat);
        }
    }
    return [ ...data ].sort();
}

function nem(query) {
    let data = [];
    for (let adat of adatok) {
        if (adat.nem == query.nem) {
            data.push(adat);
        }
    }
    return [ ...data ].sort();
}

function kor(query) {
    let data = [];
    for (let adat of adatok) {
        if (adat.kor == query.kor) {
            data.push(adat);
        }
    }
    return [ ...data ].sort();
}

function magas(query) {
    let data = [];
    for (let adat of adatok) {
        if (adat.magas == query.magas) {
            data.push(adat);
        }
    }
    return [ ...data ].sort();
}

function suly(query) {
    let data = [];
    for (let adat of adatok) {
        if (adat.suly == query.suly) {
            data.push(adat);
        }
    }
    return [ ...data ].sort();
}

function fx(query) {
    if (query.fx == "atlag") {
        let atlag = 0;
        for (let adat of adatok) {
            atlag += adat.magas;
        }
        atlag /= adatok.length;
        let adat = { atlag:Math.floor(atlag) };
        return adat;
    } else if (query.fx == "min") {
        let min = 1000;
        for (let adat of adatok) {
            if (adat.magas < min) min = adat.magas;
        }
        let adat = { min:min };
        return adat;
    } else if (query.fx == "max") {
        let max = 0;
        for (let adat of adatok) {
            if (adat.magas > max) max = adat.magas;
        }
        let adat = { max:max };
        return adat;
    } else {
        return errorMessage();
    }
}