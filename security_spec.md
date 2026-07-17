# Security Specification: Free Cell Shop Database Rules

This document outlines the safety invariants, malicious payloads, and test blueprints used to target and harden our Firestore security configuration.

## 1. Data Invariants

We enforce strict data conditions on all Firestore writes to protect our e-commerce environment:
1. **User Ownership**: No user can read, create, or update another user's single Private User profile, Cart, or Order history. Carts and user details are partitioned by UID.
2. **Anonymous Rejection**: Unauthenticated visitors are permitted to submit contact messages, but only verified or authenticated users can update user profiles, checkout orders, and read carts.
3. **Immutability of Key Meta**: Fields such as `createdAt`, `userId`, `orderId` must remain immutable during updates.
4. **Sanitized Inputs**: All ID properties must conform to string checks (`size() <= 128` and matching alphanumeric-hyphen-underscore format). All rating values, totals, and quantities must be verified types.
5. **No Blind Global Updates**: Any update operation must be compartmentalized and vetted via exact schema limits (`affectedKeys()`).

---

## 2. The "Dirty Dozen" Payloads (Security Penetration Test Cases)

The following 12 payloads are designed to attack the system rules. Each query or write MUST return `PERMISSION_DENIED`:

### Case 1: ID Poisoning (Malicious Alphanumeric String)
*Target*: `/contactMessages/malicious%20ID%20with%20infinite%20spaces%20and%20very%20long%20characters%20to%20drain%20wallet`
*Action*: Create Contact message.
*Expected*: Reject (ID contains illegal spaces/size exceeds Limit).

### Case 2: Spoofed Creator UID
*Target*: `/users/attacker-uid`
*Payload*: `{ "userId": "victim-uid", "email": "victim@gmail.com", "displayName": "Attacker", "photoURL": "", "createdAt": "request.time", "updatedAt": "request.time" }`
*Expected*: Reject (displayName/email can't be registered under another user's UID path or `userId` mismatched with authenticated path variable).

### Case 3: Unauthorized Cart Hijacking
*Target*: `/carts/victim-uid`
*Action*: Read/Write cart as `attacker-uid`.
*Expected*: Reject (UID in path variable must match `request.auth.uid`).

### Case 4: Cart Malicious Expansion (Denial of Wallet)
*Target*: `/carts/attacker-uid`
*Payload*: Current user creates or updates with a listing containing 1500 elements or malicious text blocks.
*Expected*: Reject (Items array size must be bounded, e.g., `<= 100`).

### Case 5: Order State Shortcutting
*Target*: `/orders/order_123`
*Payload*: Normal user sets status directly to `completed` or `processed` without admin authority.
*Expected*: Reject (Normal users can only set order status to `pending` on creation, and status cannot be updated arbitrarily by non-admins).

### Case 6: Price Alteration / Negative Pricing
*Target*: `/orders/order_123`
*Payload*: User checks out with `totalAmount: -99.99` or sets `price` to a negative value.
*Expected*: Reject (Total check must enforce non-negative numbers).

### Case 7: PII Data Crawl
*Target*: `/users` (List query)
*Action*: Attacker lists all users without filtering.
*Expected*: Reject (Listing user profiles is forbidden to non-admins).

### Case 8: Contact Message Hijack (Update/Delete)
*Target*: `/contactMessages/msg_abc`
*Action*: Anyone tries to update or delete a submitted contact message.
*Expected*: Reject (Contact messages are write-only for visitors; updates/deletions are blocked).

### Case 9: Timestamp Spoofing
*Target*: `/orders/order1`
*Payload*: User provides `createdAt: "2015-01-01"` representing past time.
*Expected*: Reject (Timestamp must match `request.time`).

### Case 10: Ghost Field Injection (Shadow Update)
*Target*: `/users/user_uid`
*Payload*: Update profile with `{ "displayName": "Test", "isVerified": true, "isAdmin": true }` where `isAdmin` is a ghost field.
*Expected*: Reject (Keys list must match exact update profile fields or block RBAC privilege escalation).

### Case 11: Orphaned Orders
*Payload*: Create Order that references a projects or products that do not exist or mismatch schema.
*Expected*: Reject.

### Case 12: Anonymous Cart Manipulation
*Target*: `/carts/someId`
*Action*: Anonymous user attempts write without authentication credentials.
*Expected*: Reject (Write requires active auth).
