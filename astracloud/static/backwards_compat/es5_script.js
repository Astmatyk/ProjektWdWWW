var token = localStorage.getItem('authToken');
var user = localStorage.getItem('user');
var ascObj = document.getElementById('asc');
var descObj = document.getElementById('desc');
var uploadBtn = document.getElementById('uploadButton');
var uploadForm = document.getElementById('fileInput');
var uploadBar = document.getElementById('uploadBar');

// const searchBtn = document.getElementById('submitButton');
var searchInput = document.getElementById('searchInput');
var searchForm = document.getElementById('sForm');
var fileList = [];
var sortMode = 0;
var uploading = 0;
function fetchList() {
  var fetchUrl = '/api/files/' + user;
  fetch(fetchUrl, {
    headers: {
      'Authorization': "Bearer ".concat(token)
    }
  }).then(function (res) {
    return res.json();
  }).then(function (files) {
    fileList = files;
    fileList = sortList(fileList, sortMode);
    buildList(fileList);
  });
}

// uploadowanie
function uploadFile() {
  var file = uploadForm.files[0];
  if (!file) return;
  console.log("Rozpoczynam przesyłanie...");
  uploading = 1;

  // zmieńmy to na fetch w wolnej chwili
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/upload');

  // uploadujemy tylko jak mamy token
  var token = localStorage.getItem('authToken');
  if (token) {
    xhr.setRequestHeader('Authorization', "Bearer ".concat(token));
  }
  uploadBar.style.height = '5px';
  uploadBar.style.width = 0;
  uploadBtn.style.backgroundColor = 'gray';
  uploadBtn.style.width = '110.5px';
  xhr.upload.onprogress = function (e) {
    if (e.lengthComputable) {
      var percentComplete = Math.round(e.loaded / e.total * 100);
      uploadBar.style.width = percentComplete - 10 + '%';
    }
  };
  xhr.onload = function () {
    if (xhr.status == 200) {
      fetchList();
      buildList(sortList(fileList, 0));
      uploadBtn.innerHTML = 'Przesłano!';
      uploadBtn.style.backgroundColor = 'green';
      uploadBar.style.height = 0;
      setTimeout(function () {
        uploadBtn.innerHTML = 'Wyślij';
        uploadBtn.style.backgroundColor = 'purple';
        uploadBtn.style.width = '76px';
        uploadForm.value = null;
        uploading = 0;
      }, 1000);
    } else {
      uploadBtn.innerHTML = 'Błąd!';
      uploadBtn.style.backgroundColor = 'red';
      uploadBtn.style.width = '76px';
      uploadBar.style.height = 0;
      console.log("Błąd przesyłania: " + xhr.status);
      uploadForm.value = null;
      uploading = 0;
    }
  };
  xhr.onerror = function () {
    uploadBtn.innerHTML = 'Błąd!';
    uploadBtn.style.backgroundColor = 'red';
    uploadBtn.style.width = '76px';
    uploadBar.style.height = 0;
    console.log("Błąd przesyłania: błąd sieci");
    uploadForm.value = null;
    uploading = 0;
  };
  var formData = new FormData();
  formData.append('file', file);
  xhr.send(formData);
}

// usuwanie!
function deleteFile(fileId, button) {
  console.log("Usuwam ID " + fileId);
  var token = localStorage.getItem('authToken');
  //backend sprawdza poprawność tokenu i wychwyca śmieszne ../
  fetch('/api/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "Bearer ".concat(token)
    },
    body: JSON.stringify({
      id: fileId
    })
  }).then(function (res) {
    return res.json();
  }).then(function (result) {
    if (result.status === 'ok') {
      button.closest('.listItem').remove();
    } else {
      console.log("Błąd usuwania " + result.message);
      alert('Błąd: ' + result.message);
    }
  });
}

// lista plikow, budowanie html
function buildList(fileList) {
  var flDiv = document.querySelector('.filelist');
  flDiv.innerHTML = "<h1>Wczytywanie...</h1>";
  //dla kazdego pliku generujemy div'a
  var html = fileList.map(function (file) {
    return "\n        <div class=\"listItem\" data-id=\"".concat(file.id, "\">\n            <a href=\"/uploads/").concat(user, "/").concat(file.name, "\">").concat(file.name, "</a>\n            <button class=\"deleteButton\" data-id=\"").concat(file.id, "\">Usu\u0144</button>\n        </div>\n    ");
  }).join('');
  flDiv.innerHTML = "".concat(html);

  //dodajemy eventy dla kazdego przycisku usuwania
  document.querySelectorAll('.deleteButton').forEach(function (button) {
    button.addEventListener('click', function () {
      var id = button.dataset.id;
      deleteFile(id, button);
    });
  });
}

// sortowanie

function sortList(fileList, sortMode) {
  var newlist = fileList.slice();

  //sortowanie rosnąco edycja javascript
  function asc(a, b) {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  }

  //sortowanie malejąco edycja javascript
  function desc(a, b) {
    if (a.name > b.name) return -1;
    if (a.name < b.name) return 1;
    return 0;
  }

  //oczywiste
  switch (sortMode) {
    case 0:
      newlist.sort(asc);
      ascObj.style.color = 'white';
      descObj.style.color = 'grey';
      break;
    case 1:
      newlist.sort(desc);
      ascObj.style.color = 'grey';
      descObj.style.color = 'white';
      break;
  }
  return newlist;
}
function searchList(searchString) {
  //backend sprawdza poprawność tokenu i usera zakodowanego w tokenie
  fetch("/api/search?search=".concat(encodeURIComponent(searchString)), {
    headers: {
      'Authorization': "Bearer ".concat(token)
    }
  }).then(function (res) {
    return res.json();
  }).then(function (files) {
    fileList = files;
    //sortujemy i budujemy div
    fileList = sortList(fileList, sortMode);
    buildList(fileList);
  });
  return fileList;
}

// main
fetchList();

// eventy rozmaite
uploadBtn.addEventListener('click', function () {
  if (!uploading && document.getElementById('fileInput').files[0] != undefined) {
    uploadFile();
    uploadBtn.innerHTML = 'Przesyłanie...';
  }
});
ascObj.addEventListener('click', function () {
  buildList(sortList(fileList, 0));
});
descObj.addEventListener('click', function () {
  buildList(sortList(fileList, 1));
});
searchForm.addEventListener('input', function (event) {
  event.preventDefault();
  console.log("Search: " + searchInput.value);
  buildList(searchList(searchInput.value));
});

