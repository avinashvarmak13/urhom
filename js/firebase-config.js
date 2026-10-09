/* ============================================================
   URHOM — Firebase web configuration
   These six values plus the analytics id are the public web config
   from Firebase Console → Project settings → Your apps → Web app.
   Firebase expects them in client code; they are not secrets, and
   access is controlled by the console's authorised-domain list and
   by security rules, not by hiding this file.

   Service account keys, admin credentials and API secrets must
   never appear here or anywhere else in the frontend.

   js/auth.js reads window.URHOM_FIREBASE and treats authentication
   as unconfigured while apiKey still starts with REPLACE_WITH.

   On a build with a bundler, generate this file from environment
   variables instead of committing the values.
   ============================================================ */
window.URHOM_FIREBASE = {
  apiKey:            'AIzaSyDLcN_hbFxxh7mWi1Qch2TE9oiS5laML0Y',
  authDomain:        'urhom-58774.firebaseapp.com',
  projectId:         'urhom-58774',
  storageBucket:     'urhom-58774.firebasestorage.app',
  messagingSenderId: '231912336298',
  appId:             '1:231912336298:web:8464a436b7b39a016199d3',
  measurementId:     'G-K2W5V0S3XM'
};
