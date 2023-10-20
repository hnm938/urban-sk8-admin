import Swal from "sweetalert2";
import "animate.css";

export default function Popup(title, icon) {
  Swal.fire({
    html: `
      <div class="flex flex-row items-center justify-center gap-x-2">
        ${
          icon === "error"
            ? `<svg class="h-7 w-7 text-[var(--coral-1)]"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <circle cx="12" cy="12" r="10" />  <line x1="12" y1="8" x2="12" y2="12" />  <line x1="12" y1="16" x2="12.01" y2="16" /></svg>`
            : `<svg class="h-6 w-6 text-[var(--coral-1)]" viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />  <polyline points="22 4 12 14.01 9 11.01" /></svg>`
        }
        <h1 class="font-medium text-[var(--black-1)]">${title}</h1>
      </div>
    `,
    confirmButtonColor: "var(--coral-1)",
    cancelButtonColor: "var(--coral-1)",
    showConfirmButton: false,
    backdrop: false,
    timer: 1500,
    timerProgressBar: true,
    position: "top",
    showClass: {
      popup: "animate__animated animate__slideInDown",
    },
    hideClass: {
      popup: "animate__animated animate__slideOutUp",
    },
  });
};
