"use strict";

console.log("1. Оформление и интерфейс:");
console.log("   - Вёрстка +10");
console.log("   - Реализован интерфейс игры +5");
console.log("   - В футере приложения есть ссылка на GitHub автора приложения, год создания приложения и логотип курса со ссылкой на курс +5");

console.log("2. Игровая логика:");
console.log("   - Логика игры. Ходы, перемещения фигур и другие действия игрока подчиняются определённым свойственным игре правилам +10");

console.log("3. Завершение игры:");
console.log("   - Реализовано завершение игры при достижении игровой цели +10");

console.log("4. Результаты игры:");
console.log("   - По окончанию игры выводится её результат, например, количество ходов, время игры, набранные баллы, выигрыш или поражение и т.д +10");

console.log("5. Таблица результатов:");
console.log("   - Есть таблица результатов, в которой сохраняются результаты 10 игр с наибольшим счетом (лучшим временем и т.п.) или просто 10 последних игр (хранится в Local Storage) +10");

console.log("6. Анимации, звуки и настройки:");
console.log("   - Анимации, звуки или настройки игры. Баллы начисляются за любой из перечисленных пунктов +10");

console.log("7. Оформление и дополнительный функционал:");
console.log("   - Очень высокое качество оформления приложения и/или дополнительный, не предусмотренный в задании, функционал, улучшающий качество приложения +10");
console.log("   - Высокое качество оформления приложения предполагает собственное оригинальное оформление, равное или отличающееся в лучшую сторону по сравнению с демо");

console.log("ИТОГО: 60");


// ЛОГИКА И ДИЗАЙН ИГРЫ ----------------------------------------
const gameContainer = document.querySelector('.container')
const gameFieldContainer = document.querySelector('.game-field');
const winnerField = document.querySelector('.win-field')
const chipsArr = Array.from(gameFieldContainer.querySelectorAll('.chip'));
const allChips = document.querySelectorAll('.chip');
const shuffleButton = document.querySelector('.shuffle');
const chipsCount = 16;
const blankChipNumber = 16;
const volumeSlider = document.querySelector('.slider1');
const speedSlider = document.querySelector('.slider0');
const brightSlider = document.querySelector('.slider2');
const burgerBtn = document.getElementById('burgerBtn');
const burgerMenu = document.querySelector('.burger-menu');
const burgerMenuRul = document.querySelector('.burger-menu-rules')
const burgerMenuElements = document.querySelectorAll('.burger-menu');
const scoreList = document.querySelector('.score-field');
const scoreLi = document.querySelector('.score-list');
const cnockBtn = document.getElementById('cnockBtn');
const rulesBtn = document.querySelector('.rules-button');
const scoreBtn = document.getElementById('scoreBtn');
const refreshBtn = document.getElementById('refreshBtn')
const audio = document.querySelector('.audio');
const songs = ['516010__enviromaniac2__super-mario-bros-theme-techno-loop',];
//звуки кнопок 
const chipSound = new Audio('./audio/159339__jackjan__handgun-clip-in.m4a'); 
const ordinaryButtonSound = new Audio('./audio/683098__florianreichelt__click.mp3');
const winMelody = new Audio('./audio/5e2bd22afcca601.mp3'); 
const winMelody2 = new Audio('./audio/winnermelody.mp3'); 
const muteButton = document.querySelector('.regulate-picture.sound');
const speedButton = document.querySelector('.regulate-picture.speed');
const brightButton = document.querySelector('.regulate-picture.light');
//inputs
const backgroundInput = document.getElementById('background');
const chipsInput = document.getElementById('chips');
const textInput = document.getElementById('text');

if (chipsArr.length !== 16) {
  console.log ('Количество фишек не равно 16!')
}

// скрываем 16 
chipsArr[chipsCount - 1].style.display = 'none';

// положение фишек
let fieldMatrix = getFieldMatrix(chipsArr.map((chip) => Number(chip.dataset.field)));
setPiositionOfChips(fieldMatrix);

// перемешивание фишек
shuffleButton.addEventListener('click', () => {
  const lineFromFieldMatrix = fieldMatrix.flat();
  const shuffledArr = shuffleArray(lineFromFieldMatrix);
  fieldMatrix = getFieldMatrix(shuffledArr);
  setPiositionOfChips(fieldMatrix);
  playSong();
  soundEffectPlay(ordinaryButtonSound);
  startTimer();
  audio.muted = false; 
})

