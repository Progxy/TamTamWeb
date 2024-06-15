// @ts-ignore Import module
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

// @ts-ignore Import module
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

declare const L: any;

export var map: MapClass;

export function setMsgBox(str: string, color: string) {
    const msgBox : HTMLInputElement = <HTMLInputElement> document.getElementById("msgBox");
    msgBox.style.color = color;
    msgBox.innerHTML = str;
    return;
}

export function setIdInp(str: string, color: string) {
    const idInp : HTMLInputElement = <HTMLInputElement> document.getElementById("idInp");
    idInp.value = str;
    idInp.style.borderColor = color;
    return;
}

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

    private isAValidId(id: string) : boolean {
        // Paths must be non-empty strings and can't contain ".", "#", "$", "\n", "[", or "]"
        return !(id.includes(".") || id.includes("#") || id.includes("$") || id.includes("[") || id.includes("\n") || id.includes("]") || id === "");
    }

    private setErrorBox(str: string) {
        setIdInp("", "#D2042D");
        setMsgBox(str, "#D2042D");
        return;
    }

    public getQueryReference(id: string) : any | undefined {
        return this.query_references.get(id);
    }    
    
    public deleteQueryReference(id: string) {
        return this.query_references.delete(id);
    }

    public getData(id: string, map: MapClass) : boolean {
        if (!this.isAValidId(id)) {
            this.setErrorBox(`Invalid ID: Paths must be non-empty strings and can't contain ".", "#", "$", "\n", "[", or "]"`);
            return false;
        }
        
        const unsubscribe = onValue(ref(this.database, id), (snapshot : any) => {
            if (snapshot.val() === null) unsubscribe();
            if (!this.query_references.has(id)) this.query_references.set(id, unsubscribe);
            map.updateLocation(id, snapshot.val());
        });
        
        return true;
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
    }

    private setInfoBox(str: string) {
        setIdInp("", "#FFBF00");
        setMsgBox(str, "#FFBF00");
        return;
    }

    public getDb() : Database {
        return this.db;
    }

    public updateLocation(id: string, data: any | null) {
        if (data === null) {
            this.setInfoBox("ID not found!");
            this.db.deleteQueryReference(id);
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
        let id : HTMLInputElement = <HTMLInputElement>document.getElementById("idInp");
        const index: number = this.ids.indexOf(id.value);
        if (index !== -1) {
            this.setInfoBox("ID already tracked!");
            return;
        }
        
        this.db.getData(id.value, this);
        
        return;
    }

    public stop() : boolean {
        let id : HTMLInputElement = <HTMLInputElement>document.getElementById("idInp");
        const index: number = this.ids.indexOf(id.value);
        if (index !== -1) {
            this.map.removeLayer(this.markers[index]);
            this.markers = this.markers.splice(index, index);
            this.ids = this.ids.splice(index, index);
            const unsubscribe: any | undefined = this.db.getQueryReference(id.value);
            unsubscribe(); // Interrupt the database from waiting for data update
        } else {
            this.setInfoBox("ID not found!");
            return false;
        }

        return true;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    map = new MapClass();
    document.getElementById("idInp")?.addEventListener("focus", () => {
        const idInp: HTMLInputElement = <HTMLInputElement> document.getElementById("idInp");
        idInp.style.borderColor = "transparent";
        const msgBox : HTMLInputElement = <HTMLInputElement> document.getElementById("msgBox");
        msgBox.innerHTML = "";
    });
});
