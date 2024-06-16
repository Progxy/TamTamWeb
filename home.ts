// @ts-ignore Import module
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

// @ts-ignore Import module
import { getDatabase, ref, onValue, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

declare const L: any;

export var map: MapClass;

export type VictimData = {
    latitude: number;
    longitude: number;
    lastUpdate: string;
    id: string;
    isTracked: boolean;
};

class Database {
    private app: any;
    private database: any;
    private query_references: Map<string, any> = new Map<string, any>();

    constructor() {
        // This will be substituted with the API info
        const firebaseConfig : Object = {};

        this.app = initializeApp(firebaseConfig);
        this.database = getDatabase(this.app);
    }

    public getQueryReference(id: string) : any | undefined {
        return this.query_references.get(id);
    }    
    
    public deleteQueryReference(id: string) : boolean {
        return this.query_references.delete(id);
    }

    public onDataUpdate(id: string, map: MapClass) : void {
        const unsubscribe = onValue(ref(this.database, id), (snapshot : any) => {
            map.updateLocation(id, <VictimData> snapshot.val());
        });
        this.query_references.set(id, unsubscribe);
        return;
    }

    public getVictimsIds(map: MapClass) : void {
        onValue(ref(this.database), (snapshot: any) => {
            if (snapshot.exists()) map.updateSelector(snapshot.val());
            else map.updateSelector(null);
        });
        return;
    }
}

class MapClass {
    private readonly db: Database = new Database();
    private markers: Array<any> = [];
    private ids: Array<string> = [];
    private map: any;

    constructor() {
        this.map = L.map("map").setView([51.505, -0.09], 13);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {}).addTo(this.map);
        document.getElementById("locateBt")?.addEventListener("click", () => map.locate());     
        document.getElementById("stopBt")?.addEventListener("click", () => map.stop()); 
        this.db.getVictimsIds(this);
    }

    private getSelectorValue() : string | null {
        const select: HTMLSelectElement = <HTMLSelectElement> document.getElementById("idSel");
        if (select.innerHTML === "") return null;
        return select.options[select.selectedIndex].value;
    }

    private createOption(id: string) : HTMLOptionElement {
        const opt : HTMLOptionElement = <HTMLOptionElement> document.createElement("option");
        opt.value = id;
        opt.text = id;
        opt.id = id;
        return opt;
    }

    private setInfoBox(str: string) : void {
        const msgBox : HTMLInputElement = <HTMLInputElement> document.getElementById("msgBox");
        msgBox.style.color = "#FFBF00";
        msgBox.style.visibility = "visible";
        msgBox.innerHTML = str;
        return;
    }

    private isValidVictimData(data: VictimData) : boolean {
        return !(data === undefined || data === null || data.latitude === undefined || data.longitude === undefined || data.id === undefined || data.lastUpdate === undefined || data.isTracked === undefined);
    }

    public updateSelector(data: Object | null) : void {
        const idSel: HTMLSelectElement = <HTMLSelectElement> document.getElementById("idSel");
        idSel.innerHTML = ""; // Empty the selector
        
        if (data !== null) {
            const keys: string[] = Object.keys(data);
            keys.forEach((key: string) => { idSel.appendChild(this.createOption(key)) });
            return;
        }

        return;
    }

    private suspendDataUpdate(id: string) : void {
        const unsubscribe: any = this.db.getQueryReference(id);
        if (unsubscribe !== undefined) {
            unsubscribe();
            this.db.deleteQueryReference(id);
        }
        return;
    }

    public updateLocation(id: string, data: VictimData) : boolean {
        if (!this.isValidVictimData(data)) {
            this.setInfoBox("Corrupted data, pleasy retry...");
            this.suspendDataUpdate(id);
            return false;
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

        return true;
    }


    public locate() : void {
        const id: string | null = this.getSelectorValue();
        if (id === null) {
            this.setInfoBox("No IDs found, the database is empty!");
            return;
        }

        const index: number = this.ids.indexOf(id);
        if (index !== -1) {
            this.map.setView(this.markers[index].getLatLng(), 13);
            this.markers[index].openPopup();
            return;
        }
        
        this.db.onDataUpdate(id, this);
        return;
    }

    public stop() : void {
        const id: string | null = this.getSelectorValue();
        if (id === null) {
            this.setInfoBox("No IDs found, the database is empty!");
            return;
        }

        const index: number = this.ids.indexOf(id);
        if (index === -1) return;
        this.map.removeLayer(this.markers[index]);
        this.markers.splice(index, 1);
        this.ids.splice(index, 1);
        this.suspendDataUpdate(id);
        return;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    map = new MapClass();
    document.getElementById("idSel")?.addEventListener("focus", () => {
        const msgBox : HTMLInputElement = <HTMLInputElement> document.getElementById("msgBox");
        msgBox.style.visibility = "hidden";
        msgBox.innerHTML = "";
    });
});
