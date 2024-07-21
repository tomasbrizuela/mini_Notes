let noteDiv = document.querySelector('#noteArea');
let dateText = document.querySelector('#dateNote');
let menu = document.querySelector('#menu');
let noteHistoryList = document.querySelector('#noteHistoryList');
let noteHistoryContainer = document.querySelector('#noteHistoryContainer');
let textArea = document.querySelector('textarea');
let saveButton = document.querySelector('#saveButton')
let overlay = document.querySelector('.overlay');
let trash = document.querySelector('#trash');
let buttonX = document.querySelectorAll('.buttonX');
let search = document.querySelector('input');
let sun = document.querySelector('#buttonSun');
let moon = document.querySelector('#buttonMoon');
let tag = document.querySelector('#tag');
let drop = document.querySelector('#dropdown');
let count = document.querySelector('#caracteres');
let mode = "dark";
let focusMode = true;

let noteHistory = JSON.parse(localStorage.getItem('noteHistory1')) || [];
let textLastSession = localStorage.getItem('noteLastSession1') || "";

let foc = () => {
    textArea.focus()
}

document.addEventListener('DOMContentLoaded', function () {
    let date = getDate();
    dateText.textContent = date;
    updateNotesHistory(noteHistory)
    textArea.value = textLastSession;
    localStorage.removeItem('currentId');
    foc();
})

let getDate = () => {
    let date = new Date
    let min = date.getMinutes();
    let mins = min.toString().padStart(2, 0);
    let hour = date.getHours();
    let hours = hour.toString().padStart(2, 0);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let fullDate = hours + ":" + mins + " " + day + "/" + month + "/" + year;
    return (fullDate)
}

let UpdateNotesDatabase = () => {
    let idNumber = 0;
    if (localStorage.getItem('currentId')) {
        idNumber = parseInt(getId())
    } else {
        idNumber = Math.round((Math.random()) * 100000000);
        noteHistory.push({
            id: idNumber,
            text: textArea.value,
            date: dateText.textContent
        })
    }

    localStorage.setItem('noteHistory1', JSON.stringify(noteHistory))
    textArea.value = "";
    localStorage.removeItem('currentId');
    foc()
}

let updateNotesHistory =  (array) => {
    noteHistoryList.innerHTML = "";

    array.forEach( (note) => {
        // if(note.id === JSON.parse(localStorage.getItem("currentNote"))[0].id){
        //     console.log("Hola");
        // }
        let div = document.createElement('div');
        let p = document.createElement('p');
        let trasher = document.createElement('i');

        trasher.className = "fa-solid fa-trash p-2 trasher"
        p.className = "p-2 m-0 button textBox"
        p.textContent = note.text.slice(0, 30)
        // p.textContent = await getTitle(note.text);
        div.className = "ps-3 pe-3 mb-3 d-flex flex-row justify-content-between align-items-center divNote"

        div.id = note.id;

        p.addEventListener('click', function () {
            textArea.value = note.text;
            dateText.textContent = note.date;
            hideShow(overlay, noteHistoryContainer);
            localStorage.setItem('currentNote', JSON.stringify(note))
            itemHolder(note.id)
            search.value = "";
            foc()
        })

        trasher.addEventListener('click', function () {
            console.log(noteHistory);
            let newArray = noteHistory.filter((item) => (item.id != note.id));
            noteHistory = newArray;
            updateNotesHistory(noteHistory);
            localStorage.setItem('noteHistory1', JSON.stringify(noteHistory));
        })

        div.appendChild(p);
        div.appendChild(trasher);
        noteHistoryList.appendChild(div)
    })
}

saveButton.addEventListener('click', function () {
    if (textArea.value != "") {
        UpdateNotesDatabase();
        updateNotesHistory(noteHistory);
        localStorage.setItem('noteLastSession1', "");
        let date = getDate();
        shadowSaveButton();
        dateText.textContent = date;
        escapeKey()
    } else {
        noteDiv.style.transform = "scale(1.05)"
        setTimeout(() => {
            noteDiv.style.transform = "scale(1.0)"
        }, 100)
    }
})

