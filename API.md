# Admin Dashboard API Documentation

Base URL: `VITE_API_BASE_URL` (e.g. `http://localhost:3000/api`)

All endpoints expect/return JSON. Auth uses Bearer token in `Authorization` header.

## Authentication

```
Authorization: Bearer <token>
```

---

## 1) Admin Login

**POST** `/auth/login`

Authenticate admin user and receive JWT token.

**Request Body**

```json
{
  "email": "admin@wakili.me",
  "password": "admin123"
}
```

**Response 200**

```json
{
  "token": "eyJhbGc...",
  "admin": {
    "id": "1",
    "name": "المشرف الرئيسي",
    "email": "admin@wakili.me",
    "role": "super_admin"
  }
}
```

---

## 2) Verify Session

**GET** `/auth/verify`

Verify current admin session and get admin info.

**Response 200**

(same as login response)

---

## 3) Logout

**POST** `/auth/logout`

Logout admin user and invalidate token.

**Request Body**

```json
{}
```

**Response 200**

```json
{
  "message": "تم تسجيل الخروج بنجاح"
}
```

---

## 4) Refresh Token

**POST** `/auth/refresh`

Refresh authentication token.

**Request Body**

```json
{}
```

**Response 200**

(same as login response)

---

## 5) Get Dashboard Overview

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

## 6) Get Dashboard Stats

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

## 7) Get Recent Activities

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

## 8) Get Account Status

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

## 10) Create Admin

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

## 11) Update Admin

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

## 12) Delete Admin

**DELETE** `/admins/{id}`

**Response 204**
(no content)

---

## Lawyer Verification Endpoints

---

## 13) Get Verification Requests

**GET** `/lawyer-verification?status=pending`

**Query Params**

- `status` (optional): `pending`, `approved`, `rejected`, or omit for all

**Response 200**

```json
[
  {
    "id": "1",
    "name": "أحمد محمد علي",
    "email": "ahmed@example.com",
    "phone": "+20 100 123 4567",
    "specialty": ["القانون الجنائي", "القانون التجاري"],
    "submittedAt": "2024-01-15",
    "status": "pending",
    "profileImage": "https://...",
    "bio": "محامي متخصص...",
    "location": {
      "country": "مصر",
      "city": "القاهرة"
    },
    "yearsExperience": 10,
    "sessionTypes": ["مكتب", "هاتف"],
    "education": [
      {
        "degreeType": "بكالوريوس",
        "fieldOfStudy": "القانون",
        "university": "جامعة القاهرة",
        "graduationYear": "2012"
      }
    ],
    "certifications": [
      {
        "name": "شهادة التحكيم التجاري الدولي",
        "issuingOrg": "مركز القاهرة للتحكيم",
        "yearObtained": "2018",
        "documentUrl": "https://..."
      }
    ],
    "workExperience": [
      {
        "jobTitle": "محامي رئيسي",
        "organization": "مكتب العدالة للمحاماة",
        "startYear": "2018",
        "endYear": "",
        "isCurrent": true,
        "description": "إدارة القضايا..."
      }
    ],
    "documents": {
      "governmentId": true,
      "governmentIdUrl": "https://...",
      "professionalLicense": true,
      "professionalLicenseUrl": "https://...",
      "identityVerification": true,
      "educationCertificates": [
        {
          "name": "شهادة البكالوريوس",
          "url": "https://...",
          "type": "pdf",
          "uploadedAt": "2024-01-10"
        }
      ]
    },
    "licenseNumber": "12345",
    "issuingAuthority": "نقابة المحامين المصرية",
    "licenseYear": "2012",
    "barNumber": "12345"
  }
]
```

---

## 10) Get Single Verification Request

**GET** `/lawyer-verification/{id}`

**Response 200**
(same structure as above for single request)

---

## 15) Approve Verification

**POST** `/lawyer-verification/{id}/approve`

**Request Body**

```json
{
  "notes": "تم التحقق من جميع الوثائق"
}
```

**Response 200**

```json
{
  "id": "1",
  "status": "approved"
  // ... rest of verification request
}
```

---

## 16) Reject Verification

**POST** `/lawyer-verification/{id}/reject`

**Request Body**

```json
{
  "reason": "الوثائق المرفقة غير صحيحة"
}
```

**Response 200**

```json
{
  "id": "1",
  "status": "rejected"
  // ... rest of verification request
}
```

---

## 17) Search Verification Requests

**GET** `/lawyer-verification/search?q=أحمد`

**Query Params**

- `q` (required): Search query (name, email, etc.)

**Response 200**
(array of matching verification requests)

---

## 18) Get Reviews

**GET** `/reviews`

Get all reviews with optional status filter.

**Query Params**

- `status` (optional): `visible`, `hidden`, `flagged`, or omit for all

**Response 200**

```json
[
  {
    "id": "1",
    "clientName": "محمد أحمد",
    "lawyerName": "أحمد محمد علي",
    "rating": 5,
    "content": "محامي ممتاز ومتعاون جداً...",
    "createdAt": "2024-01-15",
    "status": "visible"
  }
]
```

---

## 19) Get Review Stats

**GET** `/reviews/stats`

Get review moderation statistics.

**Response 200**

```json
{
  "totalReviews": 124,
  "visibleReviews": 110,
  "flaggedReviews": 8,
  "hiddenReviews": 6
}
```

---

## 16) Get Single Review

**GET** `/reviews/{id}`

