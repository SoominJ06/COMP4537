// Id names and classnames
const readerNoteClass = "readerNote";
const readerNoteContentClass = "readerNoteContent";
const writerNoteClass = "writerNote";
const writerTextareaClass = "writerTextarea"
const noteBtnClass = "noteBtn";

// Element names
const createButtonElement = "button";
const createDivElement = "div";
const createTextareaElement = "textarea";

// Attributes
const underscoreDdlimiter = "_";
const emptyString = "";
const htmlPage = ".html";
const emptyObj = "[]";

// Names of elements in document
const grabNotesWrap = "notesWrap";
const grabTimeDisplay = "timeDisplay;"
const grabUpdatedTime = "updatedTime";
const grabAddBtn = "addBtn";
const grabTitle = "title";
const grabName = "name";
const grabIndexNav = "toIndex";
const grabWriterNav = "toWriter";
const grabReaderNav = "toReader";

// Event names
const clickEvent = "click";
const storageEvent = "storage";
const inputEvent = "input";
const domContentLoadedEvent = "DOMContentLoaded";

// localStorage key names
const storageUserNotes = "user_notes";
const lastSavedTime = "last_saved_time";

// Page names
const indexPage = "index";
const writerPage = "writer";
const readerPage = "reader";

class ReaderNotes {
    constructor(notes) {
        this.notes = notes;
        this.time = this.getSavedTime();
        this.loadAllNotes();
        // ChatGPT suggested using storage event listener to update the notes in real-time
        window.addEventListener(storageEvent, (event) => {
            if (event.key === storageUserNotes) {
                this.updateNotes(); // Reload notes when user_notes changes
            }
        });
    }

    clearAllNotes() {
        document.getElementById(grabNotesWrap).innerHTML = emptyString;
    }

    loadAllNotes() {
        this.clearAllNotes();
        const existingNotes = this.notes.getAllNotes();
        existingNotes.forEach((note) => {
            const noteElement = this.createReaderNote(note);
            document.getElementById(grabNotesWrap).appendChild(noteElement);
        });
        this.insertTime(this.time); // Display the saved time (if any)
    }

    updateNotes() {
        this.updateTime();
        this.loadAllNotes(); // Reload the notes from localStorage
    }

    createReaderNote(content) {
        const note = document.createElement(createDivElement);
        note.classList.add(readerNoteClass);
        note.appendChild(this.createNoteContent(content))
        this.updateTime();
        return note;
    }

    createNoteContent(content) {
        const noteContent = document.createElement(createDivElement);
        noteContent.classList.add(readerNoteContentClass);
        noteContent.innerHTML = content ? content : emptyString;
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
        return localStorage.getItem(lastSavedTime) || emptyString;
    }

    saveTime(time) {
        localStorage.setItem(lastSavedTime, time);
    }

    insertTime(time) {
        document.getElementById(grabTimeDisplay).innerHTML = messages.updatedTime;
        const timeElement = document.getElementById(grabUpdatedTime);
        timeElement.innerHTML = timeElement ? time : emptyString;
    }
}

class WriterNotes {
    constructor(notes) {
        this.notes = notes;
        this.time = this.getSavedTime();
        this.loadExistingNotes();
        document.getElementById(grabAddBtn).innerHTML = messages.addBtn;
    }

    loadExistingNotes() {
        const existingNotes = this.notes.getAllNotes();
        existingNotes.forEach((note, index) => {
            const noteElement = this.createWriterNote(note, index);
            document.getElementById(grabNotesWrap).appendChild(noteElement);
        });
        this.insertTime(this.time); // Display the saved time (if any)
    }

    createWriterNote(content, index) {
        const newNote = document.createElement(createDivElement);
        newNote.classList.add(writerNoteClass);
        newNote.id = writerNoteClass + underscoreDdlimiter + index;
        newNote.appendChild(this.createTextarea(content));
        newNote.appendChild(this.createRemoveBtn());
        return newNote;
    }

    createTextarea(content) {
        const newTextarea = document.createElement(createTextareaElement);
        newTextarea.classList.add(writerTextareaClass);
        newTextarea.value = content ? content : emptyString;
        newTextarea.addEventListener(inputEvent, () => this.handleNoteChange(newTextarea));
        return newTextarea;
    }

