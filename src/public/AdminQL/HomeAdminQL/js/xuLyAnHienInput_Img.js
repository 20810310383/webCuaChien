document.getElementById('Image').addEventListener('change', function() {
    const fileList = this.files;
    const noFileSelected = document.getElementById('noFileSelected');
    if (fileList.length === 0) {
        noFileSelected.style.display = 'block';
    } else {
        noFileSelected.style.display = 'none';
    }                                
});

document.getElementById('Image1').addEventListener('change', function() {
    const fileList = this.files;
    const noFileSelected1 = document.getElementById('noFileSelected1');
    if (fileList.length === 0) {
        noFileSelected1.style.display = 'block';
    } else {
        noFileSelected1.style.display = 'none';
    }
});

document.getElementById('Image2').addEventListener('change', function() {
    const fileList = this.files;
    const noFileSelected2 = document.getElementById('noFileSelected2');
    if (fileList.length === 0) {
        noFileSelected2.style.display = 'block';
    } else {
        noFileSelected2.style.display = 'none';
    }
});

// ------------------------------------
