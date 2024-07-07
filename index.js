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

let noteHistory = JSON.parse(localStorage.getItem('noteHistory1')) || []
console.log(noteHistory)


document.addEventListener('DOMContentLoaded', function () {
    let date = getDate();
    dateText.textContent = date;
    updateNotesHistory(noteHistory)
    textArea.focus()

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
    let idNumber = Math.round((Math.random()) * 100000000)
    noteHistory.push({
        id: idNumber,
        text: textArea.value,
        date: dateText.textContent
    })
    localStorage.setItem('noteHistory1', JSON.stringify(noteHistory))
    console.log(noteHistory)
    textArea.value = "";
    textArea.focus();
}

let updateNotesHistory = (array) => {
    noteHistoryList.innerHTML ="";

    array.forEach((note) => {
        let div = document.createElement('div');
        let p = document.createElement('p');
        let trasher = document.createElement('i');

        trasher.className = "fa-solid fa-trash p-0 trasher"
        p.className = "p-0 m-0 button"
        p.textContent = note.text.slice(0, 32)
        div.className = "ps-3 pe-3 p-2 mb-3 d-flex flex-row justify-content-between align-items-center divNote"

        div.id = note.id;

        p.addEventListener('click', function () {
            textArea.value = note.text;
            dateText.textContent = note.date;
            hideShow(overlay, noteHistoryContainer)
            textArea.focus()
            console.log(note.text)
        })

        trasher.addEventListener('click', function(){
            console.log(noteHistory)
            let newArray = noteHistory.filter((item) => (item.id != note.id))
            noteHistory = newArray;
            updateNotesHistory(noteHistory)
            localStorage.setItem('noteHistory1', JSON.stringify(noteHistory));
        })

        div.appendChild(p);
        div.appendChild(trasher);
        noteHistoryList.appendChild(div)
    })
}

saveButton.addEventListener('click', function () {
    if(textArea.value != ""){
        UpdateNotesDatabase();
        updateNotesHistory(noteHistory);
        let date = getDate();
        dateText.textContent = date;
    } else {
        noteDiv.style.transform = "scale(1.05)"
        setTimeout(()=>{
            noteDiv.style.transform = "scale(1.0)"
        },100)
    }
})

menu.addEventListener('click', function () {
    noteHistoryContainer.classList.toggle('hidden')
    overlay.classList.toggle('hidden');
    search.focus()
})

overlay.addEventListener('click', function () {
    hideShow(overlay, noteHistoryContainer);
    textArea.focus()
})

trash.addEventListener('click', function(){
    textArea.value = "";
})

let hideShow = (x, y) => {
    x.classList.toggle('hidden');
    y.classList.toggle('hidden');
}

document.addEventListener('keydown', function(e){
    if(e.key === "Enter" && e.ctrlKey){
        saveButton.click()
    } if (e.key === "Delete") {
        textArea.value = "";
    } if (e.shiftKey && e.ctrlKey){
        menu.click()
    }
})

let searching = (x) => {
    noteHistoryList.innerHTML = "";

    let searchResult = noteHistory.filter((note) => note.text.toLowerCase().includes(x))
    console.log(searchResult)

    updateNotesHistory(searchResult)
}

search.addEventListener('input', function(){
    let searchText = search.value.toLowerCase();
    console.log(searchText)
    searching(searchText)
})
