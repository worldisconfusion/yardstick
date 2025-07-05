# Yardstick

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vercel Deployment](https://img.shields.io/badge/Deploy%20with-Vercel-black?logo=vercel)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fyardstick)
<!-- Add other badges like build status once CI is set up -->
<!--
[![Build Status](https://img.shields.io/github/actions/workflow/status/your-username/yardstick/ci.yml?branch=main)](https://github.com/your-username/yardstick/actions)
-->

> A modern, self-hostable personal finance application for tracking your budgets and transactions.

Yardstick helps you take control of your finances by providing a clear and simple interface to manage your budgets and monitor your spending. Built with a modern tech stack, it's designed for easy deployment on platforms like Vercel, giving you full ownership of your financial data. Whether you're trying to save money, understand your spending habits, or just keep an eye on your accounts, Yardstick provides the essential tools you need.

## ✨ Features

- **Budget Management:** Create and manage monthly or recurring budgets to stay on track.
- **Transaction Tracking:** Easily add, categorize, and view all your financial transactions.
- **Data Privacy First:** Self-host your financial data to ensure complete privacy and control.
- **Health Check API:** A built-in endpoint (`/api/health`) to diagnose deployment and connection issues.
- **Modern Tech Stack:** Built with Next.js and MongoDB for a fast and scalable experience.
- **One-Click Deployment:** Deploy your own instance in minutes on Vercel.

<!-- If your project is visual, a screenshot or GIF is a great way to show it off. -->
<!-- !Screenshot of Yardstick in action -->

## 🤔 Why Yardstick?

Yardstick was created out of a need for a simple, no-frills budgeting tool that puts users in control of their own data. Unlike many commercial budgeting apps that require you to link bank accounts or store sensitive information on third-party servers, Yardstick allows you to self-host your entire financial dashboard. This focus on privacy, combined with a clean, intuitive interface, makes it a great alternative for those who value simplicity and data ownership.

## 🚀 Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

- Node.js (v18.x or later)
- npm, yarn, or pnpm
- A MongoDB database (you can use a local instance or a free cluster from MongoDB Atlas)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/yardstick.git
    cd yardstick
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Set up environment variables**
    Create a `.env.local` file in the root of your project and add your MongoDB connection string.

    ```bash
    echo "MONGO_URI=your_mongodb_connection_string" > .env.local
    ```
    Replace `your_mongodb_connection_string` with your actual MongoDB URI.

4.  **Run the development server**
    ```bash
    npm run dev
    ```
    Open http://localhost:3000 with your browser to see the result.

## 📖 Usage

Once the application is running, you can start managing your finances.

-   Navigate to the "Budgets" section to create new spending categories.
-   Go to the "Transactions" section to log your income and expenses.
-   The dashboard will provide an overview of your financial health.

### Deployment

The easiest way to deploy your Yardstick instance is with Vercel. Click the button below to get started:

[!Deploy with Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fyardstick)

For more detailed instructions and troubleshooting, please see the **Deployment Guide**.

## ⚙️ API Reference

Yardstick exposes a few REST API endpoints for managing data:

-   `GET /api/health`: Checks the health of the application and its database connection.
-   `GET /api/transactions`: Fetches all transactions.
-   `POST /api/transactions`: Creates a new transaction.
-   `GET /api/budgets`: Fetches all budgets.
-   `POST /api/budgets`: Creates a new budget.

For more details on the API, you can explore the code in the `/pages/api` directory.

## 🤝 Contributing

We welcome contributions! If you'd like to help improve this project, please read our `CONTRIBUTING.md` guide to get started. It should include instructions on how to set up the development environment, run tests, and submit pull requests.

## 💖 Acknowledgements

-   Inspiration from the need for simple, private financial tools.
-   Thanks to the open-source community for the libraries that make this project possible.

## 📜 License

This project is licensed under the MIT License. See the `LICENSE` file for details.