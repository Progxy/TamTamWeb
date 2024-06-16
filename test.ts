import { map, VictimData } from "./home.js";

function testUpdateLocation() : boolean {
    return !map.updateLocation("test", <VictimData> {"latitude": 123}) && !map.updateLocation("test", <VictimData>(<any>undefined)) && !map.updateLocation("test", <VictimData>(<any>null));
}

function testUpdateSelector() : boolean {
    const idSel: HTMLSelectElement = <HTMLSelectElement> document.getElementById("idSel");
    const old_data: string = idSel.innerHTML;
    map.updateSelector(null);
    if (idSel.innerHTML !== "") return false;
    const test_obj: Object = {
        "test_data": 12,
        "test_man" : "asfasf"
    };
    map.updateSelector(test_obj);
    if (idSel.innerHTML === "") return false;
    idSel.innerHTML = old_data;
    return true;
}

function createOption(id: string) : HTMLOptionElement {
    const opt : HTMLOptionElement = <HTMLOptionElement> document.createElement("option");
    opt.value = id;
    opt.text = id;
    opt.id = id;
    return opt;
}

function testLocate() : boolean {
    const idSel: HTMLSelectElement = <HTMLSelectElement> document.getElementById("idSel");
    const old_data: string = idSel.innerHTML;
    idSel.innerHTML = "";
    if (map.locate()) return false;
    idSel.appendChild(createOption("temp"));
    idSel.selectedIndex = 0;
    const location: number[] = [43.124124, 12.241412];
    const marker: any = map.createMarker(location, "Test");
    map.pushMarkers(marker);
    if (!map.locate()) return false;
    idSel.innerHTML = old_data;
    return true;
}

function testStop() : boolean {
    const idSel: HTMLSelectElement = <HTMLSelectElement> document.getElementById("idSel");
    const old_data: string = idSel.innerHTML;
    idSel.innerHTML = "";
    if (map.stop()) return false;
    idSel.appendChild(createOption("temp"));
    idSel.selectedIndex = 0;
    map.pushIds("temp");
    if (!map.stop()) return false;
    idSel.innerHTML = old_data;
    const maps: any = map.getMap();
    maps.setView([43.115916, 12.384950], 13);
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