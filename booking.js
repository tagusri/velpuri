
const bookingDate = document.getElementById("bookingDate");

function getLocalDate() {
    const now = new Date();

    return [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0")
    ].join("-");
}

bookingDate.min = getLocalDate();

document.getElementById("bookingForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const message = document.getElementById("bookingMessage");
    const form = this;

    if (bookingDate.value < getLocalDate()) {
        message.textContent = "Please select today or a future date.";
        message.style.color = "#b3261e";
        return;
    }

    const data = new FormData(form);

    // Demo reference only. Real confirmation requires backend availability checks.
    const reference = "CC" + Date.now().toString().slice(-8);

    const details = {
        confirmReference: reference,
        confirmName: data.get("customerName"),
        confirmBranch: data.get("branch"),
        confirmGuests: data.get("guests") === "11+"
            ? "More than 10 people"
            : data.get("guests") + (data.get("guests") === "1" ? " person" : " people"),
        confirmDate: data.get("bookingDate"),
        confirmTime: document.getElementById("bookingTime").selectedOptions[0].textContent,
        confirmMeal: data.get("mealPeriod"),
        confirmTable: data.get("tableType"),
        confirmOccasion: data.get("occasion")
    };

    for (const [id, value] of Object.entries(details)) {
        document.getElementById(id).textContent = value || "Not specified";
    }

    document.getElementById("bookingConfirmation").hidden = false;
    document.getElementById("bookingConfirmation").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    message.textContent =
        "Demo booking summary created. Actual table availability has not been verified.";
    message.style.color = "#6b3516";
});

document.getElementById("feedbackForm").addEventListener("submit", function(event) {
    event.preventDefault();

    document.getElementById("feedbackMessage").textContent =
        "Thank you for sharing your experience with Crazy Cravings! " +
        "This demo has not saved your feedback to a database.";

    document.getElementById("feedbackMessage").style.color = "#6b3516";
});