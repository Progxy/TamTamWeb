declare const L: any;

class MapClass {
    map: any;

    constructor() {
        this.map = L.map('map').setView([51.505, -0.09], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(this.map);
    }

    locate() {
        // Cast the HTMLElement to HTMLInputElement to use the value property without triggering the warning
        let id : HTMLInputElement | null = <HTMLInputElement>document.getElementById("idInp");
        if (id === null) {
            console.log("Unable to find the text input!\n");
            return;
        }
        
        if (id.value === "Franchi") {
            const location : Array<Number> = [43.780839643180016, 11.282694289234543];
            this.map.setView(location, 13);
            L.marker(location).addTo(this.map).bindPopup(`Victim coordinates: ${location}`);
        }
        
        return;
    }

}

document.addEventListener("DOMContentLoaded", (event) => {
    const map: MapClass = new MapClass();
    document.getElementById("locateBt")?.addEventListener("click", (event) => {
        map.locate();
    }); 
});
