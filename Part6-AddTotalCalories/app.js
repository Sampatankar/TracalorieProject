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

  //allow access to data structure publicly:
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
    addBtn: ".add-btn",
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
          <i class="eidt-item fa fa-pencil"></i>
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
          <i class="eidt-item fa fa-pencil"></i>
        </a>`;
      //Insert the item:
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
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
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);
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

      //Add the total calories:
      UICtrl.showTotalCalories(totalCalories);

      //Clear the fields once submitted:
      UICtrl.clearInput();

    }

    e.preventDefault();
  };

  //Public method:
  return {
    init: function () {
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