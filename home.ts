// @ts-ignore Import module
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

// @ts-ignore Import module
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

declare const L: any;

class Database {
    private app: any;
    private database: any;
    private check: Map<String, boolean> = new Map<String, boolean>();

    constructor() {
        // This will be substituted with the API info
        const firebaseConfig : Object = {};

        this.app = initializeApp(firebaseConfig);
        this.database = getDatabase(this.app);
    }

    public deleteCheck(id: String) {
        this.check.delete(id);
        return;
    }

    public setCheck(id: String, val: boolean) {
        this.check.set(id, val);
        return;
    }

    private isAValidId(id: String) : boolean {
        // Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]"
        return !(id.includes(".") || id.includes("#") || id.includes("$") || id.includes("[") || id.includes("]") || id === "");
    }

    public getData(id: String, map: MapClass) {
        if (!this.isAValidId(id)) return;
        try {            
            onValue(ref(this.database, id), (snapshot : any) => {
                const check : boolean | undefined = this.check.get(id);
                if (!check && check !== undefined) return;
                map.updateLocation(id, snapshot.val());
            });
        } catch (error: any) {
            alert(error);
        }
        return;
    }
}

class MapClass {
    private readonly db: Database = new Database();
    private markers: Array<any> = [];
    private ids: Array<String> = [];
    private map: any;

    constructor() {
        this.map = L.map("map").setView([51.505, -0.09], 13);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {}).addTo(this.map);
    }

    public updateLocation(id: String, data: any | null) {
        if (data === null) {
            this.db.deleteCheck(id);
            alert("Id not found!\n");
            return;
        }
        
        const location: Array<number> = [data.latitude, data.longitude];
        const time: Date = new Date(data.lastUpdate);
        this.map.setView(location, 13);
        const marker = L.marker(location).addTo(this.map).bindPopup(`Victim coordinates:<br> Lat: ${data.latitude},<br> Long: ${data.longitude},<br> id: ${data.id},<br> isTracked: ${data.isTracked},<br> lastUpdate: ${time}`).openPopup();
        const index: number = this.ids.indexOf(id);    
        if (index === -1) {
            this.ids.push(id);
            this.markers.push(marker);
        } else {
            this.map.removeLayer(this.markers[index]);  
            this.markers[index] = marker; 
        }

        return;
    }

    public locate() {
        // Cast the HTMLElement to HTMLInputElement to use the value property without triggering the warning
        let id : HTMLInputElement | null = <HTMLInputElement>document.getElementById("idInp");
        if (id === null) {
            console.log("Unable to find the text input!\n");
            return;
        }

        const index: number = this.ids.indexOf(id.value);
        if (index !== -1) {
            alert("Id already tracked\n");
            return;
        }
        
        this.db.setCheck(id.value, true);
        this.db.getData(id.value, this);
        
        return;
    }

    public stop() {
        // Cast the HTMLElement to HTMLInputElement to use the value property without triggering the warning
        let id : HTMLInputElement | null = <HTMLInputElement>document.getElementById("idInp");
        if (id === null) {
            console.log("Unable to find the text input!\n");
            return;
        }

        const index: number = this.ids.indexOf(id.value);
        if (index !== -1) {
            this.map.removeLayer(this.markers[index]);
            this.markers = this.markers.splice(index, index);
            this.ids = this.ids.splice(index, index);
            this.db.setCheck(id.value, false); // Interrupt the database from waiting for data update
        } else alert("Id not found!\n");

        return;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const map: MapClass = new MapClass();
    
    document.getElementById("locateBt")?.addEventListener("click", () => {
        map.locate();
    });     

    document.getElementById("stopBt")?.addEventListener("click", () => {
        map.stop();
    }); 
});
