class QuizGame {
  // Game Variables
  constructor() {
    this.score = 0;
    this.currentQuestion = 0;
    this.questions = [];
    this.forms = [];
  }

  // Score Tracking
  initializeScore() {
    this.score = 0;
    this.updateScoreboard();
  }
  incrementScore() {
    this.score++;
    this.updateScoreboard();
  }
  updateScoreboard() {
    document.getElementById("score").textContent = this.score;
  }

  // Fetch quiz data
  fetchQuiz() {
    return fetch(
      "https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple"
    )
      .then((response) => response.json())
      .then((data) => {
        // parse out response code, keep array of results
        this.questions = data.results;
        return this.questions;
      })
      .catch((error) => console.error(error));
  }

  // Form interactions
  //   Shuffle helper function for answers (Fisher-Yates / Knuth shuffle)
  shuffle(array) {
    let currentIndex = array.length;
    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }
  //   Submit button on each question form
  handleSubmit(event, question, index) {
    const form = event.target.closest("form");
    const selected = form.querySelector('input[type="radio"]:checked');
    if (selected) {
      console.log("Selected: " + selected.value);
      console.log("Correct answer: " + question.correct_answer);

      if (selected.value === question.correct_answer) {
        console.log("Correct!");
        form.classList.add('formCorrect');
        this.incrementScore();
      } else {
        form.classList.add('formIncorrect');
        console.log("Incorrect!");
      }
      setTimeout(() => {
        this.nextQuestion(index);
      }, 1000)
    } else {
      console.log("Please select an answer");
    }

  }
  nextQuestion(index) {
    if (index < this.forms.length - 1) {
      this.forms[index].style.display = "none";
      this.forms[index + 1].style.display = "flex";
    }
    else {
      this.closeGame();
    }
  }

  closeGame() {
    console.log("game finished");
    this.forms[this.forms.length - 1].style.display = "none";

    const congratsPage = document.createElement("div");
    congratsPage.classList.add("congrats");
    const congratsMessage = document.createElement("h2");
    const congratsScore = document.createElement("h3");
    const congratsScoreCounter = document.createElement("div");
    const congratsPlayAgain = document.createElement("button");
    congratsPlayAgain.classList.add("playAgain");


    congratsPage.appendChild(congratsMessage);
    congratsPage.appendChild(congratsScore);
    congratsPage.appendChild(congratsScoreCounter);
    congratsPage.appendChild(congratsPlayAgain);

    congratsMessage.textContent = "Thanks for playing!";
    congratsScore.textContent = "Your final score: ";
    congratsScoreCounter.textContent = this.score;
    congratsPlayAgain.textContent = "Play again?";

    document.getElementById("active").appendChild(congratsPage);

    document.getElementById("scoreContainer").style.display = "none";

  }

  createForms() {
    console.log("Making forms for questions", this.questions);
    this.questions.forEach((question, index) => {
      const currentRender = index + 1;
      // Form container
      const questionForm = document.createElement("form");
      // Progress Tracker
      const progressTracker = document.createElement("div");
      progressTracker.classList.add("progressTracker");
      const progressBar = document.createElement("div");
      progressBar.style.width = ((currentRender / this.questions.length) * 100) + "%";
      progressBar.classList.add("progressBar");
      progressTracker.appendChild(progressBar);
      // Question text
      const questionTracker = document.createElement("h2");
      questionTracker.innerHTML = "Question " + currentRender;
      const questionText = document.createElement("h3");
      questionText.innerHTML = question.question;

      questionForm.appendChild(questionTracker);
      questionForm.appendChild(progressTracker);

      questionForm.appendChild(questionText);

      // concat incorrect and correct answers
      const answers = [...question.incorrect_answers, question.correct_answer];
      // shuffle answers
      this.shuffle(answers);

      // Radio buttons and labels
      const answerBox = document.createElement("div");
      answerBox.classList.add("answerbox");

      answers.forEach((answer) => {
        const answerContainer = document.createElement("div");
        answerContainer.classList.add("answercontainer");

        // Input buttons
        const choiceInput = document.createElement("input");
        choiceInput.type = "radio";
        choiceInput.id = "q" + currentRender + " " + answer;
        choiceInput.name = "choice" + currentRender;
        choiceInput.value = answer;
        choiceInput.required = "required";

        // Input Labels
        const choiceLabel = document.createElement("label");
        //
        choiceLabel.htmlFor = "q" + currentRender + " " + answer;
        choiceLabel.innerHTML = answer;

        answerContainer.appendChild(choiceInput);
        answerContainer.appendChild(choiceLabel);
        answerBox.appendChild(answerContainer);
      });
      questionForm.appendChild(answerBox);

      const submitQuestion = document.createElement("input");
      submitQuestion.type = "submit";
      submitQuestion.value = "Next question";


      // Logic after pressing button
      submitQuestion.addEventListener("click", (event) => {
        event.preventDefault();
        this.handleSubmit(event, question, index);
      });

      questionForm.appendChild(submitQuestion);
      // Hide by default, and archive new form
      questionForm.style.display = "none";
      this.forms.push(questionForm);
      document.getElementById("active").appendChild(questionForm);
    })
    // Display question 1
    this.forms[0].style.display = "flex";
    document.getElementById("active").style.display = "flex";
  }

}

function startQuiz() {
  document.getElementById("startButton").style.display = "none";
  document.getElementById("scoreContainer").style.display = "flex";
  const game = new QuizGame();
  game.initializeScore();
  game.fetchQuiz().then(() => {
    game.createForms();
  });
}