menu.addEventListener('click', function () {
    noteHistoryContainer.classList.toggle('hidden')
    overlay.classList.toggle('hidden');
    search.focus()
})

overlay.addEventListener('click', function () {
    hideShow(overlay, noteHistoryContainer);
    foc()
})

trash.addEventListener('click', function () {
    textArea.value = "";
    localStorage.removeItem('currentId');
    foc()
})

let hideShow = (x, y) => {
    x.classList.toggle('hidden');
    y.classList.toggle('hidden');
}

document.addEventListener('keydown', function (e) {
    if (e.key === "Enter" && e.ctrlKey) {
        saveButton.click()
    }
    if (e.key === "Delete") {
        textArea.value = "";
    }
    if (e.shiftKey && e.ctrlKey) {
        menu.click()
    }
    if (e.ctrlKey && e.code === "Space") {
        if (mode === "ligth") {
            moon.click()
        } else {
            sun.click()
        }
    }
})

let searching = (x) => {
    noteHistoryList.innerHTML = "";

    let searchResult = noteHistory.filter((note) => note.text.toLowerCase().includes(x))
    updateNotesHistory(searchResult)
}

search.addEventListener('input', function () {
    let searchText = search.value.toLowerCase();
    console.log(searchText)
    searching(searchText)
})

textArea.addEventListener('input', function () {
    console.log(textArea.value)
    localStorage.setItem('noteLastSession1', textArea.value);
})

let shadowSaveButton = () => {
    menu.style.textShadow = "2px 2px 15px #FFFFFF";
    menu.style.transform = "scale(1.3)";
    setTimeout(() => {
        menu.style.textShadow = "0px 0px 0px #000000";
        menu.style.transform = "scale(1)";

    }, 500)
}

let itemHolder = (id) => {
    localStorage.setItem('currentId', id);
}

let getId = () => {
    let id = parseInt(localStorage.getItem('currentId'));
    noteHistory.map((note) => {
        if (note.id === id) {
            note.text = textArea.value;
        }
    })
    return (id)
}

sun.addEventListener('click', function () {
    moon.classList.toggle('hidden');
    sun.classList.toggle('hidden');
    document.body.style.backgroundColor = "white";
    textArea.style.backgroundColor = "white";
    textArea.style.color = "black";
    search.style.backgroundColor = "white";
    let textBox = document.querySelectorAll('.textBox');
    textBox.forEach(text => {
        text.classList.toggle('button');
        text.classList.toggle('buttonTheme');
    })
    foc()
    mode = "ligth";
})

moon.addEventListener('click', function () {
    moon.classList.toggle('hidden');
    sun.classList.toggle('hidden');
    document.body.style.backgroundColor = "black";
    textArea.style.backgroundColor = "black";
    textArea.style.color = "white";
    search.style.backgroundColor = "black";
    let textBox = document.querySelectorAll('.textBox');
    textBox.forEach(text => {
        text.classList.toggle('button');
        text.classList.toggle('buttonTheme');
    })
    foc()
    mode = "dark"
})

tag.addEventListener('click', function () {
    drop.classList.toggle('hidden');
    drop.style.width = "100px";
})

document.addEventListener('keydown', function (e) {
    if (e.altKey && e.ctrlKey && focusMode == true) {
            sun.classList.toggle('dontShow');
            menu.classList.toggle('dontShow');
            moon.classList.toggle('dontShow');
            noteDiv.style.width = "700px"
            noteDiv.style.height = "300px"
            textArea.style.height = "120%"
            noteDiv.style.right = "22%";
            focusMode = !focusMode;
    } if (e.key === "Escape" && focusMode == false) {
        escapeKey();
    }
})

textArea.addEventListener('input', function(){
    let text = textArea.value
    let number = text.length

    count.textContent = "Carácteres: " + number;
})

let getTitle = async (x) => {
    let response = await fetch(`http://localhost:7788/data/${x}`);
    let data = await response.json();

    return data
}