import document from "document";
import { writeFileSync } from "fs";
import { inbox } from "file-transfer";
import { getLists } from "../utils/getLists";
import { processInbox } from "../utils/processInbox";
import { setColorScheme } from "../utils/setColorScheme";

export function init() {
  inbox.onnewfile = () => processInbox(initializeView);
  onInit();
}

function onInit() {
  const list = getLists();
  initializeView(list);
  setColorScheme();
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

function gotoListItems(listName) {
  inbox.onnewfile = undefined;
  writeFileSync("currentListName.txt", listName, "cbor");

  document.location.replace(`list-items.view`);
  import("./list-items").then((module) => {
    module.init({});
  });
}
