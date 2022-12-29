import document from "document";
import { inbox } from "file-transfer";
import { readFileSync, writeFileSync } from "fs";
import { getLists } from "../utils/getLists";

export function init() {
  inbox.onnewfile = processInbox;
  processInbox();
}

const initializeView = (lists) => {
  if (Object.keys(lists).length === 0) return;

  let currentListName = readFileSync("currentListName.txt", "cbor");
  const currentListItems = lists[currentListName].items;

  const itemsWrapper = document.getElementById("listItems");
  const items = itemsWrapper.getElementsByClassName("list-item") || [];
  const noListItems = document.getElementById("no-list-items");
  const backArrow = document.getElementById("back");
  const resetButton = document.getElementById("reset");

  backArrow.onclick = goToList;

  if (!currentListItems?.length) {
    noListItems.style.display = "inline";
    itemsWrapper.style.display = "none";
    return;
  }

  noListItems.style.display = "none";
  itemsWrapper.style.display = "inline";

  resetButton.onclick = clearAllCheckbox({
    items,
    lists,
    currentListName,
  });

  currentListItems.forEach((item, index) => {
    if (item) {
      const checkedItemIndex = currentListItems.length + index;

      const itemElement = items[index];
      const checkedItemElement = items[checkedItemIndex];

      itemElement.getElementById("text").text = item.name;
      checkedItemElement.getElementById("text").text = item?.name;

      const checkbox = itemElement.getElementById("checkbox-touch");
      const checkedElementCheckbox =
        checkedItemElement.getElementById("checkbox-touch");

      checkedItemElement.getElementById("checkbox-tick").style.display =
        "inline";

      const toggleCheckboxProps = {
        lists,
        currentListName,
        checkedItemElement,
        itemElement,
        index,
      };

      checkbox.onclick = toggleTodoStatus(toggleCheckboxProps, false);
      checkedElementCheckbox.onclick = toggleTodoStatus(
        toggleCheckboxProps,
        true
      );

      if (item.checked) {
        itemElement.hide();
        checkedItemElement.show();
      } else {
        itemElement.show();
        checkedItemElement.hide();
      }
    }
  });
};

const goToList = () => {
  inbox.onnewfile = undefined;
  document.location.replace(`lists.view`);
  import("./lists").then((module) => {
    module.init({});
  });
};

function toggleTodoStatus(
  { lists, currentListName, index, checkedItemElement, itemElement },
  isChecked
) {
  return () => {
    setTimeout(() => {
      itemElement[isChecked ? "show" : "hide"]();
      checkedItemElement[isChecked ? "hide" : "show"]();
    }, 300);
    if (isChecked) {
      checkedItemElement.animate("disable");
    } else {
      itemElement.animate("enable");
    }

    lists[currentListName].items[index].checked = !isChecked;
    writeFileSync("todoList.cbor", lists, "cbor");
  };
}

const clearAllCheckbox =
  ({ items, lists, currentListName }) =>
  () => {
    lists[currentListName].items.forEach((item, index) => {
      const checkedItemIndex = lists[currentListName].items.length + index;
      const itemElement = items[index];
      const checkedItemElement = items[checkedItemIndex];

      itemElement.show();
      checkedItemElement.hide();
      lists[currentListName].items[index].checked = false;
    });
    writeFileSync("todoList.cbor", lists, "cbor");
  };

function processInbox() {
  const list = getLists();
  initializeView(list);
}
