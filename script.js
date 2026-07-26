const KLAVIYO_PUBLIC_KEY = "Ykdd5g";
const KLAVIYO_LIST_ID = "X67Rdi";

const notifyBtn = document.getElementById("notifyBtn");
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const notifyForm = document.getElementById("notifyForm");
const emailInput = document.getElementById("emailInput");
const modalError = document.getElementById("modalError");
const modalFormState = document.getElementById("modalFormState");
const modalSuccessState = document.getElementById("modalSuccessState");

function openModal() {
  modalOverlay.classList.add("is-open");
  emailInput.value = "";
  modalError.textContent = "";
  modalFormState.classList.remove("is-hidden");
  modalSuccessState.classList.add("is-hidden");
  emailInput.focus();
}

function closeModal() {
  modalOverlay.classList.remove("is-open");
}

notifyBtn.addEventListener("click", openModal);
modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

notifyForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();
  modalError.textContent = "";

  if (!email) {
    modalError.textContent = "Please enter your email.";
    return;
  }

  const submitBtn = notifyForm.querySelector(".modal-submit");
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  try {
    const response = await fetch(
      `https://a.klaviyo.com/client/subscriptions/?company_id=${KLAVIYO_PUBLIC_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          revision: "2024-10-15",
        },
        body: JSON.stringify({
          data: {
            type: "subscription",
            attributes: {
              profile: {
                data: {
                  type: "profile",
                  attributes: { email },
                },
              },
            },
            relationships: {
              list: {
                data: { type: "list", id: KLAVIYO_LIST_ID },
              },
            },
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Klaviyo request failed");
    }

    modalFormState.classList.add("is-hidden");
    modalSuccessState.classList.remove("is-hidden");
  } catch (err) {
    modalError.textContent = "Something went wrong. Please try again.";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Notify me";
  }
});
