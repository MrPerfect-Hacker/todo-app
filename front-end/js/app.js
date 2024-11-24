document.addEventListener('DOMContentLoaded', () => {
  const authContainer = document.getElementById('auth-container');
  const todoContainer = document.getElementById('todo-container');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const taskForm = document.getElementById('task-form'); // voeg formulier voor taak toevoegen toe

  // Login gebruiker
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token); // JWT-token opslaan
        alert('Succesvol ingelogd!');
        authContainer.style.display = 'none';
        todoContainer.style.display = 'block';
        loadTasks(); // Laad taken na inloggen
      } else {
        alert(data.error || 'Inloggen mislukt!');
      }
    } catch (error) {
      console.error('Fout bij inloggen:', error);
    }
  });

  // Registreren gebruiker
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Succesvol geregistreerd! Log nu in.');
      } else {
        alert(data.error || 'Registratie mislukt!');
      }
    } catch (error) {
      console.error('Fout bij registreren:', error);
    }
  });

  // Taken laden (alleen na inloggen)
  async function loadTasks() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:5001/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const tasks = await response.json();
      const taskList = document.getElementById('task-list');
      taskList.innerHTML = ''; // Lijst leegmaken

      tasks.forEach((task) => {
        const li = document.createElement('li');
        li.textContent = `${task.title}: ${task.description}`;

        // Knop voor bijwerken taak
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Bijwerken';
        updateButton.onclick = () => updateTask(task._id); //Roep updateTask-functie aan met taakId
        taskList.appendChild(li);

        // Knop voor verwijderen taak
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Verwijderen';
        deleteButton.onclick = () => deleteTask(task._id); // Roep deleteTask-functie aan met taakId
        taskList.appendChild(deleteButton);

        taskList.appendChild(li);
      });
    } catch (error) {
      console.error('Fout bij het laden van taken:', error);
    }
  }

  // Taak toevoegen
  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Je moet ingelogd zijn om een taak toe te voegen!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // JWT-token in de header meesturen
        },
        body: JSON.stringify({ title, description }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Taak succesvol toegevoegd!');
        loadTasks();  // Herlaad de takenlijst na toevoeging
      } else {
        alert(data.error || 'Fout bij het toevoegen van taak!');
      }
    } catch (error) {
      console.error('Fout bij toevoegen van taak:', error);
    }
  });

  // Functie om een taak bij te werken
async function updateTask(taskId) {
  const newTitle = prompt('Nieuwe titel voor de taak:');
  const newDescription = prompt('Nieuwe beschrijving voor de taak:');

  const token = localStorage.getItem('token');
  if (!token) {
    alert('Je moet ingelogd zijn om een taak bij te werken!');
    return;
  }

  try {
    const response = await fetch(`http://localhost:5001/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newTitle, description: newDescription }),
    });

    const data = await response.json();
    if (response.ok) {
      alert('Taak succesvol bijgewerkt!');
      loadTasks();  // Herlaad de takenlijst
    } else {
      alert(data.error || 'Fout bij het bijwerken van taak!');
    }
  } catch (error) {
    console.error('Fout bij het bijwerken van taak:', error);
  }
}

// Functie om een taak te verwijderen
async function deleteTask(taskId) {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Je moet ingelogd zijn om een taak te verwijderen!');
    return;
  }

  try {
    const response = await fetch(`http://localhost:5001/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (response.ok) {
      alert('Taak succesvol verwijderd!');
      loadTasks();  // Herlaad de takenlijst
    } else {
      alert(data.error || 'Fout bij het verwijderen van taak!');
    }
  } catch (error) {
    console.error('Fout bij het verwijderen van taak:', error);
  }
}

});