import React, { useState, useEffect } from 'react';
import './Quiz.css';

const Quiz = () => {
  const [quizData, setQuizData] = useState([]);
  const [index, setIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [answerSelected, setAnswerSelected] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [timer, setTimer] = useState(10);
  const [score, setScore] = useState(0); // To track correct answers
  const [gameOver, setGameOver] = useState(false); // To track if the game is over

  useEffect(() => {
    // Fetch quiz data
    fetch('/QuizData.json')
      .then((response) => response.json())
      .then((data) => {
        setQuizData(data.questions);
        setCurrentQuestion(data.questions[index]);
      })
      .catch((error) => console.error('Error fetching quiz data:', error));

    // Start the timer when the question is displayed
    const interval = setInterval(() => {
      if (timer > 0 && !answerSelected && !gameOver) {
        setTimer((prevTimer) => prevTimer - 1);
      }
    }, 1000);

    // Clean up the interval
    if (timer === 0 || answerSelected || gameOver) {
      clearInterval(interval);
    }

    // If the timer runs out, move to the next question
    if (timer === 0 && !answerSelected && !gameOver) {
      moveToNextQuestion();
    }

    return () => clearInterval(interval);
  }, [timer, answerSelected, gameOver, index]);

  const nextQuestion = () => {
    if (index < quizData.length - 1) {
      setIndex(index + 1);
      setCurrentQuestion(quizData[index + 1]);
      setTimer(10); // Reset the timer for the new question
      setAnswerSelected(false);
      setIsCorrect(null);
    } else {
      setGameOver(true); // End the game when all questions are answered
    }
  };

  const moveToNextQuestion = () => {
    nextQuestion();
  };

  const checkAnswer = (answer) => {
    const correctAnswer = currentQuestion.answer;
    if (answer === correctAnswer) {
      setIsCorrect(true);
      setScore(score + 1); // Increment score for correct answer
    } else {
      setIsCorrect(false);
    }

    setAnswerSelected(true);

    // After 1 second, move to the next question
    setTimeout(() => {
      nextQuestion();
    }, 1000);
  };

  const playAgain = () => {
    // Reset game to the initial state
    setIndex(0);
    setScore(0);
    setGameOver(false);
    setTimer(10);
    setAnswerSelected(false);
    setIsCorrect(null);
  };

  return (
    <div className="container">
      {!gameOver ? (
        <>
          <h1>Quiz App</h1>
          <hr />
          <h2>{currentQuestion.Question}</h2>
          <ul>
            <li>
              <button onClick={() => checkAnswer('a')}>{currentQuestion.a}</button>
            </li>
            <li>
              <button onClick={() => checkAnswer('b')}>{currentQuestion.b}</button>
            </li>
            <li>
              <button onClick={() => checkAnswer('c')}>{currentQuestion.c}</button>
            </li>
            <li>
              <button onClick={() => checkAnswer('d')}>{currentQuestion.d}</button>
            </li>
          </ul>

          {isCorrect !== null && (
            <div>{isCorrect ? 'Correct!' : 'Wrong answer!'}</div>
          )}

          <div className="index">
            {index + 1} of {quizData.length} questions
          </div>
          <div className="timer">Time left: {timer}s</div>
        </>
      ) : (
        // Display score and "Play Again" button after game over
        <div>
          <h1>{score === quizData.length ? 'Well played!🥳' : 'Game over!🤖'}</h1>
          <p  className='score'>
            You got {score} out of {quizData.length} correct!
          </p>
          <button onClick={playAgain}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
