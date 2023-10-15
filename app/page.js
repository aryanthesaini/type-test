'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { TagCloud } from '@frank-mayer/react-tag-cloud';
import Countdown from 'react-countdown';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import Link from 'next/link';
let i = 0;
let level = 1;
let numberOfWords = 2;
export default function Home() {
  const [word, setWord] = useState(null);

  const [correctPresses, setCorrectPresses] = useState(0);
  const [incorrectPresses, setIncorrectPresses] = useState(0);
  const [curWord, setCurWord] = useState('');
  const [curWordDisplayed, setCurWordDisplayed] = useState('');
  const [nextWord, setNextWord] = useState('');
  const [accuracy, setAccuracy] = useState(0.0);
  const [pressedKey, setPressedKey] = useState('');
  const [validClass, setValidClass] = useState('text-blue-600');
  const [failed, setFailed] = useState(false);
  const [timerDuration, setTimerDuration] = useState(7);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const keyDownHandler = (e) => {
      const key = e.key.toLowerCase();

      if (key >= 'a' && key <= 'z' && failed == false) {
        setPressedKey(key);
        let checkAlpha = curWord[0];

        if (curWord.length > 0 && key == checkAlpha) {
          setCorrectPresses(correctPresses + 1);
          word[i] = curWord.slice(1, curWord.length);
          setValidClass('text-green-500');
          if (curWord.length == 1 && key == checkAlpha) {
            setKey(Math.random());
            setTimerDuration(7);

            i++;
            setCurWordDisplayed(word[i]);
            setValidClass('text-blue-600');
            if (i == numberOfWords) {
              level++;
              numberOfWords += 3;
              setTimerDuration(10);
              fetchWord();

              i = 0;
            }
          }

          setCurWord(word[i]);
          setNextWord(word[i + 1]);
        } else if (curWord.length > 0 && key != checkAlpha) {
          setIncorrectPresses(incorrectPresses + 1);
          setValidClass('text-red-500');
        }

        setAccuracy(
          (correctPresses / (correctPresses + incorrectPresses)) * 100
        );
      }
    };
    document.addEventListener('keydown', keyDownHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  });

  useEffect(() => {
    fetchWord();
  }, []);

  async function fetchWord() {
    const response = await fetch(
      `https://random-word-api.herokuapp.com/word?number=${numberOfWords}`
    );
    let randomWord = await response.json();

    setWord(randomWord);
    setCurWord(randomWord[0]);
    setCurWordDisplayed(randomWord[0]);
    setNextWord(randomWord[1]);
  }

  const options = {
    maxSpeed: 'fast',
  };

  return (
    <>
      {failed ? (
        <>
          <div className='flex justify-center items-center '>
            <div
              className='relative z-10'
              aria-labelledby='modal-title'
              role='dialog'
              aria-modal='true'>
              <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'></div>

              <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
                <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
                  <div className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg'>
                    <div className='bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
                      <div className='sm:flex sm:items-start'>
                        <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
                          <h3
                            className='text-base font-semibold leading-6 text-gray-900'
                            id='modal-title'>
                            GAME OVER
                          </h3>
                          <div className='mt-2'>
                            <p className='text-sm text-gray-500'>
                              YOUR ACCURACY WAS: {accuracy.toFixed(2)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
                      <button
                        type='button'
                        className='inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto'
                        onClick={() => {
                          setCorrectPresses(0);
                          setIncorrectPresses(0);
                          setAccuracy(0);
                          setFailed(false);
                          setTimerDuration(7);
                          numberOfWords = 2;
                        }}>
                        Click here to try again
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        word && (
          <div className='h-screen flex flex-col space-y-2 items-center justify-center text-center'>
            <h1 className='text-2xl uppercase'>Level {level}</h1>

            <CountdownCircleTimer
              isPlaying
              duration={timerDuration}
              colors={['#004777', '#F7B801', '#A30000', '#A30000']}
              colorsTime={[7, 5, 2, 0]}
              key={key}
              strokeWidth={2}
              size={45}
              onComplete={() => {
                setFailed(true);
              }}>
              {({ remainingTime }) => remainingTime}
            </CountdownCircleTimer>
            <TagCloud
              options={options}
              className='text-sm uppercase text-gray-600 -z-20'
              onClickOptions={{ passive: true }}>
              {word}
            </TagCloud>
            <div className='flex items-center justify-center space-x-7'>
              <h1 className={`text-5xl font-bold uppercase  ${validClass}`}>
                {curWordDisplayed}
              </h1>

              {/* <h1 className='text-5xl font-bold uppercase text-blue-600'>
              {curWord.split('').map((character) => (
                <div key={Math.random()} className={`inline ${validClass}`}>
                  {character}
                </div>
              ))}
            </h1> */}
            </div>
            {nextWord && (
              <h1
                className={`text-[15px] font-thin uppercase text-gray-300/[0.5] pt-5 `}>
                {' '}
                {curWord}
              </h1>
            )}
            {/* <div className='flex items-center justify-center space-x-7'>
            <h2>
              You pressed:{' '}
              <span className='text-xl font-semibold uppercase text-blue-400'>
                {pressedKey}
              </span>
            </h2>
          </div> */}

            <div className='flex items-center justify-center space-x-7'>
              <div className='px-10 py-4'>
                <div>
                  <p className='text-[60px] mx-7 text-gray-300/[0.1] -translate-x-28 -translate-y-48'>
                    Correct
                  </p>
                </div>

                <h1 className='text-[30px] uppercase text-green-500/[0.7]  -translate-y-48 -translate-x-28'>
                  {correctPresses}
                </h1>
              </div>
              <p>Accuracy: </p>

              <h1 className='text-2xl uppercase text-gray-300'>
                {accuracy.toFixed(2)}%
              </h1>

              <div className='px-10 py-10'>
                <p className='text-[60px] mx-7 text-gray-300/[0.1]  translate-x-28 -translate-y-48'>
                  Incorrect
                </p>

                <h1 className=' text-[30px] uppercase text-red-500/[0.7] translate-x-28 -translate-y-48'>
                  {incorrectPresses}
                </h1>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
}
