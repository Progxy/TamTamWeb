// @ts-ignore Import module
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

// @ts-ignore Import module
import { getDatabase, ref, child, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

declare const L: any;

class Database {
    app: any;
    database: any;

    constructor() {
        // This will be substituted with the API info
        const firebaseConfig : Object = {};

        this.app = initializeApp(firebaseConfig);
        this.database = getDatabase(this.app);
    }

    async getData(id: String) : Promise<any | null> {
        const snapshot = await get(child(ref(this.database), `${id}`)).catch((error: any) => { console.error(error); });
        if (snapshot.exists()) return snapshot.val();
        return null;
    }
}

class MapClass {
    map: any;
    db: Database;

    constructor() {
        this.map = L.map('map').setView([51.505, -0.09], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(this.map);
        this.db = new Database();
    }

    async locate() {
        // Cast the HTMLElement to HTMLInputElement to use the value property without triggering the warning
        let id : HTMLInputElement | null = <HTMLInputElement>document.getElementById("idInp");
        if (id === null) {
            console.log("Unable to find the text input!\n");
            return;
        }
        
        if (id.value === "Franchi") {
            const data = await this.db.getData("demoHash");
            console.log(data);
            const location : Array<Number> = [43.780839643180016, 11.282694289234543];
            this.map.setView(location, 13);
            L.marker(location).addTo(this.map).bindPopup(`Victim coordinates: ${location}`);
        }
        
        return;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const map: MapClass = new MapClass();
    document.getElementById("locateBt")?.addEventListener("click", () => {
        map.locate();
    }); 
});
