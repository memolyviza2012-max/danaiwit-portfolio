import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, push, onDisconnect, set, runTransaction } from 'firebase/database';
import { getAnalytics, isSupported } from 'firebase/analytics';

// =========================================================================
// FIREBASE CONFIGURATION
// =========================================================================
export const firebaseConfig = {
  apiKey: "AIzaSyDM9kon8e_-Cyhe8GYOjpFLo0otLQCqVSk",
  authDomain: "my-portfolio-stats-6b0c3.firebaseapp.com",
  databaseURL: "https://my-portfolio-stats-6b0c3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "my-portfolio-stats-6b0c3",
  storageBucket: "my-portfolio-stats-6b0c3.firebasestorage.app",
  messagingSenderId: "899120685913",
  appId: "1:899120685913:web:d0a00fa119c45729326248",
  measurementId: "G-HCHNB3DX89"
};

export function initVisitorCounter(config = firebaseConfig) {
  const onlineEl = document.getElementById('stats-online-count');
  const viewsEl = document.getElementById('stats-views-count');
  const footerOnlineEl = document.getElementById('footer-online-count');
  const footerViewsEl = document.getElementById('footer-views-count');

  try {
    const app = initializeApp(config);
    const db = getDatabase(app);

    // Initialize Firebase Analytics if supported in browser environment
    isSupported().then(supported => {
      if (supported) {
        getAnalytics(app);
      }
    }).catch(() => {});

    // 1. Total Visits Counter (with session deduplication)
    const visitsRef = ref(db, 'stats/totalVisits');
    const sessionKey = 'portfolio_session_logged';

    if (!sessionStorage.getItem(sessionKey)) {
      runTransaction(visitsRef, (current) => {
        return (current || 0) + 1;
      }).then(() => {
        sessionStorage.setItem(sessionKey, 'true');
      }).catch(err => {
        console.warn("Visits counter transaction note:", err);
      });
    }

    // Listen for real-time total visits changes
    onValue(visitsRef, (snapshot) => {
      const total = snapshot.val() || 1;
      updateText(viewsEl, total.toLocaleString());
      updateText(footerViewsEl, total.toLocaleString());
    });

    // 2. Real-time Online Presence
    const connectedRef = ref(db, '.info/connected');
    const onlineUsersRef = ref(db, 'stats/onlineUsers');

    onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        const myPresenceRef = push(onlineUsersRef);
        onDisconnect(myPresenceRef).remove();
        set(myPresenceRef, {
          time: Date.now()
        });
      }
    });

    // Listen for real-time online user count changes
    onValue(onlineUsersRef, (snapshot) => {
      let count = 1;
      if (snapshot.exists()) {
        count = Object.keys(snapshot.val()).length;
      }
      count = Math.max(1, count);
      updateText(onlineEl, count.toString());
      updateText(footerOnlineEl, count.toString());
    });

  } catch (err) {
    console.error("Firebase Visitor Counter Error:", err);
  }
}

function updateText(el, val) {
  if (el) el.innerText = val;
}
