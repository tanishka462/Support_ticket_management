# API Reference

All responses use `{ success, data?, message? }`. Errors use `{ success:false, message }`.
Protected endpoints require `Authorization: Bearer <JWT>`.

## Authentication
| Method | Endpoint | Access | Body |
|---|---|---|---|
| POST | `/api/auth/register` | Public | `{name,email,password}` |
| POST | `/api/auth/login` | Public | `{email,password}` |
| GET | `/api/auth/me` | Authenticated | — |

Public registration always creates a `user`; admin role is assigned only by the seed script/manual trusted database operation.

## Tickets
| Method | Endpoint | Access | Notes |
|---|---|---|---|
| GET | `/api/tickets?page=1&limit=10&status=open&priority=high&q=login` | User/Admin | Users see own tickets; admins see all |
| POST | `/api/tickets` | User/Admin | Create ticket |
| GET | `/api/tickets/:id` | Owner/Admin | Ticket + comments |
| PATCH | `/api/tickets/:id` | Owner/Admin | Owner may edit only open tickets |
| DELETE | `/api/tickets/:id` | Owner/Admin | Owner may delete only open tickets |
| POST | `/api/tickets/:id/comments` | Owner/Admin | Add a comment |
| PATCH | `/api/tickets/:id/admin` | Admin | Update status and/or priority |

### Ticket create/update body
```json
{
  "title": "Unable to sign in",
  "description": "I receive an error after entering my credentials.",
  "category": "account",
  "priority": "high"
}
```
Allowed categories: `technical`, `billing`, `account`, `general`, `other`.
Allowed priorities: `low`, `medium`, `high`, `urgent`.
Allowed statuses: `open`, `in_progress`, `waiting_for_user`, `resolved`, `closed`.

## Dashboard
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/dashboard/stats` | Authenticated |
| GET | `/api/dashboard/notifications` | Authenticated |
| PATCH | `/api/dashboard/notifications/:id/read` | Owner |
| GET | `/api/dashboard/activity` | Admin |

## Event actions
- `ticket.created`
- `ticket.updated`
- `ticket.status_changed`
- `comment.added`
- `ticket.resolved`

Events persist an `ActivityLog` and create an in-app notification for the ticket owner when another actor performs the action.
