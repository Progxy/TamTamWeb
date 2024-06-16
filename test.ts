import { map, VictimData } from "./home.js";

function testUpdateLocation() : boolean {
    return !map.updateLocation("test", <VictimData> {"latitude": 123}) && !map.updateLocation("test", <VictimData>(<any>undefined)) && !map.updateLocation("test", <VictimData>(<any>null));
}

function hideMsgBox() {
    const msgBox : HTMLInputElement = <HTMLInputElement> document.getElementById("msgBox");
    msgBox.style.color = "transparent";
    msgBox.style.visibility = "hidden";
    msgBox.innerHTML = "";
    return;
}

document.addEventListener("DOMContentLoaded", () => {
    if (!testUpdateLocation()) alert("Test: testUpdateLocation Failed\n");
    else alert("Tests Passed!\n");

    hideMsgBox();
});