import { Observable } from 'rxjs'
import { Toast } from 'native-base'

export const retryHandler = error => {
  return error
    .flatMap(error => {
      if (error.status === 503) {
        return Observable.of(error.status).delay(1000)
      }
      // return Observable.throw({ error: 'No retry' })
    })
    .take(5)
    .do(() =>
      Toast.show({
        text: 'An error has occured over the network.',
        type: 'danger'
      })
    )
    .concat(Observable.throw({ type: 'ERROR' }))
}
