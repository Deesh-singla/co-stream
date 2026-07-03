"use client"
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  return (
    <div>
      <button onClick={() => router.push("/signin")}>signin</button>
      <button onClick={() => router.push("/signup")}>signup</button>
    </div>
  );
}
