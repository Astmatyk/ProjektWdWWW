function uploadFile() {
    const file = document.getElementById('fileInput').files[0];
    if (!file) return;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload');

    xhr.onload = function() {
        const status = document.getElementById('status');
        if (xhr.status == 200) {
            status.textContent = 'Upload successful!';
        } else {
            status.textContent = 'Upload failed.';
        }
    };

    const formData = new FormData();
    formData.append('file', file);
    xhr.send(formData);
}

fetch('/files')
  .then(res => res.json())
  .then(files => {
    const list = files.map(file => `<li><a href="https://ipad.lineage-22-20250401-unofficial-a70q.zip/uploads/${file.name}">${file.name}</a></li>`).join('');
    document.getElementById('file-list').innerHTML = `<ul>${list}</ul>`;
  });
