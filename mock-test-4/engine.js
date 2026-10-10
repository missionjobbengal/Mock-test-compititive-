let current = 0;

let answers = Array(questions.length).fill(null);

let timeLeft = TEST_CONFIG.durationMinutes * 60;

let submitted = false;

let timerId;


const $ = id => document.getElementById(id);


// ===============================
// RENDER CURRENT QUESTION
// ===============================

function render() {

  const q = questions[current];

  $("questionNo").textContent =
    `প্রশ্ন ${current + 1} / ${questions.length}`;

  $("questionText").textContent = q.q;

  $("options").innerHTML = "";


  q.options.forEach((o, i) => {

    const label = document.createElement("label");

    label.className = "option";

    label.innerHTML = `
      <input
        type="radio"
        name="opt"
        value="${i}"
        ${answers[current] === i ? "checked" : ""}
      >

      <span>
        ${String.fromCharCode(65 + i)}. ${o}
      </span>
    `;


    label.querySelector("input").onchange = e => {

      answers[current] = +e.target.value;

    };


    $("options").appendChild(label);

  });


  $("prev").disabled = current === 0;

  $("next").disabled =
    current === questions.length - 1;


  $("progress").style.width =
    ((current + 1) / questions.length * 100) + "%";
}


// ===============================
// TIMER
// ===============================

function tick() {

  const safeTime = Math.max(0, timeLeft);

  const m = Math.floor(safeTime / 60);

  const s = safeTime % 60;


  $("timer").textContent =
    `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;


  if (timeLeft <= 0) {

    submit(true);

  }

}


// ===============================
// CREATE REVIEW
// ===============================

function createReview() {

  const review = $("review");

  review.innerHTML = "";


  questions.forEach((q, i) => {

    const userAnswer = answers[i];

    const correctAnswer = q.answer;


    const card = document.createElement("div");

    card.className = "review-card";


    // Question header

    const questionHeader = document.createElement("div");

    questionHeader.className = "review-question";


    questionHeader.innerHTML = `
      <span class="review-number">
        প্রশ্ন ${i + 1}
      </span>

      <span class="review-question-text">
        ${escapeHTML(q.q)}
      </span>
    `;


    card.appendChild(questionHeader);


    // Options

    const optionsBox = document.createElement("div");

    optionsBox.className = "review-options";


    q.options.forEach((option, optionIndex) => {

      const optionDiv = document.createElement("div");

      optionDiv.className = "review-option";


      const letter =
        String.fromCharCode(65 + optionIndex);


      // Correct option

      if (optionIndex === correctAnswer) {

        optionDiv.classList.add("review-correct");

        optionDiv.innerHTML = `
          <span class="review-letter">
            ${letter}.
          </span>

          <span class="review-option-text">
            ${escapeHTML(option)}
          </span>

          <span class="answer-label correct-label">
            ✓ সঠিক উত্তর
          </span>
        `;

      }

      // User selected wrong option

      else if (
        optionIndex === userAnswer &&
        userAnswer !== correctAnswer
      ) {

        optionDiv.classList.add("review-wrong");

        optionDiv.innerHTML = `
          <span class="review-letter">
            ${letter}.
          </span>

          <span class="review-option-text">
            ${escapeHTML(option)}
          </span>

          <span class="answer-label wrong-label">
            ✗ আপনার উত্তর
          </span>
        `;

      }

      // Normal option

      else {

        optionDiv.innerHTML = `
          <span class="review-letter">
            ${letter}.
          </span>

          <span class="review-option-text">
            ${escapeHTML(option)}
          </span>
        `;

      }


      optionsBox.appendChild(optionDiv);

    });


    card.appendChild(optionsBox);


    // Result status

    const status = document.createElement("div");

    status.className = "review-status";


    if (userAnswer === null) {

      status.classList.add("status-unanswered");

      status.innerHTML = `
        ⚪ আপনি এই প্রশ্নের উত্তর দেননি।
        <strong>
          সঠিক উত্তর:
          ${String.fromCharCode(65 + correctAnswer)}
        </strong>
      `;

    }

    else if (userAnswer === correctAnswer) {

      status.classList.add("status-correct");

      status.innerHTML = `
        🟢 আপনার উত্তর সঠিক।
      `;

    }

    else {

      status.classList.add("status-wrong");

      status.innerHTML = `
        🔴 আপনার উত্তর ভুল।
        <strong>
          সঠিক উত্তর:
          ${String.fromCharCode(65 + correctAnswer)}
        </strong>
      `;

    }


    card.appendChild(status);

    review.appendChild(card);

  });

}


// ===============================
// HTML ESCAPE
// ===============================

function escapeHTML(text) {

  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

}


// ===============================
// SUBMIT TEST
// ===============================

function submit(auto = false) {

  if (submitted) return;

  submitted = true;

  clearInterval(timerId);


  let correct = 0;

  let wrong = 0;

  let unanswered = 0;


  questions.forEach((q, i) => {

    if (answers[i] === null) {

      unanswered++;

    }

    else if (answers[i] === q.answer) {

      correct++;

    }

    else {

      wrong++;

    }

  });


  const score =
    correct * TEST_CONFIG.marksPerCorrect -
    wrong * TEST_CONFIG.negativePerWrong;


  // Hide test

  $("testArea").classList.add("hidden");


  // Show result

  $("result").classList.remove("hidden");


  $("resultTitle").textContent =
    auto
      ? "সময় শেষ — পরীক্ষা জমা হয়েছে"
      : "পরীক্ষা সম্পন্ন";


  $("score").textContent =
    score.toFixed(2);


  $("correct").textContent =
    correct;


  $("wrong").textContent =
    wrong;


  $("unanswered").textContent =
    unanswered;


  // IMPORTANT:
  // Generate complete review

  createReview();


  // Scroll to result

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


// ===============================
// BUTTONS
// ===============================

$("prev").onclick = () => {

  if (current > 0) {

    current--;

    render();

  }

};


$("next").onclick = () => {

  if (current < questions.length - 1) {

    current++;

    render();

  }

};


$("submit").onclick = () => {

  submit(false);

};


$("restart").onclick = () => {

  location.reload();

};


// ===============================
// INITIAL DATA
// ===============================

$("totalQuestions").textContent =
  questions.length;


$("totalMarks").textContent =
  TEST_CONFIG.totalMarks;


render();

tick();


timerId = setInterval(() => {

  timeLeft--;

  tick();

}, 1000);
