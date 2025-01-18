class ReaderNotes {
    constructor(notes) {
        this.notes = notes;
        this.time = this.getSavedTime();
        this.loadAllNotes();
    }

    loadAllNotes() {
        const existingNotes = this.notes.getAllNotes();
        existingNotes.forEach((note) => {
            const noteElement = this.createReaderNote(note);
            document.getElementById("notesWrap").appendChild(noteElement);
        });
        this.insertTime(this.time); // Display the saved time (if any)
    }

    createReaderNote(content) {
        const note = document.createElement("div");
        note.classList.add("readerNote");
        note.appendChild(this.createNoteContent(content))
        this.updateTime();
        return note;
    }

    createNoteContent(content) {
        const noteContent = document.createElement("div");
        noteContent.classList.add("readerNoteContent");
        noteContent.innerHTML = content ? content : "";
        return noteContent;
    }

    // Time update code starts here
    updateTime() {
        const currTime = new Date().toLocaleString();
        this.time = currTime; // Update the time property
        this.saveTime(currTime); // Persist the updated time
        this.insertTime(currTime); // Display the updated time
    }

    getSavedTime() {
        return localStorage.getItem("last_saved_time") || "";
    }

    saveTime(time) {
        localStorage.setItem("last_saved_time", time);
    }

    insertTime(time) {
        document.getElementById("timeDisplay").innerHTML = messages.updatedTime;
        const timeElement = document.getElementById("updatedTime");
        timeElement.innerHTML = timeElement ? time : "";
    }
}

class WriterNotes {
    constructor(notes) {
        this.notes = notes;
        this.time = this.getSavedTime();
        this.loadExistingNotes();
        document.getElementById("addBtn").innerHTML = messages.addBtn;
    }

    loadExistingNotes() {
        const existingNotes = this.notes.getAllNotes();
        existingNotes.forEach((note, index) => {
            const noteElement = this.createWriterNote(note, index);
            document.getElementById("notesWrap").appendChild(noteElement);
        });
        this.insertTime(this.time); // Display the saved time (if any)
    }

    createWriterNote(content, index) {
        const newNote = document.createElement("div");
        newNote.classList.add("writerNote");
        newNote.id = `writerNote_${index}`;
        newNote.appendChild(this.createTextarea(content));
        newNote.appendChild(this.createRemoveBtn());
        return newNote;
    }

    createTextarea(content) {
        const newTextarea = document.createElement("textarea");
        newTextarea.classList.add("writerTextarea");
        newTextarea.value = content ? content : "";
        newTextarea.addEventListener("input", () => this.handleNoteChange(newTextarea));
        return newTextarea;
    }

    createRemoveBtn() {
        const newRemoveBtn = document.createElement("button");
        newRemoveBtn.classList.add("noteBtn");
        newRemoveBtn.innerHTML = messages.removeBtn;
        newRemoveBtn.addEventListener("click", () => this.deleteNote(newRemoveBtn));
        return newRemoveBtn;
    }

    deleteNote(removeBtn) {
        const noteIndex = parseInt(removeBtn.parentElement.id.split("_")[1], 10);
        this.notes.removeFromNotes(noteIndex);
        document.getElementById("notesWrap").innerHTML = ""; // Clear existing notes
        this.loadExistingNotes(); // Reinitialize notes
    }
    
    createNewNote(e) {
        e.preventDefault();
        const newNoteIndex = this.notes.getAllNotes().length;
        this.notes.addToNotes("");
        const newNote = this.createWriterNote("", newNoteIndex);
        document.getElementById("notesWrap").appendChild(newNote);
    }
    
    handleNoteChange(textarea) {
        const noteIndex = parseInt(textarea.parentElement.id.split("_")[1], 10);
        this.updateTime();
        this.notes.updateNote(noteIndex, textarea.value);
    }

    // Time update code starts here
    updateTime() {
        const currTime = new Date().toLocaleString();
        this.time = currTime; // Update the time property
        this.saveTime(currTime); // Persist the updated time
        this.insertTime(currTime); // Display the updated time
    }

    getSavedTime() {
        return localStorage.getItem("last_saved_time") || "";
    }

    saveTime(time) {
        localStorage.setItem("last_saved_time", time);
    }

    insertTime(time) {
        document.getElementById("timeDisplay").innerHTML = messages.updatedTime;
        const timeElement = document.getElementById("updatedTime");
        timeElement.innerHTML = timeElement ? time : "";
    }
}

class NoteStorage {
    constructor() {
        this.notes = localStorage.getItem("user_notes") || "[]";
    }

    getAllNotes() {
        return JSON.parse(localStorage.getItem("user_notes") || "[]");
    }

    addToNotes(note) {
        const notes = this.getAllNotes();
        notes.push(note);
        localStorage.setItem("user_notes", JSON.stringify(notes));
    }

    updateNote(index, content) {
        const notes = this.getAllNotes();
        if (index >= 0 && index < notes.length) {
            notes[index] = content;
            localStorage.setItem("user_notes", JSON.stringify(notes));
        }
    }

    removeFromNotes(index) {
        const notes = this.getAllNotes();
        notes.splice(index, 1);
        localStorage.setItem("user_notes", JSON.stringify(notes));
    }
}

class UI {
    constructor(currLocation) {
        this.notes = new NoteStorage();
        this.init(currLocation);
    }

    // Initializes UI with corresponding page
    init(currLocation) {
        const currPage = currLocation.pathname;
        if (currPage.includes("index")) {
            this.initIndex();
        } else if (currPage.includes("writer")) {
            this.initWriter();
        } else if (currPage.includes("reader")) {
            this.initReader();
        }
    }

    // Navigation initializations
    initNavToIndex() {
        const toIndex = document.getElementById("toIndex");
        if (toIndex) {
            toIndex.innerHTML = messages.toIndexBtn;
            toIndex.onclick = () => {window.location = `index.html`};
        }
    }
    initNavToWriter() {
        const toWriter = document.getElementById("toWriter");
        if (toWriter) {
            toWriter.innerHTML = messages.toWriterBtn;
            toWriter.onclick = () => {window.location = `writer.html`};
        }
    }
    initNavToReader() {
        const toReader = document.getElementById("toReader");
        if (toReader) {
            toReader.innerHTML = messages.toReaderBtn;
            toReader.onclick = () => {window.location = `reader.html`};
        }
    }

    // Page initializations
    initIndex() {
        this.initNavToWriter();
        this.initNavToReader();
        document.getElementById("title").innerHTML = messages.indexTitle;
        document.getElementById("name").innerHTML = messages.name;
    }
    initWriter() {
        this.initNavToIndex();
        document.getElementById("title").innerHTML = messages.writerTitle;
        const writerNotes = new WriterNotes(this.notes);
        document.getElementById("addBtn").addEventListener("click", (e) => writerNotes.createNewNote(e)); 
    }
    initReader() {
        this.initNavToIndex();
        document.getElementById("title").innerHTML = messages.readerTitle;
        new ReaderNotes(this.notes);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new UI(window.location);
});