// движение или смена позиции при клике
gameFieldContainer.addEventListener('click', (event) => {
  const clickedChip = event.target.closest('button');
  if (!clickedChip) {
    return;
  }
  const chipNumber = Number(clickedChip.dataset.field);
  const chipCoordinates = findCooords(chipNumber, fieldMatrix);
  const blankChipCoordinates = findCooords(blankChipNumber, fieldMatrix);
  const isMovementValid = checkMovmentValidation (blankChipCoordinates, chipCoordinates);
  if (isMovementValid) {
    changeChip(blankChipCoordinates, chipCoordinates, fieldMatrix);
    setPiositionOfChips(fieldMatrix);
  }
})

// смена позиции кнопками
window.addEventListener('keydown', (event) => {
  if (!event.key.includes('Arrow')) {
    return // игнорим все кроме кнопок стрелок
  }
  const blankChipCoordinates = findCooords(blankChipNumber, fieldMatrix);
  const nearChipCoords = {
    x: blankChipCoordinates.x,
    y: blankChipCoordinates.y,
  };
  const side = event.key.split('Arrow')[1].toLowerCase();
  const maxIndexOfMatrix = fieldMatrix.length;

  switch (side) {
    case 'up':
      nearChipCoords.y +=1;
      break;
    case 'down':
      nearChipCoords.y -=1;
      break;
    case 'left':
      nearChipCoords.x +=1;
      break;
    case 'right':
      nearChipCoords.x -=1;
      break;
  }
  if (nearChipCoords.y >= maxIndexOfMatrix || nearChipCoords.y < 0 ||
      nearChipCoords.x >= maxIndexOfMatrix || nearChipCoords.x < 0) {
        return
      }
      changeChip(blankChipCoordinates, nearChipCoords, fieldMatrix);
      setPiositionOfChips(fieldMatrix);
    });

    // SWIPE ----------------------------------------------------------------------

let x1 = null;
let y1 = null;

gameFieldContainer.addEventListener('touchstart', (event) => {
  const firstTouch = event.touches[0];
  x1 = firstTouch.clientX;
  y1 = firstTouch.clientY;
}, { passive: true });

gameFieldContainer.addEventListener('touchmove', (event) => {
  const blankChipCoordinates = findCooords(blankChipNumber, fieldMatrix);
  const nearChipCoords = {
    x: blankChipCoordinates.x,
    y: blankChipCoordinates.y,
  };
  const maxIndexOfMatrix = fieldMatrix.length;

  if (!x1 || !y1) {
    return false;
  }

  let x2 = event.touches[0].clientX;
  let y2 = event.touches[0].clientY;
  let xDiff = x2 - x1;
  let yDiff = y2 - y1;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    // right left
    if (xDiff > 0) {nearChipCoords.x -=1;}
    else {nearChipCoords.x +=1;}
  } 
  else { 
    // top bottom
    if (yDiff > 0) {nearChipCoords.y -=1;}
    else {nearChipCoords.y +=1;}
  }
  
  x1 = null;
  y1 = null;
  
  if (nearChipCoords.y >= maxIndexOfMatrix || nearChipCoords.y < 0 ||
    nearChipCoords.x >= maxIndexOfMatrix || nearChipCoords.x < 0) {
      return;
  }
  
  changeChip(blankChipCoordinates, nearChipCoords, fieldMatrix);
  setPiositionOfChips(fieldMatrix);
}, { passive: true });


// все нужные функции ниже _____________________________-

// делаем матрицу из массива от 1-16
function getFieldMatrix(arr) {
  const matrix = [[], [], [], []];
  let y = 0;
  let x = 0;
  for (let i = 0; i < arr.length; i++) {
    if (x >= 4) {
      y++;
      x = 0;
    }
    matrix[y][x] = arr[i];
    x++;
  }
  return matrix;
}

//задаем место 
function setPiositionOfChips (fieldMatrix) {
  for (let y = 0; y < fieldMatrix.length; y++) {
    for (let x = 0; x < fieldMatrix[y].length; x++) {
      const value = fieldMatrix[y][x];
      const chip = chipsArr[value - 1];
      setChipStyle(chip, x, y);
    }
  }
}
// вспомогательная 
function setChipStyle(chip, x, y) {
  const move = 100;
  chip.style.transform = `translate3D(${x * move}%, ${y * move}%, 0)`;
}

// перемешивание массива 
function shuffleArray(arr) {
  return arr.map(value => ({value, sort: Math.random()})).sort((a, b) => a.sort - b.sort).map(({value}) => value);
}

// ищем координаты кнопки из полученного номера (из data-field)
function findCooords (number, matrix) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] === number) {
        return {x, y};
      }
    }
  }
  return null;
}

