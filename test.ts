import { map, setMsgBox, setIdInp } from "./home.js";

function generateInputString() : string {
    let str: string = "";
    for (let i = 0; i < (Math.random() * 100) % 100; ++i) {
        str = str.concat(String.fromCharCode(((Math.random() * 1000000) % 127 + 32) % 127));
    }
    return str;
}

function testLocateBt() : boolean {
    const test_str: string = generateInputString();
    console.log(`Test string: "${test_str}"`);
    return (map.getDb().getData(test_str, map) || document.getElementById("msgBox")?.innerHTML !== "ID not found!");
}

function testStopBt() : boolean {
    map.stop();
    return (document.getElementById("msgBox")?.innerHTML === "ID not found!");
}

document.addEventListener("DOMContentLoaded", () => {
    if (!testLocateBt()) alert("Test: testLocateBt Failed\n");
    else if (!testStopBt()) alert("Test: testStopBt Failed\n");
    else alert("Tests Passed!\n");

    setIdInp("", "transparent");
    setMsgBox("", "white");
});