import React from 'react'
import Form from 'mobx-autoform'
import feathers from "@feathersjs/client"
import { compose, withHandlers, lifecycle } from 'recompose'
import withClickOutside from 'react-click-outside'
import { toJS, observable } from 'mobx'
import { observer } from 'mobx-react'
import Button from 'grey-vest/dist/Button'
import Box from 'grey-vest/dist/Box'
import Banner from 'grey-vest/dist/Banner'
import MultiSlider, { Progress, Dot } from 'react-multi-bar-slider'
import s from '../../assets/css/page.css'
import { Input } from './input.js'

let state = observable({
  isOpened: true,
  changeOpened: null,
  location: 0,
  checked: [false, false, false],
  slide: { progress: 10 },
  viewport: {},
  loading: false,
  sent: false,
})

const submit = async (snapshot) => {
  state.loading = true

  const app = feathers();
  const restClient = feathers.rest('https://api.sickly.app')
  app.configure(restClient.fetch(window.fetch));
  const submit = app.service('cases'); 
  
  snapshot.intensity = state.slide.progress
  snapshot.date = Date.now() 
  snapshot.location = toJS(state.location)

  submit.create(snapshot)
  .then(() => {
    state.loading = false
    state.sent = true
  })
}

const form = Form({
  fields: {
    daysSick: { 
      props: { label: 'Number Of Days Sick:', type: 'number', required: true, width: 3 }, 
      value: '',
    },
    fever: { 
      props: { label: 'Fever', type: 'checkbox', native: true }, 
      value: state.checked[0] 
    },
    cough: { 
      props: { label: 'Cough', type: 'checkbox', native: true }, 
      value: state.checked[1] 
    },
    sob: { 
      props: { label: 'Breathing', type: 'checkbox', native: true }, 
      value: state.checked[2] 
    },
  },
  submit
})

const StatusBanner = observer(() => state.sent ? (
  <Banner className={s.banner}>
    You have successfuly self-reported.
  </Banner>
) : null )

const yourEnhancer = compose(
    withHandlers({
        someHandler: () => () => { state.isOpened ? state.changeOpened()  : null },
    }),
    withClickOutside,
    lifecycle({
        handleClickOutside() {
            this.props.someHandler();
        },
    }),
)

const Sick = observer((props) => {
  state.location = props.location
  state.isOpened = props.isOpened
  state.changeOpened = props.changeOpened
 
  let handleSlide = newProgress => { state.slide = { progress: newProgress } }

  return(
    state.isOpened ? 
    <div className={s.sickPopup}>
      <StatusBanner /> 
      <Box className={s.box}> 
        <p>
          <b>Location:</b><br/>
            {state.location.city ? `${state.location.city}, ` : null}
            {state.location.region ? `${state.location.region}, ` : null}
            {state.location.country ? `${state.location.country}` : null}
        <br/>
        </p>
        <div className={s.form}>
            {form.fields.map((field) =>
              <Input
                field={field}
              />
            )}
          <p><b>Intensity of Symptoms:</b></p>
          <MultiSlider onSlide={handleSlide}>
            <Progress 
              height={14}
              color={state.slide.progress > 70 ? 'red' : state.slide.progress > 40 ? 'yellow' : '#0076de' } 
              roundedCorners 
              progress={state.slide.progress}
           >
              <Dot 
                color={'#454545'}
                width={25}
                height={25}
              />
            </Progress>
          </MultiSlider>
          <br/>
            <Button primary onClick={form.submit}>Submit</Button>
        </div>
      </Box>
    </div>
    : null
  )
})

export default yourEnhancer(Sick)
