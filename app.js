'use strict';

const STORE = {
  items:[
  {name: "apples", checked: false},
  {name: "oranges", checked: false},
  {name: "milk", checked: true},
  {name: "bread", checked: false}
],
filterMySearch:false
};


function generateItemElement(item, itemIndex, template) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
        <button class="shopping-item-change js-item-change">
            <span class="button-label">change</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
  console.log("Generating shopping list element");

  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  return items.join("");
}


function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  const shoppingListItemsString = generateShoppingItemsString(STORE.items);
  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}

function renderShoppingListParm(items) {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  const shoppingListItemsString = generateShoppingItemsString(items);
  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}

function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  console.log("Toggling checked property for item at index " + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', `.js-item-toggle`, event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

// name says it all. responsible for deleting a list item.
function deleteListItem(itemIndex) {
  console.log(`Deleting item at index  ${itemIndex} from shopping list`)

  // as with `addItemToShoppingLIst`, this function also has the side effect of
  // mutating the global STORE value.
  //
  // we call `.splice` at the index of the list item we want to remove, with a length
  // of 1. this has the effect of removing the desired item, and shifting all of the
  // elements to the right of `itemIndex` (if any) over one place to the left, so we
  // don't have an empty space in our list.
  STORE.items.splice(itemIndex, 1);
}


function handleDeleteItemClicked() {
  // like in `handleItemCheckClicked`, we use event delegation
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    // get the index of the item in STORE
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    // delete the item
    deleteListItem(itemIndex);
    // render the updated shopping list
    renderShoppingList();
  });
}
function hideThemChecks(){
  $('input[type=radio][name=itemsType]').change(function(event){
      // console.log(event)
    if(this.value === "checkItems"){
      const filteredItems = STORE.items.filter(item => item.checked );
      renderShoppingListParm(filteredItems);
    }
    else if(this.value ==="allItems"){
      renderShoppingList();
    }

  });
}

// function valOfSearch() {
//   // var input, filter, ul, li, a, i;
//   // input = document.getElementById("myInput");
//   $( ".js-shopping-list-entry" ).click(function(event){
  
// // let filter = $(this).value.toUpperCase();
// let ul = $(".shopping-list js-shopping-list");
// let li = $('li');
//   for (i = 0; i < li.length; i++) {
//       li = li[i][0];
//       if (li.toUpperCase().indexOf(filter) > -1) {
//           li[i].style.display = "";
//       } else {
//           li[i].style.display = "none";

//       }
//   }
// });
//
//   // name="shopping-list-entry"
  
//   //this.value.toUpperCase();
//   ul = document.getElementById("myUL");
//   // <ul class="shopping-list js-shopping-list">
//   li = ul.getElementsByTagName("li");
//   // <li class="js-item-index-element" data-item-index="${itemIndex}">

//   for (i = 0; i < li.length; i++) {
//       a = li[i][0];
//       if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
//           li[i].style.display = "";
//       } else {
//           li[i].style.display = "none";

//       }
//   }
// }
 

function searchForItems(word) {
  const searching = STORE.items.filter( str => str.name.startsWith(word));
  const newHtmlString = generateShoppingItemsString(searching);
  //gen. new HTML
  $('.js-shopping-list').html(newHtmlString);

}

function handleSearchedForItems() {
   //get related user info from DOM
  //change STORE
  //render

  $('.js-shopping-list-entry').keyup(function() {
    const searchWord = $('.js-shopping-list-entry').val();
    if(searchWord === '') {
      renderShoppingList();
    } else {
     searchForItems(searchWord);
  
    }
  });
}


// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  hideThemChecks();
  handleSearchedForItems();
};

// when the page loads, call `handleShoppingList`
$(handleShoppingList);