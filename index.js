
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
import { databaseURL } from "./constants.js"

const appSettings = {
    databaseURL: databaseURL
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const addBtn = document.getElementById("add-button")
const input = document.getElementById("input-field")
const shoppingList = document.getElementById("shopping-list")

addBtn.addEventListener("click", () => {
    const inputValue = input.value
    push(shoppingListInDB, inputValue)
    clearFields()
})
onValue(shoppingListInDB, (snapshot) => {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        clearList()
        itemsArray.forEach((currentItem) => {
            let [currentItemID, currentItemValue] = currentItem;
            addNewItem(currentItem);
        })
    } else {
        clearList()
        let message = document.createElement("p")
        message.textContent = "No items here... yet"
        shoppingList.append(message)
    }

})
function clearList() {
    shoppingList.innerHTML = ""
}
function clearFields() {
    input.value = ""
}
function addNewItem(item) {
    let [currentItemID, currentItemValue] = item;
    let newEl = document.createElement("li")
    newEl.textContent = currentItemValue
    shoppingList.append(newEl)
    newEl.addEventListener("click", () => {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${currentItemID}`)
        remove(exactLocationOfItemInDB)
    })
}