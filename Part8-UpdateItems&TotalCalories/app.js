//Storage Controller:


//Item Controller:
const ItemCtrl = (function () {
  //Item constructor:
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  //Data Structure/State:
  const data = {
    items: [
      // {
      //   id: 0,
      //   name: "Steak Dinner",
      //   calories: 1200,
      // },
      // {
      //   id: 1,
      //   name: "Cookie",
      //   calories: 400,
      // },
      // {
      //   id: 2,
      //   name: "Eggs",
      //   calories: 300,
      // },
    ],
    currentItem: null,
    totalCalories: 0,
  };

  //Public Methods - allow access to data structure publicly:
  return {
    getItems: function () {
      return data.items;
    },
    addItem: function (name, calories) {
      let ID;
      //create and ID:
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      //Calories to a number:
      calories = parseInt(calories);

      //Create the new item:
      newItem = new Item(ID, name, calories);

      //Add the items to the data array above:
      data.items.push(newItem);

      //Allow that new item to be put in a variable outside this function:
      return newItem;
    },
    getItemById: function (id) {
      let found = null;
      //Loop through the items:
      data.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function (name, calories) {
      //Calories converted to a number:
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function (item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });

      return found;
    },
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    getTotalCalories: function () {
      //Reset calorie total:
      let total = 0;

      //Loop through each item and add the calories:
      data.items.forEach(function (item) {
        total += item.calories;
      });

      //Set the total calorie count into the data structure:
      data.totalCalories = total;

      //Allow access to the stored sum:
      return data.totalCalories;
    },
    logData: function () {
      return data;
    },
  };
})();

//UI Controller:
const UICtrl = (function () {
  const UISelectors = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: '.total-calories'
  };

  //Public Methods:
  return {
    populateItemList: function (items) {
      let html = "";

      items.forEach(function (item) {
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong><em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>`;
      });

      //Insert list items:
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      };
    },
    addListItem: function (item) {
      //Show the list as hidden:
      document.querySelector(UISelectors.itemList).style.display = 'block';
      //Create li element:
      const li = document.createElement('li');
      //Add the class:
      li.className = 'collection-item';
      //Add the ID:
      li.id = `item-${item.id}`;
      //Add the HTML:
      li.innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>`;
      //Insert the item:
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      //Turn the Node list into an array:
      listItems = Array.from(listItems);

      listItems.forEach(function (listItem) {
        const itemID = listItem.getAttribute('id');

        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>`;
        }
      });
    },
    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: function () {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
    getSelectors: function () {
      return UISelectors;
    },
  };
})();

//App Controller:
const App = (function (ItemCtrl, UICtrl) {
  //Load event listeners:
  const loadEventListeners = function () {
    //Get UI Selectors:
    const UISelectors = UICtrl.getSelectors();

    //Add Item event:
    document.querySelector(UISelectors.addBtn).addEventListener("click", itemAddSubmit);

    //Disable 'adding' on enter:
    document.addEventListener('keypress', function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    //Edit icon click event:
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    //Update item event:
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
  };

  //Add item submit:
  const itemAddSubmit = function (e) {
    //get form input from UI controller:
    const input = UICtrl.getItemInput();

    //Check that there is a name and calorie input:
    if (input.name !== "" && input.calories !== "") {

      //Add the item when once we know its there:
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      //Add the item to the UI list:
      UICtrl.addListItem(newItem);

      //Get the total calories:
      const totalCalories = ItemCtrl.getTotalCalories();

      //Add the total calories to the UI:
      UICtrl.showTotalCalories(totalCalories);

      //Clear the fields once submitted:
      UICtrl.clearInput();

    }

    e.preventDefault();
  };

  //Click edit item:
  const itemEditClick = function (e) {
    if (e.target.classList.contains('edit-item')) {
      //Get the list item id (item-0, item-1, etc):
      const listId = e.target.parentNode.parentNode.id;

      //Break into an array:
      const listIdArr = listId.split('-');

      //Get the actual Id:
      const id = parseInt(listIdArr[1]);

      //Get the item:
      const itemToEdit = ItemCtrl.getItemById(id);

      //Set the current item:
      ItemCtrl.setCurrentItem(itemToEdit);

      //Add item to form:
      UICtrl.addItemToForm();
    }

    e.preventDefault();
  }

  //Update item submit:
  const itemUpdateSubmit = function (e) {
    //get item input:
    const input = UICtrl.getItemInput();

    //Update item:
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    //Update the UI:
    UICtrl.updateListItem(updatedItem);

    //Get the total calories:
    const totalCalories = ItemCtrl.getTotalCalories();

    //Add the total calories to the UI:
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();

    e.preventDefault();
  }

  //Public method:
  return {
    init: function () {

      //Clear the edit state / Set the initial set:
      UICtrl.clearEditState();

      //Fetch items from the data structure:
      const items = ItemCtrl.getItems();

      //Check if there are any items:
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        //Populate list with items:
        UICtrl.populateItemList(items);
      }

      //Get the total calories:
      const totalCalories = ItemCtrl.getTotalCalories();

      //Add the total calories:
      UICtrl.showTotalCalories(totalCalories);

      //load event listeners:
      loadEventListeners();
    },
  };
})(ItemCtrl, UICtrl);

//Initialise App:
App.init();