// ══════════════════════════════════════════════════════════════
// BASE WRESTLING — SHARED FIREBASE MODULE
// Every screen loads this file. Handles auth, team resolution,
// progress saving, and final submission for all assessments.
// ══════════════════════════════════════════════════════════════

(function() {
  // ── FIREBASE CONFIG (REAL VALUES) ──────────────────────────
  var firebaseConfig = {
    apiKey: "AIzaSyAg2sn35a87F7hRnqOEuVgRdUgY8SZu1fE",
    authDomain: "base-wrestling-app.firebaseapp.com",
    projectId: "base-wrestling-app",
    storageBucket: "base-wrestling-app.firebasestorage.app",
    messagingSenderId: "368548684923",
    appId: "1:368548684923:web:0fc54795d1f375b0e6eede"
  };

  // ── STATE ──────────────────────────────────────────────────
  window.BASE = window.BASE || {};
  window.BASE.auth = null;
  window.BASE.db = null;
  window.BASE.user = null;
  window.BASE.userData = null;
  window.BASE.teamId = null;
  window.BASE.firebaseReady = false;
  window.BASE._readyCallbacks = [];

  // ── READY HANDLER (FIXES RACE CONDITION) ───────────────────
  // Screens call BASE.onReady(fn) instead of checking firebaseReady directly.
  // Callback fires immediately if already ready, or queues for later.
  window.BASE.onReady = function(fn) {
    if (window.BASE.firebaseReady && window.BASE.user) {
      fn(window.BASE.user, window.BASE.userData);
    } else {
      window.BASE._readyCallbacks.push(fn);
    }
  };

  function _fireReady() {
    window.BASE.firebaseReady = true;
    var cbs = window.BASE._readyCallbacks;
    window.BASE._readyCallbacks = [];
    for (var i = 0; i < cbs.length; i++) {
      try { cbs[i](window.BASE.user, window.BASE.userData); } catch(e) { console.error('BASE.onReady callback error:', e); }
    }
  }

  // ── INIT ───────────────────────────────────────────────────
  function init() {
    if (typeof firebase === 'undefined') {
      console.warn('BASE: Firebase SDK not loaded. Running in demo mode.');
      return;
    }

    // Prevent double-init
    if (firebase.apps && firebase.apps.length > 0) {
      window.BASE.auth = firebase.auth();
      window.BASE.db = firebase.firestore();
    } else {
      firebase.initializeApp(firebaseConfig);
      window.BASE.auth = firebase.auth();
      window.BASE.db = firebase.firestore();
    }

    // Listen for auth state
    window.BASE.auth.onAuthStateChanged(function(user) {
      if (user) {
        window.BASE.user = user;
        // Load user profile from Firestore
        window.BASE.db.collection('users').doc(user.uid).get()
          .then(function(doc) {
            if (doc.exists) {
              window.BASE.userData = doc.data();
              // Resolve team
              if (window.BASE.userData.teamId) {
                window.BASE.teamId = window.BASE.userData.teamId;
              } else if (window.BASE.userData.teams && window.BASE.userData.teams.length > 0) {
                window.BASE.teamId = window.BASE.userData.teams[0];
              }
              _fireReady();
            } else {
              console.warn('BASE: User doc not found in Firestore.');
              _fireReady();
            }
          })
          .catch(function(err) {
            console.error('BASE: Error loading user data:', err);
            _fireReady();
          });
      } else {
        window.BASE.user = null;
        window.BASE.userData = null;
        window.BASE.teamId = null;
        window.BASE.firebaseReady = true;
        // Not signed in — screens handle this (show demo data or redirect to login)
      }
    });
  }

  // ── HELPERS ────────────────────────────────────────────────

  // Save a document (merge by default so partial updates don't wipe data)
  window.BASE.save = function(collection, docId, data) {
    if (!window.BASE.db) { console.warn('BASE.save: No DB connection'); return Promise.resolve(null); }
    return window.BASE.db.collection(collection).doc(docId).set(data, { merge: true })
      .then(function() { return true; })
      .catch(function(err) { console.error('BASE.save error:', err); return null; });
  };

  // Get a document
  window.BASE.get = function(collection, docId) {
    if (!window.BASE.db) { console.warn('BASE.get: No DB connection'); return Promise.resolve(null); }
    return window.BASE.db.collection(collection).doc(docId).get()
      .then(function(doc) { return doc.exists ? doc.data() : null; })
      .catch(function(err) { console.error('BASE.get error:', err); return null; });
  };

  // Query a collection
  window.BASE.query = function(collection, field, op, value) {
    if (!window.BASE.db) { console.warn('BASE.query: No DB connection'); return Promise.resolve([]); }
    return window.BASE.db.collection(collection).where(field, op, value).get()
      .then(function(snap) {
        var results = [];
        snap.forEach(function(doc) { results.push(Object.assign({ id: doc.id }, doc.data())); });
        return results;
      })
      .catch(function(err) { console.error('BASE.query error:', err); return []; });
  };

  // Get current user's UID (shortcut)
  window.BASE.uid = function() {
    return window.BASE.user ? window.BASE.user.uid : null;
  };

  // Save assessment progress (auto-stamps user and team)
  window.BASE.saveAssessment = function(type, data) {
    var uid = window.BASE.uid();
    if (!uid) { console.warn('BASE.saveAssessment: No user'); return Promise.resolve(null); }
    var payload = Object.assign({}, data, {
      assessmentType: type,
      userId: uid,
      teamId: window.BASE.teamId || null,
      updatedAt: new Date().toISOString()
    });
    var docId = uid + '_' + type + (window.BASE.teamId ? '_' + window.BASE.teamId : '');
    return window.BASE.save('assessments', docId, payload);
  };

  // Save onboarding data
  window.BASE.saveOnboarding = function(stepData) {
    var uid = window.BASE.uid();
    if (!uid) { console.warn('BASE.saveOnboarding: No user'); return Promise.resolve(null); }
    return window.BASE.save('users', uid, stepData);
  };

  // Mark onboarding complete
  window.BASE.completeOnboarding = function() {
    var uid = window.BASE.uid();
    if (!uid) return Promise.resolve(null);
    return window.BASE.save('users', uid, { onboardingComplete: true });
  };

  // Save practice data
  window.BASE.savePractice = function(practiceData) {
    if (!window.BASE.db) return Promise.resolve(null);
    var uid = window.BASE.uid();
    var docId = (window.BASE.teamId || 'noteam') + '_' + new Date().toISOString().split('T')[0] + '_' + Date.now();
    var payload = Object.assign({}, practiceData, {
      coachId: uid,
      teamId: window.BASE.teamId || null,
      createdAt: new Date().toISOString()
    });
    return window.BASE.save('practices', docId, payload);
  };

  // Save attendance
  window.BASE.saveAttendance = function(date, presentIds, absentIds) {
    if (!window.BASE.db) return Promise.resolve(null);
    var docId = (window.BASE.teamId || 'noteam') + '_' + date;
    return window.BASE.save('attendance', docId, {
      teamId: window.BASE.teamId || null,
      date: date,
      present: presentIds,
      absent: absentIds,
      updatedAt: new Date().toISOString()
    });
  };

  // Sign out
  window.BASE.signOut = function() {
    if (window.BASE.auth) {
      return window.BASE.auth.signOut().then(function() {
        window.location.href = 'login-screen.html';
      });
    }
  };

  // ── KICK OFF ───────────────────────────────────────────────
  // Wait for Firebase SDK scripts to load, then init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(init, 50); });
  } else {
    setTimeout(init, 50);
  }

})();
