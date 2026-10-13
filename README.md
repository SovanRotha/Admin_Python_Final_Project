# Admin Auth Frontend

This frontend expects a FastAPI backend running at the configured API base URL.

## Environment setup

Create a `.env` file in the project root with:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

The API base URL is used for login and registration:

- POST /api/v1/auth/register
- POST /api/v1/auth/login

The admin page includes a destination form matching the API fields: `name`, `country`, `country_code`, `description`, `image`, `currency`, `language`, `timezone`, `best_time`, and numeric `average_daily_cost`. The place form matches `destination_id`, `name`, `category`, `description`, `address`, `latitude`, `longitude`, `estimated_cost`, `opening_time`, `closing_time`, `best_time_to_visit`, `website`, `rating`, and `status`. These endpoints must enforce the admin allowlist on the backend.

The admin API client uses these controller-backed destination and place routes:

- GET, POST /api/v1/admin/destinations
- GET, PATCH /api/v1/admin/destinations/{destination_id}
- PATCH /api/v1/admin/destinations/{destination_id}/status
- GET, POST /api/v1/admin/places
- GET, PATCH /api/v1/admin/places/{place_id}

The FastAPI router must register these paths and protect them with the admin authorization dependency.

The backend must also enforce:

- user is registered
- user is active
- user email is in the configured admin allowlist

The app will not use a fake demo token anymore; it will only authenticate against the configured backend.