Get a single review by ID.

**Response 200**

```json
{
  "id": "1",
  "clientName": "محمد أحمد",
  "lawyerName": "أحمد محمد علي",
  "rating": 5,
  "content": "محامي ممتاز...",
  "createdAt": "2024-01-15",
  "status": "visible"
}
```

---

## 21) Update Review Status

**PATCH** `/reviews/{id}/status`

Update review visibility status.

**Request Body**

```json
{
  "status": "hidden"
}
```

**Response 200**

```json
{
  "id": "1",
  "status": "hidden"
}
```

---

## 18) Approve Flagged Review

**POST** `/reviews/{id}/approve`

Approve a flagged review (marks as visible and removes flag).

**Request Body**

```json
{}
```

**Response 200**

```json
{
  "id": "1",
  "status": "visible",
  "flagReason": null
}
```

---

## 23) Delete Review

**DELETE** `/reviews/{id}`

Permanently delete a review.

**Response 204**

No content

---

## 24) Search Reviews

**GET** `/reviews/search?q=أحمد`

Search reviews by client name, lawyer name, or content.

**Query Params**

- `q` (required): Search query

**Response 200**

(array of matching reviews)

---

## 25) Get Reviews For Lawyer

**GET** `/reviews/lawyer/{lawyerId}`

Get all reviews for a specific lawyer.

**Response 200**

(array of reviews for the lawyer)

---

## 26) Get Users

**GET** `/users`

Get all users with optional type filter.

**Query Params**

- `type` (optional): `client` or `lawyer`

**Response 200**

```json
[
  {
    "id": "1",
    "name": "محمد أحمد علي",
    "email": "mohamed@example.com",
    "type": "client",
    "status": "active",
    "createdAt": "2024-01-01",
    "lastActive": "2024-01-15",
    "totalAppointments": 5
  }
]
```

---

## 27) Get User Stats

**GET** `/users/stats`

Get user management statistics.

**Response 200**

```json
{
  "totalUsers": 247,
  "totalClients": 150,
  "totalLawyers": 97,
  "suspendedUsers": 12
}
```

---

## 24) Get Single User

**GET** `/users/{id}`

Get a single user by ID.

**Response 200**

```json
{
  "id": "1",
  "name": "محمد أحمد علي",
  "email": "mohamed@example.com",
  "type": "client",
  "status": "active",
  "createdAt": "2024-01-01",
  "lastActive": "2024-01-15",
  "totalAppointments": 5
}
```

---

## 29) Suspend User

**POST** `/users/{id}/suspend`

Suspend a user account.

**Request Body**

```json
{
  "reason": "انتهاك قواعس المنصة"
}
```

**Response 200**

```json
{
  "id": "1",
  "status": "suspended"
}
```

---

## 30) Reinstate User

**POST** `/users/{id}/reinstate`

Reinstate/Unsuspend a user account.

**Request Body**

```json
{}
```

**Response 200**

```json
{
  "id": "1",
  "status": "active"
}
```

---

## 31) Search Users

**GET** `/users/search?q=محمد`

Search users by name or email.

**Query Params**

- `q` (required): Search query

**Response 200**

(array of matching users)

---

## 32) Get Suspended Users

**GET** `/users/suspended`

Get all suspended users.

**Response 200**

(array of suspended users)

---

## 33) Get Credentials

**GET** `/credentials?status=pending`

Get all credentials with optional status filter.

**Query Params**

- `status` (optional): pending | approved | rejected

**Response 200**

(array of credentials)

```json
[
  {
    "id": "1",
    "lawyerId": "1",
    "lawyerName": "د. أحمد سليمان",
    "lawyerImage": "https://...",
    "type": "education",
    "submittedAt": "2024-12-01",
    "status": "pending",
    "degree": "دكتوراه",
    "field": "القانون الدولي",
    "university": "جامعة الأزهر",
    "year": "2023",
    "diplomaUrl": "#diploma-doc"
  }
]
```

---

## 34) Get Credential Stats

**GET** `/credentials/stats`

Get credential review statistics.

**Response 200**

```json
{
  "totalCredentials": 150,
  "pendingCredentials": 25,
  "approvedCredentials": 110,
  "rejectedCredentials": 15
}
```

---

## 31) Get Single Credential

**GET** `/credentials/{id}`

Get a single credential by ID.

**Response 200**

(single credential object)

---

## 36) Approve Credential

**POST** `/credentials/{id}/approve`

Approve a credential submission.

**Request Body**

```json
{}
```

**Response 200**

```json
{
  "id": "1",
  "status": "approved"
}
```

---

## 37) Reject Credential

**POST** `/credentials/{id}/reject`

Reject a credential submission with reason.

**Request Body**

```json
{
  "reason": "المستند غير واضح"
}
```

**Response 200**

```json
{
  "id": "1",
  "status": "rejected"
}
```

---

## 38) Search Credentials

**GET** `/credentials/search?q=أحمد`

Search credentials by lawyer name or credential details.

**Query Params**

- `q` (required): Search query

**Response 200**

(array of matching credentials)

---

## 39) Get Credentials By Type

**GET** `/credentials/type/{type}`

Get credentials filtered by type.

**Path Params**

- `type`: education | certificate | experience

**Response 200**

(array of credentials of specified type)

---

## Errors

**Response 4xx/5xx**

```json
{
  "message": "Error message",
  "error": "Optional error detail"
}
```
