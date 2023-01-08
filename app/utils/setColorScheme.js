import document from "document";
import { existsSync, readFileSync } from "fs";
const colorSchemes = {
  grey: {
    background: "#111111",
    textColor: "white",
    checkboxColor: "white",
    lineColor: "#222222",
    headerBackground: "lightgray",
    headerColor: "black",
  },
  green: {
    background: "#042004",
    textColor: "#E7E9E7",
    checkboxColor: "#E7E9E7",
    lineColor: "#343F34",
    headerBackground: "#141613",
    headerColor: "#E7E9E7",
  },
};

export const setColorScheme = () => {
  let color = "grey";
  if (existsSync("color.txt")) {
    color = readFileSync("color.txt", "cbor");
  }

  const colorScheme = colorSchemes[color];
  if (!colorScheme) return;

  document.getElementById("background").style.fill = colorScheme.background;
  document.getElementsByClassName("text-color").forEach((element) => {
    element.style.fill = colorScheme.textColor;
  });
  document.getElementsByClassName("checkbox-color").forEach((element) => {
    element.style.fill = colorScheme.checkboxColor;
  });
  document.getElementsByClassName("line").forEach((element) => {
    element.style.fill = colorScheme.lineColor;
  });

  const header = document.getElementById("header-bg");
  if (header) {
    header.style.fill = colorScheme.headerBackground;
    document.getElementsByClassName("header-color").forEach((element) => {
      element.style.fill = colorScheme.headerColor;
    });
  }
};
