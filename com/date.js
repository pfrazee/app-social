import moment from 'moment'

export default function (ts) {
  return moment(ts).fromNow()
}