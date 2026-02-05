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

## Lawyer Verification Endpoints

---

## 9) Get Verification Requests

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

## 11) Approve Verification

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
  "status": "approved",
  // ... rest of verification request
}
```

---

## 12) Reject Verification

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
  "status": "rejected",
  // ... rest of verification request
}
```

---

## 13) Search Verification Requests

**GET** `/lawyer-verification/search?q=أحمد`

**Query Params**
- `q` (required): Search query (name, email, etc.)

**Response 200**
(array of matching verification requests)

---

## Errors

**Response 4xx/5xx**
```json
{
  "message": "Error message",
  "error": "Optional error detail"
}
```
