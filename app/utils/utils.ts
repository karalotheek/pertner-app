// This file will export the basic utitlity function to use globally.
import moment from 'moment';
import cookie from "cookie"

export function parseCookies(req) {
  return cookie.parse(req ? req.headers.cookie || "" : document.cookie)
}

export function timeDiffCalc(dateFuture, dateNow, status) {
  let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

  // calculate days
  const days = Math.floor(diffInMilliSeconds / 86400);
  diffInMilliSeconds -= days * 86400;
  console.log('calculated days', days);

  // calculate hours
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= hours * 3600;
  console.log('calculated hours', hours);

  // calculate minutes
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  diffInMilliSeconds -= minutes * 60;
  console.log('minutes', minutes);

  let difference: any = '';
  switch (status) {
    case 'Days':
      difference = days;
      break;
    case 'Hours':
      difference = hours;
      break;
    case 'Minutes':
      difference = minutes;
      break;
    case 'Fulldate':
      if (days > 0) {
        difference += (days === 1) ? `${days} day, ` : `${days} days, `;
      }

      difference += (hours === 0 || hours === 1) ? `${hours} hour, ` : `${hours} hours, `;

      difference += (minutes === 0 || hours === 1) ? `${minutes} minutes` : `${minutes} minutes`;
      break;
  }

  return difference;
}

/**
 * This utility function will truncate the long text
 * with the chars provided, for example if chars = 32 then it will
 * truancate the text till 32th character and return the new text.
 * @param {*} desc 
 * @param {*} chars 
 */
export const TruncateText = (desc, chars) => {
  if (desc && desc.length > chars) {
    return desc.substring(0, chars) + '';
  } else {
    return desc
  }
}
/**
 * Will return time/days spent from now
 * @param {*} date 
 */
export const TimeFromNow = (date) => {
  let timeFromNow = '';
  if (moment(date).fromNow(true) === 'a few seconds') {
    timeFromNow = 'few seconds';
  } else if (moment(date).fromNow(true) === 'a month') {
    timeFromNow = '1 month';
  } else if (moment(date).fromNow(true).includes('minutes')) {
    const timenow = moment(date).fromNow(true);
    timeFromNow = timenow.replace('minutes', 'mins');
  } else if (moment(date).fromNow(true).includes('minute')) {
    const timenow = moment(date).fromNow(true);
    timeFromNow = timenow.replace('minute', 'min');
  } else {
    timeFromNow = moment(date).fromNow(true);
  }
  return timeFromNow;
}

/**
   * Will return the formated date
   * @param {*} date 
   */
export const GetDateValue = (date) => {
  const today = moment().endOf('day');
  const yesterday = moment().subtract(1, 'day').endOf('day');

  if (date <= today && date > yesterday) {
    return 'Today'
  } else if (date < today && date >= yesterday) {
    return 'Yesterday';
  } else {
    // return <DateTime what="date" value={date} />
  }
}

// import { pluralize, underscore } from 'inflected'
let pluralize: any;
let underscore: any;
export function buildRelationshipData(type, ids) {
  let data = []

  if (ids === null || ids.length === 0) return data

  if (typeof ids === 'string') {
    const obj = { type: underscore(type), id: ids }

    return [obj]
  }

  if (Array.isArray(ids)) {
    data = ids.map(id => ({
      type: underscore(type),
      id
    }))
  }

  return data
}

export function formatUrlResource(type) {
  if (type === 'main-image') return type

  return pluralize(type)
}

export function createCartIdentifier() {
  return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[x]/g, () =>
    ((Math.random() * 16) | 0).toString(16)
  )
}

export function cartIdentifier(storage) {
  const cartId = createCartIdentifier()

  if (storage.get('mcart') !== null) {
    return storage.get('mcart')
  }

  storage.set('mcart', cartId)

  return cartId
}

export function parseJSON(response) {
  return new Promise(resolve => {
    response.text().then(body => {
      resolve({
        status: response.status,
        ok: response.ok,
        json: body !== '' ? JSON.parse(body) : '{}'
      })
    })
  })
}

function formatFilterString(type, filter) {
  const filterStringArray = Object.keys(filter).map(key => {
    const value = filter[key]
    let queryString: any = `${key},${value}`

    if (typeof value === 'object')
      queryString = Object.keys(value).map(
        attr => `${key}.${attr},${value[attr]}`
      )

    return `${type}(${queryString})`
  })

  return filterStringArray.join(':')
}

function formatQueryString(key, value) {
  if (key === 'limit' || key === 'offset') {
    return `page${value}`
  }

  if (key === 'filter') {
    const filterValues = Object.keys(value).map(filter =>
      formatFilterString(filter, value[filter])
    )

    return `${key}=${filterValues.join(':')}`
  }

  return `${key}=${value}`
}

function buildQueryParams({ includes, sort, limit, offset, filter }) {
  const query: any = {}

  if (includes) {
    query.include = includes
  }

  if (sort) {
    query.sort = `${sort}`
  }

  if (limit) {
    query.limit = `[limit]=${limit}`
  }

  if (offset) {
    query.offset = `[offset]=${offset}`
  }

  if (filter) {
    query.filter = filter
  }

  return Object.keys(query)
    .map(k => formatQueryString(k, query[k]))
    .join('&')
}

export function buildURL(endpoint, params) {
  if (
    params.includes ||
    params.sort ||
    params.limit ||
    params.offset ||
    params.filter
  ) {
    const paramsString = buildQueryParams(params)

    return `${endpoint}?${paramsString}`
  }

  return endpoint
}

export function buildRequestBody(body) {
  let parsedBody
  if (body) {
    if (body.options) {
      parsedBody = `{
        "data": ${JSON.stringify(body.data)},
        "options" : ${JSON.stringify(body.options)}
      }`
    } else {
      parsedBody = `{
        "data": ${JSON.stringify(body)}
      }`
    }
  }

  return parsedBody
}

export function buildCartItemData(
  id,
  quantity = null,
  type = 'cart_item',
  flows,
  isSku = false
) {
  const payload = {
    type,
    ...flows
  }

  if (type === 'cart_item') {
    if (isSku)
      Object.assign(payload, {
        sku: id,
        quantity: parseInt(quantity, 10)
      })
    else
      Object.assign(payload, {
        id,
        quantity: parseInt(quantity, 10)
      })
  }

  if (type === 'promotion_item') {
    Object.assign(payload, {
      code: id
    })
  }

  return payload
}

export function buildCartCheckoutData(
  customer,
  billing_address,
  shipping_address
) {
  let parsedCustomer = customer

  if (typeof customer === 'string') parsedCustomer = { id: customer }

  return {
    customer: parsedCustomer,
    billing_address,
    shipping_address
  }
}

export function resetProps(instance) {
  const inst = instance
    ;['includes', 'sort', 'limit', 'offset', 'filter'].forEach(
      e => delete inst[e]
    )
}

export function getCredentials(storage) {
  return JSON.parse(storage.get('moltinCredentials'))
}

export function tokenInvalid(config) {
  const credentials = getCredentials(config.storage)

  return (
    !credentials ||
    !credentials.access_token ||
    credentials.client_id !== config.client_id ||
    Math.floor(Date.now() / 1000) >= credentials.expires
  )
}