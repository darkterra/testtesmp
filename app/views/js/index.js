import { h, render } from '../../libs/node_modules/preact';
require('preact/debug');

if (module.hot) {
  module.hot.accept(() => {
    window.location.reload();
  })
}

import Geolocation from './components/geolocalisation'
import HelloBack from './components/connectBackEnd'

const toto = 'lolilol';


render((
  <div>
    <Geolocation />
    <HelloBack />
  </div>
), document.body);