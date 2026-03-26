import axios from 'axios';

export const EVENTS_PLATFORM_API_URL = process.env.VUE_APP_EVENTS_PLATFORM_API_URL;
export const COMMON_REPORT_API_URL = process.env.VUE_APP_COMMON_REPORT_API_URL;
export const EVENTS_SURVEYS_API_URL = process.env.VUE_APP_EVENTS_SURVEYS_API_URL;

export function fetchEvents() {
  return [
    {
      description: null,
      finishDate: '2026-04-08 14:15:45',
      hasCert: null,
      id: 220,
      name: 'Bites & Beats Night',
      projectCode: 'P001',
      projectType: '1',
      startDate: '2026-04-01 09:00:58',
      userCount: 10,
    },
    {
      description: null,
      finishDate: '2026-03-15 18:00:13',
      hasCert: null,
      id: 239,
      name: 'Midnight Market Feast',
      projectCode: 'P002',
      projectType: '1',
      startDate: '2026-03-13 16:00:56',
      userCount: 3,
    },
    {
      description: null,
      finishDate: '2026-04-05 17:35:45',
      hasCert: null,
      id: 234,
      name: 'Neon Nexus Expo',
      projectCode: 'P003',
      projectType: '1',
      startDate: '2026-04-01 16:00:42',
      userCount: 85,
    },
    {
      description: null,
      finishDate: '2026-03-08 17:00:53',
      hasCert: 1,
      id: 193,
      name: 'Paper & Ink Conclave',
      projectCode: 'P004',
      projectType: '1',
      startDate: '2026-03-06 16:00:39',
      userCount: 0,
    },
    {
      description: null,
      finishDate: '2023-05-29 00:00:00',
      hasCert: 0,
      id: 101,
      name: 'Invisible Orchestra Gathering',
      projectCode: 'P005',
      projectType: '0',
      startDate: '2023-05-29 00:00:00',
      userCount: 23,
    },
    {
      description: null,
      finishDate: '2026-03-26 00:00:00',
      hasCert: 1,
      id: 100,
      name: 'Singularity Symposium',
      projectCode: 'P006',
      projectType: '0',
      startDate: '2026-03-24 00:00:00',
      userCount: 125,
    },
  ];
}

export function fetchEvent() {
  return {
    description: null,
    finishDate: '2026-04-08 14:15:45',
    hasCert: 1,
    id: 220,
    name: 'Bites & Beats Night',
    projectCode: 'P001',
    projectType: '1',
    startDate: '2026-04-01 09:00:58',
    userCount: 10,
    userFields: [
      {
        eventId: 220,
        fieldType: {
          description: 'DNI',
          id: 2,
          name: 'dni',
        },
        fieldTypeId: 2,
        options: [],
        required: 0,
      },
      {
        eventId: 220,
        fieldType: {
          description: 'Name',
          id: 3,
          name: 'name',
        },
        fieldTypeId: 3,
        options: [],
        required: 1,
      },
      {
        eventId: 220,
        fieldType: {
          description: 'Surname',
          id: 4,
          name: 'surname1',
        },
        fieldTypeId: 4,
        options: [],
        required: 1,
      },
      {
        eventId: 220,
        fieldType: {
          description: 'Email',
          id: 10,
          name: 'email',
        },
        fieldTypeId: 10,
        options: [],
        required: 1,
      },
    ],
  };
}

export function searchEventUser(input, id) {
  return axios({
    url: `${EVENTS_PLATFORM_API_URL}/events/${id}/user?q=${input}`,
    method: 'GET',
  }).then(
    (response) => response.data,
  );
}

export function saveEventUser({ eventUser, eventId }) {
  return axios({
    method: 'POST',
    url: `${EVENTS_PLATFORM_API_URL}/events/${eventId}/user`,
    data: eventUser,
  }).then((response) => response.data);
}

export function deleteEventUser({ eventUserId, eventId, eventUser }) {
  return axios({
    method: 'DELETE',
    url: `${EVENTS_PLATFORM_API_URL}/events/${eventId}/user/${eventUserId}`,
    // se utiliza solo para obtener y mostrar el user que nos da error al eliminar
    data: eventUser,
  }).then((response) => response.data);
}

