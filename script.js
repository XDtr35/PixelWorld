import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

// Firebase yapılandırma ayarları
const firebaseConfig = {
  apiKey: "AIzaSyCMhOiJCpl8RPTFot5Ew-4NfZeriqTbkIc",
  authDomain: "pixelworld-564de.firebaseapp.com",
  databaseURL: "https://pixelworld-564de-default-rtdb.firebaseio.com",
  projectId: "pixelworld-564de",
  storageBucket: "pixelworld-564de.firebasestorage.app",
  messagingSenderId: "1065315037661",
  appId: "1:1065315037661:web:c3f279a215c45bdc658634",
  measurementId: "G-CFH0K3SKRX"
};

// Firebase'i başlatma
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("color");
const pixelSize = 10;
const width = 100;
const height = 100;

canvas.width = width * pixelSize;
canvas.height = height * pixelSize;

// Firebase Realtime Database'den pikselleri yükle
let pixels = Array.from({ length: height }, () => Array(width).fill("#ffffff"));
const pixelsRef = ref(database, 'pixels/');

function drawCanvas() {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            ctx.fillStyle = pixels[y][x];
            ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
    }
}

function updatePixel(x, y) {
    if (x >= 0 && x < width && y >= 0 && y < height) {
        pixels[y][x] = colorPicker.value;
        drawCanvas();

        // Firebase'de güncelle
        set(ref(database, 'pixels/'), pixels);
    }
}

function getCursorPosition(e) {
    const rect = canvas.getBoundingClientRect();
    let x = Math.floor((e.clientX - rect.left) / pixelSize);
    let y = Math.floor((e.clientY - rect.top) / pixelSize);
    return { x, y };
}

// Fare tıklaması ile pikseli güncelle
canvas.addEventListener("click", (e) => {
    const { x, y } = getCursorPosition(e);
    updatePixel(x, y);
});

// Dokunmatik ekran desteği
canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const { x, y } = getCursorPosition(touch);
    updatePixel(x, y);
});

// Firebase'den veri güncellenmesini dinle
onValue(pixelsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        pixels = data;
        drawCanvas();
    }
});

// Başlangıçta çizimi yükle
drawCanvas();