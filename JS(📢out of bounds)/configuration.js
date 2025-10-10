// 🔐 Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnD3vrDXyvimCTrHNITbQKJeHGxPAL45g",
  authDomain: "propnetix.firebaseapp.com",
  projectId: "propnetix",
  appId: "1:774181800796:web:d08d1f1313e7b61f4dcf99",
};

// 🔌 Initialize Firebase (compat)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL); // 🔹 Persist login across sessions