export async function saveEvent(event) {
  return axios({
    method: 'POST',
    url: `${EVENTS_PLATFORM_API_URL}/events`,
    data: { ...event },
  }).then((response) => response.data);
}

export function fetchEventUsers() {
  return [
    {
      checkinTime: '2026-03-01T08:45:12+00:00',
      city: 'Madrid',
      country: 'Spain',
      dni: '12345678A',
      eventId: 220,
      id: 50001,
      inscriptionTime: '2026-02-20T10:15:30+00:00',
      email: 'laura.garcia@example.com',
      name: 'Laura',
      observations: 'Vegetarian meal',
      optInMarketingEmails: true,
      phone: '+34600111222',
      surname1: 'García',
      surname2: 'López',
      treatment: 'Sra.',
    },
    {
      checkinTime: '2026-03-01T09:05:10+00:00',
      city: 'Barcelona',
      country: 'Spain',
      dni: '23456789B',
      eventId: 220,
      id: 50002,
      inscriptionTime: '2026-02-21T11:20:00+00:00',
      email: 'javier.martin@example.com',
      name: 'Javier',
      observations: 'Allergy to nuts',
      optInMarketingEmails: false,
      phone: '+34600222333',
      surname1: 'Martín',
      surname2: 'Sánchez',
      treatment: 'Sr.',
    },
    {
      checkinTime: '2026-03-01T08:55:45+00:00',
      city: 'Sevilla',
      country: 'Spain',
      dni: '34567890C',
      eventId: 220,
      id: 50003,
      inscriptionTime: '2026-02-22T09:10:15+00:00',
      email: 'carmen.ruiz@example.com',
      name: 'Carmen',
      observations: 'Requires wheelchair access',
      optInMarketingEmails: true,
      phone: '+34600333444',
      surname1: 'Ruiz',
      surname2: 'Fernández',
      treatment: 'Sra.',
    },
    {
      checkinTime: '2026-03-01T09:20:00+00:00',
      city: 'Valencia',
      country: 'Spain',
      dni: '45678901D',
      eventId: 220,
      id: 50004,
      inscriptionTime: '2026-02-23T13:45:00+00:00',
      email: 'ana.lopez@example.com',
      name: 'Ana',
      observations: 'Gluten-free diet',
      optInMarketingEmails: true,
      phone: '+34600444555',
      surname1: 'López',
      surname2: 'Gómez',
      treatment: 'Sra.',
    },
    {
      checkinTime: '2026-03-01T09:35:22+00:00',
      city: 'Bilbao',
      country: 'Spain',
      dni: '56789012E',
      eventId: 220,
      id: 50005,
      inscriptionTime: '2026-02-24T16:45:10+00:00',
      email: 'iker.garcia@example.com',
      name: 'Iker',
      observations: 'N/A',
      optInMarketingEmails: false,
      phone: '+34600555666',
      surname1: 'García',
      surname2: 'Etxeberria',
      treatment: 'Sr.',
    },
    {
      checkinTime: '2026-03-01T09:50:00+00:00',
      city: 'Zaragoza',
      country: 'Spain',
      dni: '67890123F',
      eventId: 220,
      id: 50006,
      inscriptionTime: '2026-02-25T10:10:10+00:00',
      email: 'marta.sanchez@example.com',
      name: 'Marta',
      observations: 'Allergic to penicillin',
      optInMarketingEmails: true,
      phone: '+34600666777',
      surname1: 'Sánchez',
      surname2: 'Ruiz',
      treatment: 'Sra.',
    },
    {
      checkinTime: '2026-03-01T10:05:30+00:00',
      city: 'Granada',
      country: 'Spain',
      dni: '78901234G',
      eventId: 220,
      id: 50007,
      inscriptionTime: '2026-02-25T12:00:00+00:00',
      email: 'pablo.romero@example.com',
      name: 'Pablo',
      observations: 'Diabetic',
      optInMarketingEmails: false,
      phone: '+34600777888',
      surname1: 'Romero',
      surname2: 'Navarro',
      treatment: 'Sr',
    },
    {
      checkinTime: '2026-03-01T10:15:00+00:00',
      city: 'Santander',
      country: 'Spain',
      dni: '89012345H',
      eventId: 220,
      id: 50008,
      inscriptionTime: '2026-02-26T08:30:00+00:00',
      email: 'lucia.diaz@example.com',
      name: 'Lucía',
      observations: 'N/A',
      optInMarketingEmails: true,
      phone: '+34600888999',
      surname1: 'Díaz',
      surname2: 'Moreno',
      treatment: 'Sra.',
    },
    {
      checkinTime: '2026-03-01T10:25:45+00:00',
      city: 'Palma',
      country: 'Spain',
      dni: '90123456J',
      eventId: 220,
      id: 50009,
      inscriptionTime: '2026-02-26T09:00:00+00:00',
      email: 'diego.torres@example.com',
      name: 'Diego',
      observations: 'Late check-in',
      optInMarketingEmails: false,
      phone: '+34600999000',
      surname1: 'Torres',
      surname2: 'Castro',
      treatment: 'Sr.',
    },
    {
      checkinTime: '2026-03-01T10:40:00+00:00',
      city: 'Toledo',
      country: 'Spain',
      dni: '01234567K',
      eventId: 220,
      id: 50010,
      inscriptionTime: '2026-02-26T09:30:00+00:00',
      email: 'elena.morales@example.com',
      name: 'Elena',
      observations: 'N/A',
      optInMarketingEmails: true,
      phone: '+34600123456',
      surname1: 'Morales',
      surname2: 'Vega',
      treatment: 'Sra.',
    },
  ];
}

