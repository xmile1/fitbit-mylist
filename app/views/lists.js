import document from "document";
import { writeFileSync } from "fs";
import { inbox } from "file-transfer";
import { updateList } from "../utils/updateList";

export function init() {
  inbox.onnewfile = processInbox;
  processInbox();
}

const initializeView = (lists = {}) => {
  const myList = document.getElementById("lists");
  const noLists = document.getElementById("no-lists");

  if (Object.keys(lists).length === 0) {
    myList.style.display = "none";
    noLists.style.display = "inline";
    return;
  }

  myList.style.display = "inline";
  noLists.style.display = "none";

  const items = myList.getElementsByClassName("list");
  const listNames = Object.keys(lists);

  items.forEach((element, index) => {
    const listName = listNames[index];
    if (listName) {
      element.style.display = "inline";
      element.getElementById("text").text = listName;
      element.addEventListener("click", function () {
        gotoListItems(listName);
      });
    } else {
      element.style.display = "none";
    }
  });
};

function processInbox() {
  updateList(initializeView);
}

function gotoListItems(listName) {
  inbox.onnewfile = undefined;
  writeFileSync("currentListName.txt", listName, "cbor");

  document.location.replace(`list-items.view`);
  import("./list-items").then((module) => {
    module.init({});
  });
}
