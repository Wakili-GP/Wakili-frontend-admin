# Admin Dashboard API Documentation

Base URL: `VITE_API_BASE_URL` (e.g. `http://localhost:3000/api`)

All endpoints expect/return JSON. Auth uses Bearer token in `Authorization` header.

## Authentication

```
Authorization: Bearer <token>
```

---

## 1) Get Dashboard Overview

**GET** `/dashboard`

Returns all dashboard data in one response.

**Response 200**
```json
{
  "stats": [
    {
      "title": "إجمالي المستخدمين",
      "value": 2847,
      "change": "+12%",
      "color": "from-blue-500 to-blue-600"
    }
  ],
  "recentActivities": [
    {
      "type": "verification",
      "message": "طلب توثيق جديد من المحامي أحمد محمد",
      "time": "منذ 5 دقائق",
      "status": "pending"
    }
  ],
  "notifications": [
    {
      "type": "email",
      "count": 45,
      "label": "رسائل مُرسلة اليوم"
    }
  ],
  "admins": [
    {
      "id": "1",
      "name": "المشرف الرئيسي",
      "email": "admin@wakili.me",
      "role": "super_admin",
      "createdAt": "2024-01-01",
      "status": "active"
    }
  ],
  "accountStatus": {
    "activeLawyers": 342,
    "pendingVerification": 23,
    "suspendedAccounts": 5
  }
}
```

---

## 2) Get Dashboard Stats

**GET** `/dashboard/stats`

**Response 200**
```json
[
  {
    "title": "إجمالي المستخدمين",
    "value": 2847,
    "change": "+12%",
    "color": "from-blue-500 to-blue-600"
  }
]
```

---

## 3) Get Recent Activities

**GET** `/dashboard/activities?limit=5`

**Query Params**
- `limit` (number, optional)

**Response 200**
```json
[
  {
    "type": "verification",
    "message": "طلب توثيق جديد من المحامي أحمد محمد",
    "time": "منذ 5 دقائق",
    "status": "pending"
  }
]
```

---

## 4) Get Account Status

**GET** `/dashboard/account-status`

**Response 200**
```json
{
  "activeLawyers": 342,
  "pendingVerification": 23,
  "suspendedAccounts": 5
}
```

---

## 5) Get Admins

**GET** `/admins`

**Response 200**
```json
[
  {
    "id": "1",
    "name": "المشرف الرئيسي",
    "email": "admin@wakili.me",
    "role": "super_admin",
    "createdAt": "2024-01-01",
    "status": "active"
  }
]
```

---

## 6) Create Admin

**POST** `/admins`

**Request Body**
```json
{
  "name": "أحمد محمد",
  "email": "ahmed@wakili.me",
  "password": "strongPassword",
  "role": "admin"
}
```

**Response 201**
```json
{
  "id": "2",
  "name": "أحمد محمد",
  "email": "ahmed@wakili.me",
  "role": "admin",
  "createdAt": "2024-03-15",
  "status": "active"
}
```

---

## 7) Update Admin

**PATCH** `/admins/{id}`

**Request Body** (partial)
```json
{
  "role": "moderator",
  "status": "inactive"
}
```

**Response 200**
```json
{
  "id": "2",
  "name": "أحمد محمد",
  "email": "ahmed@wakili.me",
  "role": "moderator",
  "createdAt": "2024-03-15",
  "status": "inactive"
}
```

---

## 8) Delete Admin

**DELETE** `/admins/{id}`

**Response 204**
(no content)

---

## Errors

**Response 4xx/5xx**
```json
{
  "message": "Error message",
  "error": "Optional error detail"
}
```
