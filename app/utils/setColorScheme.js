import document from "document";
import { existsSync, readFileSync } from "fs";
const colorSchemes = {
  black: {
    background: "#1D2127",
    textColor: "#E7E9E7",
    checkboxColor: "#E7E9E7",
    lineColor: "#414244",
    headerBackground: "#0D111A",
    headerColor: "#E7E9E7",
  },
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
  plum: {
    background: "#47344A",
    textColor: "#E7E9E7",
    checkboxColor: "#E7E9E7",
    lineColor: "#625064",
    headerBackground: "#200524",
    headerColor: "#E7E9E7",
  },
  red: {
    background: "#A52A2A",
    textColor: "#E7E9E7",
    checkboxColor: "#E7E9E7",
    lineColor: "#B15656",
    headerBackground: "#761212",
    headerColor: "#E7E9E7",
  },
  purple: {
    background: "#2E2A57",
    textColor: "#E7E9E7",
    checkboxColor: "#E7E9E7",
    lineColor: "#433F66",
    headerBackground: "#0C0843",
    headerColor: "#E7E9E7",
  },
  white: {
    background: "#F8F8F8",
    textColor: "#494C51",
    checkboxColor: "#494C51",
    lineColor: "#A6A7AA",
    headerBackground: "#2A2E35",
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