// проверяем возможно ли перемещение нажатой фишки
function checkMovmentValidation (cor1, cor2){
  const DiffX = Math.abs(cor1.x - cor2.x );
  const DiffY = Math.abs(cor1.y - cor2.y );
  return (DiffX === 1 || DiffY === 1) && (cor1.x === cor2.x || cor1.y === cor2.y);
}

//перемещаем фишки
function changeChip(cor1, cor2, matrix){
  const coordsOne = matrix[cor1.y][cor1.x];
  matrix[cor1.y][cor1.x] = matrix[cor2.y][cor2.x];
  matrix[cor2.y][cor2.x] = coordsOne;
  soundEffectPlay(chipSound);//звук
// проверка на выигрыш и обеспечение эффекта
  if (isFinish(matrix)) {
    finishCongrats();
  }
}

// сверка матриц ВЫИГРЫШНЫЙ порядок
const finishArr = new Array(16).fill(0).map((_item, i) => i + 1);
function isFinish(matrix) {
  const finishMatrix = matrix.flat();
  for (let i = 0; i < finishArr.length; i++) {
    if (finishMatrix[i] !== finishArr[i]) {
      return false;
    }
  } 
  return true;
}

// реализация эффекта завершения игры

const finishAddedClass = 'congrats';

function finishCongrats() {
  audio.muted = true; // глушим основную мелодию для тишины

    gameFieldContainer.classList.add(finishAddedClass);
    soundEffectPlay(winMelody); // Звук мелодии выигрыша
    soundEffectPlay(winMelody2); //мелодия победителя (три секунды тишины потом звук)
    saveRecordOfGame(); // Пишем время в базу
    stopTimer();
    setTimeout(() => {
      addWinnerGif();
      gameFieldContainer.classList.remove(finishAddedClass);
    }, 3000) 
}

// убирает кнопки и вешает победную gif на время
function addWinnerGif() {
  winnerField.classList.add('active');
  winnerField.innerHTML = `Ваше время: ${timerWinTime}`;
  
  setTimeout(() => {
    winnerField.classList.remove('active');
  }, 9000); 
}

// БУРГЕР МЕНЮ И ПРОЧИЕ ЭФФЕКТЫ ------------------------------------

// закрытие открытие по клику на кнопку
burgerBtn.addEventListener('click', () => {
  soundEffectPlay(ordinaryButtonSound);

  burgerMenu.classList.toggle('active')
  burgerBtn.classList.toggle('active')
  
})

// при клике вне поля 
document.addEventListener('click', (event) => {
  if (!burgerMenu.contains(event.target) && !burgerBtn.contains(event.target)) {
    burgerMenu.classList.remove('active');
    burgerBtn.classList.remove('active');
  }
});
// Остановить распространение события клика внутри бургер-меню, чтобы избежать немедленного закрытия после открытия
burgerMenu.addEventListener('click', (event) => {
  event.stopPropagation();
});

// правила 
rulesBtn.addEventListener('click', () => {
  soundEffectPlay(ordinaryButtonSound);

  burgerMenuRul.classList.toggle('active')
})
// при клике вне поля 
document.addEventListener('click', (event) => {
  if (!burgerMenuRul.contains(event.target) && !rulesBtn.contains(event.target)) {
    burgerMenuRul.classList.remove('active');
  }
});
// Остановить распространение события клика внутри бургер-меню, чтобы избежать немедленного закрытия после открытия
burgerMenuRul.addEventListener('click', (event) => {
  event.stopPropagation();
});

// SCORES 
scoreBtn.addEventListener('click', () => {
  soundEffectPlay(ordinaryButtonSound);
  createTimeList();
  scoreList.classList.toggle('active')
})
// при клике вне поля 
document.addEventListener('click', (event) => {
  if (!scoreList.contains(event.target) && !scoreBtn.contains(event.target)) {
    scoreList.classList.remove('active');
  }
});
// Остановить распространение события клика внутри бургер-меню, чтобы избежать немедленного закрытия после открытия
scoreList.addEventListener('click', (event) => {
  event.stopPropagation();
});


// AUDIO ---------------------------------------------

  let songIndex = 0;
  let volumeMute = false;

  //Init 
function loadSong(song) {
  audio.src = `./audio/${song}.mp3`;
}
loadSong(songs[songIndex]);

// play
function playSong() {
  audio.play()
}

// переключение вперед
function nextSong() {
  songIndex++

  if (songIndex > songs.length - 1) {
    songIndex = 0
  }
  loadSong(songs[songIndex]);
  playSong();
}

// переключение в конце игра по кругу
audio.addEventListener('ended', nextSong);


