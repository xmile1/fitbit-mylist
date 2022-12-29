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

      if (listWithItems[currentListName]) {
        todoItemsFromDB = listWithItems[currentListName].items;
      }

      listWithItems = readFileSync("listFromSettings.cbor", "cbor");

      if (!currentListName) {
        writeFileSync("todoList.cbor", cbor.encode(listWithItems));
        writeFileSync("currentListName.txt", cbor.encode(undefined));
        return listWithItems;
      }

      const todoItems = listWithItems[currentListName].items;

      const mergedTodoItems = todoItems.map((todoItem, index) => {
        const checked =
          todoItem.name === todoItemsFromDB[index]?.name
            ? todoItemsFromDB[index]?.checked
            : false;
        return {
          name: todoItem.name,
          checked,
        };
      });

      listWithItems[currentListName] = {
        items: mergedTodoItems,
      };

      writeFileSync("todoList.cbor", cbor.encode(listWithItems));
      if (existsSync("listFromSettings.cbor")) {
        unlinkSync("listFromSettings.cbor");
      }
    }
  }
  return listWithItems;
};
