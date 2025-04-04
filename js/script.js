let currentInstance = null;
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

  // Fetch and process quiz data into forms
  fetchQuiz() {
    return fetch(
      "https://opentdb.com/api.php?amount=3&difficulty=easy&type=multiple"
    )
      .then((response) => response.json())
      .then((data) => {
        // parse out response code, keep array of results
        this.questions = data.results;
        return this.questions;
      })
      .catch((error) => console.error(error));
  }
  createForms() {
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
    // Display question 1 to start
    this.forms[0].style.display = "flex";
    document.getElementById("active").style.display = "flex";
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
      // Evaluate answer
      if (selected.value === question.correct_answer) {
        console.log("Correct!");
        form.classList.add('formCorrect');
        this.incrementScore();
      } else {
        form.classList.add('formIncorrect');
        console.log("Incorrect!");
      }
      // Timeout for correct/incorrect animation to run
      setTimeout(() => {
        this.nextQuestion(index);
      }, 1000)
    } else {
      // Todo: visual feedback for no answer selected
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
    this.forms[this.forms.length - 1].style.display = "none";
    this.createCongrats();
    document.getElementById("scoreContainer").style.display = "none";
  }

  createCongrats() {
    const congratsPage = document.createElement("div");
    congratsPage.classList.add("congrats");
    const congratsMessage = document.createElement("h2");
    const congratsScore = document.createElement("h3");
    const congratsScoreCounter = document.createElement("div");
    const congratsRewardText = document.createElement ("div");
    const congratsPlayAgain = document.createElement("button");
    congratsPlayAgain.classList.add("playAgain");
    congratsPlayAgain.addEventListener("click", () => this.playAgain());

    congratsPage.appendChild(congratsMessage);
    congratsPage.appendChild(congratsScore);
    congratsPage.appendChild(congratsScoreCounter);
    congratsPage.appendChild(congratsRewardText);
    
    const congratsCarousel = new Carousel();
    congratsCarousel.fetchImages().then(() => {
      congratsCarousel.createCarousel();
      congratsPage.appendChild(congratsPlayAgain);
    })


    congratsMessage.textContent = "Thanks for playing!";
    congratsScore.textContent = "Your final score: ";
    congratsScoreCounter.textContent = Math.round((this.score / this.forms.length) * 100) + "%";
    congratsRewardText.textContent = "Your reward:";
    congratsPlayAgain.textContent = "Play again?";

    document.getElementById("active").appendChild(congratsPage);
  }

  playAgain() {
    currentInstance = null;
    this.deleteForms();
    this.deleteCongrats();
    startQuiz();
  }

  deleteForms() {
    this.forms.forEach(form => form.remove());
    this.forms = [];
  }

  deleteCongrats() {
    document.querySelector(".congrats").remove();
  }
}

class Carousel {
  constructor() {
    this.images = [];
  }
  fetchImages() {
    return fetch(
      "https://api.thecatapi.com/v1/images/search?limit=10"
    )
      .then((response) => response.json())
      .then((data) => {
        this.images = data;
        return this.images;
      })
      .catch((error) => console.error(error));
  }
  createCarousel() {
    const carouselTarget = document.getElementsByClassName("congrats")[0];
    const carouselContainer = document.createElement("div");
    carouselContainer.classList.add("carousel");

    const buttonLeft = document.createElement("button");
    const buttonRight = document.createElement("button");
    buttonLeft.classList.add("carouselButton");
    buttonRight.classList.add("carouselButton");

    buttonLeft.innerHTML = "&#8249;";
    buttonRight.innerHTML = "&#8250;";

    const carouselSlides = document.createElement("ul");
    carouselSlides.classList.add("carouselSlides");

    carouselContainer.appendChild(buttonLeft);
    this.images.forEach((image) => {
      const carouselSlide = document.createElement("li");
      carouselSlide.classList.add("carouselSlide");
      const carouselImage = document.createElement("img");
      carouselImage.classList.add("carouselImage");
      carouselImage.src = image.url;
      carouselSlide.appendChild(carouselImage);
      carouselSlides.appendChild(carouselSlide);
    })

    buttonLeft.addEventListener("click", () => {
      buttonLeft.disabled = true;
      buttonRight.disabled = true;

      const slideWidth = document.querySelector(".carouselSlide").clientWidth;
      carouselSlides.scrollLeft -= slideWidth;
      setTimeout(() => {
        buttonLeft.disabled = false;
        buttonRight.disabled = false;
      }, 500)
    })

    buttonRight.addEventListener("click", () => {
      buttonLeft.disabled = true;
      buttonRight.disabled = true;
      const slideWidth = document.querySelector(".carouselSlide").clientWidth;
      carouselSlides.scrollLeft += slideWidth;
      setTimeout(() => {
        buttonLeft.disabled = false;
        buttonRight.disabled = false;
      }, 500)
    })

    carouselContainer.appendChild(carouselSlides);
    carouselContainer.appendChild(buttonRight);

    carouselTarget.appendChild(carouselContainer);
  }
}

function startQuiz() {
  document.getElementById("startButton").style.display = "none";
  document.getElementById("scoreContainer").style.display = "flex";
  currentInstance = new QuizGame();
  currentInstance.initializeScore();
  currentInstance.fetchQuiz().then(() => {
    currentInstance.createForms();
  });
}

