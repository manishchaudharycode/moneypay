import { Suspense } from "react";
import PayPage from "./PayPage";

export default function page() {
  return (
    <Suspense fallback="">
      <PayPage />
    </Suspense>
  );
}
