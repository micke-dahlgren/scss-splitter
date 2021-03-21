import { getAdminData } from '../../../providers/AdminData'
import modalStyles from '../../../styles/Modal.module.scss'
import buttonStyles from '../../../styles/Button.module.scss'
import DatePicker from '../inputComponents/datePicker'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
const dayjs = require('dayjs')

export default function EventModal(props) {
  const router = useRouter()
  const adminCities = getAdminData().cities

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events`, {
        method: props.action.action,
        body: JSON.stringify(props.event),
        headers: { 'Content-Type': 'application/json' },
      })
      if (res.status === 200) {
        router.push('/admin/events/' + props.event.cities)
      }
    } catch (error) {
      console.error('Error:' + error)
    }
    props.toggleModal()
  }

  const onChange = (e) => {
    props.setEvent({ ...props.event, [e.target.name]: e.target.value })
  }

  return (
    <div>
      {props.showEventModal && (
        <>
          <div className={modalStyles['dimmer']} onClick={props.toggleModal}></div>

          <div className={modalStyles['modal-container']}>
            <form id="contact-form" onSubmit={onSubmit}>
              <h2 className={modalStyles['modal-title']}>{props.action.title + ' Event'}</h2>

              <div className={modalStyles['form-group']}>
                <label className={modalStyles['form-label']}>Titel</label>
                <input
                  className={`${modalStyles['form-input']} ${modalStyles['field']}`}
                  type="text"
                  placeholder="Eventtitel"
                  name="name"
                  value={props.event.name}
                  onChange={onChange}
                  required
                />
              </div>
              <div className={modalStyles['form-group']}>
                <label htmlFor="city" className={modalStyles['form-label']}>
                  Stad
                </label>
                <select
                  className={`${modalStyles['form-input']} ${modalStyles['field']}`}
                  name="cities"
                  id="cities"
                  value={props.event.cities}
                  onChange={onChange}
                >
                  {adminCities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={`${modalStyles['form-group']} ${modalStyles['flex-row']}`}>
                <div className={modalStyles['flex-col']}>
                  <label className={modalStyles['form-label']}>Datum</label>
                  <DatePicker
                    name="date"
                    onChange={onChange}
                    date={dayjs(props.event.date).format('YYYY-MM-DD')}
                    max={dayjs().format('YYYY-MM-DD')}
                  />
                </div>
                <div className={modalStyles['flex-col']}>
                  <label className={modalStyles['form-label']}>Deltagare</label>
                  <input
                    className={`${modalStyles['form-input']} ${modalStyles['number']}`}
                    type="number"
                    name="participantCount"
                    min="0"
                    value={props.event.participantCount}
                    onChange={onChange}
                  />
                </div>
                <div className={modalStyles['flex-col']}>
                  <p className={modalStyles['form-label']}>Typ av event</p>
                  <div>
                    <input
                      type="radio"
                      id="digital"
                      name="type"
                      value="digital"
                      onChange={onChange}
                      checked={props.event.type === 'digital'}
                    />
                    <label className={modalStyles['form-label']} htmlFor="digital">
                      Digital
                    </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      id="physical"
                      name="type"
                      value="physical"
                      onChange={onChange}
                      checked={props.event.type === 'physical'}
                    />
                    <label className={modalStyles['form-label']} htmlFor="physical">
                      Fysisk
                    </label>
                  </div>
                </div>
              </div>
              <div className={modalStyles['form-group']}>
                <label className={modalStyles['form-label']}>Beskrivning</label>
                <textarea
                  className={`${modalStyles['form-input']} ${modalStyles['textarea']}`}
                  rows="4"
                  placeholder="Här är en beskrivning!"
                  form="contact-form"
                  name="description"
                  resize="none"
                  value={props.event.description}
                  onChange={onChange}
                />
              </div>
              <div className={modalStyles['button-container']}>
                <button className={buttonStyles['primary-button-pink-hollow']} onClick={props.toggleModal}>
                  Avbryt
                </button>
                <button className={buttonStyles['primary-button-pink']} type="submit">
                  {props.action.title}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}

EventModal.propTypes = {
  action: PropTypes.object,
  event: PropTypes.object,
  setEvent: PropTypes.func,
  showEventModal: PropTypes.bool,
  toggleModal: PropTypes.func,
}
