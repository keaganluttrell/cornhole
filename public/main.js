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

function setup() {
	const startBtn = document.getElementById("start-btn");
	const stopBtn = document.getElementById("stop-btn");
	startBtn.addEventListener("click", start);
	stopBtn.addEventListener("click", () => completeGame("Complete"));
}

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
	const startBtn = document.getElementById("start-btn");
	const stopBtn = document.getElementById("stop-btn");
	startBtn.className = "btn";
	stopBtn.className = "btn hidden";
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
		th.innerText = i + 1;
		tr.appendChild(th);
	}
	thead.appendChild(tr);
	table.appendChild(thead);
	table.appendChild(tbody);
	const scores = document.getElementById("scores");
	scores.appendChild(table);
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

function start() {
	annyang.start();

	const btnDiv = document.querySelector("div.btn-container");
	btnDiv.innerText = "Try Saying: ";

	for (const key of Object.keys(RESULTS)) {
		const btn = document.createElement("button");
		btn.innerText = key;
		btn.className = "btn " + key;
		btn.addEventListener("click", () => listenForToss(btn.innerText));
		btnDiv.appendChild(btn);
	}
	createTable();
	setTimeout(() => speak("Lets go!"), 1000);
	const startBtn = document.getElementById("start-btn");
	const stopBtn = document.getElementById("stop-btn");
	startBtn.className = "btn hidden";
	stopBtn.className = "btn";
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
		console.log("Annyang is ready!");
	} else {
		console.log(
			"Annyang not found or browser does not support Speech Recognition",
		);
	}
});

setup();
