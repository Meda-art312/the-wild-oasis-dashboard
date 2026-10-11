import { useState } from "react";
import supabase from "../services/supabase";
import Button from "../ui/Button";
import { subtractDates, getToday } from "../utils/helpers";
import { bookings } from "./data-bookings";
import { cabins } from "./data-cabins";
import { guests } from "./data-guests";

const cabinImages = import.meta.glob("./cabins/*.jpg", {
  eager: true,
  query: "?url",
  import: "default",
});

function check(result) {
  if (result.error) throw result.error;
  return result.data;
}

function matchesSamples(rows, samples) {
  return rows.length === samples.length && samples.every((sample) =>
    rows.some((row) => Object.entries(sample).every(([key, value]) => row[key] === value))
  );
}

export default function Uploader() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function uploadSamples() {
    setIsLoading(true);
    setMessage("");
    try {
      const [existingCabins, existingGuests, existingBookings] = await Promise.all([
        supabase.from("cabins").select("*"),
        supabase.from("guests").select("*"),
        supabase.from("bookings").select("id").limit(1),
      ]).then((results) => results.map(check));
      if (existingBookings.length ||
          (existingCabins.length && !matchesSamples(existingCabins, cabins)) ||
          (existingGuests.length && !matchesSamples(existingGuests, guests)))
        throw new Error("Sample data requires empty tables or an unchanged partial sample upload. Existing data was kept.");

      for (const cabin of cabins) {
        const fileName = `cabin-${cabin.name}.jpg`;
        const response = await fetch(cabinImages[`./cabins/${fileName}`]);
        if (!response.ok) throw new Error(`Could not read ${fileName}`);
        const upload = await supabase.storage.from("cabin-images").upload(fileName, await response.blob(), { contentType: "image/jpeg" });
        if (upload.error && String(upload.error.statusCode) !== "409") throw upload.error;
      }

      const createdGuests = existingGuests.length ? existingGuests : check(await supabase.from("guests").insert(guests).select());
      const createdCabins = existingCabins.length ? existingCabins : check(await supabase.from("cabins").insert(cabins).select());
      const today = getToday();
      const sampleBookings = bookings.map((booking) => {
        const cabin = cabins[booking.cabinId - 1];
        const numNights = subtractDates(booking.endDate, booking.startDate);
        const cabinPrice = numNights * (cabin.regularPrice - cabin.discount);
        const extrasPrice = booking.hasBreakfast ? numNights * 15 * booking.numGuests : 0;
        return {
          ...booking,
          numNights,
          cabinPrice,
          extrasPrice,
          totalPrice: cabinPrice + extrasPrice,
          guestId: createdGuests.find((guest) => guest.email === guests[booking.guestId - 1].email).id,
          cabinId: createdCabins.find((row) => row.name === cabin.name).id,
          status: booking.endDate < today ? "checked-out" : booking.startDate >= today ? "unconfirmed" : "checked-in",
        };
      });
      check(await supabase.from("bookings").insert(sampleBookings));
      setMessage("Sample data loaded. Reload to view it.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={{ marginTop: "auto", display: "grid", gap: "1.2rem" }}>
      <Button onClick={uploadSamples} disabled={isLoading}>Load sample data</Button>
      {message && <p role="status">{message}</p>}
    </div>
  );
}