export function fetchUserFieldTypes() {
  return [
    {
      description: 'Treatment',
      id: 1,
      name: 'treatment',
    },
    {
      description: 'DNI',
      id: 2,
      name: 'dni',
    },
    {
      description: 'Name',
      id: 3,
      name: 'name',
    },
    {
      description: 'Surname',
      id: 4,
      name: 'surname1',
    },
    {
      description: 'City',
      id: 5,
      name: 'city',
    },
    {
      description: 'Country',
      id: 6,
      name: 'country',
    },
    {
      description: 'Email',
      id: 7,
      name: 'mail',
    },
    {
      description: 'Phone number',
      id: 8,
      name: 'phone',
    },
  ];
}

export async function downloadCheckIn({ eventId, eventUser }) {
  return axios(`${COMMON_REPORT_API_URL}/`, {
    method: 'POST',
    params: {
      id: `EVENTS_PLATFORM_CHECKIN_${eventId}`,
    },
    data: {
      data: { ...eventUser },
    },
    headers: { 'Content-Type': 'application/json' },
    responseType: 'blob',
  });
}

export function saveEventUsers(csv, eventId) {
  return axios({
    url: `${EVENTS_PLATFORM_API_URL}/events/${eventId}/users/import`,
    data: csv,
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((response) => response.data);
}

export function fetchScuInformation({ eventId }) {
  return axios({
    url: `${EVENTS_PLATFORM_API_URL}/events/scu-information/${eventId}`,
    method: 'GET',
  }).then((response) => response.data);
}

export function fetchEventMails({ eventId }) {
  return axios({
    url: `${EVENTS_PLATFORM_API_URL}/event-mails/${eventId}`,
    method: 'GET',
  }).then((response) => response.data);
}

export function sendEventMail({ mailId, userMail }) {
  return axios({
    url: `${EVENTS_PLATFORM_API_URL}/event-mails/send`,
    method: 'POST',
    data: {
      mail_id: mailId,
      user_mail: userMail,
    },
  }).then((response) => response.data);
}

export function saveEventMailTemplate({
  eventId, type, subject, scheduledAt, mailId,
}) {
  return axios({
    url: `${EVENTS_PLATFORM_API_URL}/event-mails/${eventId}`,
    method: 'POST',
    data: {
      type,
      ...(subject !== undefined && { subject }),
      scheduled_at: scheduledAt,
      ...(mailId !== undefined ? { mail_id: mailId } : { mail_id: undefined }),
    },
  }).then((response) => response.data);
}

export function deleteEventMail({ eventId, mailId }) {
  return axios({
    url: `${EVENTS_PLATFORM_API_URL}/event-mails/${eventId}`,
    method: 'DELETE',
    data: {
      mail_id: mailId,
    },
  }).then((response) => response.data);
}
