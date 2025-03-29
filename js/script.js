class QuizGame {
  constructor() {
    this.score = 0;
    this.currentQuestion = 0;
    this.questions = [];
    this.forms = [];
  }

  initializeScore() {
    this.score = 0;
    document.getElementById("score").textContent = this.score;
  }
  incrementScore() {
    this.score++;
    document.getElementById("score").textContent = this.score;
  }

  fetchQuiz() {
    return fetch(
      "https://opentdb.com/api.php?amount=10&category=23&difficulty=medium&type=multiple"
    )
      .then((response) => response.json())
      .then((data) => {
        // parse out response code, keep array of results
        this.questions = data.results;
        return this.questions;
      })
      .catch((error) => console.error(error));
  }

  handleSubmit(event, question, index) {
    const form = event.target.closest("form");
    const selected = form.querySelector('input[type="radio"]:checked');
    if (selected) {
      console.log("Selected: " + selected.value);
      console.log("Correct answer: " + question.correct_answer);

      if (selected.value === question.correct_answer) {
        console.log("Correct!");
        this.incrementScore();
      } else {
        console.log("Incorrect!");
      }
      this.nextQuestion(index);
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
      console.log("No more questions");
    }
  }

  createForms() {
    console.log("Making forms for questions", this.questions);
    this.questions.forEach((question, index) => {
      const currentRender = index + 1;
      // Form container
      const questionForm = document.createElement("form");
      // Question text
      const questionTracker = document.createElement("h2");
      questionTracker.innerHTML = "Question " + currentRender;
      const questionText = document.createElement("h3");
      questionText.innerHTML = question.question;
      questionForm.appendChild(questionTracker);
      questionForm.appendChild(questionText);

      // concat incorrect and correct answers
      const answers = [...question.incorrect_answers, question.correct_answer];
      // shuffle answers here vvv
      // console.log(answers);
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

