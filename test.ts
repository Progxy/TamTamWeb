import { map, VictimData } from "./home.js";

function createOption(id: string) : HTMLOptionElement {
    const opt : HTMLOptionElement = <HTMLOptionElement> document.createElement("option");
    opt.value = id;
    opt.text = id;
    opt.id = id;
    return opt;
}

function testUpdateLocation() : boolean {
    const test_data: Object = { latitude: 43.115916, longitude: 12.384950, id: "test", isTracked: true, lastUpdate: Date.now().toString() };
    return (
        !map.updateLocation("test", <VictimData> {"latitude": 123}) &&
        !map.updateLocation("test", <VictimData> (<any>undefined))  &&
        !map.updateLocation("test", <VictimData> (<any>null))       &&
        map.updateLocation("test", <VictimData> test_data)          &&
        map.updateLocation("test", <VictimData> test_data)
    );
}

function testUpdateSelector() : boolean {
    const idSel: HTMLSelectElement = <HTMLSelectElement> document.getElementById("idSel");
    const old_data: string = idSel.innerHTML;
    if (map.updateSelector(null)) return false;
    if (!map.updateSelector({"test_data": 12, "test_man" : "asfasf"})) return false;
    idSel.innerHTML = old_data;
    return true;
}


function testLocate() : boolean {
    const idSel: HTMLSelectElement = <HTMLSelectElement> document.getElementById("idSel");
    const old_data: string = idSel.innerHTML;
    idSel.innerHTML = "";
    if (map.locate()) return false;
    idSel.appendChild(createOption("test"));
    idSel.selectedIndex = 0;    
    if (!map.locate()) return false;
    idSel.innerHTML = old_data;
    return true;
}

function testStop() : boolean {
    const idSel: HTMLSelectElement = <HTMLSelectElement> document.getElementById("idSel");
    const old_data: string = idSel.innerHTML;
    idSel.innerHTML = "";
    if (map.stop()) return false;
    idSel.appendChild(createOption("test"));
    if (!map.stop()) return false;
    idSel.innerHTML = old_data;
    return true;
}

function hideMsgBox() {
    const msgBox : HTMLInputElement = <HTMLInputElement> document.getElementById("msgBox");
    msgBox.style.color = "transparent";
    msgBox.style.visibility = "hidden";
    msgBox.innerHTML = "";
    return;
}

document.addEventListener("DOMContentLoaded", () => {
    if (!testUpdateLocation()) alert(`Test: "testUpdateLocation" Failed\n`);
    else if (!testUpdateSelector()) alert(`Test: "testUpdateSelector" Failed\n`);
    else if (!testLocate()) alert(`Test: "testLocate" Failed\n`);
    else if (!testStop()) alert(`Test: "testStop" Failed\n`);
    else alert("Passed all the tests!\n");
    hideMsgBox();
});