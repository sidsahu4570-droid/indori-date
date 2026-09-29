# Indori Date (इन्दोरी डेट) 🥨❤️
> **“Indore mein apna match dhoondo.”**
> Exclusive dating & matchmaking mobile app for people living in Indore, Madhya Pradesh.

---

## 🌟 Highlights & Features

1. **Strictly Indore-Exclusive**:
   - Compulsory residency check during onboarding.
   - Restricts discovery to Indore localities (Vijay Nagar, Old & New Palasia, Rajwada & Sarafa, Bhawarkua, Annapurna, Saket, Scheme 54 / Meghdoot, Scheme 78, Bypass / Phoenix Citadel, Super Corridor, etc.).
   - Obfuscated location privacy: displays approximate distance (e.g. `📍 2.5 km away`) without exposing exact addresses.

2. **Full Authentication & 18+ Verification**:
   - Email/password authentication & Indian Mobile OTP verification.
   - Strict age verification derived from Date of Birth (under 18 barred from registering).
   - Mandatory acceptance of Terms & Privacy Policy.

3. **Indore Onboarding & Rich Profile Creation**:
   - 4-slide onboarding carousel highlighting Indore vibes and dating culture.
   - Profile photo gallery, bio, occupation, education (SGSITS, DAVV, IIM Indore, MGM, etc.), height, and relationship intent.
   - Indore-specific tags (Sarafa Food Walk, Chappan Dukan Poha, Vijay Nagar Nightlife, Rajwada Heritage, C21 Mall, Phoenix Citadel, Ralamandal Sunset, Sev Lovers Clan, etc.).

4. **Interactive Discovery / Swiping**:
   - Smooth card swipe gestures (Swipe Right → Like, Swipe Left → Pass, Super Like ⭐).
   - Tap profile card to reveal comprehensive details modal with photo carousels, full bio, and essentials.
   - Haptic feedback on actions.

5. **Search & Advanced Filters**:
   - Filter by Age Range (18–35+), Distance within Indore (1–25 km), Gender preference, Verified profiles only, Recently active, and specific Indore foodie tags.

6. **Match & Two-Step Accept System**:
   - Mutual likes trigger animated celebration modal: *"It’s a Match! ❤️ You and Priya liked each other."*
   - Connection request workflow: Accept or Decline incoming connect requests.

7. **Real-Time 1-to-1 Messaging**:
   - Chat messaging with timestamps, online status indicators, and typing simulations.
   - Image sharing capabilities.
   - Safety banner reminding users to meet in public places (Chappan Dukan, Phoenix Citadel) and never send money.
   - Moderation options: Unmatch, Block, Report (with categories).

8. **VIP Membership & Razorpay Monetization**:
   - Free plan daily limits (15 likes, 1 super like, 5 connection requests).
   - VIP Gold tiers (1 Month ₹499, 6 Months ₹1799, 12 Months ₹2799) with unlimited likes, see who liked you, boosts, and gold VIP badges.
   - Razorpay order creation and server-side signature verification architecture.

9. **Safety Center & Moderation**:
   - Indore emergency helplines (112, 1090, 1930).
   - Blocked users list management.
   - Profile verification workflow with selfie and ID document upload.

10. **Admin Portal**:
    - Real-time platform analytics (Total users, matches, messages, paid subscribers, revenue in INR, conversion rates).
    - Report triage with one-click Ban User or Dismiss actions.
    - App settings: dynamic VIP pricing adjustments and live broadcast announcements.

---

## 🛠️ Tech Stack

* **Framework**: React Native & Expo SDK 57 (Expo Router navigation)
* **Language**: TypeScript
* **State & Context**: Modular React Contexts (`AuthContext`, `MatchContext`, `PremiumContext`, `ChatContext`)
* **Styling**: Tailored design tokens (`COLORS.primary` #E91E63, `COLORS.secondary` #FF4F81, `COLORS.gold` #D4A72C, `COLORS.background` #FFF8FA, #171717 Obsidian Dark)
* **Database & Auth**: Firebase Auth, Cloud Firestore, Firebase Storage
* **Payments**: Razorpay Indian Payment Gateway integration architecture

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your Firebase project credentials and Razorpay API keys if connecting to live production cloud services.

### 3. Run Development Server
```bash
npx expo start
```
* Press `i` to open in iOS Simulator (Mac)
* Press `a` to open in Android Emulator / Device
* Press `w` to run on Web

### 4. Quality Checks
```bash
npx tsc --noEmit     # TypeScript typecheck
npx expo-doctor      # Expo SDK dependency & config verification
```
