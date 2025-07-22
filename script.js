let score = 0;
const UserName = document.getElementById("name");
const startBtn = document.getElementById("startBtn");
const buttons = document.querySelectorAll(".category-btn");
const firstContainer = document.getElementById("first-container");
const secondContainer = document.getElementById("second-container");
const thirdContainer = document.getElementById("third-container");
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById("restart-btn");
let quizQuestions = []; // array to store fetched questions


secondContainer.style.display = "none";
thirdContainer.style.display = "none";
let category = "";


function display(){
    if (UserName.value === "") {
        alert("Enter your name before starting your quiz");
    } else {
        console.log("Selected category:", category);
        console.log(UserName.value);
        secondContainer.style.display = "block";
        firstContainer.style.display = "none";
        fetchQuizByCategory(category);
    }
}


function fetchQuizByCategory(categoryName) {
  fetch("http://localhost:3030/categories")
    .then(res => res.json())
    .then(data => {
      // Find the quiz matching the selected category
      const selectedQuiz = data.find(q => q.name === categoryName);
      
      if (selectedQuiz) {
        quizQuestions = selectedQuiz.questions; 
        showQuestion();
      } else {
        console.log("No quiz found for", categoryName);
      }
    })
    .catch(err => console.error("Error fetching data:", err));
}

let currentIndex = 0;
function showQuestion() {
  const item = quizQuestions[currentIndex];

  const content = `
    <div class="card p-3 mx-auto shadow" style="max-width: 600px;">
      <span class="m-1">Question ${currentIndex + 1}/${quizQuestions.length}</span>
      <div class="progress" style="height: 10px;">
        <div class="progress-bar bg-success" style="width: ${(currentIndex / quizQuestions.length) * 100}%"></div>
      </div>

      <h5 class="mt-4 text-center">${item.question}</h5>
      <div id="options" class="d-flex flex-column text-center">
          ${item.options.map((opt, idx) =>
  `<button class="btn btn-outline-primary my-2" data-index="${idx}"> ${opt || "Option " + (idx + 1)}</button>`
).join("")
}
      </div>

      <div id="explanation" class="explanation mt-3 container card p-2 border border-2 border-success" style="display: none; background-color: rgba(167, 230, 167, 0.596);">
        <h6 class="text-success">Explanation:</h6>
        <p>${item.explanation}</p>
      </div>

      <div class="text-end mt-3">
        <button id="next-btn" class="btn btn-primary" style="display: none;">Next Question</button>
      </div>
    </div>
  `;

  secondContainer.innerHTML = content;

  const optionButtons = document.querySelectorAll('#options button');
  const correctIndex = item.correctOption;
  const nextBtn = document.getElementById('next-btn');

  optionButtons.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      // Disable all buttons
      optionButtons.forEach(b => b.disabled = true);

      // Highlight correct/wrong
      
      if (idx === correctIndex) {
        btn.classList.remove('btn-outline-primary');
        btn.classList.add('btn-success');
        score++;
      } else {
        btn.classList.remove('btn-outline-primary');
        btn.classList.add('btn-danger');

        // Also highlight the correct one
        optionButtons[correctIndex].classList.remove('btn-outline-primary');
        optionButtons[correctIndex].classList.add('btn-success');
      }

      // Show explanation and next button
      document.getElementById('explanation').style.display = 'block';
      nextBtn.style.display = 'inline-block';
    });
  });

  nextBtn.addEventListener('click', () => {
    currentIndex++;
    if (currentIndex < quizQuestions.length) {
      showQuestion();
    } else {
      showFinalScreen();
    }
  });
}


function showFinalScreen(){
  secondContainer.style.display = "none";
  thirdContainer.style.display = "block";
  document.getElementById("final-score").innerHTML = `${score}/${quizQuestions.length}`;
  document.getElementById("final-bar").style.width = `${(score / quizQuestions.length) * 100}%`;
  document.getElementById("name-display").innerHTML = `Keep Practicing! ${UserName.value}`;
}

function restartQuiz() {
  currentIndex = 0;
  score = 0;
  thirdContainer.style.display = "none";
  firstContainer.style.display = "block";
}


buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
    category = btn.textContent.trim();
  });
});
startBtn.addEventListener('click', display);
restartBtn.addEventListener('click', restartQuiz);
