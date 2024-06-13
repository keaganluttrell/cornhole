const synth = window.speechSynthesis;
let rounds = [];
let tosses = [];

const ROUND_LENGTH = 8;

const RESULTS = {
	miss: 0,
	hit: 0,
	on: 1,
	in: 3,
};

function speak(text) {
	console.log("speaking...", text);
	const msg = new SpeechSynthesisUtterance(text);
	synth.speak(msg);
}

function calc(toss) {
	tosses.push(toss);
	if (tosses.length === ROUND_LENGTH) {
		const round = rounds.length + 1;
		speak("completed round " + round);
		rounds.push(tosses);
		tosses = [];
		createRow();
	}
	console.log(rounds);
	console.log(tosses);
}

function listenForToss(toss) {
	if (RESULTS[toss] === undefined) {
		return "err";
	}
	speak(toss);
	updateCell(getCell(), toss);
	calc(toss);
}

function completeGame(msg) {
	speak(msg);
	const div = document.createElement("div");
	div.innerText = "complete";
	annyang.abort();
	document.querySelector("body").append(div);
	console.log(rounds);
}

function createTable() {
	const table = document.createElement("table");
	const thead = document.createElement("thead");
	const tr = document.createElement("tr");
	const rh = document.createElement("th");
	const tbody = document.createElement("tbody");
	rh.innerText = "Round";
	tr.appendChild(rh);

	for (let i = 0; i < ROUND_LENGTH; i++) {
		const th = document.createElement("th");
		tr.appendChild(th);
	}
	thead.appendChild(tr);
	table.appendChild(thead);
	table.appendChild(tbody);
	createRow();
}

function createRow() {
	const tbody = document.querySelector("tbody");
	const row = document.createElement("tr");
	const round = document.createElement("td");
	round.innerText = rounds.length + 1;
	row.appendChild(round);
	tbody.appendChild(row);
	for (let i = 0; i < ROUND_LENGTH; i++) {
		const data = document.createElement("td");
		data.innerText = "";
		data.id = `${rounds.length + 1}-${i + 1}`;
		row.append(data);
	}
}

function getCell() {
	const r = rounds.length + 1;
	const t = tosses.length + 1;
	return `${r}-${t}`;
}

function updateCell(cell, toss) {
	const c = document.getElementById(cell);
	c.innerText = toss;
	c.className = toss;
}

document.addEventListener("DOMContentLoaded", function () {
	if (annyang) {
		const commands = {
			hit: () => listenForToss("hit"),
			miss: () => listenForToss("miss"),
			on: () => listenForToss("on"),
			in: () => listenForToss("in"),
			done: () => completeGame("Complete"),
		};
		annyang.addCommands(commands);
		annyang.start();
		console.log("Annyang is ready!");
		setTimeout(() => speak("Lets go!"), 1000);
		createTable();
	} else {
		console.log(
			"Annyang not found or browser does not support Speech Recognition",
		);
	}
});

const btns = document.getElementsByClassName("btn");
console.log(btns);

for (const b of btns) {
	b.addEventListener("click", () => listenForToss(b.innerText));
}
