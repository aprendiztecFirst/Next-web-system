import { FirestoreAdapter as AuthFirebaseAdapter } from "@auth/firebase-adapter"
import type { Firestore } from "firebase-admin/firestore"

export default function FirestoreAdapter(db: Firestore) {
    const adapter = AuthFirebaseAdapter(db)

    return {
        ...adapter,
        async getUserByEmail(email: string) {
            const user = await adapter.getUserByEmail(email)
            if (!user) return null

            // Fill in accounts for compatibility with existing logic
            const accountsSnapshot = await db.collection("accounts")
                .where("userId", "==", user.id)
                .get()

            const accounts = accountsSnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))

            return {
                ...user,
                accounts
            }
        },
        // Ensure createUser also works as expected
        async createUser(user: any) {
            return await adapter.createUser(user)
        },
        async linkAccount(account: any) {
            return await adapter.linkAccount(account)
        }
    }
}
