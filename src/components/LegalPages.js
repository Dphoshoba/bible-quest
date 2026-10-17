import React from 'react';
import { Link } from 'react-router-dom';

const CONTACT_EMAIL = 'davidoshoba@gmail.com';
const UPDATED = '17 October 2026';

const pageStyle = {
  maxWidth: 720,
  margin: '0 auto',
  padding: '32px 20px 64px',
  lineHeight: 1.65,
  color: '#222',
  position: 'relative',
  zIndex: 1000,
};

function Page({ title, children }) {
  return (
    <div style={pageStyle}>
      <p><Link to="/" style={{ color: '#1a237e', fontWeight: 600 }}>← Back to Bible Quest</Link></p>
      <h1 style={{ color: '#1a237e' }}>{title}</h1>
      <p style={{ color: '#555', fontSize: 14 }}>Last updated: {UPDATED}</p>
      {children}
    </div>
  );
}

export function PrivacyPolicy() {
  return (
    <Page title="Privacy Policy">
      <p>
        Bible Quest is an interactive Bible story app for children, made by Rev David P H Oshoba George
        (Eternal Echoes &amp; Visions). This page explains, in plain language, what information the app
        uses. Questions? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>The short version</h2>
      <ul>
        <li>
          Accounts are optional and for parents only. We never ask children for their name, email, age
          or photo.
        </li>
        <li>There are no ads and no tracking or analytics tools.</li>
        <li>
          Progress is saved on your own device. If a parent chooses to sign in, it is also saved to the
          parent's account so it can follow them between devices.
        </li>
        <li>Payments are handled by Stripe. We never see card numbers.</li>
      </ul>

      <h2>Information stored on your device</h2>
      <p>
        To remember where you are, the app saves a few things in your browser's storage on your own
        device: stories and quizzes completed, quiz high scores, your daily streak and last visit date,
        the weekly goal a parent types in, and whether Premium has been unlocked (including a private
        restore code). Unless a parent signs in (see the next section), this information stays on your
        device and we cannot see it. Clearing your browser's site data removes it.
      </p>

      <h2>Parent accounts (optional)</h2>
      <p>
        A parent or guardian can choose to sign in with their Google account so Premium and progress sync
        between devices. Sign-in is handled by Google and Firebase. When a parent signs in we receive and
        store their Google account's unique ID and email address, whether Premium is unlocked, and the
        progress listed above (stories and quizzes completed, scores, streak, daily challenge count and
        weekly goal). We use this only to provide syncing and to restore Premium. Children should not
        create accounts. A parent can sign out at any time, and can ask us to delete the account and its
        data by emailing <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>Bible Buddy (the AI helper)</h2>
      <p>
        When a child types a question to Bible Buddy, the text is sent through our server to OpenAI so a
        safety check and a short answer can be produced. We do not ask for or intentionally store these
        questions, and we do not link them to any person. Please remind children never to type personal
        information such as their name, address, school or phone number. If they do, tell them to stop and
        talk to a parent. Every AI-written answer has a "Report this answer" link. It opens your email app
        with the answer filled in, and we only receive what you choose to send.
      </p>

      <h2>Bible text</h2>
      <p>
        Bible passages are fetched through our server from a Bible text provider. These requests contain
        the passage being read, not personal information.
      </p>

      <h2>Payments</h2>
      <p>
        Premium is a one-time purchase made by a parent or guardian. Payment is processed by Stripe, which
        collects the payment details and receipt email on its own secure page under its own{' '}
        <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">privacy policy</a>.
        After payment we only learn that the purchase was completed, so that Premium can be unlocked.
      </p>

      <h2>Children</h2>
      <p>
        Bible Quest is designed for children to use together with a parent, guardian or teacher. Purchases
        must be made by an adult. We do not knowingly collect personal information from children. If you
        believe a child has shared personal information with us, email us and we will delete it.
      </p>

      <h2>Hosting and logs</h2>
      <p>
        The app is delivered by hosting providers (Netlify and Render), and optional parent accounts are
        stored with Google Firebase. Like most web services, they may
        keep technical logs such as IP addresses and browser type for security and reliability. We do not
        use these logs to identify children.
      </p>

      <h2>Sharing</h2>
      <p>
        The Share buttons only open your device's share options (or a sharing page) when you tap them.
        Nothing is shared automatically.
      </p>

      <h2>Your choices</h2>
      <p>
        You can delete everything saved on your device by clearing the site data in your browser. To ask
        about, correct or delete anything else, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>Changes</h2>
      <p>If this policy changes, the date at the top will be updated.</p>
    </Page>
  );
}

export function RefundPolicy() {
  return (
    <Page title="Refund Policy">
      <p>
        Bible Quest Premium is a one-time purchase of US$5.00 that unlocks all characters and stories.
        We want parents to be happy with it.
      </p>

      <h2>14-day refund</h2>
      <p>
        If you are not satisfied, you can ask for a full refund within <strong>14 days</strong> of your
        purchase. No reason is needed.
      </p>

      <h2>How to ask</h2>
      <p>
        Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with the email address you used at
        checkout (it is on your Stripe receipt) and, if you have it, your restore code. We will reply as
        soon as we can.
      </p>

      <h2>How you get your money back</h2>
      <p>
        Approved refunds go back to the original payment method through Stripe. Your bank may take 5 to 10
        business days to show it. Premium access ends once a purchase is refunded.
      </p>

      <h2>Currency</h2>
      <p>
        Charges are made in US dollars. Your bank may show the amount in your local currency, and the
        exact figure can vary with exchange rates and bank fees.
      </p>

      <h2>Your rights</h2>
      <p>
        Nothing in this policy limits any rights you have under consumer protection laws that apply to
        you.
      </p>
    </Page>
  );
}
