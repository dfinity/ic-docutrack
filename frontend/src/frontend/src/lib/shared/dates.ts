export function formatUploadDate(uploaded_at: BigInt) {
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "CET",
    hour12: false,
  };
  let uploadedAt = new Date(Math.floor(Number(uploaded_at) / 1000000));
  return uploadedAt.toLocaleTimeString("en-CH", dateOptions);
}

export function formatUploadDateShort(uploaded_at: BigInt) {
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    timeZone: "CET",
    hour12: false,
  };
  let uploadedAt = new Date(Math.floor(Number(uploaded_at) / 1000000));
  return uploadedAt.toLocaleTimeString("en-CH", dateOptions);
}
