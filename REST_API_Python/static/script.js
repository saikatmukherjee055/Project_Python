document.addEventListener("DOMContentLoaded", function() {
    loadItems();
});

let currentItemIndex = null;

function loadItems() {
    fetch('/items')
        .then(response => response.json())
        .then(data => {
            const itemList = document.getElementById("itemList");
            itemList.innerHTML = '';
            data.forEach((item, index) => {
                const li = document.createElement("li");
                
                const span = document.createElement("span");
                span.textContent = item.name;

                const buttonGroup = document.createElement("div");
                buttonGroup.className = "button-group";

                const updateButton = document.createElement("button");
                updateButton.innerHTML = '<i class="fas fa-edit"></i>';
                updateButton.className = "update-button";
                updateButton.onclick = () => openModal(index, item.name);

                const deleteButton = document.createElement("button");
                deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
                deleteButton.className = "delete-button";
                deleteButton.onclick = () => deleteItem(index);

                buttonGroup.appendChild(updateButton);
                buttonGroup.appendChild(deleteButton);

                li.appendChild(span);
                li.appendChild(buttonGroup);

                itemList.appendChild(li);
            });
        });
}

function createItem() {
    const itemInput = document.getElementById("itemInput");
    const itemName = itemInput.value.trim();

    if (!itemName) {
        alert("Item name cannot be empty.");
        return;
    }

    const item = { name: itemName };

    fetch('/items', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
    })
    .then(response => response.json())
    .then(data => {
        itemInput.value = '';
        loadItems();
    });
}

function openModal(index, name) {
    currentItemIndex = index;
    document.getElementById("updateInput").value = name;
    document.getElementById("updateModal").style.display = "block";
}

function closeModal() {
    document.getElementById("updateModal").style.display = "none";
}

function confirmUpdate() {
    const itemName = document.getElementById("updateInput").value.trim();

    if (!itemName) {
        alert("Item name cannot be empty.");
        return;
    }

    const item = { name: itemName };

    fetch(`/items/${currentItemIndex}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        return response.json().then(err => { throw err; });
    })
    .then(data => {
        loadItems();
        closeModal();
    })
    .catch(error => {
        alert(error.error || "Error updating item.");
    });
}

function deleteItem(itemId) {
    fetch(`/items/${itemId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        loadItems();
    });
}
