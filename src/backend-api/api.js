// // Google Apps Script API URL
// const SHEET_API_URL =
//   "https://script.google.com/macros/s/AKfycbzNbbeO4lm9ATIOYerTzntYjBuva5W9UouH-xA120tz5uX-frmv1Po8Y3hUvGAe5F6p/exec";

// /**
//  * Send survey data to Google Sheet
//  */
// export async function submitSurvey(data) {
//   const response = await fetch(SHEET_API_URL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });

//   const result = await response.json();
//   return result;
// }


const SHEET_API_URL =
  "https://script.google.com/macros/s/AKfycbzNbbeO4lm9ATIOYerTzntYjBuva5W9UouH-xA120tz5uX-frmv1Po8Y3hUvGAe5F6p/exec";

export async function submitSurvey(data) {
  const response = await fetch(SHEET_API_URL, {
    method: "POST",

    // ✅ IMPORTANT: remove headers
    body: JSON.stringify(data),
  });

  return await response.json();
}
