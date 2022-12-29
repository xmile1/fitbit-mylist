import { existsSync, readFileSync, writeFileSync, unlinkSync } from "fs";
import { inbox } from "file-transfer";
import * as cbor from "cbor";

export const updateList = (cb) => {
  let fileName;
  let listWithItems = {};
  let todoItemsFromDB = [];

  if (existsSync("todoList.cbor")) {
    listWithItems = readFileSync("todoList.cbor", "cbor");
  }

  while ((fileName = inbox.nextFile())) {
    if (fileName === "listFromSettings.cbor") {
      listWithItems = readFileSync("listFromSettings.cbor", "cbor");
      let currentListName = readFileSync("currentListName.txt", "cbor");

      if (!currentListName) {
        cb(listWithItems);
        writeFileSync("todoList.cbor", cbor.encode(listWithItems));
        writeFileSync("currentListName.txt", cbor.encode(undefined));
        return;
      }

      const todoItems = listWithItems[currentListName].items;

      if (existsSync("todoList.cbor")) {
        let json_object = readFileSync("todoList.cbor", "cbor");
        if (json_object[currentListName]) {
          todoItemsFromDB = json_object[currentListName].items;
        }
      }

      const mergedTodoItems = todoItems.map((todoItem, index) => {
        return {
          name: todoItem.name,
          checked: !!todoItemsFromDB[index]?.checked,
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
  cb(listWithItems);
};
