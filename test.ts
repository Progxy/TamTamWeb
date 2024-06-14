import { map, setMsgBox, setIdInp } from "./home.js";

function randomNumber() {
    return Math.round(Math.random() * 1_000_000);
}

function generateInputString() : string {
    const symbols: string[] = [".", "#", "$", "\n", "[", "]"];
    let str: string = symbols[randomNumber() % 6];
    for (let i = 0; i < randomNumber() % 100; ++i) {
        str = str.concat(String.fromCharCode((randomNumber() % 127 + 32) % 127));
    }
    str = str.concat(symbols[randomNumber() % 6]);
    return str;
}

function testLocateBt() : boolean {
    for (let i = 0; i < randomNumber() % 1000; ++i) {
        const test_str: string = generateInputString();
        if (map.getDb().getData(test_str, map)) {
            console.log(`Test string: ${test_str}`);
            return false;
        }
    }
    return true;
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