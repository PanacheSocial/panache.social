# Panache

## About

Panache is an open-source social media, in the making.

## Features

> [!WARNING]
>
> Panache is a **Work In Progress**.
>
> We are working on a stable release, and we are looking for contributors to help us.

- Panache Social: Join the conversation, share your ideas.

## Technologies

- [AdonisJS V6](https://adonisjs.com)
- [TailwindCSS](https://tailwindcss.com)
- [InertiaJS](https://inertiajs.com)
- [React](https://react.dev)
- [ShadCN UI](https://ui.shadcn.com)
- [PostgreSQL](https://www.postgresql.org)

## FAQ

### Why is it called Panache?

> **Panache** (_noun, figurative_)
>
> An attitude blending nobility, elegance, grandeur, and flair.

We believe this name represents the initiative very well. ^^

### Is it truly open-source?

Yes, it is.

Panache is licensed under the [AGPL-3.0](https://github.com/panacheapp/panache/blob/main/LICENSE) license, which means you are free to use, modify, and distribute the source code as long as you provide the same rights to others.

In other words, you can use Panache for free when self-hosting, and you can also modify the source code to suit your needs. However, if you distribute the modified source code, you must also provide the same rights to others.

This license is approved by the [Free Software Foundation](https://www.gnu.org/licenses/license-list.html) and the [Open Source Initiative](https://opensource.org/licenses).

## Development

### Requirements

- [NodeJS + NPM](https://nodejs.org)
- [Docker](https://www.docker.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/PanacheCompany/panache

# Change directory
cd panache.so

# Install dependencies
npm install

# Set up a environment variables file
cp .env.example .env

# Generate a development application key
node ace generate:key

# Launch Docker compose services
docker compose up -d

# Run migrations
node ace migration:run

# Start development server
npm run dev
```
