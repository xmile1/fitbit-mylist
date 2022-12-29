import { settingsStorage } from "settings";
import { outbox } from "file-transfer";
import * as cbor from "cbor";

settingsStorage.onchange = function (evt) {
  init(evt);
};

const init = (evt) => {
  if (evt.key === "selection") {
    const currentListName = getCurrentListName();
    outbox.enqueue("currentListName.txt", cbor.encode(currentListName));
  } else {
    const list = mergeListsWithItems();
    outbox.enqueue("listFromSettings.cbor", cbor.encode(list));
  }
};

const mergeListsWithItems = () => {
  const lists = settingsStorage.getItem("lists") || "[]";
  const parsedLists = JSON.parse(lists);
  return parsedLists.reduce((acc, todo) => {
    return {
      ...acc,
      [todo.name]: {
        items: JSON.parse(settingsStorage.getItem(todo.name) ?? "[]"),
      },
    };
  }, {});
};

const getCurrentListName = () => {
  const currentListName = settingsStorage.getItem("selection");
  return JSON.parse(currentListName)?.values?.[0].name;
};

init({});
