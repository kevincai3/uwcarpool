const times = Array.from(Array(24).keys()).map(val => {
  let time = val;
  let modifier = "AM";
  if (time > 12) {
    time -= 12;
    modifier = "PM";
  }
  if (time == 0) {
    time = 12;
    modifier = "PM";
  }
  return `${time}:00 ${modifier}`
})

console.log(times);
