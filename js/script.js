function fetchQuiz() {
  fetch('https://opentdb.com/api.php?amount=10&category=23&difficulty=medium&type=multiple')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const results = data.results;
      const questionList = document.createElement("ol");

      results.forEach(result => {
        console.log(result.question);
        const questionItem = document.createElement("li");
        const questionOptions = document.createElement("ul"); 
        
        const questionOptionsArray = result.incorrect_answers;
        questionOptionsArray.push(result.correct_answer);
        
        const questionOptionsContainer = document.createElement("ul");
        questionOptionsArray.forEach(option => {
          const choice = document.createElement("li");
          choice.innerHTML = option;
          questionOptionsContainer.appendChild(choice);
        })
        
        questionItem.textContent = result.question;
        questionList.appendChild(questionItem);        
        questionItem.appendChild(questionOptionsContainer);
      });

      document.getElementById("response").appendChild(questionList);
    })
    .catch(error => console.error(error));
}