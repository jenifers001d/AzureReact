import config from "./Config";

var graph = require("@microsoft/microsoft-graph-client");

function getAuthenticatedClient(accessToken) {
  // Initialize Graph client
  // Use the provided access token to authenticate requests
  const client = graph.Client.init({
    authProvider: done => {
      done(null, accessToken.accessToken);
    },
  });
  return client;
}

export async function getCalenderEvents(accessToken) {
  const client = getAuthenticatedClient(accessToken);
  const events = await client
    .api("/me/events")
    .select("subject,organizer,start,end")
    .orderby("start/dateTime DESC")
    .get();
  return events;
}

export async function listBookingService(accessToken) {
  const client = getAuthenticatedClient(accessToken);
  const events = await client
    .api("/bookingBusinesses/" + config.orgId + "/services")
    .version("beta")
    .get();
  return events;
}

// export async function getBookingService(accessToken) {
//   const serviceId = listBookingService;
//   console.log(serviceId);
//   const client = getAuthenticatedClient(accessToken);
//   const events = await client
//     .api("/bookingBusinesses/" + config.orgId + "/services")
//     .version("beta")
//     .get();
//   return events;
// }

export async function getBookingsCalendarView(accessToken) {
  const client = getAuthenticatedClient(accessToken);
  const events = await client
    .api("/bookingBusinesses/" + config.orgId + "/calendarView")
    .version("beta")
    .get();
  return events;
}

// export async function publishBookings(accessToken) {
//   const client = getAuthenticatedClient(accessToken);
//   let res = await client
//     .api("/bookingBusinesses/" + config.orgId + "/publish")
//     .version("beta")
//     .post();
//   return res;
// }
