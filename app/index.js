import { existsSync, readFileSync } from "fs";
import { routes } from "./constants";
import { goto } from "./utils/goto";

function start() {
  if (existsSync("currentListName.txt")) {
    const currentListName = readFileSync("currentListName.txt", "cbor");
    if (currentListName) {
      goto(routes.LIST_ITEMS);
      return;
    }
  }

  goto(routes.LISTS);
}

start();
