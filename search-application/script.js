$(".searchbox").autocomplete({
  source: function (request, response) {
    $.ajax({
      url: "http://en.wikipedia.org/w/api.php",
      dataType: "jsonp",
      data: {
        'action': "opensearch",
        'format': "json",
        'search': request.term
      },
      success: function (data) {
        response(data[1]);
      }
    });
  }
});

const form = document.getElementById('search-engine');
const clearButton = document.getElementById('clear-button');
const ul = document.getElementById('history-list')
const input = document.getElementById('searchbox');
const consoles = document.getElementById('console');
var storageVar = 'localValues';

let itemsArray = localStorage.getItem(storageVar) ? JSON.parse(localStorage.getItem(storageVar)) : [];
localStorage.setItem(storageVar, JSON.stringify(itemsArray));
const data = JSON.parse(localStorage.getItem(storageVar));

const liWithTime = (text, timestamp) => {
  const li = document.createElement('li');
  var datevalue = moment.unix(timestamp).format("YYYY-MM-DD, h:mm A");
  li.innerHTML = text + ' <span class="f-right"><span class="date">' + datevalue + '</span><button type="button" onClick="clearMeButton(' + timestamp + ')" class="remove">x</button></span>';
  ul.appendChild(li);
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  var object = { value: input.value, timestamp: moment().unix() }
  itemsArray.push(object);
  localStorage.setItem(storageVar, JSON.stringify(itemsArray));
  liWithTime(object.value, object.timestamp);
  input.value = "";
});
data.slice(-10).forEach(item => {
  if (item) {
    liWithTime(item.value, item.timestamp);
  }
});

clearButton.addEventListener('click', function () {
  localStorage.clear();
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
  }
  itemsArray = [];
});

function clearMeButton(target) {
  var storedValues = JSON.parse(localStorage.getItem(storageVar));
  for (x in storedValues) {
    if (storedValues[x] !== null) {
      if (storedValues[x].timestamp === target) {
        var indexToRemove = x;
      }
    }
  }
  delete storedValues[indexToRemove];
  localStorage.setItem(storageVar, JSON.stringify(storedValues));
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
  }
  const finalData = JSON.parse(localStorage.getItem(storageVar));

  finalData.slice(-10).forEach(item => {
    if (item) {
      liWithTime(item.value, item.timestamp);
    }
  });
}

