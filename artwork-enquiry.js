(() => {
  const title = document.querySelector("main h1")?.textContent.trim();
  if (!title) {
    console.error("Cannot set up artwork enquiries: artwork title is missing.");
    return;
  }

  document.querySelectorAll('a.artwork-enquiry[href^="mailto:"]').forEach((link, index) => {
    const mailto = link.getAttribute("href");
    const [recipient, query = ""] = mailto.split("?");
    const originalSubject = new URLSearchParams(query).get("subject");
    if (!originalSubject) {
      console.error("Cannot set up artwork enquiry: email subject is missing.", link);
      return;
    }

    const reference = originalSubject.match(/\bBOS-\d+\b/)?.[0];
    let subject;
    if (originalSubject.startsWith("Enquiry about a custom work")) {
      subject = `${originalSubject} inspired by ${title}`;
    } else if (originalSubject.startsWith("Enquiry about a similar piece to ")) {
      subject = `Enquiry about a similar piece to ${reference ? `${reference} ` : ""}${title}`;
    } else {
      subject = `Enquiry about ${reference ? `${reference} ` : ""}${title}`;
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = link.className;
    button.textContent = link.textContent;
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", `artwork-enquiry-options-${index}`);

    const options = document.createElement("div");
    options.className = "artwork-enquiry-options";
    options.id = `artwork-enquiry-options-${index}`;
    options.hidden = true;

    const suggested = document.createElement("a");
    const message = `Hello,\r\n\r\nI would like to enquire about:\r\n${subject.replace(/^Enquiry about /, "")}\r\n\r\nCould you please provide more information?\r\n\r\nThank you.`;
    suggested.href = `${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    suggested.textContent = "Use a suggested message";

    const own = document.createElement("a");
    own.href = `${recipient}?subject=${encodeURIComponent(subject)}`;
    own.textContent = "Write your own message";

    options.append(suggested, own);
    button.addEventListener("click", () => {
      options.hidden = !options.hidden;
      button.setAttribute("aria-expanded", String(!options.hidden));
    });
    link.replaceWith(button, options);
  });
})();