//функция сброс на ноль и проигрывание звука
function soundEffectPlay(sound) {
  sound.currentTime = 0;
  sound.play(); 
}

// работа со звуком (регулировка)

function volumeSliderRegulate() {
  audio.volume = volumeSlider.value / 100; 
  }

  volumeSlider.addEventListener('input', volumeSliderRegulate);
  function toggleMute() {
    volumeSlider.value = 50;
    soundEffectPlay(ordinaryButtonSound);
    if (audio.muted) {
      audio.muted = false;
      muteButton.style.backgroundImage = 'url(./assets/volume_up_white_48dp.svg)';
    } else {
      audio.muted = true;
      muteButton.style.backgroundImage = 'url(./assets/volume_off_white_48dp.svg)';
    }
  }
  
  muteButton.addEventListener('click', toggleMute);
  
  // кнопка mute звука клавиш

  function toggleChipMute() {
    soundEffectPlay(ordinaryButtonSound);
  
    if (chipSound.muted) {
      chipSound.muted = false;
      cnockBtn.style.backgroundImage = 'url(./assets/token_FILL0_wght400_GRAD0_opsz48.svg)';
    } else {
      chipSound.muted = true;
      cnockBtn.style.backgroundImage = 'url(./assets/view_in_ar_FILL0_wght400_GRAD0_opsz48.svg)';
    }
  }
  cnockBtn.addEventListener('click', toggleChipMute);

  // SPEED --------------------------------

function speedSliderRegulate() {
  const invertedValue = 100 - speedSlider.value;
  const sliderValue = `${invertedValue / 100}s`;
  
  allChips.forEach(chip => {
    chip.style.transition = `transform ${sliderValue}, filter 0.5s`;
  });
}
speedSlider.addEventListener('input', speedSliderRegulate);
// установка скорости в середину при нажатии на кнопку
speedButton.addEventListener('click', () => {
  soundEffectPlay(ordinaryButtonSound);
  speedSlider.value = 50;
})

  // BRIGTNESS --------------------------------

  function brightnessSliderRegulate() {
    const sliderValue = (brightSlider.value / 100) * 2;
    gameContainer.style.filter = `brightness(${sliderValue})`

  }
  brightSlider.addEventListener('input', brightnessSliderRegulate);
  
  // установка dark mode and light mode
  let isLightMode = true; 
  brightButton.addEventListener('click', () => {
    brightSlider.value = 55; // возврат слайдера на середину на всякий случай
    soundEffectPlay(ordinaryButtonSound);

    if (isLightMode) {
      brightButton.style.backgroundImage = 'url(./assets/dark_mode_FILL0_wght400_GRAD0_opsz48.svg)';
      gameContainer.style.filter = `brightness(0.6)`

    } else {
      brightButton.style.backgroundImage = 'url(./assets/light_mode_FILL0_wght400_GRAD0_opsz48.svg)';
      gameContainer.style.filter = `brightness(1.0)`
    }
      isLightMode = !isLightMode;
  });
  
  // COLOURS -----------------------------

  // заполнение палитры цветами 

    function fillPaletteColors() {
      let tools = document.querySelectorAll(".palette .tool");
      for (let i = 0; i < tools.length; i++) {
        tools[i].style.backgroundColor = tools[i].dataset.color;
      }
    }
    fillPaletteColors();
    

    let currentColour = "#ddd";
let palette = document.querySelector(".palette");

function onclickPickColor(el) {
  function clickHandler(e) {
    if (!e.target.classList.contains("tool")) return;

    currentColour = e.target.dataset.color;

    palette.style.borderColor = currentColour; // Индикатор выбранного цвета.
    el.style.background = currentColour;

    // Удаляем обработчик события после его выполнения
    palette.removeEventListener("click", clickHandler);
  }

  palette.addEventListener("click", clickHandler);
}

// окрашиваем поля
    const radioInputs = document.querySelectorAll('input[type="radio"]');
    
    radioInputs.forEach((input) => {
      input.addEventListener('change', handleRadioChange);
    });
    
    function handleRadioChange(event) {
      const selectedValue = event.target.value;
      
      if (selectedValue === "gameContainer") {
        onclickPickColor(gameContainer);
      } else if (selectedValue === "chipsArr") {
        chipsArr.forEach(chip => {
          onclickPickColor(chip);
        });
      } else if (selectedValue === "gameFieldContainer") {
        onclickPickColor(gameFieldContainer);
      }
    }
    
// ВРЕМЯ -------------------------------------------------
const clockNode = document.getElementById('clock');
const timerNode = document.getElementById('timer');
let startTime;
let timerInterval;
// часы
function setClock() {
  let now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  
  let timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  
  clockNode.innerHTML = timeString;
}
setInterval(setClock, 1000); //каждую секунду обновляемся

