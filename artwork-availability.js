(() => {
  // Update each artwork's status here; its gallery and detail page use this record.
  const artworks = {
    "BOS-001": { status: "NOT AVAILABLE", reason: "Artist's personal collection" },
    "BOS-002": { status: "NOT AVAILABLE", reason: "Artist's personal collection" },
    "BOS-003": { status: "NOT AVAILABLE", reason: "Artist's personal collection" },
    "BOS-004": { status: "NOT AVAILABLE", reason: "Artist's personal collection" },
    "BOS-005": { status: "AVAILABLE" },
    "BOS-006": { status: "AVAILABLE" },
    "BOS-007": { status: "AVAILABLE" },
    "BOS-008": { status: "AVAILABLE" },
    "BOS-009": { status: "AVAILABLE" },
    "BOS-010": { status: "AVAILABLE" },
    "BOS-011": { status: "AVAILABLE" },
    "ash-reliquary": { status: "NOT FOR SALE" },
    "ash-basin": { status: "AVAILABLE" },
    "ash-vessel": { status: "NOT AVAILABLE" },
    "ash-relic": { status: "AVAILABLE" },
    "cinder-vessel": { status: "AVAILABLE" },
    "jasper-hollow": { status: "AVAILABLE" },
    "frankie": { status: "AVAILABLE" },
    "pork-chop": { status: "AVAILABLE" },
    "tom": { status: "AVAILABLE" },
    "at-what-cost": { status: "AVAILABLE" },
    "enough": { status: "AVAILABLE" },
    "caldera-relic": { status: "AVAILABLE" },
    "sutured-basin": { status: "AVAILABLE" }
  };
  const statusOrder = { AVAILABLE: 0, SOLD: 1, "NOT AVAILABLE": 2, "NOT FOR SALE": 2 };

  const recordFor = (itemNumber) => {
    const record = artworks[itemNumber];
    if (!record) {
      console.error(`Missing artwork availability for ${itemNumber}.`);
    } else if (!Object.prototype.hasOwnProperty.call(statusOrder, record.status)) {
      console.error(`Invalid artwork availability status for ${itemNumber}: ${record.status}.`);
      return undefined;
    }
    return record;
  };

  document.querySelectorAll(".artwork-status[data-artwork-item]").forEach((statusElement) => {
    const itemNumber = statusElement.dataset.artworkItem;
    const record = recordFor(itemNumber);
    if (!record) return;

    statusElement.dataset.status = record.status;
    const label = statusElement.querySelector("span");
    if (label) {
      label.textContent = record.reason
        ? `${record.status} · ${record.reason.toUpperCase()}`
        : record.status;
    }

    if (record.status === "SOLD" || record.status === "NOT AVAILABLE") {
      const artworkTitle = document.querySelector("main h1")?.textContent.trim();
      const artworkReference = /^BOS-\d+$/.test(itemNumber) ? `${itemNumber} ${artworkTitle || ""}` : artworkTitle || itemNumber;
      const subject = `Enquiry about a similar piece to ${artworkReference}`.trim();
      document.querySelectorAll('a.artwork-enquiry[href^="mailto:"]').forEach((enquiryLink) => {
        enquiryLink.textContent = "Enquire about a similar piece";
        enquiryLink.href = `mailto:kk.artspace.au@gmail.com?subject=${encodeURIComponent(subject)}`;
      });
    }
  });

  document.querySelectorAll("[data-availability-detail]").forEach((detailElement) => {
    const itemNumber = detailElement.dataset.artworkItem;
    const record = recordFor(itemNumber);
    if (record) {
      const labels = { AVAILABLE: "Available", SOLD: "Sold", "NOT AVAILABLE": "Not available", "NOT FOR SALE": "Not for sale" };
      detailElement.textContent = record.reason && record.status === "NOT AVAILABLE"
        ? `${record.reason}; not available`
        : labels[record.status];
    }
  });

  document.querySelectorAll("#individual-sculptures .gallery[data-availability-sort]").forEach((gallery) => {
    const cards = [...gallery.querySelectorAll(":scope > .artwork")].map((card, index) => {
      const item = card.querySelector(".individual-card-link")?.dataset.artworkItem;
      return { card, item, record: recordFor(item), index };
    });
    if (cards.some(({ record }) => !record)) return;

    cards.sort((left, right) => {
      const rank = (status) => gallery.dataset.availabilitySort === "separate-not-for-sale" && status === "NOT FOR SALE"
        ? 3
        : statusOrder[status];
      const statusDifference = rank(left.record.status) - rank(right.record.status);
      if (statusDifference) return statusDifference;
      if (/^BOS-\d+$/.test(left.item) && /^BOS-\d+$/.test(right.item)) {
        return Number(left.item.slice(4)) - Number(right.item.slice(4));
      }
      return left.index - right.index;
    });
    cards.forEach(({ card }) => gallery.append(card));
  });
})();
