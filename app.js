import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// REPLACE WITH YOUR FIREBASE CONFIG
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// --- LOGIC FOR INDEX PAGE (DISPLAY) ---
const productList = document.getElementById('product-list');
if (productList) {
    const loadProducts = async () => {
        const querySnapshot = await getDocs(collection(db, "products"));
        productList.innerHTML = ""; // Clear loader
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            productList.innerHTML += `
                <div class="col-6 col-md-4 col-lg-3">
                    <div class="card h-100 border-0 shadow-sm product-card">
                        <img src="${data.imageUrl}" class="card-img-top" alt="Product">
                        <div class="card-body p-2">
                            <h6 class="mb-1 text-truncate">${data.name}</h6>
                            <p class="fw-bold text-primary mb-0">$${data.price}</p>
                            <small class="text-muted">${data.contact}</small>
                        </div>
                    </div>
                </div>
            `;
        });
    };
    loadProducts();
}

// --- LOGIC FOR ADD PRODUCT PAGE ---
const productForm = document.getElementById('product-form');
if (productForm) {
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerText = "Uploading...";

        const file = document.getElementById('image').files[0];
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const price = document.getElementById('price').value;
        const contact = document.getElementById('contact').value;

        try {
            // 1. Upload Image to Firebase Storage
            const storageRef = ref(storage, 'products/' + file.name);
            const snapshot = await uploadBytes(storageRef, file);
            const imageUrl = await getDownloadURL(snapshot.ref);

            // 2. Save Product Data to Firestore
            await addDoc(collection(db, "products"), {
                name, description, price, contact, imageUrl, createdAt: new Date()
            });

            alert("Product posted successfully!");
            window.location.href = "index.html";
        } catch (error) {
            console.error(error);
            alert("Error uploading product.");
            submitBtn.disabled = false;
        }
    });
}
