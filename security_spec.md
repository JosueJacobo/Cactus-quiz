# Security Specification: Cactáceas Photo-Quiz App

## 1. Data Invariants
1. **Exclusive Owner Write Access**: Only the verified owner account (`emiliojacobg@gmail.com` with `request.auth.token.email_verified == true` or registered in `/admins/$(request.auth.uid)`) may create, update, or delete documents in `/cactus_photos/{speciesId}`.
2. **Public Catalog Readability**: All users (including unauthenticated visitors playing the quiz) can read `/cactus_photos/{speciesId}` so custom photos loaded by the owner appear in the quiz and flashcards, provided `speciesId` is valid or `photoData` size meets schema bounds.
3. **Strict Schema & Volumetric Bounds**:
   - `speciesId`: string, 1..64 chars, matches `^[a-zA-Z0-9_\-]+$`, and must equal the document ID `speciesId`.
   - `scientificName`: string, 2..160 chars.
   - `photoData`: string, 0..750000 chars.
   - `notes`: optional string, 0..1000 chars.
   - `updatedBy`: string, 1..128 chars, must equal `request.auth.uid`.
   - `updatedAt`: timestamp, must equal `request.time`.
4. **Shadow Field Rejection**: Any payload containing undeclared keys is rejected via `.keys().hasOnly(...)`.

## 2. The "Dirty Dozen" Payloads
1. **Unauthenticated Create**: Guest tries to upload a photo to `/cactus_photos/sp_0001`. -> `PERMISSION_DENIED`
2. **Non-Admin Authenticated Write**: Logged-in user `intruder@gmail.com` tries to update `/cactus_photos/sp_0001`. -> `PERMISSION_DENIED`
3. **Unverified Admin Email Spoof**: User with `email: "emiliojacobg@gmail.com"` but `email_verified: false` attempts to write. -> `PERMISSION_DENIED`
4. **Shadow Field Injection on Create**: Admin sends `{ speciesId: "sp_0001", scientificName: "Carnegiea gigantea", photoData: "data:...", updatedBy: uid, updatedAt: SERVER_TIMESTAMP, isSuperAdmin: true }`. -> `PERMISSION_DENIED`
5. **Shadow Field Injection on Update**: Admin updates `photoData` along with an undeclared field `hacked: 1`. -> `PERMISSION_DENIED`
6. **UID Spoofing (`updatedBy`)**: Admin sends `updatedBy: "someone_else_uid"`. -> `PERMISSION_DENIED`
7. **Forged Client Timestamp (`updatedAt`)**: Admin sends a past or future timestamp instead of `request.time`. -> `PERMISSION_DENIED`
8. **Path-Payload ID Mismatch**: Admin writes to `/cactus_photos/sp_0001` with `speciesId: "sp_0002"`. -> `PERMISSION_DENIED`
9. **ID Poisoning Attack**: Path variable `speciesId` contains invalid characters or exceeds 64 chars. -> `PERMISSION_DENIED`
10. **Oversized Payload (Denial of Wallet)**: `photoData` exceeds 750,000 characters or `scientificName` exceeds 160 characters. -> `PERMISSION_DENIED`
11. **Type Confusion on Update**: Admin updates `notes` with a number or array instead of a string. -> `PERMISSION_DENIED`
12. **Self-Privilege Escalation in `/admins`**: Non-owner user attempts to create `/admins/{theirUid}`. -> `PERMISSION_DENIED`
