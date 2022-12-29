import document from "document";
import { inbox } from "file-transfer";
import { readFileSync, writeFileSync } from "fs";
import { updateList } from "../utils/updateList";

export function init() {
  inbox.onnewfile = processInbox;
  processInbox();
}

const initializeView = (lists) => {
  if (Object.keys(lists).length === 0) return;

  let currentListName = readFileSync("currentListName.txt", "cbor");
  const currentListItems = lists[currentListName].items;

  const itemsWrapper = document.getElementById("listItems");
  const items = itemsWrapper?.getElementsByClassName("list-item") || [];
  const noListItems = document.getElementById("no-list-items");
  const backArrow = document.getElementById("back");
  const backButton = document.getElementById("back-button");

  if (!currentListItems?.length) {
    backButton.onclick = goToList
    noListItems.style.display = "inline";
    itemsWrapper.style.display = "none";
    return;
  }

  noListItems.style.display = "none";
  itemsWrapper?.style.display = "inline";

  backArrow.onclick = goToList
  // items.forEach((itemElement, index) => {
  //   const item = currentListItems[index];
  //   if (!item || item.checked) items[index].style.display = "none";
  //   if (item && !item.checked) {
  //     items[index].style.display = "inline";
  //     items[index].getElementById("text").text = item?.name;

  //     const checkbox =  items[index].getElementById("checkbox-touch");
  //     checkbox.onclick = () => onItemClick({
  //       itemElement: items[index],
  //       itemsElementWrapper: itemsWrapper,
  //       items,
  //       lists,
  //       index,
  //       currentListName
  //     })
  //   }
  //   setTimeout(() => forceUIUpdate(itemsWrapper, items), 1000);
  // });
  let uncheckedIndex = 0;
let checkedIndex = 0;

  currentListItems.forEach((item, index) => {
        // const item = currentListItems[index];
    if (!item || item.checked) {
      // items[index].style.display = "none";
    }
    if (item && !item.checked) {
      items[uncheckedIndex].style.display = "inline";
      items[uncheckedIndex].style.visibility = "visible";
      items[uncheckedIndex].getElementById("text").text = item?.name;

      const checkbox =  items[uncheckedIndex].getElementById("checkbox-touch");
      console.log('uncheckedIndex', uncheckedIndex)
      checkbox.onclick = onItemClick({
        itemElement: items[uncheckedIndex],
        uncheckedIndex,
        itemsElementWrapper: itemsWrapper,
        items,
        lists,
        index,
        currentListName
      })
      uncheckedIndex++
    }

  })
};

const goToList = () => {
  inbox.onnewfile = undefined;
  document.location.replace(`lists.view`);
  import("./lists").then((module) => {
    module.init({});
  });
}

const forceUIUpdate = (list, items) => {
  list.value = items.length - 1;
  list.value = 0;
}

const onItemClick = ({
  itemElement,
  itemsWrapper,
  lists,
  index,
  uncheckedIndex,
  currentListName,
  items
}) => () => {
    const sv = document?.getElementsByClassName("sv") 
    // document.getElementById("sv555").height = 0;
  const checkboxTick = itemElement.getElementById("checkbox-tick");
  checkboxTick.style.display = "inline";
  console.log('uncheckedIndex', uncheckedIndex)
  itemElement.animate("enable");
    sv[0].height = 20



  // setTimeout(() => {
  //   // itemElement.style.display = "none";
  //   sv[uncheckedIndex].style.height = 0
  //   // itemElement.style.height = "0px";
  //   // forceUIUpdate(lists, items)

  // }, 300);
  // lists[currentListName].items[index].checked = true;
  // writeFileSync("todoList.cbor", lists, "cbor");
}

function processInbox() {
  updateList(initializeView);
}
