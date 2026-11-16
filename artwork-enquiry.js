(() => {
  const title = document.querySelector("main h1")?.textContent.trim();
  if (!title) {
    console.error("Cannot set up artwork enquiries: artwork title is missing.");
    return;
  }

  const dialog = document.createElement("dialog");
  dialog.className = "enquiry-dialog";
  dialog.setAttribute("aria-labelledby", "enquiry-dialog-title");
  dialog.setAttribute("aria-describedby", "enquiry-dialog-message");

  const heading = document.createElement("h2");
  heading.id = "enquiry-dialog-title";
  heading.textContent = "Enquire about this work";

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "enquiry-dialog-close";
  closeButton.textContent = "Close";
  closeButton.setAttribute("aria-label", "Close enquiry dialog");
  closeButton.addEventListener("click", () => dialog.close());

  const introduction = document.createElement("p");
  introduction.className = "enquiry-dialog-intro";
  introduction.textContent = "Suggested message";

  const messagePreview = document.createElement("p");
  messagePreview.id = "enquiry-dialog-message";
  messagePreview.className = "enquiry-dialog-message";

  const actions = document.createElement("div");
  actions.className = "enquiry-dialog-actions";
  const suggested = document.createElement("a");
  suggested.className = "enquiry-dialog-action";
  suggested.textContent = "Use this message";
  const own = document.createElement("a");
  own.className = "enquiry-dialog-action enquiry-dialog-action-secondary";
  own.textContent = "Write my own message";
  actions.append(suggested, own);

  dialog.append(closeButton, heading, introduction, messagePreview, actions);
  document.body.append(dialog);

  document.querySelectorAll('a.artwork-enquiry[href^="mailto:"]').forEach((link) => {
    const mailto = link.getAttribute("href");
    const [recipient, query = ""] = mailto.split("?");
    const originalSubject = new URLSearchParams(query).get("subject");
    if (!originalSubject) {
      console.error("Cannot set up artwork enquiry: email subject is missing.", link);
      return;
    }

    const reference = originalSubject.match(/\bBOS-\d+\b/)?.[0];
    let subject;
    let messageDetail;
    if (originalSubject.startsWith("Enquiry about a custom work")) {
      subject = `${originalSubject} inspired by ${title}`;
      messageDetail = `I'm interested in a custom work inspired by ${title} and would like to know more about commissioning a piece.`;
    } else if (originalSubject.startsWith("Enquiry about a similar piece to ")) {
      subject = `Enquiry about a similar piece to ${reference ? `${reference} ` : ""}${title}`;
      messageDetail = `I'm interested in a piece similar to ${title} and would like to know more about purchasing a similar artwork.`;
    } else {
      subject = `Enquiry about ${reference ? `${reference} ` : ""}${title}`;
      const artworkType = link.textContent.includes("pairing") ? "pairing" : "artwork";
      messageDetail = `I'm interested in ${title} and would like to know more about purchasing this ${artworkType}.`;
    }
    const message = `Hello,\r\n\r\n${messageDetail}\r\n\r\nThank you.`;

    const button = document.createElement("button");
    button.type = "button";
    button.className = link.className;
    button.textContent = link.textContent;
    button.setAttribute("aria-haspopup", "dialog");
    button.addEventListener("click", () => {
      heading.textContent = button.textContent;
      messagePreview.textContent = message;
      suggested.href = `${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      own.href = `${recipient}?subject=${encodeURIComponent(subject)}`;
      dialog.showModal();
    });
    link.replaceWith(button);
  });
})();
