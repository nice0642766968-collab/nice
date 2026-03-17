import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Screen Switching Logic
window.showScreen = (screen) => {
    if (screen === 'add-product') {
        document.getElementById('screen-list').classList.add('d-none');
        document.getElementById('screen-add').classList.remove('d-none');
        document.getElementById('btn-show-add').classList.add('d-none');
    } else {
        document.getElementById('screen-list').classList.remove('d-none');
        document.getElementById('screen-add').classList.add('d-none');
        document.getElementById('btn-show-add').classList.remove('d-none');
        loadProducts();
    }
};

// Fetch Products
async function loadProducts() {
    const container = document.getElementById('product-container');
    container.innerHTML = '<div class="text-center">Loading...</div>';
    
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    container.innerHTML = '';
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        container.innerHTML += `
            <div class="col-6 col-md-4 col-lg-3">
                <div class="card h-100 border-0 shadow-sm product-card">
                    <img src="${data.imageUrl}" class="card-img-top" alt="${data.name}">
                    <div class="card-body p-2">
                        <h6 class="card-title text-truncate mb-1">${data.name}</h6>
                        <p class="text-primary fw-bold mb-1">฿${data.price}</p>
                        <small class="text-muted d-block text-truncate">${data.contact}</small>
                    </div>
                </div>
            </div>
        `;
    });
}

// Handle Form Submission
document.getElementById('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    btn.disabled = true;
    btn.innerText = "Uploading...";

    const file = document.getElementById('image').files[0];
    const name = document.getElementById('name').value;
    const desc = document.getElementById('desc').value;
    const price = document.getElementById('price').value;
    const contact = document.getElementById('contact').value;

    try {
        // 1. Upload Image
        const storageRef = ref(storage, 'products/' + Date.now() + "_" + file.name);
        const snapshot = await uploadBytes(storageRef, file);
        const imageUrl = await getDownloadURL(snapshot.ref);

        // 2. Save to Firestore
        await addDoc(collection(db, "products"), {
            name, desc, price, contact, imageUrl,
            createdAt: new Date()
        });

        alert("Product listed successfully!");
        document.getElementById('product-form').reset();
        showScreen('list');
    } catch (error) {
        console.error(error);
        alert("Error uploading product.");
    } finally {
        btn.disabled = false;
        btn.innerText = "Post Product";
    }
});

// Initial Load
loadProducts();