// таймер
function startTimer() {
  clearInterval(timerInterval); 
  startTime = new Date().getTime();
  timerInterval = setInterval(updateTimer, 1000);
}
let timerWinTime = '';
function updateTimer() {
  const currentTime = new Date().getTime();
  const elapsedTime = new Date(currentTime - startTime);
  const minutes = elapsedTime.getMinutes().toString().padStart(2, '0');
  const seconds = elapsedTime.getSeconds().toString().padStart(2, '0');
  timerNode.textContent = `${minutes}:${seconds}`;
  timerWinTime = `${minutes}:${seconds}`; //фиксация времени прохождения игры для рекордов
}

function stopTimer() {
  const currentTime = new Date().getTime();
  if (!startTime) {
    startTime = currentTime; 
  }
  clearInterval(timerInterval); // Остановить интервал
  const elapsedTime = new Date(currentTime - startTime);
  const minutes = elapsedTime.getMinutes().toString().padStart(2, '0');
  const seconds = elapsedTime.getSeconds().toString().padStart(2, '0');
  timerNode.textContent = `${minutes}:${seconds}`;
  timerWinTime = `${minutes}:${seconds}`; 
}

// СОХРАНЕНИЕ ДАННЫХ очков - LOCAL STORAGE ---------------------------------

// создаем сообщение с датой и временем
let dateLog = '';
function createDateLog() {
  const now = new Date();
  const day = now.getDate();
  const month = now.toLocaleString('ru', { month: 'short' }); 
  const hours = now.getHours().toString().padStart(2, '0');;
  const minutes = now.getMinutes().toString().padStart(2, '0');;
  dateLog = `${day} ${month} в ${hours}:${minutes} твое время:`;
}


// сохраняем рекорды в базу
function saveRecordOfGame() {
  createDateLog();
  const userDataKey = 'Game-Data';
  const maxItems = 10; // Максимальное количество рекордов в памяти
  //read
  const existingData = JSON.parse(localStorage.getItem(userDataKey)) || [];
  
  if (existingData.length >= maxItems) { //проверка на количество
    existingData.shift();
  }
  
    // Создаем объект userData после обновления переменных
    const userData = {
      gameTime: dateLog,
      gameRecord: timerWinTime, 
    };
  //push
  existingData.push(userData);
  //save
  const userDataJSON = JSON.stringify(existingData);
  localStorage.setItem(userDataKey, userDataJSON);
}


// ищем рекорд среди записей сохраненных
function findBestTime() {
  const userDataKey = 'Game-Data';
    //read
    const existingData = JSON.parse(localStorage.getItem(userDataKey)) || [];
  if (existingData.length === 0) {
    return null; // Вернуть null, если массив пустой
  }

  let bestTime = null; // Переменная для хранения наилучшего времени

  for (const item of existingData) {
    if (item['gameRecord']) {
      // Проверяем, существует ли значение ключа
      const timeParts = item['gameRecord'].split(':');
      if (timeParts.length === 2) {
        // Проверяем, имеет ли значение формат "мм:сс"
        const minutes = parseInt(timeParts[0]);
        const seconds = parseInt(timeParts[1]);
        const totalTime = minutes * 60 + seconds;

        if (bestTime === null || totalTime < bestTime) {
          bestTime = totalTime;
        }
      }
    }
  }

  if (bestTime !== null) {
    // Преобразовать наилучшее время обратно в формат "мм:сс"
    const bestMinutes = Math.floor(bestTime / 60);
    const bestSeconds = bestTime % 60;
    return `${bestMinutes.toString().padStart(2, '0')}:${bestSeconds.toString().padStart(2, '0')}`;
  } else {
    return `00:00`; // Вернуть 00:00, если не удалось найти наилучшее время
  }
}

// формируем HTML список из данных
  function createTimeList() {
  const bestTime = findBestTime();
  //read
  const userDataKey = 'Game-Data';
  scoreLi.innerHTML = '';
  const existingData = JSON.parse(localStorage.getItem(userDataKey)) || [];
  existingData.forEach((item) => {
    const li = document.createElement('li');
    li.innerHTML = `${item.gameTime} ${item.gameRecord}<br>лучшее: ${bestTime}`;
    scoreLi.appendChild(li);
  });
}

// ПЕРЕЗАГРУЗКА по кнопке
refreshBtn.addEventListener('click', () => {
  soundEffectPlay(ordinaryButtonSound);
  location.reload();
})

