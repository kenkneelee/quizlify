function fetchQuiz() {
  return fetch('https://opentdb.com/api.php?amount=10&category=23&difficulty=medium&type=multiple')
      .then(response => response.json())
      .then(data => {
          // parse out response code, keep array of results
          console.log(data.results);
          return data.results;
      })
      .catch(error => console.error(error));
}

function startQuiz() {
  fetchQuiz().then(questions => {
      console.log("Starting quiz with questions:", questions);
      let currentQuestion = 0;
      questions.forEach(question => {
          // Form container
          const questionForm = document.createElement("form");
          // Question text      
          const questionText = document.createElement("h2");
          questionText.innerHTML = question.question;
          questionForm.appendChild(questionText);

          // concat incorrect and correct answers
          const answers = [...question.incorrect_answers, question.correct_answer];
          // shuffle answers here vvv

          console.log(answers);
          // Radio buttons and labels
          answers.forEach(answer => {
              // Input buttons
              const choiceInput = document.createElement("input");
              choiceInput.type = "radio";
              choiceInput.id = answer;
              choiceInput.name = "choice"
              choiceInput.value = answer;

              // Input Labels
              const choiceLabel = document.createElement("label");
              //
              choiceLabel.for = answer;
              choiceLabel.textContent = answer;

              questionForm.appendChild(choiceInput);
              questionForm.appendChild(choiceLabel);
          });

          const submitQuestion = document.createElement("button");
          submitQuestion.textContent = "Next question";

          // Logic after pressing button
          submitQuestion.addEventListener("click", function(event) {
              event.preventDefault();
              console.log("Next question clicked!");
          });

          questionForm.appendChild(submitQuestion);

          document.getElementById("active").appendChild(questionForm);
          console.log(question);
      });
  });
}

// Creates a bullet point list of results
      // const questionList = document.createElement("ol");

      // results.forEach(result => {
      //   console.log(result.question);
      //   const questionItem = document.createElement("li");
      //   const questionOptions = document.createElement("ul"); 
        
      //   const questionOptionsArray = result.incorrect_answers;
      //   questionOptionsArray.push(result.correct_answer);
        
      //   const questionOptionsContainer = document.createElement("ul");
      //   questionOptionsArray.forEach(option => {
      //     const choice = document.createElement("li");
      //     choice.innerHTML = option;
      //     questionOptionsContainer.appendChild(choice);
      //   })
        
      //   questionItem.textContent = result.question;
      //   questionList.appendChild(questionItem);        
      //   questionItem.appendChild(questionOptionsContainer);
      // });

      // document.getElementById("active").appendChild(questionList);