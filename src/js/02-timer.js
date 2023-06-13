import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const refs = {
  startBtn: document.querySelector('[data-start]'),
  timerThumb: document.querySelector('.timer'),
  daysField: document.querySelector('[data-days]'),
  hoursField: document.querySelector('[data-hours]'),
  minutesField: document.querySelector('[data-minutes]'),
  secondsField: document.querySelector('[data-seconds]'),
  input: document.querySelector('#datetime-picker'),
  spanValue: document.querySelectorAll('.value'),
  spanLabel: document.querySelectorAll('.label'),
  containerChildrenTimes: document.querySelectorAll('.field'),
};

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (Date.now() > selectedDates[0]) {
      refs.startBtn.disabled = true;
      Notiflix.Notify.failure('Please choose a date in the future', {
        fontSize: '16px',
        width: '360px',
        svgSize: '120px',
        borderRadius: '8px',
        clickToClose: true,
      });
      refs.daysField.innerHTML = `00`;
      refs.hoursField.innerHTML = `00`;
      refs.minutesField.innerHTML = `00`;
      refs.secondsField.innerHTML = `00`;
    } else {
      refs.startBtn.disabled = false;
      refs.input.disabled = false;
    }
  },
};

let intervalId = null;

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

refs.startBtn.disabled = true;
flatpickr('#datetime-picker', options);

refs.startBtn.addEventListener('click', e => {
  intervalId = setInterval(() => {
    const ms = new Date(`${refs.input.value}`) - Date.now();
    const deltaTime = convertMs(ms);
    const { days, hours, minutes, seconds } = deltaTime;

    if (ms < 1000) {
      clearInterval(intervalId);
      refs.input.disabled = false;
    } else {
      refs.input.disabled = true;
      refs.startBtn.disabled = true;
    }
    refs.daysField.innerHTML = `${addLeadingZero(days)}`;
    refs.hoursField.innerHTML = `${addLeadingZero(hours)}`;
    refs.minutesField.innerHTML = `${addLeadingZero(minutes)}`;
    refs.secondsField.innerHTML = `${addLeadingZero(seconds)}`;
  }, 1000);
});

// Styles
refs.timerThumb.style.display = 'flex';
refs.timerThumb.style.gap = '15px';

for (let i = 0; i < refs.spanValue.length; i++) {
  refs.spanValue[i].style.fontSize = '30px';
}

for (let i = 0; i < refs.spanLabel.length; i++) {
  refs.spanLabel[i].style.textTransform = 'uppercase';
  refs.spanLabel[i].style.fontSize = '13px';
}

for (let i = 0; i < refs.containerChildrenTimes.length; i++) {
  refs.containerChildrenTimes[i].style.display = 'flex';
  refs.containerChildrenTimes[i].style.flexDirection = 'column';
  refs.containerChildrenTimes[i].style.alignItems = 'center';
}