    createRemoveBtn() {
        const newRemoveBtn = document.createElement(createButtonElement);
        newRemoveBtn.classList.add(noteBtnClass);
        newRemoveBtn.innerHTML = messages.removeBtn;
        newRemoveBtn.addEventListener(clickEvent, () => this.deleteNote(newRemoveBtn));
        return newRemoveBtn;
    }

    deleteNote(removeBtn) {
        const noteIndex = parseInt(removeBtn.parentElement.id.split(underscoreDdlimiter)[1], 10);
        this.notes.removeFromNotes(noteIndex);
        document.getElementById(grabNotesWrap).innerHTML = emptyString; // Clear existing notes
        this.updateTime();
        this.loadExistingNotes(); // Reinitialize notes
    }
    
    createNewNote(e) {
        e.preventDefault();
        const newNoteIndex = this.notes.getAllNotes().length;
        this.notes.addToNotes(emptyString);
        const newNote = this.createWriterNote(emptyString, newNoteIndex);
        document.getElementById(grabNotesWrap).appendChild(newNote);
        this.updateTime();
    }
    
    handleNoteChange(textarea) {
        const noteIndex = parseInt(textarea.parentElement.id.split(underscoreDdlimiter)[1], 10);
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
        return localStorage.getItem(lastSavedTime) || emptyString;
    }

    saveTime(time) {
        localStorage.setItem(lastSavedTime, time);
    }

    insertTime(time) {
        document.getElementById(grabTimeDisplay).innerHTML = messages.updatedTime;
        const timeElement = document.getElementById(grabUpdatedTime);
        timeElement.innerHTML = timeElement ? time : emptyString;
    }
}

class NoteStorage {
    constructor() {
        this.notes = localStorage.getItem(storageUserNotes) || emptyObj;
    }

    getAllNotes() {
        return JSON.parse(localStorage.getItem(storageUserNotes) || emptyObj);
    }

    addToNotes(note) {
        const notes = this.getAllNotes();
        notes.push(note);
        localStorage.setItem(storageUserNotes, JSON.stringify(notes));
    }

    updateNote(index, content) {
        const notes = this.getAllNotes();
        if (index >= 0 && index < notes.length) {
            notes[index] = content;
            localStorage.setItem(storageUserNotes, JSON.stringify(notes));
        }
    }

    removeFromNotes(index) {
        const notes = this.getAllNotes();
        notes.splice(index, 1);
        localStorage.setItem(storageUserNotes, JSON.stringify(notes));
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
        if (currPage.includes(indexPage)) {
            this.initIndex();
        } else if (currPage.includes(writerPage)) {
            this.initWriter();
        } else if (currPage.includes(readerPage)) {
            this.initReader();
        }
    }

    // Navigation initializations
    initNavToIndex() {
        const toIndex = document.getElementById(grabIndexNav);
        if (toIndex) {
            toIndex.innerHTML = messages.toIndexBtn;
            toIndex.onclick = () => {window.location = indexPage + htmlPage};
        }
    }
    initNavToWriter() {
        const toWriter = document.getElementById(grabWriterNav);
        if (toWriter) {
            toWriter.innerHTML = messages.toWriterBtn;
            toWriter.onclick = () => {window.location = writerPage + htmlPage};
        }
    }
    initNavToReader() {
        const toReader = document.getElementById(grabReaderNav);
        if (toReader) {
            toReader.innerHTML = messages.toReaderBtn;
            toReader.onclick = () => {window.location = readerPage + htmlPage};
        }
    }

    // Page initializations
    initIndex() {
        this.initNavToWriter();
        this.initNavToReader();
        document.getElementById(grabTitle).innerHTML = messages.indexTitle;
        document.getElementById(grabName).innerHTML = messages.name;
    }
    initWriter() {
        this.initNavToIndex();
        document.getElementById(grabTitle).innerHTML = messages.writerTitle;
        const writerNotes = new WriterNotes(this.notes);
        document.getElementById(grabAddBtn).addEventListener(clickEvent, (e) => writerNotes.createNewNote(e)); 
    }
    initReader() {
        this.initNavToIndex();
        document.getElementById(grabTitle).innerHTML = messages.readerTitle;
        new ReaderNotes(this.notes);
    }
}

document.addEventListener(domContentLoadedEvent, () => {
    new UI(window.location);
});