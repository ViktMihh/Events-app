import { format, parseISO } from 'date-fns';
import { enGB } from 'date-fns/locale';

export function mailIsValid(mail) {
  return mail
    .toLowerCase()
    .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}

export function saveAs(data, fileName) {
  const blobFile = new Blob([data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blobFile);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function downloadCsv(columns, cells, name) {
  let csv = [];
  const headers = columns.join(',');
  csv.push(headers);
  cells.forEach((element) => {
    const string = Object.values(element).join(',');
    csv.push(string);
    csv = [csv.join('\n')];
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', name);
  a.click();
  a.remove();
}

export function handleUsersImportErrors(errors) {
  const errorList = [];
  errors.forEach((item) => {
    if (item === 'EVENT_USER_EVENT_ID_DNI_DUPLICATED') {
      errorList.push('[El DNI de este usuario ya existe en este evento]');
    } else if (item === 'EVENT_USER_EVENT_ID_MAIL_DUPLICATED') {
      errorList.push('[El email indicado ya se ha registrado en este evento]');
    } else if (item === 'INVALID_MAIL_ERROR') {
      errorList.push('[El email no es válido]');
    } else if (item === 'INVALID_DNI_ERROR') {
      errorList.push('[El DNI no es válido]');
    } else if (item === 'INVALID_TREATMENT_ERROR') {
      errorList.push('[El tratamiento no es válido] ');
    } if (item.includes('REQUIRED_FIELD_ERROR')) {
      errorList.push(`[Error en campo requerido ${item.substr('REQUIRED_FIELD_ERROR'.length)}] `);
    }
  });

  return errorList;
}

export function generateUrl(type, lang, id) {
  if (type === 'checkin') {
    return `${window.location.origin}${window.location.pathname}#/event/${id}/checkin${lang === 'en' ? '/en' : ''}`;
  }
  if (type === 'eventView') {
    return `${window.location.origin}${window.location.pathname}#/events/${id}/settings`;
  }
  return '';
}

export function getStartAndFinishDateFormat(startDate, finishDate, startFormat, finishFormat) {
  return `${format(parseISO(startDate), startFormat, { locale: enGB })} - ${format(parseISO(finishDate), finishFormat, { locale: enGB })}`;
}

export function getDateFormat(date, dateFormat) {
  return `${format(parseISO(date), dateFormat, { locale: enGB })}`;
}
