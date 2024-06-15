import { map, setMsgBox, setIdInp, VictimData } from "./home.js";

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

function testLocate() : boolean {
    for (let i = 0; i < randomNumber() % 1000; ++i) {
        const test_str: string = generateInputString();
        (<HTMLInputElement> document.getElementById("idInp")).value = test_str;
        if (map.locate()) {
            console.log(`Test string: ${test_str}`);
            return false;
        }
    }
    return true;
}

function testStop() : boolean {
    for (let i = 0; i < randomNumber() % 1000; ++i) {
        const test_str: string = generateInputString();
        (<HTMLInputElement> document.getElementById("idInp")).value = test_str;
        if (map.stop()) {
            console.log(`Test string: ${test_str}`);
            return false;
        }
    }
    return true;
}

function testUpdateLocation() : boolean {
    const data: Object = {"latitude": 123};
    return !map.updateLocation("test", null) || !map.updateLocation("test", <VictimData> data);
}

document.addEventListener("DOMContentLoaded", () => {
    if (!testLocate()) alert("Test: testLocate Failed\n");
    else if (!testStop()) alert("Test: testStop Failed\n");
    else if (!testUpdateLocation()) alert("Test: testUpdateLocation Failed\n");
    else alert("Tests Passed!\n");

    setIdInp("", "transparent");
    setMsgBox("", "white");
});