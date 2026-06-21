let selected = [];
let index = 0;
let score = 0;
let points = 10;
let timer;
let timeLeft = 0;
let answers = [];

const setup = document.getElementById("setup");
const quiz = document.getElementById("quiz");
const result = document.getElementById("result");

const qCount = document.getElementById("qCount");
const qCustom = document.getElementById("qCustom");
const tLimit = document.getElementById("tLimit");
const tCustom = document.getElementById("tCustom");
const pPoints = document.getElementById("pPoints");
const pCustom = document.getElementById("pCustom");

qCount.onchange = () => qCustom.classList.toggle("hidden", qCount.value !== "custom");
tLimit.onchange = () => tCustom.classList.toggle("hidden", tLimit.value !== "custom");
pPoints.onchange = () => pCustom.classList.toggle("hidden", pPoints.value !== "custom");

document.getElementById("startBtn").onclick = startQuiz;

function startQuiz(){

    let count = qCount.value==="custom" ? +qCustom.value : +qCount.value;
    let time = tLimit.value==="custom" ? +tCustom.value : +tLimit.value;
    points = pPoints.value==="custom" ? +pCustom.value : +pPoints.value;

    selected = [...questionBank]
        .filter(q => true)
        .slice(0,count);

    index = 0;
    score = 0;
    answers = [];

    setup.classList.add("hidden");
    quiz.classList.remove("hidden");

    if(time > 0){
        timeLeft = time * 60;
        startTimer();
    }

    loadQ();
}

function startTimer(){
    updateTimer();
    timer = setInterval(()=>{
        timeLeft--;
        updateTimer();
        if(timeLeft<=0){
            clearInterval(timer);
            showResult();
        }
    },1000);
}

function updateTimer(){
    document.getElementById("timer").innerText =
    timeLeft>0 ?
    `Time: ${Math.floor(timeLeft/60)}:${timeLeft%60}` :
    "No Time Limit";
}

function loadQ(){

    let q = selected[index];

    document.getElementById("question").innerText =
    (index+1)+". "+q.question;

    let note = document.getElementById("note");
    let opt = document.getElementById("options");
    let fill = document.getElementById("fill");

    opt.innerHTML = "";
    fill.classList.add("hidden");
    note.innerText = "";

    if(q.type==="multiple"){
        note.innerText = "(Multiple options can be selected)";
    }

    if(q.type==="single" || q.type==="multiple"){
        q.options.forEach(o=>{
            opt.innerHTML += `
            <label class="option">
            <input type="${q.type==="single"?"radio":"checkbox"}" name="ans" value="${o}">
            ${o}
            </label>`;
        });
    } else {
        fill.classList.remove("hidden");
    }

    document.getElementById("nextBtn").innerText =
    index===selected.length-1 ? "Submit" : "Next";
}

document.getElementById("nextBtn").onclick = ()=>{

    save();

    if(index===selected.length-1){
        showResult();
    } else {
        index++;
        loadQ();
    }
};

function save(){

    let q = selected[index];
    let userAns = "";
    let correct = false;

    if(q.type==="single"){

        let sel = document.querySelector('input[name="ans"]:checked');
        userAns = sel ? sel.value : "";
        correct = userAns === q.answer;

    } else if(q.type==="multiple"){

        let sel = [...document.querySelectorAll('input[type=checkbox]:checked')]
        .map(x=>x.value);

        userAns = sel.join(", ");
        correct =
        sel.length===q.answer.length &&
        sel.every(a=>q.answer.includes(a));

    } else {

        userAns = document.getElementById("fill").value.trim();
        correct = userAns.toLowerCase()===q.answer.toLowerCase();
    }

    if(correct) score += points;

    answers.push({
        q:q.question,
        user:userAns,
        correct:q.answer
    });
}

function showResult(){

    clearInterval(timer);
    quiz.classList.add("hidden");
    result.classList.remove("hidden");

    let html =
    `<h2>Score: ${score}</h2><hr>`;

    answers.forEach((a,i)=>{
        html += `
        <p><b>Q${i+1}: ${a.q}</b></p>
        <p>Your: ${a.user}</p>
        <p>Correct: ${a.correct}</p>
        <hr>`;
    });

    html += `<button onclick="location.reload()">Play Again</button>`;

    result.innerHTML = html;
}