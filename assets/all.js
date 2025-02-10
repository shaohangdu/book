let showView = document.getElementById('showView');
let input = showView.querySelector('input');
let select = showView.querySelector('select');
let content = document.getElementById('content');
let next = document.getElementById('next');
let copy = document.getElementById('copy');
input.addEventListener('change', function (e) {
    e.preventDefault();
    let url = "show.php";
    fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            'url': this.value,
        }),
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            'Content-Type': 'application/json; charset=utf-8'
        }
    })
        .then(res => res.json())
        .then(data => {
            let str = '';
            select.innerHTML = `<option value=''>請選擇章節</option>`;
            data.forEach(item => {
                let option = document.createElement('option');
                option.value = item.href;
                option.innerText = item.name;

                select.appendChild(option);
            })
        })
        .catch(err => console.log(err));
})

select.addEventListener('change', function (e) {
    e.preventDefault();
    show(this.value);
})

next.addEventListener('click', function (e) {
    e.preventDefault();
    console.log(this.dataset.value);
    show(this.dataset.value);
});

function show(value) {
    let url = "store.php";
    let input = showView.querySelector('input');
    let piaotian = input.value;

    if (piaotian.indexOf('index.html') != -1) {
        piaotian = piaotian.substr(0, piaotian.indexOf('index.html'));
    }

    content.innerHTML = '';
    fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            'url': piaotian + "/" + value,
        }),
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            'Content-Type': 'application/json; charset=utf-8'
        }
    })
        .then(res => res.json())
        .then(data => {
            next.dataset.value = data.next;
            content.innerHTML = data.str;
        })
        .catch(err => console.log(err));
}

// move div----------------------------------
dragElement(document.getElementById("moveView"));
function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
const copyfun = (value) => {
    navigator.clipboard.writeText(value);
};
copy.addEventListener('click', function (e) {
    e.preventDefault();
    copyfun(content.innerText);
})