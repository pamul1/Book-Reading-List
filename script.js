let token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bm95YWxtcmVheXdxd3NyeW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgzNDczNzAsImV4cCI6MjA0MzkyMzM3MH0.t_yzEGMttCDR2oITWMF_YYLdibKrOcXbSnXE29-WHg8`

let endPoint = `https://uunoyalmreaywqwsrymh.supabase.co/rest/v1/book_reading_list`

let modalNotes
let modalBooks

let notessBooks = []

const user = () => {
    event.preventDefault()

    let username = inputUserName.value
    window.localStorage.setItem('username', username)

}

const showNotes = (id) => {

    event.preventDefault()

    modalNotes = new bootstrap.Modal(document.getElementById("modalNotes"))
    modalNotes.show()
    inputIdBook.value = id
    getNotess(id)

}

const getBooks = async () => {

    let url = `${endPoint}?order=title.asc`

    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'apikey': token,
            'Authorization': token
        }
    })

    let body = await response.json()

    if (response.ok) {

        let cardLayOut = ``

        for (let i = 0; i < body.length; i++) {

            cardLayOut += `<div class="m-3" style="width: 400px;">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${body[i].title}</h5>
                    <p class="card-text">Status: ${body[i].status} </p>
                    <button onclick="showNotess(${body[i].id})" class="btn btn-primary"><i class="fa-regular fa-comment"></i></a>
                </div>
            </div>
        </div>`

        }

        bookReport.innerHTML = cardLayOut

    }
}

const getNotes = async (id) => {

    let url = `${endPoint}?id=eq.${id}`


    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'apikey': token,
            'Authorization': token
        }
    })

    let body = await response.json()

    if (response.ok) {

        let book = body[0]
        let notes = book.notes

        let listItemLayOut = ``

        for (let i = 0; i < notes.length; i++) {

            listItemLayOut += `<li class="list-group-item">${notes[i].user}: ${notes[i].text} </li>`

        }

        getNotes.innerHTML = listItemLayOut
        notesBook = notes
    }
}

const addNote = async () => {

    event.preventDefault()

    let id = inputId1.value
    let text = inputNote1.value
    let user = inputUser1.value

    let notes = {
        text,
        user
    }

    //notesBook.push(note)

    let updateInfo = {
        notes
    }


    let url = `${endPoint}?id=eq.${id}`
    let response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'apikey': token,
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateInfo)
    })

    if (response.ok) {
        console.log("Note Added")
        getNotes(id)
    } else {
        console.log("Note wasn´t added")
        let body = await response.json()
        console.log(body)
    }
}

const onLoadBooks = () => {

    getBooks()
    getUserName()

}

const showModalBooks = () => {

    modalBooks = new bootstrap.Modal(document.getElementById("modalBooks1"))
    modalBooks.show()

}

const postBook = async () => {

    event.preventDefault()

    let title = inputTitle.value
    let author = inputAuthor.value
    let status = inputStatus.value
    let notes = []

    let movie = {
        title,
        author,
        status,
        notes
    }

    let response = await fetch(endPoint, {
        method: 'POST',
        headers: {
            'apikey': token,
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(movie)
    })

    if (response.ok) {

    } else {
        console.log("Book wasn´t added")
        let body = await response.json()
        console.log(body)
    }
}

const createNote = async () => {

    let id = inputIdNote.value
    let name = window.localStorage.getItem("username")
    let note = inputNote.value
    let today = new Date()
    let date = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`

    let noteObject = {
        name,
        note,
        date
    }


    let url = `${baseURL}?id=eq.${id}`

    let responseNotes = await fetch(url, {
        method: 'GET',
        headers: {
            'apikey': token,
            'Authorization': token
        }
    })

    if (responseNotes.ok) {

        let bodyNotes = await responseNotes.json()
        let post = bodyNotes[0]


        post.notes.push(noteObject)

        let response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'apikey': token,
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
        })

        if (response.ok) {
            getAllPosts()
            noteModal.hide()
            showNotesModal(id)
            inputNote.value = ""
        } else {
            console.log("Note wasn´t added")
        }



    } else {
        console.log(`Post with id: ${id} is not getting returned from supabase`)
    }

}

function renderReportBooks(data) {

    let tableLayout = ` <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Status</th>
                            <th>Notes</th>
                        <tr>`

    for (let i = 0; i < data.length; i++) {
        tableLayout += ` <tr>
                            <td>${data[i].title}</td>
                            <td>${data[i].author}</td>
                            <td>${data[i].status}</td>
                            <td>${data[i].notes}</td>
                        <tr> `

    }

    loadbooks.innerHTML = tableLayout

}