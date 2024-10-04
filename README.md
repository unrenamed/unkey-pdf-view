# Time-Sensitive API Keys for Digital Content Access

Leverage Unkey’s short-lived keys to grant temporary access to digital content (e.g., e-books, videos, or streams), expiring after a set duration.

## Uniqueness

Many platforms lack simple time-based access controls or rely on complex, time-consuming setups. Unkey offers a quick, dynamic solution for trial versions, short-term access, or educational content management.

## Use Cases

Ideal for educational platforms, research papers, and subscription-based news services.

## Benefits

- **Security**: Content remains server-side, with access controlled by expiring API keys.
- **Control**: Easily revoke or limit access by managing key lifespans.
- **Scalability**: Suited for serverless or distributed systems.

## Demo App Overview

This demo provides time-limited access to specific pages of a PDF, without allowing full downloads. Each page request is authenticated with Unkey, ensuring access is controlled and expires as needed. The app streams individual PDF pages as users navigate through them.

## Quickstart

### Create a root key

1. Go to [/settings/root-keys](https://app.unkey.com/settings/root-key) and click on the "Create New Root Key" button.
2. Enter a name for the key.
3. Select the following workspace permissions: `create_key`, `read_key`, `encrypt_key` and `decrypt_key`.
4. Click "Create".

### Create your API

1. Go to [https://app.unkey.com/apis](https://app.unkey.com/apis) and click on the "Create New API" button.
2. Give it a name.
3. Click "Create".

### Set up the example

1. Clone the repository

```bash
git clone git@github.com:unrenamed/unkey-pdf-view
cd unkey-pdf-view
```

2. Install the dependencies

```bash
pnpm install
```

3. Create a `.env` or `.env.local` file and add the following:

```env
UNKEY_ROOT_KEY=your-root-key
UNKEY_EBOOK_API_ID=your-ebook-api-id
```

4. Start the server

```bash
pnpm dev
```

5. Open your browser and go to [http://localhost:3000](http://localhost:3000)
