const services=[
["⌂","Arkivkjerne","Kjernetjenester og fellesløsninger","ok"],
["▤","Digitalarkivet","Tilgang til arkivmateriale og publisering","ok"],
["⇄","eFormidling","Meldingsutveksling og integrasjon","warn"],
["✉","SvarUt / SvarInn","Inn- og utgående meldinger","ok"],
["◯","eInnsyn","Ordinær innsynshåndtering","ok"],
["♙","ID-porten","Elektronisk identifikasjon og tilgang","ok"],
["♙","Maskinporten","Maskin-til-maskin autentisering","ok"],
["▦","Altinn","Skjema, tjenester og integrasjoner","ok"],
["KS","KS Fiks","Felles infrastruktur og deletjenester","ok"],
["⌁","Sertifikater","TLS- og virksomhetssertifikater","ok"]
];
const channels=[
["Mottak","Operativ","12","14.05.2026 10:23:11","215 ms","ok"],
["Validering","Varsel","35","14.05.2026 10:22:58","1250 ms","warn"],
["Transformasjon","Operativ","8","14.05.2026 10:23:02","198 ms","ok"],
["Distribusjon SvarUt","Operativ","5","14.05.2026 10:23:05","210 ms","ok"],
["Distribusjon SvarInn","Operativ","7","14.05.2026 10:23:07","205 ms","ok"]
];
const checks=[
["Database – Arkivkjerne","OK","10:24:01"],["Sikkerhetskopi – Nattlig","OK","03:15:22"],
["Lagringskapasitet","OK","10:20:11"],["Sertifikat – Utløper","OK","45 dager"],["Integrasjonspunkter","OK","10:23:55"]
];
document.querySelector("#services").innerHTML=services.map(s=>`
<article class="service"><div class="service-icon">${s[0]}</div><h3>${s[1]}</h3><p>${s[2]}</p>
<div class="status ${s[3]}">● &nbsp;${s[3]==="warn"?"Varsel":"Operativ"}</div></article>`).join("");
document.querySelector("#channelRows").innerHTML=channels.map(c=>`
<tr><td>${c[0]}</td><td class="table-${c[5]}">● &nbsp;${c[1]}</td><td>${c[2]}</td><td>${c[3]}</td><td class="table-${c[5]}">${c[4]}</td></tr>`).join("");
document.querySelector("#checks").innerHTML=checks.map(c=>`
<div class="check"><span>${c[0]}</span><b>● ${c[1]}</b><small>${c[2]}</small></div>`).join("");
document.querySelector("#refresh").addEventListener("click",()=>{
  document.querySelector("#updated").textContent="Sist oppdatert: "+new Date().toLocaleTimeString("no-NO",{hour:"2-digit",minute:"2-digit"});
});
