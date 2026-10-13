# Admin Auth Frontend

This frontend expects a FastAPI backend running at the configured API base URL.

## Environment setup

Create a `.env` file in the project root with:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

This is used for the login and register requests:

- POST /api/v1/auth/register
- POST /api/v1/auth/login
- POST /api/v1/destinations
- POST /api/v1/places

The admin page includes a destination form matching the API fields: `name`, `country`, `country_code`, `description`, `image`, `currency`, `language`, `timezone`, `best_time`, and numeric `average_daily_cost`. The place form matches `destination_id`, `name`, `category`, `description`, `address`, `latitude`, `longitude`, `estimated_cost`, `opening_time`, `closing_time`, `best_time_to_visit`, `website`, `rating`, and `status`. These endpoints must enforce the admin allowlist on the backend.

The backend must also enforce:

- user is registered
- user is active
- user email is in the configured admin allowlist

The app will not use a fake demo token anymore; it will only authenticate against the configured backend.
