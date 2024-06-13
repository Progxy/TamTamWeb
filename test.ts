function generateInputString() : string {
    let str: string = "";
    for (let i = 0; i < (Math.random() * 100) % 100; ++i) {
        str = str.concat(String.fromCharCode(((Math.random() * 1000000) % 127 + 32) % 127));
    }
    return str;
}

document.addEventListener("DOMContentLoaded", () => {
    const id: HTMLInputElement | null = <HTMLInputElement> document.getElementById("idInp");
    id.value = generateInputString();
    const bt: HTMLButtonElement | null = <HTMLButtonElement> document.getElementById("locateBt");
    bt.click();
});