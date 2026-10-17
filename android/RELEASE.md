# Releasing Bible Quest on Google Play

This is the first Android release: **free, no purchases, no sign-in** (Premium stays on the website).
The Android app detects it is running natively and hides Upgrade, Restore purchase, parent sign-in and
the refund link. Locked characters show "Coming soon".

Current version: `versionCode 2`, `versionName 1.1.0` (in `android/app/build.gradle`).
Raise `versionCode` by at least 1 for every upload to Google Play.

## One-time setup (only you can do these)

1. **Google Play Console account**: https://play.google.com/console (one-time US$25 fee, ID checks apply).
2. **Install Android Studio** (it includes the Android SDK and the Java tools): https://developer.android.com/studio
3. **Create your release signing key.** Open a terminal in the `android` folder and run
   (Android Studio's Java is in `C:\Program Files\Android\Android Studio\jbr\bin`):

   ```
   keytool -genkeypair -v -keystore biblequest-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias biblequest
   ```

   You will be asked to choose two passwords. **Write them down and back the `.jks` file up somewhere safe
   outside this folder** (a password manager or cloud drive). If it is lost you cannot update the app
   under the same key without Google's help.
4. Copy `keystore.properties.example` to `keystore.properties` and fill in your passwords.
   Both `keystore.properties` and `*.jks` are git-ignored on purpose.
5. In Play Console, when asked, **enrol in Play App Signing** (recommended). Your key then acts as the
   "upload key" and Google keeps the final signing key.

## Build the release bundle (each release)

From the project folder (not `android`):

```
npm run build
npx cap sync android
cd android
gradlew bundleRelease
```

(If `npm run build` fails on Node 24 with a strange "Identifier ... has already been declared" error, retry,
or run it with `NODE_OPTIONS="--no-experimental-detect-module --no-experimental-require-module"`.)

The file to upload is `android/app/build/outputs/bundle/release/app-release.aab`.
Alternative: in Android Studio, open the `android` folder and use **Build > Generate Signed App Bundle**.

Set `sdk.dir` in `android/local.properties` if Gradle cannot find the SDK (Android Studio does this for you).

## Upload and test

1. Play Console > Create app: name **Bible Quest for Kids**, default language English, **App**, **Free**.
2. Complete **App content**: privacy policy URL `https://bible-quest.netlify.app/privacy`, ads (none),
   app access (all features available without login), target audience, content rating, Data safety,
   and the Families questions. Suggested answers are in `PLAY_LISTING.md`.
3. Upload the `.aab` to **Internal testing** first and install it on a real phone from the test link.
4. New personal developer accounts must usually run a **closed test with about 12 testers for 14 days**
   before they can apply for production access. Check the current rule in Play Console.
5. Then promote to Production.

## Before every release: quick phone test

- Home screen shows only free characters unlocked (David, Esther). Others say "Coming soon".
- No "Upgrade", "Restore purchase", sign-in, install or refund links anywhere.
- Stories, narration, quizzes, Daily Challenge, certificates work, including with Airplane Mode on
  (the audio is bundled inside the app).
- Back button behaves; app does not crash on rotation.

## Open items before submitting

- **AI helper (Bible Buddy):** Google's AI-generated content policy expects an in-app way to report
  offensive AI answers. A "Report this answer" button is not built yet. Either add one, or hide Bible
  Buddy in the Android release.
- **Designed for Families:** because children are a target audience, review the Families policy
  checklist in Play Console and answer the questionnaire carefully.
- **Store graphics:** a 512x512 icon is ready (`public/icon-512.png`). You still need a 1024x500 feature
  graphic and at least 2 phone screenshots (see `PLAY_LISTING.md`).
