# Supabase REST API Documentation
**Project:** Directroy_Apps · ArthaFreestyle's Org
**Base URL:** `https://xaeudnpyvixevxjuslxt.supabase.co/rest/v1/`
**Project ID:** `xaeudnpyvixevxjuslxt`
**Auth Header:** `apikey` + `Authorization: Bearer`
**Version:** v1 (PostgREST)
**Generated:** 22 May 2026

---

## Table of Contents

1. [Authentication & Headers](#1-authentication--headers)
2. [Database Schema Overview](#2-database-schema-overview)
3. [Endpoints — units](#3-endpoints--units)
4. [Endpoints — buildings](#4-endpoints--buildings)
5. [Endpoints — categories](#5-endpoints--categories)
6. [Endpoints — unit_rooms](#6-endpoints--unit_rooms)
7. [Endpoints — unit_image](#7-endpoints--unit_image)
8. [Endpoints — reviews](#8-endpoints--reviews)
9. [Endpoints — admin_profiles](#9-endpoints--admin_profiles)
10. [Endpoints — audit_logs](#10-endpoints--audit_logs)
11. [Filtering, Ordering & Pagination](#11-filtering-ordering--pagination)
12. [Error Codes](#12-error-codes)

---

## 1. Authentication & Headers

Every request must include two headers: `apikey` and `Authorization`. The API key acts as your project identifier, while `Authorization` carries the bearer token (use the same key for anonymous/public access, or a user JWT for authenticated requests).

### Required Headers

| Header | Value | Required | Notes |
|--------|-------|----------|-------|
| `apikey` | `sb_publishable_de5hAR2u...` | Yes | Your Supabase publishable API key |
| `Authorization` | `Bearer <token>` | Yes | Same key for anon; user JWT for auth |
| `Content-Type` | `application/json` | POST/PATCH | Required when sending a body |
| `Prefer` | `return=representation` | No | Returns inserted/updated row |
| `Range` | `0-9` | No | Pagination range header |

### Example cURL

```bash
curl -X GET \
  "https://xaeudnpyvixevxjuslxt.supabase.co/rest/v1/units?select=*" \
  -H "apikey: sb_publishable_de5hAR2uJwkfeBQt2pX-jQ_B95Ym7hv" \
  -H "Authorization: Bearer sb_publishable_de5hAR2uJwkfeBQt2pX-jQ_B95Ym7hv"
```

### JavaScript (Supabase Client)

```js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xaeudnpyvixevxjuslxt.supabase.co',
  'sb_publishable_de5hAR2uJwkfeBQt2pX-jQ_B95Ym7hv'
)

// Example query
const { data, error } = await supabase
  .from('units')
  .select('*')
```

---

## 2. Database Schema Overview

The database consists of 8 tables. The central entity is `units`, which belongs to a building and a category. Each unit can have multiple images, rooms, and reviews. Admin activity is tracked via `audit_logs`.

| Table | Primary Key | Foreign Keys | Description |
|-------|-------------|--------------|-------------|
| `units` | `id` (int4) | `building_id → buildings`, `category_id → categories` | Core listing entity with geo, hours, rating |
| `buildings` | `id` (int8) | — | Physical building with coordinates & floor count |
| `categories` | `id` (int4) | — | Unit categories (slug, icon, description) |
| `unit_rooms` | `id` (int4) | `unit_id → units` | Individual rooms inside a unit |
| `unit_image` | `id` (int8) | `unit_id → units` | Images attached to a unit |
| `reviews` | `id` (int4) | `unit_id → units`, `user_id → auth.users` | User reviews with rating |
| `admin_profiles` | `id` (uuid) | `→ auth.users` | Admin user roles and status |
| `audit_logs` | `id` (int8) | `admin_id → auth.users` | Admin action audit trail |

---

## 3. Endpoints — units

The `units` table stores the primary listings.
**Base URL:** `.../rest/v1/units`

### Fields

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | int4 | No | Primary key (auto-increment) |
| `category_id` | int4 | Yes | FK → categories.id |
| `building_id` | int4 | Yes | FK → buildings.id |
| `name` | varchar | Yes | Full unit name |
| `short_name` | varchar | Yes | Short display name |
| `floor` | varchar | Yes | Floor location in building |
| `lat` | numeric | Yes | Latitude coordinate |
| `lng` | numeric | Yes | Longitude coordinate |
| `address` | text | Yes | Physical address |
| `description` | text | Yes | Long description |
| `open_hours` | time | Yes | Opening time |
| `close_hours` | time | Yes | Closing time |
| `rating` | numeric | Yes | Avg rating (computed/stored) |
| `rating_count` | int4 | Yes | Total number of reviews |
| `photo_url` | varchar | Yes | Cover photo URL |
| `is_published` | bool | Yes | Visibility flag |
| `created_at` | timestamptz | Yes | Creation timestamp |
| `updated_at` | timestamptz | Yes | Last update timestamp |

### Endpoints

#### `GET /rest/v1/units?select=*`
Retrieve all units. Add filters via query params.

```
?select=id,name,rating,is_published&is_published=eq.true&order=rating.desc
```

```json
[
  {
    "id": 1,
    "name": "Kafe Lantai 2",
    "rating": 4.5,
    "is_published": true
  }
]
```

#### `GET /rest/v1/units?id=eq.{id}`
Retrieve a single unit by its primary key.

```
?select=*&id=eq.1
```

```json
[{
  "id": 1,
  "name": "Kafe Lantai 2",
  "building_id": 3,
  "category_id": 2,
  "floor": "2",
  "is_published": true
}]
```

#### `GET /rest/v1/units?select=*,buildings(*),categories(*)`
Retrieve units with nested building and category data (join).

```json
[{
  "id": 1,
  "name": "...",
  "buildings": {"id": 3, "name": "Gedung A"},
  "categories": {"id": 2, "name": "Food & Beverage"}
}]
```

#### `POST /rest/v1/units`
Create a new unit. Requires `Content-Type` and `Prefer` headers.

```json
{
  "name": "Toko Baru",
  "building_id": 1,
  "category_id": 2,
  "floor": "3",
  "is_published": false
}
```

Response:
```json
[{
  "id": 42,
  "name": "Toko Baru",
  "is_published": false
}]
```

#### `PATCH /rest/v1/units?id=eq.{id}`
Update an existing unit by ID.

```json
{
  "is_published": true,
  "rating": 4.8
}
```

Response:
```json
[{
  "id": 42,
  "is_published": true,
  "rating": 4.8
}]
```

#### `DELETE /rest/v1/units?id=eq.{id}`
Delete a unit by ID. Returns `204 No Content` on success.

---

## 4. Endpoints — buildings

The `buildings` table stores physical building metadata.
**Base URL:** `.../rest/v1/buildings`

### Fields

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | int8 | No | Primary key |
| `code` | varchar | Yes | Short building code |
| `name` | varchar | Yes | Building name |
| `lat` | numeric | Yes | Latitude |
| `lng` | numeric | Yes | Longitude |
| `floors` | int2 | Yes | Number of floors |
| `created_at` | timestamptz | Yes | Created timestamp |
| `updated_at` | timestamptz | Yes | Updated timestamp |

### Endpoints

#### `GET /rest/v1/buildings?select=*`
Retrieve all buildings.

```json
[{"id": 1, "code": "GDA", "name": "Gedung A", "floors": 5}]
```

#### `GET /rest/v1/buildings?id=eq.{id}`
Retrieve one building by ID.

#### `POST /rest/v1/buildings`
Create a new building.

```json
{"code": "GDB", "name": "Gedung B", "lat": -7.25, "lng": 112.75, "floors": 4}
```

#### `PATCH /rest/v1/buildings?id=eq.{id}`
Update a building.

```json
{"floors": 6}
```

#### `DELETE /rest/v1/buildings?id=eq.{id}`
Delete a building.

---

## 5. Endpoints — categories

Unit categories (e.g. Food, Retail, Services).
**Base URL:** `.../rest/v1/categories`

### Fields

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | int4 | No | Primary key |
| `name` | varchar | Yes | Category display name |
| `slug` | varchar | Yes | URL-friendly identifier |
| `icon` | varchar | Yes | Icon identifier / URL |
| `description` | text | Yes | Category description |
| `created_at` | timestamptz | Yes | Created timestamp |
| `updated_at` | timestamptz | Yes | Updated timestamp |

### Endpoints

#### `GET /rest/v1/categories?select=*`
List all categories.

```json
[{"id": 1, "name": "Food & Beverage", "slug": "food-beverage"}]
```

#### `GET /rest/v1/categories?slug=eq.{slug}`
Find category by slug.

```
?slug=eq.food-beverage
```

#### `POST /rest/v1/categories`
Create a category.

```json
{"name": "Retail", "slug": "retail", "icon": "shopping-bag"}
```

#### `PATCH /rest/v1/categories?id=eq.{id}`
Update a category.

#### `DELETE /rest/v1/categories?id=eq.{id}`
Delete a category.

---

## 6. Endpoints — unit_rooms

Rooms or sub-spaces within a unit.
**Base URL:** `.../rest/v1/unit_rooms`

### Fields

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | int4 | No | Primary key |
| `unit_id` | int4 | Yes | FK → units.id |
| `name` | varchar | Yes | Room name |
| `location` | varchar | Yes | Location description |
| `sort_order` | int2 | Yes | Display order |
| `created_at` | timestamptz | Yes | Created timestamp |

### Endpoints

#### `GET /rest/v1/unit_rooms?unit_id=eq.{unit_id}`
Get all rooms for a specific unit.

```
?unit_id=eq.1&order=sort_order.asc
```

```json
[{"id": 1, "unit_id": 1, "name": "Room A", "location": "Lt. 2", "sort_order": 1}]
```

#### `POST /rest/v1/unit_rooms`
Add a room to a unit.

```json
{"unit_id": 1, "name": "Room B", "location": "Lt. 2", "sort_order": 2}
```

#### `PATCH /rest/v1/unit_rooms?id=eq.{id}`
Update a room.

#### `DELETE /rest/v1/unit_rooms?id=eq.{id}`
Delete a room.

---

## 7. Endpoints — unit_image

Gallery images associated with a unit.
**Base URL:** `.../rest/v1/unit_image`

### Fields

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | int8 | No | Primary key |
| `created_at` | timestamptz | Yes | Upload timestamp |
| `image_url` | text | Yes | Public image URL |
| `unit_id` | int4 | Yes | FK → units.id |

### Endpoints

#### `GET /rest/v1/unit_image?unit_id=eq.{unit_id}`
Get all images for a unit.

```
?unit_id=eq.1&select=id,image_url,created_at
```

```json
[{"id": 10, "image_url": "https://...", "created_at": "2025-01-01T00:00:00Z"}]
```

#### `POST /rest/v1/unit_image`
Upload image record for a unit.

```json
{"unit_id": 1, "image_url": "https://storage.example.com/img.jpg"}
```

#### `DELETE /rest/v1/unit_image?id=eq.{id}`
Remove an image record.

---

## 8. Endpoints — reviews

User reviews with ratings for units.
**Base URL:** `.../rest/v1/reviews`

### Fields

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | int4 | No | Primary key |
| `unit_id` | int4 | Yes | FK → units.id |
| `user_id` | varchar | Yes | FK → auth.users.id |
| `rating` | int2 | Yes | Rating 1–5 |
| `comment` | text | Yes | Review text |
| `created_at` | timestamptz | Yes | Review timestamp |

### Endpoints

#### `GET /rest/v1/reviews?unit_id=eq.{unit_id}`
Get all reviews for a unit, ordered by newest first.

```
?unit_id=eq.1&order=created_at.desc
```

```json
[{"id": 5, "unit_id": 1, "rating": 5, "comment": "Bagus!"}]
```

#### `GET /rest/v1/reviews?user_id=eq.{user_id}`
Get all reviews written by a specific user.

#### `POST /rest/v1/reviews`
Submit a new review (requires user auth token).

```json
{
  "unit_id": 1,
  "user_id": "uuid-of-user",
  "rating": 4,
  "comment": "Tempatnya nyaman"
}
```

#### `DELETE /rest/v1/reviews?id=eq.{id}`
Delete a review.

---

## 9. Endpoints — admin_profiles

Admin user profiles linked to Supabase Auth users.
**Base URL:** `.../rest/v1/admin_profiles`

### Fields

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | uuid | No | PK + FK → auth.users.id |
| `role` | admin_role | Yes | Enum role (e.g. superadmin, editor) |
| `is_active` | bool | Yes | Whether admin account is active |
| `created_at` | timestamptz | Yes | Created timestamp |
| `updated_at` | timestamptz | Yes | Updated timestamp |

### Endpoints

#### `GET /rest/v1/admin_profiles?select=*`
List all admin profiles _(restricted — requires service key or RLS policy)_.

```json
[{"id": "uuid", "role": "superadmin", "is_active": true}]
```

#### `GET /rest/v1/admin_profiles?id=eq.{uuid}`
Get a single admin profile by UUID.

#### `PATCH /rest/v1/admin_profiles?id=eq.{uuid}`
Update admin role or active status.

```json
{"is_active": false}
```

---

## 10. Endpoints — audit_logs

Immutable audit trail of admin actions. Typically read-only via API.
**Base URL:** `.../rest/v1/audit_logs`

### Fields

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | int8 | No | Primary key |
| `admin_id` | uuid | Yes | FK → auth.users.id (who acted) |
| `action` | varchar | Yes | Action type (e.g. CREATE, UPDATE, DELETE) |
| `entity` | varchar | Yes | Table/entity name affected |
| `entity_id` | int4 | Yes | ID of the affected row |
| `diff_json` | jsonb | Yes | Before/after diff in JSON |
| `ip` | varchar | Yes | Request IP address |
| `user_agent` | varchar | Yes | Browser / client user-agent |
| `created_at` | timestamptz | Yes | When the action occurred |

### Endpoints

#### `GET /rest/v1/audit_logs?select=*&order=created_at.desc`
List recent audit logs, newest first.

```
?limit=50&order=created_at.desc&entity=eq.units
```

```json
[{"id": 99, "action": "UPDATE", "entity": "units", "entity_id": 1}]
```

#### `GET /rest/v1/audit_logs?admin_id=eq.{uuid}`
Get all audit entries for a specific admin user.

---

## 11. Filtering, Ordering & Pagination

PostgREST supports expressive URL-based filtering, sorting, and pagination. Combine these on any endpoint.

### Filter Operators

| Operator | SQL Equivalent | Example |
|----------|---------------|---------|
| `eq` | `=` (equals) | `?rating=eq.5` |
| `neq` | `!=` (not equals) | `?is_published=neq.false` |
| `gt` | `>` (greater than) | `?rating=gt.3` |
| `gte` | `>=` (greater or equal) | `?rating=gte.4` |
| `lt` | `<` (less than) | `?rating_count=lt.100` |
| `lte` | `<=` (less or equal) | `?floors=lte.5` |
| `like` | `LIKE` (case-sensitive) | `?name=like.*Kafe*` |
| `ilike` | `ILIKE` (case-insensitive) | `?name=ilike.*kafe*` |
| `in` | `IN` list | `?id=in.(1,2,3)` |
| `is` | `IS NULL / IS TRUE` | `?photo_url=is.null` |
| `not` | Negate operator | `?is_published=not.eq.false` |

### Select & Join

```
# Select specific columns
GET /rest/v1/units?select=id,name,rating

# Join related table
GET /rest/v1/units?select=*,buildings(id,name,floors)

# Nested join
GET /rest/v1/units?select=*,buildings(*),categories(*),unit_image(image_url)
```

### Ordering

```
# Order by rating descending
GET /rest/v1/units?order=rating.desc

# Multiple sort keys
GET /rest/v1/units?order=building_id.asc,rating.desc
```

### Pagination

```bash
# Using Range header (0-indexed, inclusive)
curl -H "Range: 0-9"   # first 10 rows
curl -H "Range: 10-19" # rows 11–20

# Using query params
GET /rest/v1/units?limit=10&offset=0
GET /rest/v1/units?limit=10&offset=10
```

### Count

```bash
# Get total count with Prefer header
curl -H "Prefer: count=exact" \
  "https://xaeudnpyvixevxjuslxt.supabase.co/rest/v1/units?select=*"

# Response includes header:
# Content-Range: 0-9/247
```

---

## 12. Error Codes

| HTTP Status | Meaning | Common Cause |
|-------------|---------|--------------|
| `200` | OK | Successful GET request |
| `201` | Created | POST with `Prefer: return=representation` |
| `204` | No Content | DELETE or PATCH without `Prefer` header |
| `400` | Bad Request | Wrong operator or malformed JSON |
| `401` | Unauthorized | `apikey` or `Authorization` header missing |
| `403` | Forbidden | Row-Level Security denies access |
| `404` | Not Found | Typo in table name or table not exposed |
| `409` | Conflict | Duplicate key or constraint error |
| `422` | Unprocessable | FK mismatch, NOT NULL, check constraint |
| `500` | Internal Error | Database error — check Supabase logs |

### Error Response Shape

```json
{
  "code": "42P01",
  "details": null,
  "hint": null,
  "message": "relation \"public.unit\" does not exist"
}
```

### RLS Note

> All tables have **Row-Level Security (RLS)** enabled by default in Supabase. If you receive 0 rows or a `403`, ensure your API key has the appropriate policy or switch to a service-role key (**never expose it on the client**).
