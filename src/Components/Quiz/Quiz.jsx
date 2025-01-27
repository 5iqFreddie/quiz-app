import React, { useState, useEffect } from 'react';
import './Quiz.css';

const Quiz = () => {
  const [quizData, setQuizData] = useState([]);
  const [index, setIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [answerSelected, setAnswerSelected] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [timer, setTimer] = useState(10);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // New state to disable buttons

  useEffect(() => {
    if (quizStarted) {
      fetch('/QuizData.json')
        .then((response) => response.json())
        .then((data) => {
          setQuizData(data.questions);
          setCurrentQuestion(data.questions[index]);
        })
        .catch((error) => console.error('Error fetching quiz data:', error));

      const interval = setInterval(() => {
        if (timer > 0 && !answerSelected && !gameOver) {
          setTimer((prevTimer) => prevTimer - 1);
        }
      }, 1000);

      if (timer === 0 || answerSelected || gameOver) {
        clearInterval(interval);
      }

      if (timer === 0 && !answerSelected && !gameOver) {
        moveToNextQuestion();
      }

      return () => clearInterval(interval);
    }
  }, [timer, answerSelected, gameOver, index, quizStarted]);

  const nextQuestion = () => {
    if (index < quizData.length - 1) {
      setIndex(index + 1);
      setCurrentQuestion(quizData[index + 1]);
      setTimer(10); 
      setAnswerSelected(false);
      setIsCorrect(null);
      setIsButtonDisabled(false); // Re-enable the buttons when moving to the next question
    } else {
      setGameOver(true);
    }
  };

  const moveToNextQuestion = () => {
    nextQuestion();
  };

  const checkAnswer = (answer) => {
    const correctAnswer = currentQuestion.answer;
    if (answer === correctAnswer) {
      setIsCorrect(true);
      setScore(score + 1);
    } else {
      setIsCorrect(false);
    }

    setAnswerSelected(true);
    setIsButtonDisabled(true);

    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const playAgain = () => {
    setIndex(0);
    setScore(0);
    setGameOver(false);
    setTimer(10);
    setAnswerSelected(false);
    setIsCorrect(null);
    setIsButtonDisabled(false);
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  return (
    <div className="container">
      {!quizStarted ? (
        <div className="start-screen">
          <h1>Welcome to the Quiz! 🎉</h1>
          <button onClick={startQuiz}>Start Quiz</button>
        </div>
      ) : (
        !gameOver ? (
          <>
            <h1>Quiz App💡</h1>
            <hr />
            <h2>{currentQuestion.Question}</h2>
            <ul>
              <li>
                <button
                  onClick={() => checkAnswer('a')}
                  disabled={isButtonDisabled}
                >
                  {currentQuestion.a}
                </button>
              </li>
              <li>
                <button
                  onClick={() => checkAnswer('b')}
                  disabled={isButtonDisabled}
                >
                  {currentQuestion.b}
                </button>
              </li>
              <li>
                <button
                  onClick={() => checkAnswer('c')}
                  disabled={isButtonDisabled}
                >
                  {currentQuestion.c}
                </button>
              </li>
              <li>
                <button
                  onClick={() => checkAnswer('d')}
                  disabled={isButtonDisabled}
                >
                  {currentQuestion.d}
                </button>
              </li>
            </ul>

            {isCorrect !== null && (
              <div>{isCorrect ? 'Correct!✅' : 'Wrong answer!❌'}</div>
            )}

            <div className="index">
              {index + 1} of {quizData.length} questions
            </div>
            <div className="timer">Time left: {timer}s⏲️</div>
          </>
        ) : (
          <div>
            <h1>{score === quizData.length ? 'Well played!🥳' : 'Game over!🤖'}</h1>
            <p className='score'>
              You got {score} out of {quizData.length} correct!
            </p>
            <button onClick={playAgain}>Play Again</button>
          </div>
        )
      )}
    </div>
  );
};

export default Quiz;
