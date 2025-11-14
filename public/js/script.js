const pswbtn = document.getElementById('pswbtn');
pswbtn.addEventListener('click', function() {
    const pswninput = document.getElementById('password');
    if (pswninput.type === 'password') {
        pswninput.type = 'text';
        pswbtn.innerHTML = 'Hide Password';
    } else {
        pswninput.type = 'password';
        pswbtn.innerHTML = 'Show Password';
    }
});