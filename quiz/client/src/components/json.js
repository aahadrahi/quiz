export const json = {
  "title": "Quiz Test",
  "showProgressBar": "bottom",
  "showTimerPanel": "top",
  "maxTimeToFinishPage": 15,
  "maxTimeToFinish": 60,
  "firstPageIsStarted": true,
  "startSurveyText": "Start Quiz",
  "pages": [
    {
      "elements": [
        {
          "type": "html",
          "html": "You are about to start a quiz on WCEI. <br>You will have 15 seconds for every question and 60 seconds to end the quiz."
        },
      
      ]
    },
    {
      "elements": [
        {
          "type": "radiogroup",
          "name": "1",
          "title": "When was the American Civil War?",
          "choices": [
            "1796-1803",
            "1810-1814",
            "1861-1865",
            "1939-1945"
          ],
          "correctAnswer": "1861-1865",
          "enableIf": " empty"
        }
      ]
    },
    
    {
      "elements": [
        {
          "type": "radiogroup",
          "name": "2",
          "title": "Whose quote is this: \"Give me liberty, or give me death\"?",
          "choicesOrder": "random",
          "choices": [
            "John Hancock",
            "James Madison",
            "Patrick Henry",
            "Samuel Adams"
          ],
          "correctAnswer": "Patrick Henry",
          "enableIf": "empty"
        }
      ]
    },
     {
      "elements": [
        {
          "type": "radiogroup",
          "name": "3",
          "title": "When was the American Civil War?",
          "choices": [
            "1796-1803",
            "1810-1814",
            "1861-1865",
            "1939-1945"
          ],
          "correctAnswer": "1861-1865",
          "enableIf": "empty"
        }
      ]
    },
    
    {
      "elements": [
        {
          "type": "radiogroup",
          "name": "4",
          "title": "What is Magna Carta?",
          "choicesOrder": "random",
          "choices": [
            "The foundation of the British parliamentary system",
            "The Great Seal of the monarchs of England",
            "The French Declaration of the Rights of Man",
            "The charter signed by the Pilgrims on the Mayflower"
          ],
          "correctAnswer": "The foundation of the British parliamentary system",
          "enableIf": "empty"
        }
      ]
    }
  ],
  // "completedHtml": "<h4>You got <b>{correctAnswers}</b> out of <b>{questionCount}</b> correct answers.</h4>",
  // "completedHtmlOnCondition": [
  //   {
  //     "expression": "{correctAnswers} == 0",
  //     "html": "<h4>Unfortunately, none of your answers is correct. Please try again.</h4>"
  //   },
  //   {
  //     "expression": "{correctAnswers} == {questionCount}",
  //     "html": "<h4>Congratulations! You answered all the questions correctly!</h4>"
  //   }
  // ]
};  