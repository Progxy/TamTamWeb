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

enum Days {
    MONDAY = 1,
    TUESDAY
}

class MapClass {
    private readonly months : Array<String> = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];    
    private readonly days : Array<String> = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
    private db: Database;
    private map: any;

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
        
        const data : any | null = await this.db.getData(id.value);
        if (data === null) {
            alert("Id not found!\n");
            return;
        }

        const location: Array<Number> = [data.latitude, data.longitude];
        const time: Date = new Date(data.lastUpdate);
        const time_str: String = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()} on ${time.getDay()} ${this.days[time.getDate()]} ${this.months[time.getMonth()]} ${time.getFullYear()}`;
        this.map.setView(location, 13);
        L.marker(location).addTo(this.map).bindPopup(`Victim coordinates:<br> Lat: ${location[0]},<br> Long: ${location[1]},<br> id: ${data.id},<br> isTracked: ${data.isTracked},<br> lastUpdate: ${time_str}`).openPopup();
        
        return;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const map: MapClass = new MapClass();
    document.getElementById("locateBt")?.addEventListener("click", () => {
        map.locate();
    }); 
});
