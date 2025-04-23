const apiUrl = "http://localhost:3000/contacts";
let contacts = [];

document.addEventListener("DOMContentLoaded", () => {
  fetchContacts();

  // Handle form submission
  document.getElementById("contact-form").addEventListener("submit", handleFormSubmit);

  // Handle search input
  document.getElementById("search").addEventListener("input", handleSearch);

  // Toggle contact list visibility
  document.getElementById("viewBtn").addEventListener("click", () => {
    const list = document.getElementById("contact-list");
    if (list.style.display === "none") {
      list.style.display = "block";
      fetchContacts();
      document.getElementById("viewBtn").textContent = "Hide Contacts";
    } else {
      list.style.display = "none";
      document.getElementById("viewBtn").textContent = "View Contacts";
    }
  });
});

// Fetch contacts from API
async function fetchContacts() {
  try {
    const res = await fetch(apiUrl);
    contacts = await res.json();
    displayContacts(contacts);
  } catch (error) {
    console.error("Failed to fetch contacts:", error);
  }
}

// Handle form submit (add or update)
async function handleFormSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const contactId = document.getElementById("contactId").value;

  const contact = { name, phone };

  try {
    if (contactId) {
      // Update contact
      await fetch(`${apiUrl}/${contactId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });
    } else {
      // Add new contact
      await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });
    }

    e.target.reset(); // Clear form
    fetchContacts();  // Refresh list
  } catch (error) {
    console.error("Error saving contact:", error);
  }
}

// Display contact list in the UI
function displayContacts(contactList) {
  const list = document.getElementById("contact-list");
  list.innerHTML = "";

  contactList.forEach((contact) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <strong>${contact.name}</strong><br/>
        <span>${contact.phone}</span>
      </div>
      <div>
        <button class="small edit" onclick="editContact('${contact.id}')">Edit</button>
        <button class="small delete" onclick="deleteContact('${contact.id}')">Delete</button>
      </div>
    `;
    list.appendChild(li);
  });
}

// Search contacts
function handleSearch(e) {
  const term = e.target.value.toLowerCase();
  const filtered = contacts.filter(
    (c) => c.name.toLowerCase().includes(term) || c.phone.includes(term)
  );
  displayContacts(filtered);
}

// Edit contact (pre-fill form)
function editContact(id) {
    const contact = contacts.find((c) => c.id == id); // Use == for type flexibility
  
    if (contact) {
      document.getElementById("name").value = contact.name;
      document.getElementById("phone").value = contact.phone;
      document.getElementById("contactId").value = contact.id;
    }
  }
  
// Delete contact
async function deleteContact(id) {
  if (confirm("Are you sure you want to delete this contact?")) {
    try {
      await fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
      });
      fetchContacts();
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  }
}