/*
  BASE Wrestling — Firebase Assessment Module
  Include this AFTER the Firebase SDK scripts in any assessment HTML file.
  
  USAGE:
  1. Add Firebase SDK scripts (firebase-app-compat, firebase-auth-compat, firebase-firestore-compat)
  2. Add: <script src="base-firebase-module.js"></script>
  3. Call baseFirebase.init() on page load
  4. Call baseFirebase.saveProgress(assessmentType, answers) to save partial progress
  5. Call baseFirebase.submit(assessmentType, answers) to submit completed assessment
  
  SAVES TO:
  - Progress: /teams/{teamId}/assessments/coach-{type}-draft
  - Final:    /teams/{teamId}/assessments/coach-{type}
  - Also updates: /users/{uid} with assessment completion flag
  
  assessmentType values: 'battle', 'athletic', 'exercise', 'skill'
*/

var baseFirebase = (function() {
  var db = null;
  var auth = null;
  var ready = false;
  var userId = null;
  var teamId = null;
  var userProfile = null;

  function init(callback) {
    if (typeof firebase === 'undefined') {
      console.log('Firebase not available — demo mode');
      if (callback) callback(false);
      return;
    }

    // Check if already initialized
    if (firebase.apps.length === 0) {
      firebase.initializeApp({
        apiKey: "AIzaSyAg2sn35a87F7hRnqOEuVgRdUgY8SZu1fE",
        authDomain: "base-wrestling-app.firebaseapp.com",
        projectId: "base-wrestling-app",
        storageBucket: "base-wrestling-app.appspot.com",
        messagingSenderId: "000000000000",
        appId: "1:000000000000:web:placeholder"
      });
    }

    auth = firebase.auth();
    db = firebase.firestore();

    auth.onAuthStateChanged(function(user) {
      if (user) {
        userId = user.uid;
        db.collection('users').doc(userId).get().then(function(doc) {
          if (doc.exists) {
            userProfile = doc.data();
            teamId = userProfile.teamId;
            ready = true;
            if (callback) callback(true);
          }
        });
      } else {
        console.log('No user logged in — demo mode');
        if (callback) callback(false);
      }
    });
  }

  // Save partial progress (auto-save as coach answers questions)
  function saveProgress(type, answers) {
    if (!ready || !teamId) {
      console.log('Demo mode — progress saved locally only');
      return Promise.resolve();
    }
    return db.collection('teams').doc(teamId).collection('assessments').doc('coach-' + type + '-draft').set({
      answers: answers,
      answeredCount: Object.keys(answers).filter(function(k) { return answers[k]; }).length,
      lastSaved: new Date(),
      savedBy: userId
    }, { merge: true });
  }

  // Load saved progress (resume where coach left off)
  function loadProgress(type) {
    if (!ready || !teamId) return Promise.resolve(null);
    return db.collection('teams').doc(teamId).collection('assessments').doc('coach-' + type + '-draft').get()
      .then(function(doc) {
        return doc.exists ? doc.data().answers : null;
      })
      .catch(function() { return null; });
  }

  // Submit completed assessment
  function submit(type, answers, totalQuestions) {
    if (!ready || !teamId) {
      console.log('Demo mode — assessment submitted locally');
      return Promise.resolve();
    }

    var data = {
      answers: answers,
      totalQuestions: totalQuestions || Object.keys(answers).length,
      completedAt: new Date(),
      completedBy: userId,
      coachName: (userProfile.firstName || '') + ' ' + (userProfile.lastName || '')
    };

    // Save final assessment
    return db.collection('teams').doc(teamId).collection('assessments').doc('coach-' + type).set(data)
      .then(function() {
        // Delete draft
        return db.collection('teams').doc(teamId).collection('assessments').doc('coach-' + type + '-draft').delete().catch(function() {});
      })
      .then(function() {
        // Update user profile with completion flag
        var update = {};
        update['assessments.' + type] = true;
        return db.collection('users').doc(userId).set(update, { merge: true });
      });
  }

  // Check if assessment is already completed
  function isComplete(type) {
    if (!ready || !teamId) return Promise.resolve(false);
    return db.collection('teams').doc(teamId).collection('assessments').doc('coach-' + type).get()
      .then(function(doc) { return doc.exists; })
      .catch(function() { return false; });
  }

  return {
    init: init,
    saveProgress: saveProgress,
    loadProgress: loadProgress,
    submit: submit,
    isComplete: isComplete,
    isReady: function() { return ready; },
    getTeamId: function() { return teamId; },
    getUserId: function() { return userId; }
  };
})();
