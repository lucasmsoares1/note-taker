const addNoteBtn = document.querySelector('[datajs="add-note"]');
const modalArea = document.querySelector('[data-js="modal-backdrop"]');
const modalForm = document.querySelector('[data-js="modal-form"]');
const notesArea = document.querySelector('[data-js="notes-area"]');
const modalTitle = document.querySelector('[data-js="modal-title"]');
const modalSubmit = document.querySelector('[data-js="modal-submit"]');
const titleInputValue = document.querySelector("#title");
const contentInputValue = document.querySelector("#content");
const filter = document.querySelector('[data-js="filter"]');
const body = document.querySelector("body");

// edit status
let isEditing = false;
let editId = "";

// set local storage values in fake database
let notes = localStorage.getItem('notesData') 
  ? JSON.parse(localStorage.getItem('notesData'))
  : []

// add template html into DOM
const addNotesIntoDOM = (arrayToAddIntoDOM) => {
  let notesHTML = arrayToAddIntoDOM
    .map(({ id, title, content, date }) => {
      return `
    <div class="note" data-js=${id}>
      <h2 class="note__title">${title}</h2>
      <p class="note__content">${content}</p>
      <div class="note__bottom">
        <div class="note__date">${date}</div>
        <div class="note__icons">
          <ion-icon onClick="setModalToEdit(${id})" name="create-outline" class="note__icon note__icon--edit"></ion-icon>
          <ion-icon onClick="removeNote(${id})" name="trash-outline" class="note__icon note__icon--delete"></ion-icon>
        </div>
      </div>
    </div>
    `;
    })
    .join("");

  notesArea.innerHTML += notesHTML;
};

// open modal
const openModal = () => {
  modalArea.classList.add("modal--show");
  body.style.overflow = "hidden";
};

// close modal
const closeModal = () => {
  modalArea.classList.remove("modal--show");
  body.style.overflow = "initial";
  setBackToDefault();
};

// generate indentifier for each note
const generateID = () => {
  return Date.now();
};

// create new note object
const addNote = () => {
  const newNote = {
    id: generateID(),
    title: titleInputValue.value.trim(),
    content: contentInputValue.value.trim(),
    date: new Date().toLocaleDateString(),
  };

  notes.push(newNote);
  closeModal();
  updateApp();
  return;
};

// remove note filtering the ids 
const removeNote = (id) => {
  notes = notes.filter((note) => note.id !== id);
  updateLocalStorage()
  updateApp();
};

// set edit mode to false, reset modal and inputs
const setBackToDefault = () => {
  modalTitle.textContent = "Criar uma nota";
  modalSubmit.textContent = "Criar Nota";
  titleInputValue.value = "";
  contentInputValue.value = "";
  isEditing = false;
  filter.value = "";
};

// change modal values (edit note)
const setModalToEdit = (id) => {
  modalTitle.textContent = "Editar nota";
  modalSubmit.textContent = "Editar";
  isEditing = true;
  editId = id;
  openModal();
  const noteToEdit = notes.find((note) => note.id === id);

  titleInputValue.value = noteToEdit.title;
  contentInputValue.value = noteToEdit.content;
};

// edit selected note with the map method 
const editNote = () => {
  notes = notes.map((note) => {
    if (note.id === editId) {
      return {
        ...note,
        title: titleInputValue.value.trim(),
        content: contentInputValue.value.trim(),
      };
    }

    return note;
  });

  setBackToDefault();
  closeModal();
  updateApp();
};

// filter notes using the method includes and reusing the addNotesIntoDOM function
const filterNotes = (e) => {
  const filterTerm = e.target.value;

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(filterTerm.toLowerCase())
  );
  updateApp(filteredNotes);
};

// submit notes form 
const submitForm = (e) => {
  e.preventDefault();

  if (titleInputValue && contentInputValue && !isEditing) {
    addNote();
  } else if (titleInputValue && contentInputValue && isEditing) {
    editNote();
  }

  updateLocalStorage()
  setBackToDefault();
};

// update the state of the application
const updateApp = (arrayToAddIntoDOM = notes) => {
  notesArea.innerHTML = `
  <button class="add-note" data-js="add-note">
    <div class="add-note__plus" data-js="add-note">
      <ion-icon name="add-outline" data-js="add-note"></ion-icon>
    </div>  
    <h3 class="add-note__title" data-js="add-note">Adicionar Nota</h3>
  </button>
  `;
  addNotesIntoDOM(arrayToAddIntoDOM);
};

updateApp();

// update the "database" 
const updateLocalStorage = () => {
  localStorage.setItem('notesData', JSON.stringify(notes))
}


// event listeners 
notesArea.addEventListener("click", (e) =>
  e.target.dataset.js === "add-note" ? openModal() : ""
);
modalArea.addEventListener("click", (e) => {
  const clickedElement = e.target.dataset.js;

  const targetsToClose = ["modal-backdrop", "close-modal"];
  const isCloseModal = targetsToClose.some(
    (target) => clickedElement === target
  );

  if (isCloseModal) closeModal();
});
modalForm.addEventListener("submit", submitForm);
filter.addEventListener("input", filterNotes);
