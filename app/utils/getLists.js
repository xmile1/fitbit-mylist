import { existsSync, readFileSync, writeFileSync, unlinkSync } from "fs";
import { inbox } from "file-transfer";
import * as cbor from "cbor";

export const getLists = () => {
  let fileName;
  let listWithItems = {};
  let todoItemsFromDB = [];

  if (existsSync("todoList.cbor")) {
    listWithItems = readFileSync("todoList.cbor", "cbor");
  }

  while ((fileName = inbox.nextFile())) {
    if (fileName === "listFromSettings.cbor") {
      let currentListName = readFileSync("currentListName.txt", "cbor");

      if (listWithItems) {
        todoItemsFromDB = listWithItems;
      }

      listWithItems = readFileSync("listFromSettings.cbor", "cbor");

      if (!currentListName) {
        writeFileSync("todoList.cbor", cbor.encode(listWithItems));
        writeFileSync("currentListName.txt", cbor.encode(undefined));
        return listWithItems;
      }

      listWithItems = Object.keys(listWithItems).reduce((acc, key) => {
        acc[key] = {
          items: listWithItems[key].items.map((todoItem, index) => {
            const checked =
              todoItem.name === todoItemsFromDB[key]?.items[index]?.name
                ? todoItemsFromDB[key].items[index].checked
                : false;
            return {
              name: todoItem.name,
              checked,
            };
          }),
        };
        return acc;
      }, {});

      writeFileSync("todoList.cbor", cbor.encode(listWithItems));
      if (existsSync("listFromSettings.cbor")) {
        unlinkSync("listFromSettings.cbor");
      }
    }
  }
  return listWithItems;
};
