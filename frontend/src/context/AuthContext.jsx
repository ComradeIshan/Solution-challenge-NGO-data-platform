import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";

// Inside your context:
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const snap = await getDoc(doc(db, "users", user.uid));
    const userData = snap.data();
    // userData.role will be "volunteer" or "ngo"
    // redirect accordingly
    if (userData.role === "ngo") navigate("/dashboard/ngo");
    else navigate("/dashboard/volunteer");
  }
});