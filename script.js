let contacts = [];

// Load initial data from API or localStorage
document.addEventListener("DOMContentLoaded", () => {
  const localData = localStorage.getItem("contacts");
  if (localData) {
    contacts = JSON.parse(localData);
    displayContacts();
  } else {
    fetch('https://jsonplaceholder.typicode.com/users') // Sample API
      .then(res => res.json())
      .then(data => {
        contacts = data.map(user => ({
          name: user.name,
          number: user.phone
        }));
        localStorage.setItem("contacts", JSON.stringify(contacts));
        displayContacts();
      });
  }
});

// Add contact
document.getElementById("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const number = document.getElementById("number").value;

  contacts.push({ name, number });
  localStorage.setItem("contacts", JSON.stringify(contacts));
  displayContacts();

  e.target.reset();
});

// Search function
document.getElementById("searchBtn").addEventListener("click", () => {
  const searchQuery = document.getElementById("search").value.toLowerCase();
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery) ||
    contact.number.includes(searchQuery)
  );
  displayContacts(filteredContacts);
  document.getElementById("contactContainer").style.display = "block"; // show on search too
});

// View all contacts
const viewBtn = document.getElementById("viewBtn");
const contactContainer = document.getElementById("contactContainer");

viewBtn.addEventListener("click", () => {
  if (contactContainer.style.display === "none") {
    displayContacts();
    contactContainer.style.display = "block";
    viewBtn.textContent = "Hide";
  } else {
    contactContainer.style.display = "none";
    viewBtn.textContent = "View";
  }
});

function displayContacts(filteredContacts = contacts) {
  const list = document.getElementById("contactList");
  list.innerHTML = "";

  filteredContacts.forEach((contact, index) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <span>${contact.name} - ${contact.number}</span>
      <div>
        <button class="btn btn-sm btn-info me-2" onclick="editContact(${index})">Edit</button>
        <button class="btn btn-sm btn-secondary" onclick="deleteContact(${index})">Delete</button>
      </div>
    `;
    list.appendChild(li);
  });
}

function editContact(index) {
  const newName = prompt("Edit Name:", contacts[index].name);
  const newNumber = prompt("Edit Number:", contacts[index].number);

  if (newName && newNumber) {
    contacts[index].name = newName;
    contacts[index].number = newNumber;
    localStorage.setItem("contacts", JSON.stringify(contacts));
    displayContacts();
  }
}

function deleteContact(index) {
  if (confirm("Delete this contact?")) {
    contacts.splice(index, 1);
    localStorage.setItem("contacts", JSON.stringify(contacts));
    displayContacts();
  }
}
