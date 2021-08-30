const Prando = require("prando").default;
const { members, REFERENCE_DATE_STRING, question_bank } = require("./constants");
const {
  getNearestMonday,
  getNextSunday,
  deterministicShuffle,
} = require("./utils");

function getWeekRangeString() {
  return getNearestMonday() + " - " + getNextSunday();
}

function weeksSince(dateString) {
  var date = new Date(dateString);
  var today = new Date();
  const result = Math.floor((today - date) / (1000 * 60 * 60 * 24 * 7));
  return result;
}

function getRoundNumber() {
  return (
    (weeksSince(REFERENCE_DATE_STRING) + 1) % (members.SET_1.length * 2 - 1)
  );
}

function appendScheduleToDOM(participants1, participants2, questions) {
  let len = questions.length
  let start = 0
  const type =  len/ 6
  const pairings = [];
  for (let i = 0; i < participants1.length; i += 1) {
    if(type === 1){
      const pairing = `<li>
                        <h3>${participants1[i]} - ${participants2[i]} (Group ${i+1})</h3>
                        <p>Group questions for the week:</p>
                        <a href=${questions[start].link} target="_blank"><p>${questions[start].name}</p></a>
                        <a href=${questions[len-1].link} target="_blank"><p>${questions[len-1].name}</p></a>
                      </li>`;
      pairings.push(pairing);
      len--
      start++
    } else if (type === 2){
      const pairing = `<li>
                        <h3>${participants1[i]} - ${participants2[i]} (Group ${i+1})</h3>
                        <p>Group questions for the week:</p>
                        <a href=${questions[start].link} target="_blank"><p>${questions[start].name}</p></a>
                        <a href=${questions[start+1].link} target="_blank"><p>${questions[start+1].name}</p></a>
                        <a href=${questions[len-1].link} target="_blank"><p>${questions[len-1].name}</p></a>
                        <a href=${questions[len-2].link} target="_blank"><p>${questions[len-2].name}</p></a>
                      </li>`;
      pairings.push(pairing);
      len -= 2
      start += 2
    }
  } 
  const element = document.getElementById("app");
  let content = "<div>";
  content += `<h2>Pairings for the week ${getWeekRangeString()}</h2>`;
  content += "<ul>";
  pairings.forEach((pair) => (content += pair));
  content += "</ul>";
  element.innerHTML = content;
}

function generateSchedule() {
  const participants1 = members.SET_1;
  const participants2 = members.SET_2;
  schedulingAlgorithm(participants1, participants2, getRoundNumber());
  appendScheduleToDOM(participants1, participants2, questions_list);
}

const questions_list = questionExtractor(getRoundNumber());

function questionExtractor(week){
  switch(week) {
    case 1:
      // code block
      let questions1 = extractBasedOnTag('strings').concat(extractBasedOnTag('array'))
      randomizeQuestions(questions1, questions1.length)
      return questions1
      break;
    case 2:
      // code block
      let questions2 = extractBasedOnTag('hash table and hash sets')
      randomizeQuestions(questions2, questions2.length)
      return questions2
      break;
    case 3:
      // code block
      let questions3 = extractBasedOnTag('LinkedLists')
      randomizeQuestions(questions3, questions3.length)
      return questions3
      break;
    case 4:
      // code block
      let questions4 = extractBasedOnTag('stacks').concat(extractBasedOnTag('queues'))
      randomizeQuestions(questions4, questions4.length)
      return questions4
      break;
    case 5:
      // code block
      let questions5 = extractBasedOnTag('tree')
      randomizeQuestions(questions5, questions5.length)
      return questions5
      break;
    case 6:
      // code block
      let questions6 = extractBasedOnTag('recursion')
      randomizeQuestions(questions6, questions6.length)
      return questions6
      break;
  // default:
  }
}

function extractBasedOnTag(week_tag){
  let available = question_bank.filter(question => question.tag === week_tag && question.assigned === false);
  return available
}

function randomizeQuestions(arr, n){
    for (let i = n - 1; i > 0; i--)
    {
        let j = Math.floor((n/100) * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

// https://en.wikipedia.org/wiki/Round-robin_tournament#Scheduling_algorithm
function schedulingAlgorithm(participants1, participants2, week) {
  let rotations = week - 1;

  while (rotations > 0) {
    rotations -= 1;
    const first_participant_2 = participants2[0];
    const last_participant_1 = participants1[participants1.length - 1];

    for (let i = 1; i < participants2.length; i++) {
      participants2[i - 1] = participants2[i];
    }
    participants2[participants2.length - 1] = last_participant_1;
    let i = participants1.length - 1;
    while (i >= 1) {
      participants1[i] = participants1[i - 1];
      i -= 1;
    }
    participants1[1] = first_participant_2;
  }
}

generateSchedule();
