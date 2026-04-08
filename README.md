# 🏦 FinCRM — Sales Intelligence & Pipeline Management

FinCRM is a modern, fast, and feature-rich CRM (Customer Relationship Management) dashboard tailored specifically for sales teams. Built with React and structured for scalability, it allows teams to manage their leads, track their sales pipelines, monitor performance, and seamlessly log daily interactions through an intuitive timeline and an interactive Activity Bot.

## ✨ Key Features

- **📊 Comprehensive Dashboard:** Real-time visibility into your sales pipeline value, completed vs pending activities, overdue reminders, and recent interactions.
- **💼 Lead Management:** Detailed lists of all leads which you can filter and manage. Each lead profile contains contact parameters, deal value, stage, assigned person, and interaction history.
- **🕒 Interactive Activity Timeline:** A unified timeline view displaying a chronological history of operations (Calls, Emails, Demos, Meetings, Notes, and Follow-ups) connected to each lead.
- **🤖 Activity Bot:** A custom-built floating interactive widget for frictionless activity logging. The bot guides users step-by-step through logging interactions, selecting leads, adding notes, and tracking them into the global timeline.
- **📈 Advanced Analytics:** Visualized reports leveraging Recharts, such as activity completion rates per sales rep, deal progression funnels, and pipeline value grouped by stage.

## 🛠️ Built With

The project uses a modern frontend tech stack ensuring a premium UI and blazing fast functionality:
- **Frontend Framework:** React 18 & TypeScript
- **Tooling & Build:** Vite
- **Styling:** Tailwind CSS & shadcn/ui
- **State Management:** React Context & TanStack Query (React Query)
- **Routing:** React Router v6
- **Data Visualizations:** Recharts
- **Backend Sync:** Supabase (Auth & Database)

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js and NPM (or Yarn/Bun) installed on your system. 

### Local System Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Aditya0611/sales.git
   cd sales
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   A `.env` file should be located at the root of the project with your respective Supabase URL and Keys for Authentication to work.
   ```env
   VITE_SUPABASE_PROJECT_ID="your_project_id"
   VITE_SUPABASE_PUBLISHABLE_KEY="your_publishable_key"
   VITE_SUPABASE_URL="your_supabase_url"
   ```

4. **Start the local development server:**
   ```bash
   npm run dev
   ```

5. **Open the browser:**
   Navigate to [http://localhost:8080](http://localhost:8080) to interact with the CRM.

### Demo Access
Since the app uses Supabase for Auth, you can:
- **Sign In** using previously created credentials, or
- **Sign Up** natively clicking the "Sign up" link to explore the CRM directly.

## 🤝 Workflow & Usage

1. **Add a Lead:** Navigate to the "Leads" tab and track a new prospect moving through your custom funnel stages `New → Contacted → Qualified → Proposal → Won/Lost`.
2. **Log Activities via Bot:** Regardless of the page you are on, click the purple "Log Activity ✨" widget in the bottom right corner to seamlessly log notes and phone calls.
3. **Review Overdues:** Check your dashboard frequently for missed follow-ups to ensure zero leads fall through!

---

*Designed and Built for frictionless sales workflows!*
