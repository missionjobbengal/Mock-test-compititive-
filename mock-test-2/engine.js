let current=0,answers=Array(questions.length).fill(null),timeLeft=TEST_CONFIG.durationMinutes*60,submitted=false,timerId;

const $=id=>document.getElementById(id);

function render(){
  const q=questions[current];
  $("questionNo").textContent=`প্রশ্ন ${current+1} / ${questions.length}`;
  $("questionText").textContent=q.q;
  $("options").innerHTML="";
  q.options.forEach((o,i)=>{
    const label=document.createElement("label");
    label.className="option";
    label.innerHTML=`<input type="radio" name="opt" value="${i}" ${answers[current]===i?"checked":""}> <span>${String.fromCharCode(65+i)}. ${o}</span>`;
    label.querySelector("input").onchange=e=>answers[current]=+e.target.value;
    $("options").appendChild(label);
  });
  $("prev").disabled=current===0;
  $("next").disabled=current===questions.length-1;
  $("progress").style.width=((current+1)/questions.length*100)+"%";
}
function tick(){
  const m=Math.floor(Math.max(0,timeLeft)/60),s=Math.max(0,timeLeft)%60;
  $("timer").textContent=`${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  if(timeLeft<=0) submit(true);
}
function submit(auto=false){
  if(submitted)return;
  submitted=true; clearInterval(timerId);
  let correct=0,wrong=0,unanswered=0;
  questions.forEach((q,i)=>{
    if(answers[i]===null)unanswered++;
    else if(answers[i]===q.answer)correct++;
    else wrong++;
  });
  const score=correct*TEST_CONFIG.marksPerCorrect-wrong*TEST_CONFIG.negativePerWrong;
  $("testArea").classList.add("hidden");
  $("result").classList.remove("hidden");
  $("resultTitle").textContent=auto?"সময় শেষ — পরীক্ষা জমা হয়েছে":"পরীক্ষা সম্পন্ন";
  $("score").textContent=score.toFixed(2);
  $("correct").textContent=correct;
  $("wrong").textContent=wrong;
  $("unanswered").textContent=unanswered;
}
$("prev").onclick=()=>{if(current>0){current--;render()}};
$("next").onclick=()=>{if(current<questions.length-1){current++;render()}};
$("submit").onclick=()=>submit(false);
$("restart").onclick=()=>location.reload();

$("totalQuestions").textContent=TEST_CONFIG.totalQuestions;
$("totalMarks").textContent=TEST_CONFIG.totalMarks;
render(); tick(); timerId=setInterval(()=>{timeLeft--;tick()},1000);
