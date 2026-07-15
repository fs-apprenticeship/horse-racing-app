This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Backend Setup

The backend is built with FastAPI and PostgreSQL.

### Prerequisites

* Python 3.12 (recommended; Python 3.14 may cause dependency installation issues)
* PostgreSQL

### Setup

Navigate to the backend directory:

```bash
cd backend
```

Create and activate a virtual environment:

```bash
python3.12 -m venv venv

# macOS/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate
```

Install dependencies:

```bash
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

Create a PostgreSQL database (e.g. `horseracing_db`) in your local PostgreSQL instance, then add a `.env` file in the `backend` directory containing your database connection string.

Depending on your local PostgreSQL configuration, your connection string may look different. For example:

If your PostgreSQL installation does not require a username and password:

```env
DATABASE_URL=postgresql://localhost/horseracing_db
```

If your PostgreSQL installation requires authentication:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/horseracing_db
```

### Running the Backend

Start the FastAPI development server:

```bash
uvicorn main:app --reload
```

The backend API will be available at:

```text
http://localhost:8000
```

To generate AI-powered race summaries, set an OpenAI API key in the backend environment:

```env
OPENAI_API_KEY=your_openai_api_key
```

Optional: set a different model if needed:

```env
OPENAI_MODEL=gpt-4o-mini
```

You can then call:

```text
GET /horses/{horse_id}/summary
```

If no OpenAI key is configured, the API will return a heuristic summary based on the horse's race history.

Interactive API documentation is available at:

```text
http://localhost:8000/docs
```

Note: Database tables are created automatically when the backend starts.


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
