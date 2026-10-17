# Google Play listing: Bible Quest for Kids

Paste these into Play Console. Check each answer against what the released app actually does.

## Store listing

**App name** (max 30): `Bible Quest for Kids`

**Short description** (max 80):
`Fun Bible stories, quizzes and daily challenges for kids, with audio.`

**Full description** (max 4000):

```
Bible Quest is a gentle, interactive Bible story app made for children and the grown-ups who read with them.

What kids can do:
• Read Bible stories with David and Esther at three reading levels (ages 3-6, 6+ and a longer summary)
• Listen to every story read aloud with a warm narrator voice, even without internet
• Take a quiz after each story and beat their high score
• Play the Daily Challenge: 5 fresh questions every day, the same for everyone
• Build a daily streak and collect badges like Story Explorer, Quiz Whiz and Week Warrior
• Print or save a Certificate of Completion when they finish a story and its quiz
• Ask Bible Buddy, a friendly AI helper, simple questions about the story (it follows child-safety rules and gently steers back to the Bible)

Made for families:
• No ads and no tracking
• No accounts and no personal information collected from children
• Progress is saved on the device
• Parents can see streaks and finished stories in the Parent/Teacher Dashboard

More Bible characters are coming soon.

Bible Quest is created by Rev David P H Oshoba George, Eternal Echoes & Visions.
```

**App category:** Education
**Tags:** Education, Kids, Religion
**Contact email:** davidoshoba@gmail.com
**Website:** https://bible-quest.netlify.app
**Privacy policy URL:** https://bible-quest.netlify.app/privacy

## Graphics you still need to create

- App icon 512x512: ready at `public/icon-512.png`
- Feature graphic 1024x500: not made yet (the app icon art on the navy background works as a start)
- Phone screenshots: at least 2, ideally 4-8 (home screen, a story, a quiz, the Daily Challenge,
  achievements, a certificate). Take them on a real phone or the Android emulator.

## Target audience and content

- Target age groups: select **6-8 and 9-12**. The stories also suit ages 3-6 when read with a parent,
  but selecting the youngest group adds stricter Google rules.
- Appeals to children: **Yes**. This means the app joins **Designed for Families**.
- Ads: **No ads**.

## Content rating questionnaire (IARC)

Suggested answers: no violence beyond mild Bible-story events, no sexual content, no profanity, no
controlled substances, no gambling, no user-to-user communication, no location sharing, no purchases in
the app. Say that the app contains **AI-generated chat answers** if the questionnaire asks.
Expected result: suitable for everyone, but confirm what Play Console returns.

## Data safety form (suggested answers, verify in Console)

- Does the app collect or share user data? **Yes, limited** (the AI helper text is sent to a service
  provider to produce an answer).
- Data types:
  - **User-generated content / messages**: the question a child types into Bible Buddy. Purpose: app
    functionality. Processed by a service provider (OpenAI) to generate the answer. Not stored by us
    against any person. Optional.
  - No personal info (name, email, address), no location, no contacts, no photos, no device IDs,
    no advertising ID, no financial info.
- Is data encrypted in transit? **Yes** (HTTPS).
- Can users request data deletion? There is no account; progress stays on the device and is removed by
  clearing app data or uninstalling.

## App content declarations

- Ads: no. App access: all functionality available without login. Government app: no.
  Financial features: none. Health: none. News: no. COVID-19: no.
- Purchases: the Android app has **no in-app purchases and no purchase links**. Premium is available
  only on the website and is not mentioned in the app.

## Notes

- The Android app is a free release. Locked characters show "Coming soon" without any price.
- If Premium inside the Android app is wanted later, it must use **Google Play Billing**, not Stripe.
