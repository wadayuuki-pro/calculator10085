import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig"; // Firebase設定ファイルをインポート

export async function saveCalculation(expression: string, result: number) {
  try {
    const docRef = await addDoc(collection(db, "calculations"), {
      expression,
      result,
      timestamp: new Date()
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
