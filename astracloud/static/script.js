const token = localStorage.getItem('authToken');
const user = localStorage.getItem('user');

const ascObj = document.getElementById('asc');
const descObj = document.getElementById('desc');

const uploadBtn = document.getElementById('uploadButton');
const uploadForm = document.getElementById('fileInput');

// const searchBtn = document.getElementById('submitButton');
const searchInput = document.getElementById('searchInput');
const searchForm = document.getElementById('sForm');

let fileList = [];
let sortMode = 0;
let uploading = 0;

function fetchList() {
    const fetchUrl = '/api/files/'+user;
    fetch(fetchUrl, {
        headers: {
        'Authorization': `Bearer ${token}`
        }
    }).then(res => res.json())
            .then(files => {
                fileList = files;
                fileList = sortList(fileList, sortMode);
                buildList(fileList);
            })
}

// uploadowanie
function uploadFile() {
    const file = uploadForm.files[0];
    if (!file) return;

    console.log("Rozpoczynam przesyłanie...");
    uploading = 1;

    // zmieńmy to na fetch w wolnej chwili
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload');

    // uploadujemy tylko jak mamy token
    const token = localStorage.getItem('authToken');
    if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    xhr.onload = function() {
        if (xhr.status == 200) {
            fetchList();
            buildList(sortList(fileList, 0));
            uploadBtn.innerHTML = 'Przesłano!';
            setTimeout(() => {
                uploadBtn.innerHTML = 'Wyślij';
                uploadForm.value = null;
                uploading = 0;
            }, 3000)
        } else {
            uploadBtn.innerHTML = 'Błąd!';
            console.log("Błąd przesyłania: "+xhr.status);
            uploadForm.value = null;
            uploading = 0;
        }
    };

    const formData = new FormData();
    formData.append('file', file);
    xhr.send(formData);
}

// usuwanie!
function deleteFile(fileId, button) {
    console.log("Usuwam ID " + fileId);
    const token = localStorage.getItem('authToken');
    //backend sprawdza poprawność tokenu i wychwyca śmieszne ../
    fetch('/api/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: fileId })
    })
    .then(res => res.json())
    .then(result => {
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
    const flDiv = document.querySelector('.filelist');
    flDiv.innerHTML = "<h1>Wczytywanie...</h1>";
    //dla kazdego pliku generujemy div'a
    const html = fileList.map(file => `
        <div class="listItem" data-id="${file.id}">
            <a href="/uploads/${user}/${file.name}">${file.name}</a>
            <button class="deleteButton" data-id="${file.id}">Usuń</button>
        </div>
    `).join('');
    flDiv.innerHTML = `${html}`;

    //dodajemy eventy dla kazdego przycisku usuwania
    document.querySelectorAll('.deleteButton').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.dataset.id;
            deleteFile(id, button);
        });
    });
}

// sortowanie

function sortList(fileList, sortMode) {
    const newlist = fileList.slice();

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
    fetch(`/api/search?search=${encodeURIComponent(searchString)}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => res.json())
            .then(files => {
                fileList = files;
                //sortujemy i budujemy div
                fileList = sortList(fileList, sortMode);
                buildList(fileList);
            })
    return fileList;
}

// main
fetchList();

// eventy rozmaite
uploadBtn.addEventListener('click', () => {
    if (!uploading && document.getElementById('fileInput').files[0] != undefined) {
        uploadFile();
        uploadBtn.innerHTML = 'Przesyłanie...';
    }
});
ascObj.addEventListener('click', () => {
    buildList(sortList(fileList, 0));
})
descObj.addEventListener('click', () => {
    buildList(sortList(fileList, 1));
})
searchForm.addEventListener('input', function(event) {
    event.preventDefault();
    console.log("Search: "+searchInput.value);
    buildList(searchList(searchInput.value));
});
